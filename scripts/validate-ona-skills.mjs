#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const registryPath = path.join(root, ".ona", "skills", "index.json");
const indexDocPath = path.join(root, ".ona", "skills", "INDEX.md");
const requiredSections = [
  "## Purpose",
  "## When to use",
  "## Workflow",
  "## Output shape",
  "## Guardrails",
];

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

const registry = JSON.parse(read(registryPath));
const skills = registry.skills;

if (!skills || typeof skills !== "object" || Array.isArray(skills)) {
  fail("skills must be a non-empty object");
}

const indexDoc = read(indexDocPath);

for (const [name, spec] of Object.entries(skills)) {
  if (!spec || typeof spec !== "object" || Array.isArray(spec)) {
    fail(`skill '${name}' must be an object`);
  }

  const filePath = spec.file;
  if (typeof filePath !== "string" || filePath.trim().length === 0) {
    fail(`skill '${name}' must declare a file path`);
  }

  const absoluteFilePath = path.join(root, filePath);
  if (!fs.existsSync(absoluteFilePath) || !fs.statSync(absoluteFilePath).isFile()) {
    fail(`skill '${name}' file does not exist: ${filePath}`);
  }

  const triggers = spec.triggers;
  if (!Array.isArray(triggers) || triggers.length === 0) {
    fail(`skill '${name}' must have non-empty triggers list`);
  }
  if (triggers.some((trigger) => typeof trigger !== "string" || trigger.trim().length === 0)) {
    fail(`skill '${name}' has invalid trigger entries`);
  }
  if (new Set(triggers.map((trigger) => trigger.toLowerCase())).size !== triggers.length) {
    fail(`skill '${name}' has duplicate triggers (case-insensitive)`);
  }

  const actions = spec.actions;
  if (!Array.isArray(actions) || actions.length === 0) {
    fail(`skill '${name}' must have non-empty actions list`);
  }
  if (actions.some((action) => typeof action !== "string" || action.trim().length === 0)) {
    fail(`skill '${name}' has invalid actions`);
  }

  if (!actions.includes(spec.default_action)) {
    fail(`skill '${name}' default_action must be one of actions`);
  }

  const skillDoc = read(absoluteFilePath);
  for (const section of requiredSections) {
    if (!skillDoc.includes(section)) {
      fail(`skill '${name}' is missing required section: ${section}`);
    }
  }

  const basename = path.basename(filePath);
  if (!indexDoc.includes(basename)) {
    fail(`skills index must mention ${basename}`);
  }
}

const markdownFiles = fs
  .readdirSync(path.join(root, ".ona", "skills"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "INDEX.md")
  .map((entry) => entry.name)
  .sort();

const registeredFiles = Object.values(skills)
  .map((spec) => path.basename(spec.file))
  .sort();

for (const file of markdownFiles) {
  if (!registeredFiles.includes(file)) {
    fail(`.ona/skills/${file} exists but is missing from .ona/skills/index.json`);
  }
}

console.log(".ona skills registry and skill docs are valid");
