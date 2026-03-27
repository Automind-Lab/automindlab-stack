#!/usr/bin/env node

import fs from "node:fs";
import { execFileSync } from "node:child_process";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    repo: null,
    issueNumber: null,
    issueJsonPath: null,
    runId: process.env.GITHUB_RUN_ID || "local",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--issue-json") {
      options.issueJsonPath = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--run-id") {
      options.runId = argv[index + 1];
      index += 1;
      continue;
    }
    if (!options.repo) {
      options.repo = arg;
      continue;
    }
    if (!options.issueNumber) {
      options.issueNumber = arg;
      continue;
    }
    fail(`unexpected argument: ${arg}`);
  }

  return options;
}

function loadIssue(options) {
  if (options.issueJsonPath) {
    return JSON.parse(fs.readFileSync(options.issueJsonPath, "utf8"));
  }

  if (!options.repo || !options.issueNumber) {
    fail("usage: github-issue-planner.mjs <repo_full_name> <issue_number> [--issue-json path] [--run-id id]");
  }

  try {
    const output = execFileSync(
      "gh",
      [
        "issue",
        "view",
        options.issueNumber,
        "--repo",
        options.repo,
        "--json",
        "number,title,body,labels,url",
      ],
      { encoding: "utf8" },
    );
    return JSON.parse(output);
  } catch (error) {
    fail(`unable to read issue via gh: ${error.message}`);
  }
}

function slugify(input) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "issue"
  );
}

function unique(values) {
  return [...new Set(values)];
}

function buildPlan(issue, runId) {
  const labels = unique(
    (issue.labels || [])
      .map((label) => (typeof label === "string" ? label : label?.name))
      .filter(Boolean),
  ).sort();
  const text = `${issue.title || ""}\n${issue.body || ""}`.toLowerCase();

  let scope = "docs";
  let risk = "low";
  let executionMode = "external_executor";
  let executorAllowed = true;
  let blockedReason = "";
  let suggestedTargets = ["README.md", "docs/", "RUNBOOK.md"];
  let checks = [
    "node scripts/validate-repo-operating-system.mjs",
    "node scripts/validate-github-automation.mjs",
  ];

  if (["flowcommander", "downstream", "sync", "contract review"].some((word) => text.includes(word))) {
    scope = "downstream";
    suggestedTargets = [
      "config/sync/",
      "docs/DOWNSTREAM_SYNC_CONTRACT.md",
      "docs/FLOWCOMMANDER_INTEGRATION_CONTRACT.md",
    ];
    checks = [
      "node scripts/validate-downstream-sync.mjs",
      "node scripts/validate-runtime-contracts.mjs",
    ];
  }

  if (["workflow", "github action", "ci", "automation", "codespace", "pull request"].some((word) => text.includes(word))) {
    scope = "automation";
    risk = "medium";
    suggestedTargets = [
      ".github/workflows/",
      "scripts/",
      "docs/GITHUB_AUTONOMY.md",
      "docs/GITHUB_AUTOMATION.md",
    ];
    checks = [
      "node scripts/validate-github-automation.mjs",
      "node scripts/github-autonomy-selftest.mjs",
      "node scripts/validate-workflows.mjs",
    ];
  }

  if (["service", "schema", "worker", "runtime", "openclaw", "binding", "host/worker"].some((word) => text.includes(word))) {
    scope = "runtime";
    risk = "medium";
    suggestedTargets = [
      "services/",
      "scripts/",
      "config/schemas/",
      "docs/OPENCLAW_HOST_AGENT_SYSTEM.md",
    ];
    checks = [
      "node scripts/validate-runtime-contracts.mjs",
      "node scripts/openclaw-fixture-smoke.mjs",
      "npm test --prefix services/diagnostic",
    ];
  }

  const blockedTerms = ["secret", ".env", "credential", "token", "tenant", "production", "prod"];
  const hitTerms = blockedTerms.filter((term) => text.includes(term));

  if (hitTerms.length > 0) {
    executionMode = "blocked";
    executorAllowed = false;
    risk = "high";
    blockedReason = `Issue touches approval-boundary terms: ${hitTerms.join(", ")}`;
  }

  if (labels.includes("autonomy:needs-human") || labels.includes("risk:high")) {
    executionMode = "blocked";
    executorAllowed = false;
    risk = "high";
    blockedReason = blockedReason || "Issue carries a blocking autonomy label.";
  }

  const slug = slugify(issue.title || `issue-${issue.number}`);

  return {
    version: 1,
    issue_number: issue.number,
    issue_url: issue.url,
    issue_title: issue.title || "",
    issue_body: issue.body || "",
    summary: `AutoMindLab autonomy plan for issue #${issue.number}: ${issue.title || "untitled issue"}`,
    scope,
    risk,
    execution_mode: executionMode,
    executor_allowed: executorAllowed,
    blocked_reason: blockedReason,
    branch_name: `autonomy/issue-${issue.number}-${slug}`,
    suggested_targets: suggestedTargets,
    target_files: suggestedTargets,
    checks,
    labels,
    pr_title: `autonomy: address issue #${issue.number}`,
    run_id: runId,
  };
}

const options = parseArgs(process.argv.slice(2));
const issue = loadIssue(options);
const plan = buildPlan(issue, options.runId);
console.log(JSON.stringify(plan, null, 2));
