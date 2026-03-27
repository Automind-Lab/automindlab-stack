#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const workflowDir = path.join(root, "config", "workflows");
const registryPath = path.join(root, ".ona", "skills", "index.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const skills = new Set(Object.keys(registry.skills || {}));
const allowedStepTypes = new Set(["host", "worker", "service"]);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const files = fs.readdirSync(workflowDir).filter((name) => name.endsWith(".json"));
if (files.length === 0) {
  fail("No workflow config files found");
}

for (const file of files) {
  const payload = JSON.parse(fs.readFileSync(path.join(workflowDir, file), "utf8"));
  for (const key of ["name", "description", "entry_skill", "steps", "outputs"]) {
    if (!(key in payload)) {
      fail(`${file} missing required key: ${key}`);
    }
  }
  if (!skills.has(payload.entry_skill)) {
    fail(`${file} entry_skill '${payload.entry_skill}' is not in the skills registry`);
  }
  if (!Array.isArray(payload.steps) || payload.steps.length === 0) {
    fail(`${file} must contain at least one workflow step`);
  }
  if (!Array.isArray(payload.outputs) || payload.outputs.length === 0) {
    fail(`${file} must declare non-empty outputs`);
  }
  if (new Set(payload.outputs).size !== payload.outputs.length) {
    fail(`${file} contains duplicate outputs`);
  }

  const stepIds = new Set();
  for (const step of payload.steps) {
    if (typeof step.id !== "string" || step.id.length === 0) {
      fail(`${file} contains a step with missing id`);
    }
    if (stepIds.has(step.id)) {
      fail(`${file} contains duplicate step id '${step.id}'`);
    }
    stepIds.add(step.id);

    if (!allowedStepTypes.has(step.type)) {
      fail(`${file} step '${step.id}' has unsupported type '${step.type}'`);
    }

    if (step.skill && !skills.has(step.skill)) {
      fail(`${file} step '${step.id}' points at missing skill '${step.skill}'`);
    }

    if (step.type === "worker" && !Number.isInteger(step.timeoutMs)) {
      fail(`${file} worker step '${step.id}' must declare timeoutMs`);
    }

    if (!step.skill && !step.output) {
      fail(`${file} step '${step.id}' must declare skill or output`);
    }
  }
}

console.log("Workflow configs are valid");
