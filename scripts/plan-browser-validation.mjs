#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "config", "browser-validation", "enterprise-browser-validation.manifest.json");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseArgs(argv) {
  const state = {
    mode: "branch",
    files: [],
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--mode") {
      state.mode = argv[index + 1] || fail("--mode requires a value");
      index += 1;
      continue;
    }
    if (arg === "--files") {
      const value = argv[index + 1] || fail("--files requires a comma-separated value");
      state.files = value.split(",").map((item) => item.trim()).filter(Boolean);
      index += 1;
      continue;
    }
    if (arg === "--json") {
      state.json = true;
      continue;
    }
    fail(`unknown argument: ${arg}`);
  }

  return state;
}

function runGit(args) {
  const completed = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (completed.status !== 0) {
    fail(`git ${args.join(" ")} failed: ${completed.stderr || completed.stdout}`);
  }
  return completed.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function collectChangedFiles(mode, explicitFiles) {
  if (mode === "files") {
    return explicitFiles;
  }
  if (mode === "unstaged") {
    return runGit(["diff", "--name-only"]);
  }
  if (mode === "head") {
    return runGit(["diff", "--name-only", "HEAD~1..HEAD"]);
  }
  if (mode === "branch") {
    const completed = spawnSync("git", ["diff", "--name-only", "origin/main...HEAD"], {
      cwd: root,
      encoding: "utf8",
      stdio: "pipe",
    });
    if (completed.status === 0) {
      return completed.stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    }
    return runGit(["diff", "--name-only", "HEAD~1..HEAD"]);
  }
  fail(`unsupported mode: ${mode}`);
}

function matchesPrefix(filePath, prefixes) {
  return prefixes.some((prefix) => filePath === prefix || filePath.startsWith(prefix));
}

const args = parseArgs(process.argv.slice(2));
const manifest = readJson(manifestPath);
const changedFiles = collectChangedFiles(args.mode, args.files);
const selections = [];

for (const target of manifest.targets) {
  for (const suite of target.suites) {
    const matchedFiles = changedFiles.filter((filePath) => matchesPrefix(filePath, suite.pathPrefixes));
    if (suite.alwaysInclude || matchedFiles.length > 0) {
      selections.push({
        targetId: target.id,
        targetName: target.name,
        baseUrlEnv: target.baseUrlEnv,
        requiresAuthSession: target.requiresAuthSession,
        suiteId: suite.id,
        description: suite.description,
        riskLevel: suite.riskLevel,
        approvalMode: suite.approvalMode,
        routeHints: suite.routeHints,
        requiredArtifacts: suite.requiredArtifacts,
        steps: suite.steps,
        matchedFiles,
        notes: suite.notes
      });
    }
  }
}

const payload = {
  manifestId: manifest.manifestId,
  mode: args.mode,
  changedFiles,
  selectedSuites: selections
};

if (args.json) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

console.log("== Browser Validation Plan ==");
console.log(`manifest: ${manifest.manifestId}`);
console.log(`mode: ${args.mode}`);
console.log();
console.log("Changed files:");
if (changedFiles.length === 0) {
  console.log("- none detected");
} else {
  for (const filePath of changedFiles) {
    console.log(`- ${filePath}`);
  }
}

console.log();
if (selections.length === 0) {
  console.log("No browser validation suites matched the current change set.");
  process.exit(0);
}

console.log("Selected suites:");
for (const suite of selections) {
  console.log(`- ${suite.suiteId} (${suite.targetName})`);
  console.log(`  baseUrlEnv: ${suite.baseUrlEnv}`);
  console.log(`  approvalMode: ${suite.approvalMode}`);
  console.log(`  riskLevel: ${suite.riskLevel}`);
  console.log(`  requiresAuthSession: ${suite.requiresAuthSession}`);
  console.log(`  routeHints: ${suite.routeHints.join(", ")}`);
  console.log(`  requiredArtifacts: ${suite.requiredArtifacts.join(", ")}`);
  if (suite.matchedFiles.length > 0) {
    console.log(`  matchedFiles: ${suite.matchedFiles.join(", ")}`);
  }
  console.log(`  notes: ${suite.notes}`);
}
