#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
CONFIG_PATH="${OPENCLAW_CONFIG:-$OPENCLAW_HOME/openclaw.json}"
HOST_WORKSPACE="${AUTOMIND_HOST_WORKSPACE:-$OPENCLAW_HOME/workspace-automind-host}"
WORKER_WORKSPACE="${AUTOMIND_WORKER_WORKSPACE:-$OPENCLAW_HOME/workspace-automind-worker}"
HOST_AGENT_ID="${AUTOMIND_HOST_AGENT_ID:-automind-host}"
WORKER_AGENT_ID="${AUTOMIND_WORKER_AGENT_ID:-automind-worker}"

print_state_block() {
  local label="$1"
  local file="$2"
  echo "$label: $file"
  grep -E '^(Last updated:|- Description:|- Active repo:|- Branch:|- Last successful step:|- Next intended step:|- Verification complete:|- Safe to resume:|- Active mission:)' "$file" || true
  echo
}

workspace_snapshot() {
  local label="$1"
  local workspace="$2"
  echo "$label workspace: $workspace"
  if [[ ! -d "$workspace" ]]; then
    echo "  missing"
    echo
    return
  fi
  for file in AGENTS.md RUNBOOK.md TASK_STATE.md WORK_IN_PROGRESS.md; do
    if [[ -f "$workspace/$file" ]]; then
      echo "  present: $file"
    else
      echo "  missing: $file"
    fi
  done
  echo
}

echo "=== AutoMindLab Worker Status ==="
echo "Repo root: $ROOT_DIR"
echo

if command -v openclaw >/dev/null 2>&1; then
  if openclaw gateway status >/dev/null 2>&1; then
    echo "Gateway: running"
  else
    echo "Gateway: not running or not reachable"
  fi

  if openclaw config validate >/dev/null 2>&1; then
    echo "OpenClaw config: valid"
  else
    echo "OpenClaw config: invalid or unavailable"
  fi

  echo
  openclaw agents list --bindings 2>/dev/null || true
else
  echo "Gateway: openclaw not installed on this machine"
fi

echo
if command -v node >/dev/null 2>&1 && [[ -f "$CONFIG_PATH" ]]; then
  node - "$CONFIG_PATH" "$HOST_AGENT_ID" "$WORKER_AGENT_ID" <<'NODE'
const fs = require("node:fs");
const [configPath, hostId, workerId] = process.argv.slice(2);
const raw = fs.readFileSync(configPath, "utf8").trim();
const config = raw ? JSON.parse(raw) : {};
const list = config.agents?.list || [];
const host = list.find((item) => item.id === hostId) || {};
const worker = list.find((item) => item.id === workerId) || {};
console.log(`Configured host agent: ${hostId}`);
console.log(`  default: ${host.default === true}`);
console.log(`  sandbox: ${host.sandbox?.mode || "unknown"}`);
console.log(`Configured worker agent: ${workerId}`);
console.log(`  sandbox: ${worker.sandbox?.mode || "unknown"}`);
console.log(`  scope: ${worker.sandbox?.scope || "unknown"}`);
console.log(`Default workspace: ${config.agents?.defaults?.workspace || "unknown"}`);
NODE
else
  echo "Configured topology: unable to inspect openclaw config"
fi

echo
workspace_snapshot "Host" "$HOST_WORKSPACE"
workspace_snapshot "Worker" "$WORKER_WORKSPACE"

if [[ -f "$ROOT_DIR/TASK_STATE.md" ]]; then
  print_state_block "Task state" "$ROOT_DIR/TASK_STATE.md"
else
  echo "Task state: not found"
  echo
fi

if [[ -f "$ROOT_DIR/WORK_IN_PROGRESS.md" ]]; then
  print_state_block "Work in progress" "$ROOT_DIR/WORK_IN_PROGRESS.md"
else
  echo "Work in progress: not found"
  echo
fi

echo "Expected shape:"
echo "- host agent:   $HOST_AGENT_ID"
echo "- worker agent: $WORKER_AGENT_ID"
echo "- host owns external bindings"
echo "- worker is the isolated execution path"
echo "=== End Status ==="
