#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <repo_full_name> <issue_number>" >&2
  exit 1
fi

REPO_FULL_NAME="$1"
ISSUE_NUMBER="$2"
RUN_ID="${GITHUB_RUN_ID:-local}"

issue_json="$(gh issue view "$ISSUE_NUMBER" --repo "$REPO_FULL_NAME" --json number,title,body,labels,url)"

node - "$issue_json" "$RUN_ID" <<'NODE'
const issue = JSON.parse(process.argv[2]);
const runId = process.argv[3];
const labels = new Set((issue.labels || []).map((label) => label.name));
const text = `${issue.title || ""}\n${issue.body || ""}`.toLowerCase();

let scope = "docs";
let risk = "low";
let executorAllowed = true;
let suggestedTargets = ["docs/", "config/", "RUNBOOK.md"];
let checks = ["node scripts/validate-ona-skills.mjs"];

if (["workflow", "github action", "ci", "automation"].some((word) => text.includes(word))) {
  scope = "automation";
  suggestedTargets = [".github/workflows/", "scripts/", "docs/"];
  checks = [
    "node scripts/validate-ona-skills.mjs",
    "node scripts/validate-workflows.mjs",
  ];
}

if (["service", "contract", "schema", "policy", "worker", "runtime"].some((word) => text.includes(word))) {
  scope = "runtime";
  risk = "medium";
  suggestedTargets = ["services/", "docs/", "config/", "scripts/"];
  checks = [
    "node scripts/validate-ona-skills.mjs",
    "node scripts/validate-runtime-contracts.mjs",
    "npm test --prefix services/diagnostic || true",
  ];
}

if (["secret", ".env", "credential", "token", "tenant", "prod"].some((word) => text.includes(word))) {
  executorAllowed = false;
  risk = "high";
}

if (labels.has("autonomy:needs-human") || labels.has("risk:high")) {
  executorAllowed = false;
}

const slug =
  issue.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || `issue-${issue.number}`;

const plan = {
  issue_number: issue.number,
  issue_url: issue.url,
  summary: `Autonomy scaffold plan for issue #${issue.number}: ${issue.title}`,
  scope,
  risk,
  executor_allowed: executorAllowed,
  branch_name: `autonomy/issue-${issue.number}-${slug}`,
  suggested_targets: suggestedTargets,
  checks,
  labels: [...labels].sort(),
  run_id: runId,
};

console.log(JSON.stringify(plan, null, 2));
NODE
