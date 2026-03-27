#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const schemaPath = "config/schemas/capability-intake-catalog.schema.json";
const catalogs = [
  { relativePath: "config/intake/candidates.json", reviewStatus: "candidate" },
  { relativePath: "config/intake/approved.json", reviewStatus: "approved" },
  { relativePath: "config/intake/rejected.json", reviewStatus: "rejected" },
];
const capabilityTypes = new Set(["tool", "skill", "source-repo", "workflow-pattern", "service-surface"]);
const adoptionModes = new Set(["wrap", "curate", "inspire", "reject"]);
const riskLevels = new Set(["low", "medium", "high"]);
const networkScopes = new Set(["none", "operator-approved", "api-read", "api-write", "external-web"]);
const storageScopes = new Set(["none", "repo-only", "runtime-config", "service-contracts", "downstream-owned"]);
const secretScopes = new Set(["none", "operator-provided", "runtime-secrets", "downstream-secrets"]);
const tenantScopes = new Set(["single-tenant", "platform-shared", "downstream-owned"]);
const rolloutRings = new Set(["design", "sandbox", "staging", "production"]);
const idPattern = /^[a-z0-9-]+$/;
const versionPattern = /^\d{4}-\d{2}-\d{2}\.v\d+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

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

const seenIds = new Set();
const seenTypes = new Set();

for (const { relativePath, reviewStatus } of catalogs) {
  const catalog = readJson(relativePath);
  ensureString(catalog.catalogVersion, `${relativePath} catalogVersion`);
  ensure(versionPattern.test(catalog.catalogVersion), `${relativePath} catalogVersion must match YYYY-MM-DD.vN`);
  ensureString(catalog.catalogId, `${relativePath} catalogId`);
  ensure(catalog.reviewStatus === reviewStatus, `${relativePath} reviewStatus must be ${reviewStatus}`);
  ensureString(catalog.description, `${relativePath} description`);
  ensure(Array.isArray(catalog.entries) && catalog.entries.length > 0, `${relativePath} must contain at least one entry`);

  for (const entry of catalog.entries) {
    ensureString(entry.id, `${relativePath} entry id`);
    ensure(idPattern.test(entry.id), `${relativePath} entry id must be lowercase kebab-case: ${entry.id}`);
    ensure(!seenIds.has(entry.id), `duplicate intake entry id: ${entry.id}`);
    seenIds.add(entry.id);

    for (const fieldName of [
      "name",
      "sourceRepoOrSource",
      "owner",
      "rollbackNotes",
      "reviewNotes",
      "enterpriseJustification",
      "boundaryDecision",
      "decisionOwner",
    ]) {
      ensureString(entry[fieldName], `${relativePath} ${entry.id} ${fieldName}`);
    }

    ensure(capabilityTypes.has(entry.capabilityType), `${relativePath} ${entry.id} capabilityType is invalid`);
    ensure(adoptionModes.has(entry.adoptionMode), `${relativePath} ${entry.id} adoptionMode is invalid`);
    ensure(riskLevels.has(entry.riskLevel), `${relativePath} ${entry.id} riskLevel is invalid`);
    ensure(networkScopes.has(entry.networkScope), `${relativePath} ${entry.id} networkScope is invalid`);
    ensure(storageScopes.has(entry.storageScope), `${relativePath} ${entry.id} storageScope is invalid`);
    ensure(secretScopes.has(entry.secretScope), `${relativePath} ${entry.id} secretScope is invalid`);
    ensure(tenantScopes.has(entry.tenantScope), `${relativePath} ${entry.id} tenantScope is invalid`);
    ensure(rolloutRings.has(entry.rolloutRing), `${relativePath} ${entry.id} rolloutRing is invalid`);
    ensure(datePattern.test(entry.decisionDate), `${relativePath} ${entry.id} decisionDate must match YYYY-MM-DD`);
    ensure(
      Array.isArray(entry.approvalRequirements) && entry.approvalRequirements.every((item) => typeof item === "string" && item.trim().length > 0),
      `${relativePath} ${entry.id} approvalRequirements must be a non-empty string array`,
    );

    if (reviewStatus === "rejected") {
      ensure(entry.adoptionMode === "reject", `${relativePath} ${entry.id} must use adoptionMode=reject`);
    } else {
      ensure(entry.adoptionMode !== "reject", `${relativePath} ${entry.id} may not use adoptionMode=reject`);
    }

    if (reviewStatus === "approved") {
      ensure(entry.rolloutRing !== "design", `${relativePath} ${entry.id} approved entries must not stay in design ring`);
      ensure(
        entry.approvalRequirements.includes("runtime-owner-review"),
        `${relativePath} ${entry.id} approved entries must include runtime-owner-review`,
      );
    }

    seenTypes.add(entry.capabilityType);
  }
}

for (const requiredType of ["tool", "skill", "source-repo"]) {
  ensure(seenTypes.has(requiredType), `capability intake catalogs must include at least one ${requiredType} example`);
}

console.log("Capability intake catalogs are valid");
