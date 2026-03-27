#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const schemaPath = "config/schemas/enterprise-skill-bundles.schema.json";
const catalogPath = "config/skills/enterprise-skill-bundles.json";
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

function ensureString(value, label) {
  ensure(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
}

readJson(schemaPath);
const catalog = readJson(catalogPath);
const skillsIndex = readJson(skillsIndexPath);
const skills = new Set(Object.keys(skillsIndex.skills || {}));

ensure(Number.isInteger(catalog.version) && catalog.version >= 1, "version must be a positive integer");
ensureString(catalog.catalog_name, "catalog_name");
ensureString(catalog.description, "description");
ensure(Array.isArray(catalog.bundles) && catalog.bundles.length > 0, "bundles must be a non-empty array");

const bundleIds = new Set();

for (const bundle of catalog.bundles) {
  ensureString(bundle.id, "bundle id");
  ensure(/^[a-z0-9-]+$/.test(bundle.id), `bundle id ${bundle.id} must use lowercase slug format`);
  ensure(!bundleIds.has(bundle.id), `duplicate bundle id: ${bundle.id}`);
  bundleIds.add(bundle.id);
  ensureString(bundle.name, `bundle ${bundle.id} name`);
  ensureString(bundle.purpose, `bundle ${bundle.id} purpose`);
  ensure(Array.isArray(bundle.skills) && bundle.skills.length > 0, `bundle ${bundle.id} skills must be non-empty`);
  ensure(Array.isArray(bundle.when_to_use) && bundle.when_to_use.length > 0, `bundle ${bundle.id} when_to_use must be non-empty`);
  ensure(Array.isArray(bundle.guardrails) && bundle.guardrails.length > 0, `bundle ${bundle.id} guardrails must be non-empty`);
  ensure(new Set(bundle.skills).size === bundle.skills.length, `bundle ${bundle.id} contains duplicate skills`);

  for (const skill of bundle.skills) {
    ensure(skills.has(skill), `bundle ${bundle.id} references unknown skill: ${skill}`);
  }
}

console.log("Enterprise skill bundles are valid");
