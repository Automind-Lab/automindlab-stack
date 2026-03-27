#!/usr/bin/env node

import fs from "node:fs";
import { spawnSync } from "node:child_process";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const planPath = process.argv[2];
if (!planPath) {
  fail("usage: github-verifier.mjs <plan_json_path>");
}

if (!fs.existsSync(planPath)) {
  fail(`plan file not found: ${planPath}`);
}

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const checks = [];

for (const command of plan.checks || []) {
  const completed = spawnSync(command, {
    shell: true,
    stdio: "pipe",
    encoding: "utf8",
  });

  checks.push({
    name: command,
    status: completed.status === 0 ? "passed" : "failed",
    returncode: completed.status ?? 1,
    stdout: (completed.stdout || "").trim(),
    stderr: (completed.stderr || "").trim(),
  });
}

const failedChecks = checks.filter((check) => check.status !== "passed");

console.log(
  JSON.stringify(
    {
      issue_number: plan.issue_number,
      scope: plan.scope,
      checks,
      overall_status: failedChecks.length === 0 ? "passed" : "failed",
      escalate: failedChecks.length > 0,
    },
    null,
    2,
  ),
);
