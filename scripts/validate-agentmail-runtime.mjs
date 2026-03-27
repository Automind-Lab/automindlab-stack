#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = "config/email/agentmail-runtime-manifest.json";
const manifestSchemaPath = "config/schemas/agentmail-runtime-manifest.schema.json";
const requestSchemaPath = "config/schemas/agentmail-message-request.schema.json";
const resultSchemaPath = "config/schemas/agentmail-message-result.schema.json";
const requestExamplePath = "config/examples/agentmail-message-request.example.json";
const resultExamplePath = "config/examples/agentmail-message-result.example.json";
const evidenceStatuses = new Set(["planned", "user-declared", "api-validated", "dns-validated", "runtime-validated"]);
const roles = new Set(["operator-primary", "operator-secondary", "runtime-agent", "downstream-agent", "notification"]);
const ownerSurfaces = new Set(["host", "worker", "downstream", "shared"]);
const approvalModes = new Set(["allow", "prompt", "deny"]);
const operations = new Set(["send", "reply", "reply-all", "forward", "list-messages", "get-message", "list-threads"]);
const uncertaintyLevels = new Set(["low", "medium", "high"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

readJson(manifestSchemaPath);
readJson(requestSchemaPath);
readJson(resultSchemaPath);
const manifest = readJson(manifestPath);
const requestExample = readJson(requestExamplePath);
const resultExample = readJson(resultExamplePath);

ensureString(manifest.manifestVersion, "manifestVersion");
ensureString(manifest.manifestId, "manifestId");
ensure(manifest.provider === "agentmail", "provider must be agentmail");
ensureString(manifest.description, "description");
ensure(Array.isArray(manifest.requiredEnv) && manifest.requiredEnv.length > 0, "requiredEnv must be a non-empty array");
ensure(manifest.requiredEnv.includes("AGENTMAIL_API_KEY"), "requiredEnv must include AGENTMAIL_API_KEY");
ensure(manifest.requiredEnv.includes("AGENTMAIL_BASE_URL"), "requiredEnv must include AGENTMAIL_BASE_URL");

ensure(Array.isArray(manifest.domains) && manifest.domains.length > 0, "domains must be a non-empty array");
ensure(Array.isArray(manifest.mailboxes) && manifest.mailboxes.length > 0, "mailboxes must be a non-empty array");
ensure(Array.isArray(manifest.webhooks) && manifest.webhooks.length > 0, "webhooks must be a non-empty array");
ensure(Array.isArray(manifest.serviceSurfaces) && manifest.serviceSurfaces.length > 0, "serviceSurfaces must be a non-empty array");
ensure(Array.isArray(manifest.approvalBoundaries) && manifest.approvalBoundaries.length > 0, "approvalBoundaries must be a non-empty array");
ensureString(manifest.notes, "notes");

const domainIds = new Set();
const domainNames = new Set();
for (const domain of manifest.domains) {
  ensureString(domain.id, "domain id");
  ensure(!domainIds.has(domain.id), `duplicate domain id: ${domain.id}`);
  domainIds.add(domain.id);
  ensureString(domain.domain, `domain ${domain.id} domain`);
  ensure(!domainNames.has(domain.domain), `duplicate domain name: ${domain.domain}`);
  domainNames.add(domain.domain);
  ensureString(domain.purpose, `domain ${domain.id} purpose`);
  ensure(["shared-hosted", "custom-domain"].includes(domain.routingMode), `domain ${domain.id} routingMode is invalid`);
  ensure(evidenceStatuses.has(domain.evidenceStatus), `domain ${domain.id} evidenceStatus is invalid`);
  ensure(ownerSurfaces.has(domain.ownerSurface), `domain ${domain.id} ownerSurface is invalid`);
  ensure(Array.isArray(domain.requiredOperations) && domain.requiredOperations.length > 0, `domain ${domain.id} requiredOperations must be non-empty`);
  ensureString(domain.notes, `domain ${domain.id} notes`);
}

const mailboxIds = new Set();
const addresses = new Set();
let foundAgentmailHostedMailbox = false;
for (const mailbox of manifest.mailboxes) {
  ensureString(mailbox.id, "mailbox id");
  ensure(!mailboxIds.has(mailbox.id), `duplicate mailbox id: ${mailbox.id}`);
  mailboxIds.add(mailbox.id);
  ensureString(mailbox.address, `mailbox ${mailbox.id} address`);
  ensure(emailPattern.test(mailbox.address), `mailbox ${mailbox.id} address is invalid`);
  ensure(!addresses.has(mailbox.address), `duplicate mailbox address: ${mailbox.address}`);
  addresses.add(mailbox.address);
  ensureString(mailbox.purpose, `mailbox ${mailbox.id} purpose`);
  ensure(roles.has(mailbox.role), `mailbox ${mailbox.id} role is invalid`);
  ensure(ownerSurfaces.has(mailbox.ownerSurface), `mailbox ${mailbox.id} ownerSurface is invalid`);
  ensure(approvalModes.has(mailbox.approvalMode), `mailbox ${mailbox.id} approvalMode is invalid`);
  ensure(evidenceStatuses.has(mailbox.evidenceStatus), `mailbox ${mailbox.id} evidenceStatus is invalid`);
  ensure(
    mailbox.domainRef === null || (typeof mailbox.domainRef === "string" && domainIds.has(mailbox.domainRef)),
    `mailbox ${mailbox.id} domainRef must be null or reference a known domain id`,
  );
  ensure(Array.isArray(mailbox.allowedOperations) && mailbox.allowedOperations.length > 0, `mailbox ${mailbox.id} allowedOperations must be non-empty`);
  ensure(mailbox.allowedOperations.every((item) => operations.has(item)), `mailbox ${mailbox.id} has unsupported allowedOperations`);
  ensure(Array.isArray(mailbox.requiredScopes) && mailbox.requiredScopes.length > 0, `mailbox ${mailbox.id} requiredScopes must be non-empty`);
  ensureString(mailbox.notes, `mailbox ${mailbox.id} notes`);
  if (mailbox.address.endsWith("@agentmail.to")) {
    foundAgentmailHostedMailbox = true;
  }
}

ensure(foundAgentmailHostedMailbox, "manifest must include at least one @agentmail.to mailbox");
ensure(manifest.domains.some((domain) => domain.routingMode === "custom-domain"), "manifest must include at least one custom-domain entry");

const webhookIds = new Set();
for (const webhook of manifest.webhooks) {
  ensureString(webhook.id, "webhook id");
  ensure(!webhookIds.has(webhook.id), `duplicate webhook id: ${webhook.id}`);
  webhookIds.add(webhook.id);
  ensure(Array.isArray(webhook.eventTypes) && webhook.eventTypes.length > 0, `webhook ${webhook.id} eventTypes must be non-empty`);
  ensureString(webhook.targetSurface, `webhook ${webhook.id} targetSurface`);
  ensure(["planned", "push", "pull"].includes(webhook.deliveryMode), `webhook ${webhook.id} deliveryMode is invalid`);
  ensure(evidenceStatuses.has(webhook.evidenceStatus), `webhook ${webhook.id} evidenceStatus is invalid`);
  ensureString(webhook.notes, `webhook ${webhook.id} notes`);
}

for (const surface of manifest.serviceSurfaces) {
  ensureString(surface.name, "serviceSurface name");
  ensure(["runtime-contract", "operator-contract"].includes(surface.type), `serviceSurface ${surface.name} type is invalid`);
  ensureString(surface.manifestPath, `serviceSurface ${surface.name} manifestPath`);
  ensure(fs.existsSync(path.join(root, surface.manifestPath)), `serviceSurface ${surface.name} manifestPath does not exist`);
  if (surface.requestSchema !== null) {
    ensureString(surface.requestSchema, `serviceSurface ${surface.name} requestSchema`);
    ensure(fs.existsSync(path.join(root, surface.requestSchema)), `serviceSurface ${surface.name} requestSchema does not exist`);
  }
  if (surface.responseSchema !== null) {
    ensureString(surface.responseSchema, `serviceSurface ${surface.name} responseSchema`);
    ensure(fs.existsSync(path.join(root, surface.responseSchema)), `serviceSurface ${surface.name} responseSchema does not exist`);
  }
  ensureString(surface.owner, `serviceSurface ${surface.name} owner`);
  ensure(typeof surface.advisoryOnly === "boolean", `serviceSurface ${surface.name} advisoryOnly must be boolean`);
}

ensureString(requestExample.requestId, "request example requestId");
ensureString(requestExample.requestedBy, "request example requestedBy");
ensure(mailboxIds.has(requestExample.mailboxId), "request example mailboxId must reference a known mailbox");
ensure(operations.has(requestExample.operation), "request example operation is invalid");
ensure(approvalModes.has(requestExample.approvalMode), "request example approvalMode is invalid");
ensure(requestExample.payload && typeof requestExample.payload === "object", "request example payload must be an object");

ensureString(resultExample.requestId, "result example requestId");
ensure(resultExample.provider === "agentmail", "result example provider must be agentmail");
ensure(mailboxIds.has(resultExample.mailboxId), "result example mailboxId must reference a known mailbox");
ensure(operations.has(resultExample.operation), "result example operation is invalid");
ensure(["success", "blocked", "partial", "failed"].includes(resultExample.status), "result example status is invalid");
ensure(resultExample.uncertainty && typeof resultExample.uncertainty === "object", "result example uncertainty must be an object");
ensure(uncertaintyLevels.has(resultExample.uncertainty.level), "result example uncertainty level is invalid");
ensureString(resultExample.uncertainty.reason, "result example uncertainty.reason");
ensure(typeof resultExample.escalate === "boolean", "result example escalate must be boolean");
ensureString(resultExample.safeAction, "result example safeAction");

console.log("AgentMail runtime manifest and message contracts are valid");
