#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
HOST_WORKSPACE="${AUTOMIND_HOST_WORKSPACE:-$OPENCLAW_HOME/workspace-automind-host}"
WORKER_WORKSPACE="${AUTOMIND_WORKER_WORKSPACE:-$OPENCLAW_HOME/workspace-automind-worker}"
CONFIG_PATH="${OPENCLAW_CONFIG:-$OPENCLAW_HOME/openclaw.json}"
HOST_AGENT_ID="${AUTOMIND_HOST_AGENT_ID:-automind-host}"
WORKER_AGENT_ID="${AUTOMIND_WORKER_AGENT_ID:-automind-worker}"

command -v openclaw >/dev/null 2>&1 || { echo "Error: openclaw not found"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Error: node not found"; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo "Error: rsync not found"; exit 1; }

bash "$ROOT_DIR/scripts/sync-openclaw-workspaces.sh"

node "$ROOT_DIR/scripts/apply-openclaw-topology.mjs" \
  "$CONFIG_PATH" \
  "$HOST_WORKSPACE" \
  "$WORKER_WORKSPACE" \
  "$HOST_AGENT_ID" \
  "$WORKER_AGENT_ID"

openclaw agents set-identity --workspace "$HOST_WORKSPACE" --from-identity \
  || echo "Warning: host identity seeding failed; verify workspace manually"
openclaw agents set-identity --workspace "$WORKER_WORKSPACE" --from-identity \
  || echo "Warning: worker identity seeding failed; verify workspace manually"

openclaw config validate >/dev/null

echo "Configured OpenClaw host/worker split for AutoMindLab."
echo "Next step: restart the gateway and run ./scripts/worker-status.sh"
