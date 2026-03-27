#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_FULL_NAME="Automind-Lab/automindlab-stack"
CONFIG_FILE="${AUTOMIND_CODESPACE_ADMIN_CONFIG:-$ROOT_DIR/config/github/codespace-admin.env}"

usage() {
  cat <<'EOF'
Usage:
  scripts/codespace-github-admin.sh doctor
  scripts/codespace-github-admin.sh set-vars
  scripts/codespace-github-admin.sh create-low-risk-issue
  scripts/codespace-github-admin.sh run-dry-run <issue_number>
  scripts/codespace-github-admin.sh bootstrap-low-risk-dry-run
EOF
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

load_config() {
  if [ -f "$CONFIG_FILE" ]; then
    # shellcheck disable=SC1090
    source "$CONFIG_FILE"
  fi
}

doctor() {
  require_cmd gh
  gh auth status >/dev/null
  gh repo view "$REPO_FULL_NAME" >/dev/null
  gh workflow list --repo "$REPO_FULL_NAME" >/dev/null
  echo "AutoMindLab Codespace GitHub admin worker is ready."
}

set_vars() {
  : "${AUTOMINDLAB_GITHUB_AUTONOMY_EXECUTOR:?Set AUTOMINDLAB_GITHUB_AUTONOMY_EXECUTOR in $CONFIG_FILE}"
  : "${AUTOMIND_HOST_WORKSPACE:?Set AUTOMIND_HOST_WORKSPACE in $CONFIG_FILE}"
  : "${AUTOMIND_WORKER_WORKSPACE:?Set AUTOMIND_WORKER_WORKSPACE in $CONFIG_FILE}"
  : "${OPENCLAW_HOME:?Set OPENCLAW_HOME in $CONFIG_FILE}"

  gh variable set AUTOMIND_AUTONOMY_EXECUTION_ENABLED --repo "$REPO_FULL_NAME" --body "${AUTOMIND_AUTONOMY_EXECUTION_ENABLED:-false}"
  gh variable set AUTOMIND_WORKSPACE_SYNC_ENABLED --repo "$REPO_FULL_NAME" --body "${AUTOMIND_WORKSPACE_SYNC_ENABLED:-false}"
  gh variable set AUTOMINDLAB_GITHUB_AUTONOMY_EXECUTOR --repo "$REPO_FULL_NAME" --body "$AUTOMINDLAB_GITHUB_AUTONOMY_EXECUTOR"
  gh variable set AUTOMIND_HOST_WORKSPACE --repo "$REPO_FULL_NAME" --body "$AUTOMIND_HOST_WORKSPACE"
  gh variable set AUTOMIND_WORKER_WORKSPACE --repo "$REPO_FULL_NAME" --body "$AUTOMIND_WORKER_WORKSPACE"
  gh variable set OPENCLAW_HOME --repo "$REPO_FULL_NAME" --body "$OPENCLAW_HOME"

  echo "Configured AutoMindLab repo variables."
}

create_low_risk_issue() {
  local issue_body
  issue_body="$(cat <<'EOF'
## Summary
Refresh the AutoMindLab autonomy and downstream-sync docs index so operators can find the autonomy guide, downstream sync contract, and FLOWCOMMANDER sync surface quickly.

## Scope
- docs/
- config/sync/
- README links only
- no runtime or service logic changes

## Acceptance criteria
- autonomy and downstream sync docs are easier to find
- README or docs index links are valid
- no runtime behavior changes

## Risk
low

## Guardrails
- no secrets, credentials, tenant data, or production settings changes
- no service contract changes
- review through draft PR only
EOF
)"

  gh issue create \
    --repo "$REPO_FULL_NAME" \
    --title "autonomy: refresh AutoMindLab operator docs index" \
    --label "autonomy:ready" \
    --body "$issue_body"
}

run_dry_run() {
  local issue_number="$1"
  gh workflow run issue-to-pr.yml \
    --repo "$REPO_FULL_NAME" \
    -f issue_number="$issue_number" \
    -f dry_run=true
  echo "Dispatched dry-run workflow for issue #$issue_number"
}

bootstrap_low_risk_dry_run() {
  local issue_url issue_number
  doctor
  set_vars
  issue_url="$(create_low_risk_issue)"
  issue_number="${issue_url##*/}"
  echo "Created issue: $issue_url"
  run_dry_run "$issue_number"
}

main() {
  if [ "$#" -lt 1 ]; then
    usage
    exit 1
  fi

  load_config

  case "$1" in
    doctor)
      doctor
      ;;
    set-vars)
      set_vars
      ;;
    create-low-risk-issue)
      create_low_risk_issue
      ;;
    run-dry-run)
      if [ "$#" -lt 2 ]; then
        echo "run-dry-run requires an issue number" >&2
        exit 1
      fi
      run_dry_run "$2"
      ;;
    bootstrap-low-risk-dry-run)
      bootstrap_low_risk_dry_run
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
