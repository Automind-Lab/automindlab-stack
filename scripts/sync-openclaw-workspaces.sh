#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPENCLAW_HOME="${OPENCLAW_HOME:-$HOME/.openclaw}"
HOST_WORKSPACE="${AUTOMIND_HOST_WORKSPACE:-$OPENCLAW_HOME/workspace-automind-host}"
WORKER_WORKSPACE="${AUTOMIND_WORKER_WORKSPACE:-$OPENCLAW_HOME/workspace-automind-worker}"

command -v rsync >/dev/null 2>&1 || {
  echo "Error: rsync not found"
  exit 1
}

mkdir -p "$HOST_WORKSPACE/.ona" "$HOST_WORKSPACE/config" "$WORKER_WORKSPACE"

for file in AGENTS.md BOOTSTRAP.md README.md RUNBOOK.md TASK_STATE.md WORK_IN_PROGRESS.md routines.md; do
  if [[ -f "$ROOT_DIR/$file" ]]; then
    cp "$ROOT_DIR/$file" "$HOST_WORKSPACE/$file"
  fi
done

rsync -a "$ROOT_DIR/context/" "$HOST_WORKSPACE/context/"
rsync -a "$ROOT_DIR/docs/" "$HOST_WORKSPACE/docs/"
rsync -a "$ROOT_DIR/.ona/skills/" "$HOST_WORKSPACE/.ona/skills/"
rsync -a "$ROOT_DIR/config/" "$HOST_WORKSPACE/config/"

rsync -a --delete "$HOST_WORKSPACE/" "$WORKER_WORKSPACE/"

echo "Synced AutoMindLab repo state into OpenClaw workspaces."
echo "Host workspace: $HOST_WORKSPACE"
echo "Worker workspace: $WORKER_WORKSPACE"
