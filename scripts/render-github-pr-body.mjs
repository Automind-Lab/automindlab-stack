#!/usr/bin/env node

import fs from "node:fs";

const [planPath, policyPath, verifyPath] = process.argv.slice(2);
if (!planPath || !policyPath || !verifyPath) {
  console.error("usage: render-github-pr-body.mjs <plan_json_path> <policy_json_path> <verify_json_path>");
  process.exit(1);
}

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));
const verify = JSON.parse(fs.readFileSync(verifyPath, "utf8"));

const lines = [
  "## Summary",
  plan.summary,
  "",
  `Closes #${plan.issue_number}`,
  "",
  "## Policy",
  `- Decision: ${policy.decision}`,
  ...policy.notes.map((item) => `- ${item}`),
  "",
  "## Verification",
  ...verify.checks.map((item) => `- ${item.name}: ${item.status}`),
  "",
  "## Rollback",
  "- Revert this PR or remove the triggering autonomy label before rerun.",
];

process.stdout.write(`${lines.join("\n")}\n`);
