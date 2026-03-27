#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "automindlab-github-autonomy-"));

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function runNode(scriptRelativePath, args = []) {
  const completed = spawnSync(
    process.execPath,
    [path.join(root, scriptRelativePath), ...args],
    {
      cwd: root,
      encoding: "utf8",
      stdio: "pipe",
    },
  );
  if (completed.status !== 0) {
    fail(`${scriptRelativePath} failed:\n${completed.stderr || completed.stdout}`);
  }
  return completed.stdout;
}

function writeTemp(name, content) {
  const filePath = path.join(tempDir, name);
  fs.writeFileSync(filePath, content);
  return filePath;
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

const docsExample = path.join(root, "config/examples/github-autonomy-issue-docs.example.json");
const blockedExample = path.join(root, "config/examples/github-autonomy-issue-blocked.example.json");
const policyPath = path.join(root, ".github/autonomy/execution-policy.json");

const docsPlanPath = writeTemp(
  "docs-plan.json",
  runNode("scripts/github-issue-planner.mjs", ["--issue-json", docsExample, "--run-id", "selftest-docs"]),
);
const docsPolicyPath = writeTemp(
  "docs-policy.json",
  runNode("scripts/github-policy-check.mjs", [docsPlanPath, policyPath]),
);
const docsVerifyPath = writeTemp(
  "docs-verify.json",
  runNode("scripts/github-verifier.mjs", [docsPlanPath]),
);

const docsPlan = JSON.parse(fs.readFileSync(docsPlanPath, "utf8"));
const docsPolicy = JSON.parse(fs.readFileSync(docsPolicyPath, "utf8"));
const docsVerify = JSON.parse(fs.readFileSync(docsVerifyPath, "utf8"));

assert(docsPlan.scope === "downstream" || docsPlan.scope === "docs", "docs example should map to docs or downstream scope");
assert(docsPolicy.decision === "allow", "docs example should be policy-allowed");
assert(docsVerify.overall_status === "passed", "docs example verification should pass");

const commentOutput = runNode("scripts/render-github-plan-comment.mjs", [docsPlanPath, docsPolicyPath]);
assert(commentOutput.includes("## AutoMindLab autonomy plan"), "plan comment renderer must produce a heading");

const prBodyOutput = runNode("scripts/render-github-pr-body.mjs", [docsPlanPath, docsPolicyPath, docsVerifyPath]);
assert(prBodyOutput.includes("## Verification"), "PR body renderer must include verification");

const blockedPlanPath = writeTemp(
  "blocked-plan.json",
  runNode("scripts/github-issue-planner.mjs", ["--issue-json", blockedExample, "--run-id", "selftest-blocked"]),
);
const blockedPolicyPath = writeTemp(
  "blocked-policy.json",
  runNode("scripts/github-policy-check.mjs", [blockedPlanPath, policyPath]),
);

const blockedPlan = JSON.parse(fs.readFileSync(blockedPlanPath, "utf8"));
const blockedPolicy = JSON.parse(fs.readFileSync(blockedPolicyPath, "utf8"));

assert(blockedPlan.execution_mode === "blocked", "blocked example should produce a blocked execution mode");
assert(blockedPolicy.decision === "deny", "blocked example should be policy-denied");

console.log("GitHub autonomy self-test passed");
