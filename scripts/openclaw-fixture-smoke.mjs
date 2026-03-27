#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "automindlab-openclaw-fixture-"));
const fixtureBin = path.join(tempRoot, "bin");
const openclawHome = path.join(tempRoot, "openclaw-home");
const bashCommand = resolveBash();
const nodeBinary = process.env.NODE_BINARY || process.execPath;

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function resolveBash() {
  if (process.env.BASH_PATH) {
    return process.env.BASH_PATH;
  }
  if (process.platform === "win32") {
    return "C:\\Program Files\\Git\\bin\\bash.exe";
  }
  return "bash";
}

function toPosixPath(filePath) {
  if (process.platform !== "win32") {
    return filePath;
  }
  const normalized = filePath.replace(/\\/g, "/");
  const drive = normalized.slice(0, 1).toLowerCase();
  return `/${drive}${normalized.slice(2)}`;
}

function writeExecutable(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  fs.chmodSync(filePath, 0o755);
}

function runBash(command, env) {
  const completed = spawnSync(
    bashCommand,
    ["-lc", `cd '${toPosixPath(root)}' && ${command}`],
    {
      env,
      encoding: "utf8",
      stdio: "pipe",
    },
  );

  if (completed.status !== 0) {
    fail(`${command} failed:\n${completed.stderr || completed.stdout}`);
  }
  return completed.stdout;
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

writeExecutable(
  path.join(fixtureBin, "node"),
  `#!/usr/bin/env bash
set -euo pipefail
exec "\${NODE_BINARY:?NODE_BINARY is required}" "$@"
`,
);

writeExecutable(
  path.join(fixtureBin, "openclaw"),
  `#!/usr/bin/env bash
set -euo pipefail
CONFIG_PATH="\${OPENCLAW_CONFIG:-\${OPENCLAW_HOME:-$HOME/.openclaw}/openclaw.json}"
COMMAND="\${1:-} \${2:-} \${3:-}"
case "$COMMAND" in
  "config validate ")
    node -e "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'))" "$CONFIG_PATH" >/dev/null
    ;;
  "gateway status ")
    exit 0
    ;;
  "agents list --bindings")
    echo "automind-host binding: external"
    ;;
  "agents bindings ")
    echo "binding owner: automind-host"
    ;;
  "agents set-identity --workspace")
    WORKSPACE=""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --workspace)
          WORKSPACE="$2"
          shift 2
          ;;
        --from-identity)
          shift
          ;;
        *)
          shift
          ;;
      esac
    done
    mkdir -p "$WORKSPACE"
    printf 'seeded\\n' > "$WORKSPACE/.identity-seeded"
    ;;
  *)
    exit 0
    ;;
esac
`,
);

writeExecutable(
  path.join(fixtureBin, "rsync"),
  `#!/usr/bin/env bash
set -euo pipefail
DELETE=false
POSITIONAL=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    -a|-av|-az)
      shift
      ;;
    --delete)
      DELETE=true
      shift
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done
SRC="\${POSITIONAL[0]}"
DEST="\${POSITIONAL[1]}"
if [[ -z "$SRC" || -z "$DEST" ]]; then
  echo "fake rsync requires source and destination" >&2
  exit 1
fi
mkdir -p "$DEST"
if [[ "$DELETE" == true && -d "$DEST" ]]; then
  find "$DEST" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
fi
if [[ "$SRC" == */ ]]; then
  cp -R "$SRC". "$DEST"/
else
  cp -R "$SRC" "$DEST"
fi
`,
);

const env = {
  ...process.env,
  PATH: `${fixtureBin}${path.delimiter}${process.env.PATH || ""}`,
  NODE_BINARY: nodeBinary,
  OPENCLAW_HOME: openclawHome,
  OPENCLAW_CONFIG: path.join(openclawHome, "openclaw.json"),
  AUTOMIND_HOST_WORKSPACE: path.join(openclawHome, "workspace-automind-host"),
  AUTOMIND_WORKER_WORKSPACE: path.join(openclawHome, "workspace-automind-worker"),
};

fs.mkdirSync(openclawHome, { recursive: true });

runBash("./scripts/configure-openclaw-agents.sh", env);

const config = JSON.parse(fs.readFileSync(env.OPENCLAW_CONFIG, "utf8"));
const host = config.agents?.list?.find((item) => item.id === "automind-host");
const worker = config.agents?.list?.find((item) => item.id === "automind-worker");

assert(host?.default === true, "host agent must be the default agent");
assert(host?.sandbox?.mode === "off", "host agent sandbox must be off");
assert(worker?.sandbox?.mode === "all", "worker agent sandbox must be all");
assert(worker?.sandbox?.scope === "agent", "worker agent sandbox scope must be agent");

for (const file of ["AGENTS.md", "RUNBOOK.md", "TASK_STATE.md", "WORK_IN_PROGRESS.md"]) {
  assert(fs.existsSync(path.join(env.AUTOMIND_HOST_WORKSPACE, file)), `host workspace missing ${file}`);
  assert(fs.existsSync(path.join(env.AUTOMIND_WORKER_WORKSPACE, file)), `worker workspace missing ${file}`);
}

const workerStatusOutput = runBash("./scripts/worker-status.sh", env);
assert(workerStatusOutput.includes("Configured host agent: automind-host"), "worker status should report the configured host agent");
assert(workerStatusOutput.includes("Configured worker agent: automind-worker"), "worker status should report the configured worker agent");

const runtimeDoctorOutput = runBash("./scripts/runtime-doctor.sh", env);
assert(runtimeDoctorOutput.includes("PASS openclaw config validate"), "runtime doctor should validate the openclaw config in fixture mode");
assert(runtimeDoctorOutput.includes("PASS workspace present"), "runtime doctor should see seeded workspaces");

const dryRunOutput = runBash("./scripts/bootstrap-recovery.sh --dry-run", env);
assert(dryRunOutput.includes("Dry run: true"), "bootstrap recovery dry-run should report dry-run mode");

runBash("./scripts/bootstrap-recovery.sh", env);

console.log("OpenClaw fixture smoke passed");
