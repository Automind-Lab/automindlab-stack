#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_FILE="$ROOT_DIR/config/runtime.auto.env"

read_value() {
  local file="$1"
  local key="$2"
  awk -F'=' -v k="$key" '$1 == k {sub($1 FS, "", $0); gsub(/^"|"$/, "", $0); print $0}' "$file" | head -n1
}

have_cmd() {
  command -v "$1" >/dev/null 2>&1
}

echo "== AutoMindLab Runtime Doctor =="
echo "repo: $ROOT_DIR"

echo
if [[ -f "$CONFIG_FILE" ]]; then
  echo "runtime env: present"
  echo "  host agent:   $(read_value "$CONFIG_FILE" AUTOMIND_HOST_AGENT_ID)"
  echo "  worker agent: $(read_value "$CONFIG_FILE" AUTOMIND_WORKER_AGENT_ID)"
  echo "  service port: $(read_value "$CONFIG_FILE" AUTOMIND_DIAGNOSTIC_PORT)"
else
  echo "runtime env: missing"
  echo "  fix: copy config/runtime.auto.env.example to config/runtime.auto.env"
fi

echo
if have_cmd openclaw; then
  echo "openclaw: present"
else
  echo "openclaw: missing"
fi

if have_cmd docker; then
  echo "docker: present"
else
  echo "docker: missing"
fi

if docker compose version >/dev/null 2>&1; then
  echo "docker compose: present"
else
  echo "docker compose: missing"
fi

echo
echo "Recommended next steps:"
echo "1. Configure agents with ./scripts/configure-openclaw-agents.sh"
echo "2. Restart the gateway after configuration"
echo "3. Verify worker state with ./scripts/worker-status.sh"
