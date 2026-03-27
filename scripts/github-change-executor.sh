#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <plan_json_path>" >&2
  exit 1
fi

PLAN_PATH="$1"
EXECUTOR="${AUTOMINDLAB_GITHUB_AUTONOMY_EXECUTOR:-}"

if [ ! -f "$PLAN_PATH" ]; then
  echo "Plan file not found: $PLAN_PATH" >&2
  exit 1
fi

if [ -z "$EXECUTOR" ]; then
  echo "AUTOMINDLAB_GITHUB_AUTONOMY_EXECUTOR is not configured." >&2
  echo "Set a repo variable pointing to the local executor command on the self-hosted runner." >&2
  exit 1
fi

node - "$PLAN_PATH" <<'NODE'
const fs = require("node:fs");
const plan = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
if (plan.execution_mode === "blocked" || plan.executor_allowed !== true) {
  console.error("Blocked or disallowed plans must not be executed automatically.");
  process.exit(1);
}
console.log(`Executor scope: ${plan.scope}`);
console.log(`Issue: #${plan.issue_number}`);
console.log("This scaffold will now hand off to the configured local executor.");
NODE

# The configured executor should apply a bounded change based on the current checkout.
# Example: /usr/local/bin/automindlab-github-executor --plan "$PLAN_PATH"
# shellcheck disable=SC2086
$EXECUTOR "$PLAN_PATH"
