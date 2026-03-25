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
mkdir -p "$HOST_WORKSPACE/context" "$WORKER_WORKSPACE/context"

cp "$ROOT_DIR/AGENTS.md" "$HOST_WORKSPACE/AGENTS.md"
cp "$ROOT_DIR/context/BOOTSTRAP.md" "$HOST_WORKSPACE/BOOTSTRAP.md"
rsync -a "$ROOT_DIR/context/" "$HOST_WORKSPACE/context/"

if [ -d "$ROOT_DIR/.ona/skills" ]; then
  mkdir -p "$HOST_WORKSPACE/.ona"
  rsync -a "$ROOT_DIR/.ona/skills/" "$HOST_WORKSPACE/.ona/skills/"
fi

rsync -a --delete "$HOST_WORKSPACE/" "$WORKER_WORKSPACE/"

echo "Synced AutoMindLab repo state into OpenClaw workspaces."
echo "Host workspace: $HOST_WORKSPACE"
echo "Worker workspace: $WORKER_WORKSPACE"
