#!/usr/bin/env node

import fs from "node:fs";

const [planPath, policyPath] = process.argv.slice(2);
if (!planPath || !policyPath) {
  console.error("usage: render-github-plan-comment.mjs <plan_json_path> <policy_json_path>");
  process.exit(1);
}

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));

const lines = [
  "## AutoMindLab autonomy plan",
  "",
  `- Issue: #${plan.issue_number}`,
  `- Scope: \`${plan.scope}\``,
  `- Risk: \`${plan.risk}\``,
  `- Execution mode: \`${plan.execution_mode}\``,
  `- Proposed branch: \`${plan.branch_name}\``,
  `- Policy decision: \`${policy.decision}\``,
  "",
  "### Suggested targets",
  ...plan.suggested_targets.map((item) => `- \`${item}\``),
  "",
  "### Checks to run",
  ...plan.checks.map((item) => `- \`${item}\``),
  "",
  "### Policy notes",
  ...policy.notes.map((item) => `- ${item}`),
];

process.stdout.write(`${lines.join("\n")}\n`);
