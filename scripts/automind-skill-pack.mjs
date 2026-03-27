#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const packPath = path.join(root, "config", "skills", "automindlab-baseline-pack.json");
const registryPath = path.join(root, ".ona", "skills", "index.json");
const command = process.argv[2] || "list";
const target = process.argv[3] || "";

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const pack = loadJson(packPath);
const registry = loadJson(registryPath);
const skillNames = new Set(Object.keys(registry.skills || {}));

function validatePack() {
  if (typeof pack.version !== "number") {
    fail("skill pack must declare a numeric version");
  }
  if (typeof pack.pack_name !== "string" || pack.pack_name.length === 0) {
    fail("skill pack must declare pack_name");
  }
  if (!Array.isArray(pack.local_skills) || pack.local_skills.length === 0) {
    fail("skill pack must declare non-empty local_skills");
  }
  for (const skill of pack.local_skills) {
    if (typeof skill.name !== "string" || skill.name.length === 0) {
      fail("each local skill must declare name");
    }
    if (!skillNames.has(skill.name)) {
      fail(`local skill '${skill.name}' is not present in .ona/skills/index.json`);
    }
    if (typeof skill.why !== "string" || skill.why.length === 0) {
      fail(`local skill '${skill.name}' must declare why`);
    }
  }
  if (!Array.isArray(pack.optional_capabilities)) {
    fail("skill pack must declare optional_capabilities");
  }
  for (const capability of pack.optional_capabilities) {
    for (const key of ["name", "why", "approval"]) {
      if (typeof capability[key] !== "string" || capability[key].length === 0) {
        fail(`optional capability is missing ${key}`);
      }
    }
  }
}

validatePack();

if (command === "validate") {
  console.log("AutoMindLab baseline skill pack is valid");
  process.exit(0);
}

if (command === "show") {
  const skill = pack.local_skills.find((item) => item.name === target);
  const capability = pack.optional_capabilities.find((item) => item.name === target);
  if (!skill && !capability) {
    fail(`no skill or capability named '${target}'`);
  }
  console.log(JSON.stringify(skill || capability, null, 2));
  process.exit(0);
}

if (command !== "list") {
  fail("usage: node scripts/automind-skill-pack.mjs [list|show <name>|validate]");
}

console.log(`Pack: ${pack.pack_name}`);
console.log("");
console.log("Local skills:");
for (const skill of pack.local_skills) {
  console.log(`- ${skill.name}: ${skill.why}`);
}
console.log("");
console.log("Optional capability categories:");
for (const capability of pack.optional_capabilities) {
  console.log(`- ${capability.name}: ${capability.why}`);
}
