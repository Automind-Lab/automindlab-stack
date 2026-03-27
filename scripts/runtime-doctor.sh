#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_ENV_FILE="$ROOT_DIR/config/runtime.auto.env"
OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
CONFIG_PATH="${OPENCLAW_CONFIG:-$OPENCLAW_HOME/openclaw.json}"
HOST_WORKSPACE="${AUTOMIND_HOST_WORKSPACE:-$OPENCLAW_HOME/workspace-automind-host}"
WORKER_WORKSPACE="${AUTOMIND_WORKER_WORKSPACE:-$OPENCLAW_HOME/workspace-automind-worker}"
HOST_AGENT_ID="${AUTOMIND_HOST_AGENT_ID:-automind-host}"
WORKER_AGENT_ID="${AUTOMIND_WORKER_AGENT_ID:-automind-worker}"

read_value() {
  local file="$1"
  local key="$2"
  awk -F'=' -v expected="$key" '$1 == expected {sub($1 FS, "", $0); gsub(/^"|"$/, "", $0); print $0}' "$file" | head -n1
}

have_cmd() {
  command -v "$1" >/dev/null 2>&1
}

pass() {
  echo "PASS $1"
}

warn() {
  echo "WARN $1"
}

run_check() {
  local label="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    pass "$label"
  else
    warn "$label"
  fi
}

check_file() {
  local label="$1"
  local file="$2"
  if [[ -f "$file" ]]; then
    pass "$label present: $file"
  else
    warn "$label missing: $file"
  fi
}

if [[ -f "$CONFIG_ENV_FILE" ]]; then
  host_value="$(read_value "$CONFIG_ENV_FILE" AUTOMIND_HOST_AGENT_ID || true)"
  worker_value="$(read_value "$CONFIG_ENV_FILE" AUTOMIND_WORKER_AGENT_ID || true)"
  if [[ -n "$host_value" ]]; then HOST_AGENT_ID="$host_value"; fi
  if [[ -n "$worker_value" ]]; then WORKER_AGENT_ID="$worker_value"; fi
fi

echo "== AutoMindLab Runtime Doctor =="
echo "repo: $ROOT_DIR"
echo "host agent: $HOST_AGENT_ID"
echo "worker agent: $WORKER_AGENT_ID"
echo "host workspace: $HOST_WORKSPACE"
echo "worker workspace: $WORKER_WORKSPACE"

echo
if [[ -f "$CONFIG_ENV_FILE" ]]; then
  pass "runtime env present: $CONFIG_ENV_FILE"
else
  warn "runtime env missing: copy config/runtime.auto.env.example to config/runtime.auto.env"
fi

echo
for command_name in node npm openclaw docker rsync; do
  if have_cmd "$command_name"; then
    pass "$command_name found"
  else
    warn "$command_name not found"
  fi
done

if have_cmd docker && docker compose version >/dev/null 2>&1; then
  pass "docker compose available"
else
  warn "docker compose unavailable"
fi

echo
for required in \
  "$ROOT_DIR/AGENTS.md" \
  "$ROOT_DIR/RUNBOOK.md" \
  "$ROOT_DIR/TASK_STATE.md" \
  "$ROOT_DIR/WORK_IN_PROGRESS.md" \
  "$ROOT_DIR/routines.md" \
  "$ROOT_DIR/.ona/skills/index.json" \
  "$ROOT_DIR/config/intake/approved.json" \
  "$ROOT_DIR/config/operator/operator-surface-manifest.json" \
  "$ROOT_DIR/config/operator/operator-command-policy.json" \
  "$ROOT_DIR/config/runtime-profiles/openclaw.enterprise-host-worker.json" \
  "$ROOT_DIR/config/runtime-profiles/nemoclaw.enterprise-host-worker.json" \
  "$ROOT_DIR/config/skills/automindlab-baseline-pack.json" \
  "$ROOT_DIR/config/routines/automindlab-core-routines.json" \
  "$ROOT_DIR/docs/CAPABILITY_INTAKE_POLICY.md" \
  "$ROOT_DIR/docs/NETWORK_POLICY.md" \
  "$ROOT_DIR/docs/OPERATOR_SURFACE_CONTRACT.md" \
  "$ROOT_DIR/docs/OPERATOR_APPROVAL_POLICY.md" \
  "$ROOT_DIR/docs/RUNTIME_PROFILE_COMPATIBILITY.md" \
  "$ROOT_DIR/docs/WORKER_DELEGATION_PROTOCOL.md" \
  "$ROOT_DIR/services/diagnostic/package.json"; do
  check_file "required file" "$required"
