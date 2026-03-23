#!/usr/bin/env bash
set -euo pipefail

HOST_AGENT_ID="${AUTOMIND_HOST_AGENT_ID:-automind-host}"
WORKER_AGENT_ID="${AUTOMIND_WORKER_AGENT_ID:-automind-worker}"

command -v openclaw >/dev/null 2>&1 || { echo "Error: openclaw not found"; exit 1; }

openclaw agents list --bindings || true

echo
openclaw agents bindings || true

echo
echo "Expected shape:"
echo "- host agent:   $HOST_AGENT_ID"
echo "- worker agent: $WORKER_AGENT_ID"
echo "- host owns external bindings"
echo "- worker is the isolated execution path"
