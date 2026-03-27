#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const contractPath = path.join(root, "config", "github", "automation-contract.json");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing file: ${relativePath}`);
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function requireString(text, needle, context) {
  if (!text.includes(needle)) {
    fail(`missing '${needle}' in ${context}`);
  }
}

if (!fs.existsSync(contractPath)) {
  fail(`missing automation contract: ${contractPath}`);
}

const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
if (contract.version !== 1) {
  fail("automation contract version must be 1");
}

const issueToPrText = read(".github/workflows/issue-to-pr.yml");
const workspaceSyncText = read(".github/workflows/workspace-sync-on-merge.yml");
const autonomyDoc = read("docs/GITHUB_AUTONOMY.md");
const automationDoc = read("docs/GITHUB_AUTOMATION.md");
const codespaceDoc = read("docs/CODESPACE_GITHUB_WORKER.md");

for (const relativePath of contract.required_scripts || []) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`missing automation script: ${relativePath}`);
  }
}

for (const relativePath of contract.docs || []) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`missing automation doc: ${relativePath}`);
  }
}

for (const relativePath of contract.env_examples || []) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`missing automation env example: ${relativePath}`);
  }
}

for (const relativePath of contract.selftest_examples || []) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`missing automation self-test example: ${relativePath}`);
  }
}

if (!fs.existsSync(path.join(root, contract.policy_file))) {
  fail(`missing automation policy file: ${contract.policy_file}`);
}

for (const workflow of contract.workflows || []) {
  const text = read(workflow.workflow_file);
  requireString(text, `name: ${workflow.workflow_name}`, workflow.workflow_file);
  for (const needle of workflow.required_strings || []) {
    requireString(text, needle, workflow.workflow_file);
  }
  for (const variableName of workflow.required_repo_vars || []) {
    requireString(text, variableName, workflow.workflow_file);
  }
}

requireString(issueToPrText, "policy_decision", ".github/workflows/issue-to-pr.yml");
requireString(issueToPrText, "scripts/render-github-plan-comment.mjs", ".github/workflows/issue-to-pr.yml");
requireString(issueToPrText, "scripts/render-github-pr-body.mjs", ".github/workflows/issue-to-pr.yml");
requireString(workspaceSyncText, "AUTOMIND_WORKSPACE_SYNC_ENABLED", ".github/workflows/workspace-sync-on-merge.yml");

requireString(autonomyDoc, "config/github/automation-contract.json", "docs/GITHUB_AUTONOMY.md");
requireString(autonomyDoc, ".github/autonomy/execution-policy.json", "docs/GITHUB_AUTONOMY.md");
requireString(automationDoc, "validate-github-automation.mjs", "docs/GITHUB_AUTOMATION.md");
requireString(automationDoc, "github-autonomy-selftest.mjs", "docs/GITHUB_AUTOMATION.md");
requireString(codespaceDoc, "codespace-admin.env.example", "docs/CODESPACE_GITHUB_WORKER.md");

console.log("GitHub automation contract is valid");
