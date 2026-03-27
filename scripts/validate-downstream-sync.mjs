#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const schemaPath = path.join(root, "config", "schemas", "downstream-sync-manifest.schema.json");
const manifestPath = path.join(root, "config", "sync", "downstreams", "flowcommander.sync-manifest.json");

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

const schema = JSON.parse(read("config/schemas/downstream-sync-manifest.schema.json"));
const manifest = JSON.parse(read("config/sync/downstreams/flowcommander.sync-manifest.json"));
const contractDoc = read("docs/DOWNSTREAM_SYNC_CONTRACT.md");

for (const key of [
  "version",
  "consumer",
  "mode",
  "contract_version",
  "review_paths",
  "default_skip_paths",
  "sync_rules",
  "notes",
]) {
  if (!schema.required.includes(key)) {
    fail(`schema must require ${key}`);
  }
  if (!(key in manifest)) {
    fail(`manifest must include ${key}`);
  }
}

if (manifest.version !== 1) {
  fail("downstream sync manifest version must be 1");
}

if (manifest.consumer !== "FLOWCOMMANDER") {
  fail("downstream sync manifest must target FLOWCOMMANDER");
}

if (manifest.mode !== "manual_review_only") {
  fail("downstream sync manifest mode must be manual_review_only");
}

for (const key of ["review_paths", "default_skip_paths", "sync_rules", "notes"]) {
  if (!Array.isArray(manifest[key]) || manifest[key].length === 0) {
    fail(`manifest ${key} must be a non-empty array`);
  }
}

for (const relativePath of manifest.review_paths) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`review path does not exist: ${relativePath}`);
  }
}

const overlap = manifest.review_paths.filter((value) => manifest.default_skip_paths.includes(value));
if (overlap.length > 0) {
  fail(`review paths and default skip paths must not overlap: ${overlap.join(", ")}`);
}

if (!contractDoc.includes("config/sync/downstreams/flowcommander.sync-manifest.json")) {
  fail("docs/DOWNSTREAM_SYNC_CONTRACT.md must reference the JSON manifest path");
}

if (!contractDoc.includes(manifest.contract_version)) {
  fail("docs/DOWNSTREAM_SYNC_CONTRACT.md should mention the active contract version");
}

console.log("Downstream sync manifest is valid");
