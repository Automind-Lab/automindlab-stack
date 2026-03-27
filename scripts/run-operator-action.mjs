#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "config/operator/operator-surface-manifest.json"), "utf8"));
const policy = JSON.parse(fs.readFileSync(path.join(root, "config/operator/operator-command-policy.json"), "utf8"));
const args = process.argv.slice(2);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function usage() {
  console.log("Usage:");
  console.log("  node scripts/run-operator-action.mjs list");
  console.log("  node scripts/run-operator-action.mjs describe <action-id>");
  console.log("  node scripts/run-operator-action.mjs run <action-id> [--approve] [--dry-run]");
}

if (args.length === 0) {
  usage();
  process.exit(1);
}

const actionMap = new Map(manifest.operatorActions.map((item) => [item.id, item]));
const [verb, actionId, ...rest] = args;
const hasApprove = rest.includes("--approve");
const hasDryRun = rest.includes("--dry-run");

function toPosixPath(input) {
  return input.replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`).replace(/\\/g, "/");
}

function resolveBashPath() {
  if (process.platform !== "win32") {
    return "bash";
  }

  const candidates = [
    path.join(process.env.ProgramFiles || "", "Git", "bin", "bash.exe"),
    path.join(process.env["ProgramFiles(x86)"] || "", "Git", "bin", "bash.exe"),
    path.join(process.env.LocalAppData || "", "Programs", "Git", "bin", "bash.exe"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return "bash";
}

function normalizeCommand(command) {
  if (process.platform === "win32" && command.startsWith("bash ")) {
    const bashExe = resolveBashPath();
    const scriptCommand = command.slice(5);
    const posixRoot = toPosixPath(root);
    return `"${bashExe}" -lc "cd '${posixRoot}' && ${scriptCommand}"`;
  }
  return command;
}

if (verb === "list") {
  for (const action of manifest.operatorActions) {
    console.log(`${action.id}\t${action.approvalMode}\t${action.command}`);
  }
  process.exit(0);
}

if (verb === "describe") {
  if (!actionId || !actionMap.has(actionId)) {
    fail(`unknown operator action: ${actionId || "<missing>"}`);
  }
  const action = actionMap.get(actionId);
  console.log(JSON.stringify(action, null, 2));
  process.exit(0);
}

if (verb !== "run") {
  usage();
  process.exit(1);
}

if (!actionId || !actionMap.has(actionId)) {
  fail(`unknown operator action: ${actionId || "<missing>"}`);
}

const action = actionMap.get(actionId);
const decision = policy.capabilities[action.capability] || policy.defaultMode;

if (decision === "deny") {
  fail(`operator action denied by policy: ${action.id}`);
}

if (decision === "prompt" && !hasApprove && !hasDryRun) {
  fail(`operator action ${action.id} requires --approve`);
}

if (hasDryRun) {
  console.log(JSON.stringify({
    actionId: action.id,
    approvalMode: decision,
    command: action.command,
    cwd: root
  }, null, 2));
  process.exit(0);
}

console.log(`Running operator action ${action.id}: ${action.command}`);

const normalizedCommand = normalizeCommand(action.command);

const child = spawn(normalizedCommand, {
  cwd: root,
  stdio: "inherit",
  shell: true
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
