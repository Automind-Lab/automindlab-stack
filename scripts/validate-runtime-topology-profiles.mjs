#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const schemaPath = "config/schemas/runtime-topology-profile.schema.json";
const profiles = [
  "config/runtime-profiles/openclaw.enterprise-host-worker.json",
  "config/runtime-profiles/nemoclaw.enterprise-host-worker.json",
];
const implementationStatuses = new Set(["contract-validated", "fixture-validated", "runtime-validated"]);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function ensure(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function resolveExisting(relativePath, label) {
  const absolutePath = path.join(root, relativePath);
  ensure(fs.existsSync(absolutePath), `${label} missing file: ${relativePath}`);
  return absolutePath;
}

function readJson(relativePath) {
  const absolutePath = resolveExisting(relativePath, "required");
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

for (const relativePath of profiles) {
  const profile = readJson(relativePath);
  ensureString(profile.profileVersion, `${relativePath} profileVersion`);
  ensureString(profile.profileId, `${relativePath} profileId`);
  ensureString(profile.runtimeName, `${relativePath} runtimeName`);
  ensure(implementationStatuses.has(profile.implementationStatus), `${relativePath} implementationStatus is invalid`);
  ensureString(profile.description, `${relativePath} description`);
  ensure(profile.deploymentPattern === "enterprise-host-worker", `${relativePath} deploymentPattern must be enterprise-host-worker`);

  const artifacts = profile.artifacts;
  ensure(artifacts && typeof artifacts === "object", `${relativePath} artifacts must be an object`);
  ensure(Array.isArray(artifacts.primaryDocs) && artifacts.primaryDocs.length > 0, `${relativePath} primaryDocs must be a non-empty array`);
  ensure(Array.isArray(artifacts.validators) && artifacts.validators.length > 0, `${relativePath} validators must be a non-empty array`);
  for (const doc of artifacts.primaryDocs) {
    resolveExisting(doc, `${relativePath} primary doc`);
  }
  for (const validator of artifacts.validators) {
    resolveExisting(validator, `${relativePath} validator`);
  }
  if (artifacts.bootstrapScript !== null) {
    ensureString(artifacts.bootstrapScript, `${relativePath} bootstrapScript`);
    resolveExisting(artifacts.bootstrapScript, `${relativePath} bootstrapScript`);
  }
  if (artifacts.doctorScript !== null) {
    ensureString(artifacts.doctorScript, `${relativePath} doctorScript`);
    resolveExisting(artifacts.doctorScript, `${relativePath} doctorScript`);
  }

  const routing = profile.routing;
  ensure(routing && typeof routing === "object", `${relativePath} routing must be an object`);
  ensure(routing.hostReceivesExternalChannels === true, `${relativePath} host must own external channels`);
  ensure(routing.workerAcceptsExternalChannels === false, `${relativePath} worker must not accept external channels`);
  ensure(routing.escalationRequiredOnIrreversibleActions === true, `${relativePath} escalation must remain required`);
  ensure(routing.delegationTaskSchema === "config/schemas/worker-task.schema.json", `${relativePath} task schema path must match worker task schema`);
  ensure(routing.delegationResultSchema === "config/schemas/worker-result.schema.json", `${relativePath} result schema path must match worker result schema`);
  resolveExisting(routing.delegationTaskSchema, `${relativePath} delegation task schema`);
  resolveExisting(routing.delegationResultSchema, `${relativePath} delegation result schema`);

  ensure(Array.isArray(profile.agents) && profile.agents.length === 2, `${relativePath} must define exactly two agents`);
  const host = profile.agents.find((agent) => agent.role === "host");
  const worker = profile.agents.find((agent) => agent.role === "worker");
  ensure(host, `${relativePath} must define a host agent`);
  ensure(worker, `${relativePath} must define a worker agent`);

  for (const [agentName, agent] of [["host", host], ["worker", worker]]) {
    ensureString(agent.id, `${relativePath} ${agentName} id`);
    ensure(Array.isArray(agent.capabilities) && agent.capabilities.length > 0, `${relativePath} ${agentName} capabilities must be non-empty`);
    ensure(Array.isArray(agent.constraints) && agent.constraints.length > 0, `${relativePath} ${agentName} constraints must be non-empty`);
  }

  ensure(host.defaultAgent === true, `${relativePath} host must be the default agent`);
  ensure(host.sandboxMode === "off", `${relativePath} host sandboxMode must be off`);
  ensure(host.sandboxScope === "none", `${relativePath} host sandboxScope must be none`);
  ensure(worker.defaultAgent === false, `${relativePath} worker must not be the default agent`);
  ensure(worker.sandboxMode === "all", `${relativePath} worker sandboxMode must be all`);
  ensure(worker.sandboxScope === "agent", `${relativePath} worker sandboxScope must be agent`);

  ensure(Array.isArray(profile.serviceSurfaces) && profile.serviceSurfaces.length > 0, `${relativePath} serviceSurfaces must be non-empty`);
  for (const surface of profile.serviceSurfaces) {
    ensureString(surface.name, `${relativePath} service surface name`);
    ensureString(surface.type, `${relativePath} service surface type`);
    ensureString(surface.entrypoint, `${relativePath} service surface entrypoint`);
    ensureString(surface.contractSchema, `${relativePath} service surface contractSchema`);
    ensureString(surface.owner, `${relativePath} service surface owner`);
    ensure(typeof surface.advisoryOnly === "boolean", `${relativePath} service surface advisoryOnly must be boolean`);
    resolveExisting(surface.entrypoint, `${relativePath} service surface entrypoint`);
    resolveExisting(surface.contractSchema, `${relativePath} service surface contractSchema`);
  }

  ensure(
    Array.isArray(profile.approvalBoundaries) && profile.approvalBoundaries.length > 0,
    `${relativePath} approvalBoundaries must be a non-empty array`,
  );
  ensureString(profile.notes, `${relativePath} notes`);

  if (profile.runtimeName === "OpenClaw") {
    ensure(profile.implementationStatus !== "contract-validated", `${relativePath} OpenClaw profile must be at least fixture-validated`);
    ensure(artifacts.bootstrapScript !== null, `${relativePath} OpenClaw profile must declare a bootstrap script`);
    ensure(artifacts.doctorScript !== null, `${relativePath} OpenClaw profile must declare a doctor script`);
    ensure(artifacts.validators.includes("scripts/openclaw-fixture-smoke.mjs"), `${relativePath} OpenClaw profile must include fixture smoke validation`);
  }

  if (profile.runtimeName === "NemoClaw") {
    ensure(profile.implementationStatus === "contract-validated", `${relativePath} NemoClaw profile must remain contract-validated until live proof exists`);
    ensure(artifacts.bootstrapScript === null, `${relativePath} NemoClaw profile must not claim a bootstrap script yet`);
    ensure(artifacts.doctorScript === null, `${relativePath} NemoClaw profile must not claim a runtime doctor yet`);
  }
}

console.log("Runtime topology profiles are valid");
