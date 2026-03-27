#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = "config/operator/operator-surface-manifest.json";
const policyPath = "config/operator/operator-command-policy.json";
const manifestSchemaPath = "config/schemas/operator-surface-manifest.schema.json";
const policySchemaPath = "config/schemas/operator-command-policy.schema.json";
const skillsIndexPath = ".ona/skills/index.json";

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

function ensureFile(relativePath, label) {
  ensure(fs.existsSync(path.join(root, relativePath)), `${label} missing file: ${relativePath}`);
}

readJson(manifestSchemaPath);
readJson(policySchemaPath);
const manifest = readJson(manifestPath);
const policy = readJson(policyPath);
const skillsIndex = readJson(skillsIndexPath);
const skillMap = skillsIndex.skills || {};

ensure(Array.isArray(manifest.documentShortcuts) && manifest.documentShortcuts.length > 0, "operator manifest must include documentShortcuts");
ensure(Array.isArray(manifest.operatorActions) && manifest.operatorActions.length > 0, "operator manifest must include operatorActions");
ensure(Array.isArray(manifest.runtimeProfiles) && manifest.runtimeProfiles.length > 0, "operator manifest must include runtimeProfiles");
ensure(Array.isArray(manifest.skillActions) && manifest.skillActions.length > 0, "operator manifest must include skillActions");
ensure(Array.isArray(manifest.serviceSurfaces) && manifest.serviceSurfaces.length > 0, "operator manifest must include serviceSurfaces");
ensure(Array.isArray(policy.safeCommandExact) && policy.safeCommandExact.length > 0, "operator policy must include safeCommandExact");
ensure(Array.isArray(policy.blockedCommandTokens) && policy.blockedCommandTokens.length > 0, "operator policy must include blockedCommandTokens");

const documentIds = new Set();
for (const shortcut of manifest.documentShortcuts) {
  ensure(!documentIds.has(shortcut.id), `duplicate document shortcut id: ${shortcut.id}`);
  documentIds.add(shortcut.id);
  ensureFile(shortcut.path, `document shortcut ${shortcut.id}`);
}

const actionIds = new Set();
const safeCommands = new Set(policy.safeCommandExact);
const blockedTokens = policy.blockedCommandTokens.map((item) => item.toLowerCase());
const promptActionIds = [];

for (const action of manifest.operatorActions) {
  ensure(!actionIds.has(action.id), `duplicate operator action id: ${action.id}`);
  actionIds.add(action.id);
  ensure(policy.capabilities[action.capability], `operator action ${action.id} uses unknown capability ${action.capability}`);
  ensure(action.approvalMode === policy.capabilities[action.capability], `operator action ${action.id} approvalMode must match policy capability ${action.capability}`);
  ensure(safeCommands.has(action.command), `operator action ${action.id} command must be present in policy.safeCommandExact`);
  const lowerCommand = action.command.toLowerCase();
  for (const token of blockedTokens) {
    ensure(!lowerCommand.includes(token), `operator action ${action.id} command contains blocked token: ${token}`);
  }
  if (action.approvalMode === "prompt") {
    promptActionIds.push(action.id);
  }
}

ensure(promptActionIds.length > 0, "operator manifest must include at least one prompt-gated action");

for (const profile of manifest.runtimeProfiles) {
  ensureFile(profile.profilePath, `runtime profile ${profile.id}`);
  ensure(safeCommands.has(profile.validationCommand), `runtime profile ${profile.id} validationCommand must be safe-listed`);
}

for (const skillAction of manifest.skillActions) {
  ensure(skillMap[skillAction.skillId], `skill action references unknown skill: ${skillAction.skillId}`);
  ensureFile(skillAction.path, `skill action ${skillAction.skillId}`);
  ensure(actionIds.has(skillAction.recommendedActionId), `skill action ${skillAction.skillId} references unknown operator action ${skillAction.recommendedActionId}`);
}

for (const surface of manifest.serviceSurfaces) {
  ensureFile(surface.path, `service surface ${surface.id}`);
  for (const ref of surface.contractRefs) {
    ensureFile(ref, `service surface ${surface.id} contract ref`);
  }
}

console.log("Operator surface manifest and policy are valid");