done

echo
seat_count="$(find "$ROOT_DIR/context/council" -maxdepth 1 -name '*.md' ! -name 'COUNCIL_OF_13.md' | wc -l | tr -d ' ')"
echo "Council seat files: $seat_count"
if [[ "$seat_count" == "13" ]]; then
  pass "council seat count matches expected 13"
else
  warn "expected exactly 13 council seat files"
fi

echo
for workspace in "$HOST_WORKSPACE" "$WORKER_WORKSPACE"; do
  if [[ -d "$workspace" ]]; then
    pass "workspace present: $workspace"
    check_file "workspace AGENTS" "$workspace/AGENTS.md"
    check_file "workspace RUNBOOK" "$workspace/RUNBOOK.md"
    check_file "workspace task state" "$workspace/TASK_STATE.md"
  else
    warn "workspace missing: $workspace"
  fi
done

echo
if have_cmd node; then
  run_check "repo operating system validator" node "$ROOT_DIR/scripts/validate-repo-operating-system.mjs"
  run_check "skills validator" node "$ROOT_DIR/scripts/validate-ona-skills.mjs"
  run_check "skill pack validator" node "$ROOT_DIR/scripts/automind-skill-pack.mjs" validate
  run_check "routine pack validator" node "$ROOT_DIR/scripts/automind-routines.mjs" validate
  run_check "workflow validator" node "$ROOT_DIR/scripts/validate-workflows.mjs"
  run_check "worker delegation contract validator" node "$ROOT_DIR/scripts/validate-runtime-contracts.mjs"
  run_check "github automation validator" node "$ROOT_DIR/scripts/validate-github-automation.mjs"
  run_check "github autonomy self-test" node "$ROOT_DIR/scripts/github-autonomy-selftest.mjs"
  run_check "downstream sync validator" node "$ROOT_DIR/scripts/validate-downstream-sync.mjs"
  run_check "capability intake validator" node "$ROOT_DIR/scripts/validate-capability-intake.mjs"
  run_check "runtime profile validator" node "$ROOT_DIR/scripts/validate-runtime-topology-profiles.mjs"
  run_check "operator surface validator" node "$ROOT_DIR/scripts/validate-operator-surfaces.mjs"
  run_check "diagnostic consultation syntax" node --check "$ROOT_DIR/services/diagnostic/consultation-service.js"
  run_check "diagnostic server syntax" node --check "$ROOT_DIR/services/diagnostic/server.js"
else
  warn "node not available; skipped repo validators"
fi

echo
if have_cmd openclaw; then
  run_check "openclaw config validate" openclaw config validate
  if [[ -f "$CONFIG_PATH" ]] && have_cmd node; then
    run_check "host and worker config match expected topology" \
      node - "$CONFIG_PATH" "$HOST_AGENT_ID" "$WORKER_AGENT_ID" <<'NODE'
const fs = require("node:fs");
const [configPath, hostId, workerId] = process.argv.slice(2);
const raw = fs.readFileSync(configPath, "utf8").trim();
const config = raw ? JSON.parse(raw) : {};
const list = config.agents?.list || [];
const host = list.find((item) => item.id === hostId);
const worker = list.find((item) => item.id === workerId);
if (!host || !worker) process.exit(1);
if (host.default !== true) process.exit(1);
if (host.sandbox?.mode !== "off") process.exit(1);
if (worker.sandbox?.mode !== "all") process.exit(1);
if (worker.sandbox?.scope !== "agent") process.exit(1);
NODE
  else
    warn "openclaw config file missing or node unavailable: $CONFIG_PATH"
  fi
else
  warn "openclaw unavailable; skipped topology validation"
fi

echo
echo "Recommended next steps:"
echo "1. Run ./scripts/worker-status.sh for host and worker continuity details."
echo "2. Run ./scripts/bootstrap-recovery.sh --dry-run if workspaces or bindings drifted."
echo "3. Run npm test --prefix services/diagnostic before claiming contract or service readiness."
