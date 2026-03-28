#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

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
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function readText(relativePath) {
  const absolutePath = path.join(root, relativePath);
  ensure(fs.existsSync(absolutePath), `missing file: ${relativePath}`);
  return fs.readFileSync(absolutePath, "utf8");
}

const promptSchema = readJson("config/schemas/enterprise-app-factory-prompt.schema.json");
const specSchema = readJson("config/schemas/enterprise-app-spec.schema.json");
const generationSchema = readJson("config/schemas/enterprise-app-generation-request.schema.json");
const designSchema = readJson("config/schemas/enterprise-app-design-handoff.schema.json");
const agentRunRequestSchema = readJson("config/schemas/enterprise-app-agent-run-request.schema.json");
const agentRunSchema = readJson("config/schemas/enterprise-app-agent-run.schema.json");
const promptExample = readJson("config/examples/enterprise-app-factory-prompt.example.json");
const specExample = readJson("config/examples/enterprise-app-spec.example.json");
const designExample = readJson("config/examples/enterprise-app-design-handoff.example.json");
const agentRunRequestExample = readJson("config/examples/enterprise-app-agent-run-request.example.json");
const agentRunExample = readJson("config/examples/enterprise-app-agent-run.example.json");
const envExample = readText(".env.example");
const contractDoc = readText("docs/ENTERPRISE_APP_FACTORY_CONTRACT.md");

for (const required of ["customerName", "businessDescription", "applicationNeeds", "constraints"]) {
  ensure(promptSchema.required.includes(required), `prompt schema must require ${required}`);
  ensure(Object.prototype.hasOwnProperty.call(promptExample, required), `prompt example must include ${required}`);
}

for (const required of ["customerProfile", "businessDomain", "appPurpose", "coreWorkflows", "businessEntities", "userRoles", "approvalGates", "uncertainty", "blueprint"]) {
  ensure(specSchema.required.includes(required), `spec schema must require ${required}`);
  ensure(Object.prototype.hasOwnProperty.call(specExample, required), `spec example must include ${required}`);
}

for (const required of ["prompt", "spec", "approval"]) {
  ensure(generationSchema.required.includes(required), `generation schema must require ${required}`);
}

for (const required of ["themeConfig", "tokens", "componentManifest", "screenMap", "copyMap", "figmaAdapter"]) {
  ensure(designSchema.required.includes(required), `design handoff schema must require ${required}`);
  ensure(Object.prototype.hasOwnProperty.call(designExample, required), `design example must include ${required}`);
}

for (const required of ["prompt", "spec", "operator", "focus", "requestedSeatKeys", "allowDelegation", "maxDelegationDepth"]) {
  ensure(agentRunRequestSchema.required.includes(required), `agent run request schema must require ${required}`);
  ensure(Object.prototype.hasOwnProperty.call(agentRunRequestExample, required), `agent run request example must include ${required}`);
}

for (const required of ["request", "selectedSeatKeys", "root", "delegationPlan", "capabilityMatrix", "uncertainty", "warnings", "logs"]) {
  ensure(agentRunSchema.required.includes(required), `agent run schema must require ${required}`);
  ensure(Object.prototype.hasOwnProperty.call(agentRunExample, required), `agent run example must include ${required}`);
}

ensure(specExample.blueprint.persistenceOwnership.includes("Generated customer apps own"), "spec example must keep persistence ownership explicit");
ensure(envExample.includes("AUTOMIND_APP_FACTORY_PORT"), ".env.example must include app factory variables");
ensure(envExample.includes("AUTOMIND_APP_FACTORY_DOWNLOAD_ROOT"), ".env.example must include app factory download root");
ensure(envExample.includes("AUTOMIND_APP_FACTORY_AGENT_MODE"), ".env.example must include app factory agent mode");
ensure(contractDoc.includes("services/enterprise-app-factory/"), "contract doc must mention service package");
ensure(contractDoc.includes("generated-apps/"), "contract doc must mention generated app root");
ensure(contractDoc.includes("agent"), "contract doc must mention the agent runtime surface");

console.log("Enterprise App Factory contracts are valid");
