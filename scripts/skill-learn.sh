#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STORE="$ROOT_DIR/data/adaptive-skills-store.json"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing dependency: $1" >&2
    exit 1
  }
}

log_result() {
  local input="$1"
  local skill="$2"
  local action="$3"
  local success="$4"

  require_cmd jq

  local tmp
  tmp="$(mktemp)"
  jq --arg input "$input" \
    --arg skill "$skill" \
    --arg action "$action" \
    --arg success "$success" \
    --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    '.records += [{
      input: $input,
      skill: $skill,
      action: $action,
      success: ($success == "true"),
      timestamp: $ts
    }]' "$STORE" >"$tmp"

  mv "$tmp" "$STORE"
}

summarize() {
  require_cmd jq
  jq '.records | group_by(.skill) | map({skill: .[0].skill, success_rate: (map(select(.success == true)) | length) / length, attempts: length})' "$STORE"
}

case "${1:-}" in
  log)
    log_result "${2:-}" "${3:-}" "${4:-}" "${5:-false}"
    ;;
  stats)
    summarize
    ;;
  *)
    echo "Usage:"
    echo "  skill-learn.sh log \"input\" skill action true|false"
    echo "  skill-learn.sh stats"
    exit 1
    ;;
esac
