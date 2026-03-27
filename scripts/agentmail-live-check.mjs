#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "config", "email", "agentmail-runtime-manifest.json");
const requireLive = process.argv.includes("--require-live");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function info(message) {
  console.log(`INFO ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function warn(message) {
  console.log(`WARN ${message}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeBaseUrl(rawBaseUrl) {
  const trimmed = rawBaseUrl.replace(/\/+$/, "");
  return trimmed.endsWith("/v0") ? trimmed : `${trimmed}/v0`;
}

function extractArray(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  for (const key of ["data", "items", "results", "inboxes", "domains"]) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }
  return [];
}

function readString(record, keys) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return "";
}

async function getJson(url, apiKey) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${body.slice(0, 400)}`);
  }

  return response.json();
}

if (!fs.existsSync(manifestPath)) {
  fail("missing config/email/agentmail-runtime-manifest.json");
}

const manifest = readJson(manifestPath);
const apiKey = process.env.AGENTMAIL_API_KEY;
const baseUrl = normalizeBaseUrl(process.env.AGENTMAIL_BASE_URL || "https://api.agentmail.to");

console.log("== AgentMail Live Check ==");
console.log(`baseUrl: ${baseUrl}`);
console.log(`manifest: ${path.relative(root, manifestPath)}`);
console.log();

if (!apiKey) {
  warn("AGENTMAIL_API_KEY is missing; skipping live provider verification");
  warn("This repo can validate contracts and setup instructions, but not inbox or domain readiness without credentials");
  if (requireLive) {
    process.exit(1);
  }
  process.exit(0);
}

try {
  const [inboxesPayload, domainsPayload] = await Promise.all([
    getJson(`${baseUrl}/inboxes?limit=100`, apiKey),
    getJson(`${baseUrl}/domains?limit=100`, apiKey),
  ]);

  const inboxes = extractArray(inboxesPayload);
  const domains = extractArray(domainsPayload);
  pass(`provider API reachable; fetched ${inboxes.length} inbox entries and ${domains.length} domain entries`);

  const inboxAddresses = new Set(
    inboxes
      .map((item) => readString(item, ["email", "address", "email_address"]))
      .filter(Boolean)
      .map((item) => item.toLowerCase()),
  );
  const domainNames = new Map(
    domains.map((item) => [
      readString(item, ["domain", "name"]).toLowerCase(),
      {
        status: readString(item, ["status", "verification_status"]),
        raw: item,
      },
    ]),
  );

  console.log();
  for (const mailbox of manifest.mailboxes || []) {
    const address = String(mailbox.address || "").toLowerCase();
    if (inboxAddresses.has(address)) {
      pass(`mailbox present in provider: ${mailbox.address}`);
    } else {
      warn(`mailbox not found in provider response: ${mailbox.address}`);
      if (requireLive) {
        process.exitCode = 1;
      }
    }
  }

  console.log();
  for (const domain of manifest.domains || []) {
    const declaredName = String(domain.domain || "").toLowerCase();
    const providerDomain = domainNames.get(declaredName);
    if (providerDomain) {
      const status = providerDomain.status || "unknown";
      pass(`domain present in provider: ${domain.domain} (status: ${status})`);
      if (!["verified", "active"].includes(status.toLowerCase())) {
        warn(`domain ${domain.domain} is present but not fully verified yet`);
        if (requireLive) {
          process.exitCode = 1;
        }
      }
    } else {
      warn(`domain not found in provider response: ${domain.domain}`);
      if (requireLive) {
        process.exitCode = 1;
      }
    }
  }

  console.log();
  info("If inboxes are present but prismtek.dev is not verified yet, create the domain in AgentMail, import the returned DNS records, and rerun this check.");
  if (process.exitCode && process.exitCode !== 0) {
    process.exit(process.exitCode);
  }
} catch (error) {
  fail(`AgentMail live check failed: ${error.message}`);
}
