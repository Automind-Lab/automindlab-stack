#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const packPath = path.join(root, "config", "routines", "automindlab-core-routines.json");
const makefilePath = path.join(root, "Makefile");
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
const makefile = fs.readFileSync(makefilePath, "utf8");

function hasMakeTarget(name) {
  const pattern = new RegExp(`^${name}:`, "m");
  return pattern.test(makefile);
}

function validatePack() {
  if (typeof pack.version !== "number") {
    fail("routine pack must declare a numeric version");
  }
  if (!Array.isArray(pack.routines) || pack.routines.length === 0) {
    fail("routine pack must declare non-empty routines");
  }
  for (const routine of pack.routines) {
    for (const key of ["name", "command", "owner_surface", "purpose"]) {
      if (typeof routine[key] !== "string" || routine[key].length === 0) {
        fail(`routine is missing ${key}`);
      }
    }
    if (!Array.isArray(routine.related_files) || routine.related_files.length === 0) {
      fail(`routine '${routine.name}' must declare related_files`);
    }
    for (const relatedFile of routine.related_files) {
      const absolutePath = path.join(root, relatedFile);
      if (!fs.existsSync(absolutePath)) {
        fail(`routine '${routine.name}' references missing file or path: ${relatedFile}`);
      }
    }
    if (routine.command.startsWith("make ")) {
      const makeTarget = routine.command.slice(5).trim();
      if (!hasMakeTarget(makeTarget)) {
        fail(`routine '${routine.name}' points at missing Makefile target: ${makeTarget}`);
      }
    }
  }
}

validatePack();

if (command === "validate") {
  console.log("AutoMindLab routine pack is valid");
  process.exit(0);
}

if (command === "show") {
  const routine = pack.routines.find((item) => item.name === target);
  if (!routine) {
    fail(`no routine named '${target}'`);
  }
  console.log(JSON.stringify(routine, null, 2));
  process.exit(0);
}

if (command !== "list") {
  fail("usage: node scripts/automind-routines.mjs [list|show <name>|validate]");
}

console.log(`Pack: ${pack.pack_name}`);
console.log("");
for (const routine of pack.routines) {
  console.log(`- ${routine.name}: ${routine.command}`);
  console.log(`  ${routine.purpose}`);
}
