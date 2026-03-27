#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dry-run]"
      exit 1
      ;;
  esac
done

run_step() {
  local description="$1"
  shift
  echo "-> $description"
  if [[ "$DRY_RUN" == true ]]; then
    printf '   %q' "$@"
    printf '\n'
    return 0
  fi
  "$@"
}

echo "=== AutoMindLab Bootstrap Recovery ==="
echo "Repo root: $ROOT_DIR"
echo "Dry run: $DRY_RUN"
echo

if command -v openclaw >/dev/null 2>&1 && command -v node >/dev/null 2>&1 && command -v rsync >/dev/null 2>&1; then
  run_step "reseed workspaces and reapply host/worker config" bash "$ROOT_DIR/scripts/configure-openclaw-agents.sh"
else
  run_step "reseed workspaces only" bash "$ROOT_DIR/scripts/sync-openclaw-workspaces.sh"
  echo "Warning: openclaw, node, or rsync missing; skipped agent reconfiguration."
fi

if command -v node >/dev/null 2>&1; then
  run_step "validate repo operating system" node "$ROOT_DIR/scripts/validate-repo-operating-system.mjs"
  run_step "validate workflows" node "$ROOT_DIR/scripts/validate-workflows.mjs"
  run_step "validate worker delegation contracts" node "$ROOT_DIR/scripts/validate-runtime-contracts.mjs"
fi

echo
echo "Bootstrap recovery complete."
