#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = "config/browser-validation/enterprise-browser-validation.manifest.json";
const schemaPath = "config/schemas/browser-validation-manifest.schema.json";
const riskLevels = new Set(["low", "medium", "high"]);
const approvalModes = new Set(["allow", "prompt"]);
const artifactTypes = new Set(["screenshot", "console-log", "trace", "video", "network-log"]);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function ensure(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  ensure(fs.existsSync(absolutePath), `missing file: ${relativePath}`);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error.message}`);
  }
}

function ensureString(value, label) {
  ensure(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
}

readJson(schemaPath);
const manifest = readJson(manifestPath);

ensureString(manifest.version, "version");
ensureString(manifest.manifestId, "manifestId");
ensureString(manifest.description, "description");
ensure(["diff-aware", "manual-only"].includes(manifest.plannerMode), "plannerMode is invalid");
ensure(Array.isArray(manifest.defaultEvidence) && manifest.defaultEvidence.length > 0, "defaultEvidence must be non-empty");
ensure(manifest.defaultEvidence.every((item) => artifactTypes.has(item)), "defaultEvidence contains unsupported artifact types");
ensure(Array.isArray(manifest.targets) && manifest.targets.length > 0, "targets must be non-empty");

const targetIds = new Set();
const suiteIds = new Set();
let hasOperatorCoverage = false;
let hasAgentmailCoverage = false;
let hasPromptSuite = false;

for (const target of manifest.targets) {
  ensureString(target.id, "target id");
  ensure(!targetIds.has(target.id), `duplicate target id: ${target.id}`);
  targetIds.add(target.id);
  ensureString(target.name, `target ${target.id} name`);
  ensure(/^[A-Z0-9_]+$/.test(target.baseUrlEnv), `target ${target.id} baseUrlEnv must be uppercase underscore format`);
  ensureString(target.owner, `target ${target.id} owner`);
  ensure(typeof target.requiresAuthSession === "boolean", `target ${target.id} requiresAuthSession must be boolean`);
  ensure(Array.isArray(target.supportedArtifacts) && target.supportedArtifacts.length > 0, `target ${target.id} supportedArtifacts must be non-empty`);
  ensure(target.supportedArtifacts.every((item) => artifactTypes.has(item)), `target ${target.id} has unsupported artifacts`);
  ensure(Array.isArray(target.suites) && target.suites.length > 0, `target ${target.id} suites must be non-empty`);

  for (const suite of target.suites) {
    ensureString(suite.id, `suite id on target ${target.id}`);
    ensure(!suiteIds.has(suite.id), `duplicate suite id: ${suite.id}`);
    suiteIds.add(suite.id);
    ensureString(suite.description, `suite ${suite.id} description`);
    ensure(Array.isArray(suite.pathPrefixes) && suite.pathPrefixes.length > 0, `suite ${suite.id} pathPrefixes must be non-empty`);
    ensure(Array.isArray(suite.routeHints) && suite.routeHints.length > 0, `suite ${suite.id} routeHints must be non-empty`);
    ensure(riskLevels.has(suite.riskLevel), `suite ${suite.id} riskLevel is invalid`);
    ensure(approvalModes.has(suite.approvalMode), `suite ${suite.id} approvalMode is invalid`);
    ensure(Array.isArray(suite.steps) && suite.steps.length > 0, `suite ${suite.id} steps must be non-empty`);
    ensure(Array.isArray(suite.requiredArtifacts) && suite.requiredArtifacts.length > 0, `suite ${suite.id} requiredArtifacts must be non-empty`);
    ensure(suite.requiredArtifacts.every((item) => target.supportedArtifacts.includes(item)), `suite ${suite.id} requires artifacts unsupported by target ${target.id}`);
    ensure(typeof suite.alwaysInclude === "boolean", `suite ${suite.id} alwaysInclude must be boolean`);
    ensureString(suite.notes, `suite ${suite.id} notes`);

    if (suite.approvalMode === "prompt") {
      hasPromptSuite = true;
    }
    if (suite.pathPrefixes.some((prefix) => prefix.startsWith("config/operator/") || prefix.startsWith("docs/OPERATOR_"))) {
      hasOperatorCoverage = true;
    }
    if (suite.pathPrefixes.some((prefix) => prefix.startsWith("config/email/") || prefix.includes("AGENTMAIL_RUNTIME_CONTRACT"))) {
      hasAgentmailCoverage = true;
    }
  }
}

ensure(hasPromptSuite, "browser validation manifest must include at least one prompt-gated suite");
ensure(hasOperatorCoverage, "browser validation manifest must cover operator-surface changes");
ensure(hasAgentmailCoverage, "browser validation manifest must cover AgentMail runtime changes");

console.log("Browser validation manifest is valid");
