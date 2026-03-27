#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function loadJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing file: ${relativePath}`);
  }
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

const taskSchema = loadJson("config/schemas/worker-task.schema.json");
const resultSchema = loadJson("config/schemas/worker-result.schema.json");
const taskExample = loadJson("config/examples/worker-task.example.json");
const resultExample = loadJson("config/examples/worker-result.example.json");
const delegationDoc = fs.readFileSync(path.join(root, "docs", "WORKER_DELEGATION_PROTOCOL.md"), "utf8");

for (const key of ["taskId", "type", "input", "contextRefs", "timeoutMs"]) {
  if (!taskSchema.required.includes(key)) {
    fail(`worker-task schema must require ${key}`);
  }
  if (!(key in taskExample)) {
    fail(`worker-task example must include ${key}`);
  }
}

if (!Array.isArray(taskExample.contextRefs) || taskExample.contextRefs.length === 0) {
  fail("worker-task example must include non-empty contextRefs");
}

if (!Number.isInteger(taskExample.timeoutMs) || taskExample.timeoutMs <= 0 || taskExample.timeoutMs > 30000) {
  fail("worker-task example timeoutMs must be an integer between 1 and 30000");
}

for (const key of ["taskId", "status", "output", "uncertainty", "escalate", "safeAction"]) {
  if (!resultSchema.required.includes(key)) {
    fail(`worker-result schema must require ${key}`);
  }
  if (!(key in resultExample)) {
    fail(`worker-result example must include ${key}`);
  }
}

if (!["ok", "partial", "timeout", "error"].includes(resultExample.status)) {
  fail("worker-result example status is invalid");
}

if (!resultExample.uncertainty || typeof resultExample.uncertainty !== "object") {
  fail("worker-result example must include uncertainty object");
}

for (const key of ["level", "reason", "missingContext"]) {
  if (!(key in resultExample.uncertainty)) {
    fail(`worker-result uncertainty must include ${key}`);
  }
}

if (!["low", "medium", "high"].includes(resultExample.uncertainty.level)) {
  fail("worker-result uncertainty level is invalid");
}

if (!Array.isArray(resultExample.uncertainty.missingContext)) {
  fail("worker-result uncertainty missingContext must be an array");
}

if (resultExample.escalate === true) {
  if (!resultExample.escalation) {
    fail("worker-result example must include escalation object when escalate is true");
  }
}

for (const expected of ["config/schemas/worker-task.schema.json", "config/schemas/worker-result.schema.json"]) {
  if (!delegationDoc.includes(expected)) {
    fail(`delegation doc must mention ${expected}`);
  }
}

console.log("Worker delegation contracts are valid");
