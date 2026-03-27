#!/usr/bin/env node

import fs from "node:fs";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const planPath = process.argv[2];
const policyPath = process.argv[3] || ".github/autonomy/execution-policy.json";

if (!planPath) {
  fail("usage: github-policy-check.mjs <plan_json_path> [policy_json_path]");
}

if (!fs.existsSync(planPath)) {
  fail(`plan file not found: ${planPath}`);
}

if (!fs.existsSync(policyPath)) {
  fail(`policy file not found: ${policyPath}`);
}

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));
const combinedText = `${plan.issue_title || ""}\n${plan.issue_body || ""}`.toLowerCase();
const notes = [];
let decision = "allow";

if (plan.execution_mode === "blocked" || plan.executor_allowed !== true) {
  decision = "deny";
  notes.push(plan.blocked_reason || "Planner marked the issue as blocked.");
}

if ((policy.blocked_scopes || []).includes(plan.scope)) {
  decision = "deny";
  notes.push(`Scope '${plan.scope}' is blocked for autonomous execution.`);
}

const hitLabels = (plan.labels || []).filter((label) => (policy.blocked_labels || []).includes(label));
if (hitLabels.length > 0) {
  decision = "deny";
  notes.push(`Blocking labels present: ${hitLabels.join(", ")}`);
}

const hitTerms = (policy.blocked_terms || []).filter((term) => combinedText.includes(term.toLowerCase()));
if (hitTerms.length > 0) {
  decision = "deny";
  notes.push(`Blocked terms detected: ${hitTerms.join(", ")}`);
}

if ((policy.allowed_scopes || []).includes(plan.scope)) {
  notes.push(`Scope '${plan.scope}' is eligible for autonomous execution if checks pass.`);
} else {
  notes.push(`Scope '${plan.scope}' requires human confirmation before execution.`);
}

if ((plan.checks || []).length === 0) {
  decision = "deny";
  notes.push("Plan does not declare any verification checks.");
} else {
  notes.push(`Verifier must run ${plan.checks.length} declared checks before PR open.`);
}

console.log(
  JSON.stringify(
    {
      issue_number: plan.issue_number,
      decision,
      notes: unique(notes),
      policy_version: policy.version || 1,
    },
    null,
    2,
  ),
);

function unique(values) {
  return [...new Set(values)];
}
