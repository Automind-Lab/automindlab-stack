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
command -v python3 >/dev/null 2>&1 || { echo "Error: python3 not found"; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo "Error: rsync not found"; exit 1; }

mkdir -p "$HOST_WORKSPACE/context" "$WORKER_WORKSPACE/context"

cp "$ROOT_DIR/AGENTS.md" "$HOST_WORKSPACE/AGENTS.md"
cp "$ROOT_DIR/context/BOOTSTRAP.md" "$HOST_WORKSPACE/BOOTSTRAP.md"
rsync -a "$ROOT_DIR/context/" "$HOST_WORKSPACE/context/"
rsync -a --delete "$HOST_WORKSPACE/" "$WORKER_WORKSPACE/"

python3 - "$CONFIG_PATH" "$HOST_WORKSPACE" "$WORKER_WORKSPACE" "$HOST_AGENT_ID" "$WORKER_AGENT_ID" <<'PY'
import json
import sys
from pathlib import Path

config_path = Path(sys.argv[1])
host_workspace = sys.argv[2].replace(str(Path.home()), "~")
worker_workspace = sys.argv[3].replace(str(Path.home()), "~")
host_agent_id = sys.argv[4]
worker_agent_id = sys.argv[5]

if config_path.exists():
    text = config_path.read_text().strip()
    config = json.loads(text) if text else {}
else:
    config = {}

agents = config.setdefault("agents", {})
agent_list = agents.setdefault("list", [])
defaults = agents.setdefault("defaults", {})
defaults["workspace"] = host_workspace
defaults["sandbox"] = {"mode": "off"}

def upsert(agent):
    for idx, item in enumerate(agent_list):
        if item.get("id") == agent["id"]:
            merged = dict(item)
            merged.update(agent)
            agent_list[idx] = merged
            return
    agent_list.append(agent)

upsert({
    "id": host_agent_id,
    "default": True,
    "workspace": host_workspace,
    "sandbox": {"mode": "off"},
})

upsert({
    "id": worker_agent_id,
    "workspace": worker_workspace,
    "sandbox": {
        "mode": "all",
        "scope": "agent",
        "docker": {"network": "bridge"},
    },
})

config_path.parent.mkdir(parents=True, exist_ok=True)
config_path.write_text(json.dumps(config, indent=2) + "\n")
PY

openclaw agents set-identity --workspace "$HOST_WORKSPACE" --from-identity >/dev/null 2>&1 || true
openclaw agents set-identity --workspace "$WORKER_WORKSPACE" --from-identity >/dev/null 2>&1 || true
openclaw config validate >/dev/null

echo "Configured OpenClaw host/worker split for AutoMindLab."
