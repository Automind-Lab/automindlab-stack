#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "config", "email", "agentmail-runtime-manifest.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function warn(message) {
  console.log(`WARN ${message}`);
}

if (!fs.existsSync(manifestPath)) {
  console.error("ERROR missing config/email/agentmail-runtime-manifest.json");
  process.exit(1);
}

const manifest = readJson(manifestPath);

console.log("== AgentMail Runtime Doctor ==");
console.log(`manifest: ${path.relative(root, manifestPath)}`);
console.log(`provider: ${manifest.provider}`);
console.log(`manifest version: ${manifest.manifestVersion}`);
console.log();

for (const envName of manifest.requiredEnv || []) {
  if (process.env[envName]) {
    pass(`env present: ${envName}`);
  } else {
    warn(`env missing: ${envName}`);
  }
}

console.log();
for (const domain of manifest.domains || []) {
  console.log(`Domain ${domain.domain}`);
  console.log(`  routingMode: ${domain.routingMode}`);
  console.log(`  evidenceStatus: ${domain.evidenceStatus}`);
  console.log(`  ownerSurface: ${domain.ownerSurface}`);
}

console.log();
for (const mailbox of manifest.mailboxes || []) {
  console.log(`Mailbox ${mailbox.address}`);
  console.log(`  role: ${mailbox.role}`);
  console.log(`  approvalMode: ${mailbox.approvalMode}`);
  console.log(`  evidenceStatus: ${mailbox.evidenceStatus}`);
  console.log(`  ownerSurface: ${mailbox.ownerSurface}`);
}

console.log();
for (const webhook of manifest.webhooks || []) {
  console.log(`Webhook ${webhook.id}`);
  console.log(`  deliveryMode: ${webhook.deliveryMode}`);
  console.log(`  evidenceStatus: ${webhook.evidenceStatus}`);
}

console.log();
if (process.env.AGENTMAIL_API_KEY) {
  pass("AgentMail API key is present; live read-only verification can be attempted outside this repo");
} else {
  warn("AgentMail API key is absent; this repo can validate contracts only, not live mailbox connectivity");
}

if ((manifest.mailboxes || []).some((mailbox) => mailbox.evidenceStatus === "user-declared")) {
  warn("One or more mailboxes are still user-declared only; do not claim live email readiness yet");
}

console.log();
console.log("Recommended next steps:");
console.log("1. Export AGENTMAIL_API_KEY and AGENTMAIL_BASE_URL in a non-committed runtime env.");
console.log("2. Confirm inbox provisioning for prismtek@agentmail.to and bmo-tron@agentmail.to through the provider.");
console.log("3. Verify prismtek.dev domain routing and only then upgrade evidenceStatus beyond user-declared.");
