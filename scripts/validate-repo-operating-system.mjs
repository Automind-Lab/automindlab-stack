#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const requiredFiles = [
  "AGENTS.md",
  "BOOTSTRAP.md",
  "README.md",
  "RUNBOOK.md",
  "TASK_STATE.md",
  "WORK_IN_PROGRESS.md",
  "routines.md",
  "context/BOOTSTRAP.md",
  "docs/REPO_BOUNDARY_POLICY.md",
  "docs/NETWORK_POLICY.md",
  "docs/CAPABILITY_INTAKE_POLICY.md",
  "docs/AGENTMAIL_RUNTIME_CONTRACT.md",
  "docs/AGENTMAIL_OPENCLAW_SETUP.md",
  "docs/BROWSER_VALIDATION_CONTRACT.md",
  "docs/ENTERPRISE_SKILL_BUNDLES.md",
  "docs/OPERATOR_SURFACE_CONTRACT.md",
  "docs/OPERATOR_APPROVAL_POLICY.md",
  "docs/PLATFORM_OWNERSHIP_AND_POSITIONING.md",
  "docs/RUNTIME_PROFILE_COMPATIBILITY.md",
  "docs/GITHUB_AUTOMATION.md",
  "docs/GITHUB_AUTONOMY.md",
  "docs/DOWNSTREAM_SYNC_CONTRACT.md",
  "docs/SKILLS_USAGE.md",
  "docs/SKILLS_RECOMMENDED.md",
  ".github/autonomy/execution-policy.json",
  "config/browser-validation/enterprise-browser-validation.manifest.json",
  "config/email/agentmail-runtime-manifest.json",
  "config/examples/agentmail-message-request.example.json",
  "config/examples/agentmail-message-result.example.json",
  "config/examples/openclaw-agentmail-skill.example.json",
  "config/github/automation-contract.json",
  "config/intake/candidates.json",
  "config/intake/approved.json",
  "config/intake/rejected.json",
  "config/operator/operator-surface-manifest.json",
  "config/operator/operator-command-policy.json",
  "config/routines/automindlab-core-routines.json",
  "config/runtime-profiles/openclaw.enterprise-host-worker.json",
  "config/runtime-profiles/nemoclaw.enterprise-host-worker.json",
  "config/skills/automindlab-baseline-pack.json",
  "config/skills/enterprise-skill-bundles.json",
  "config/schemas/agentmail-message-request.schema.json",
  "config/schemas/agentmail-message-result.schema.json",
  "config/schemas/agentmail-runtime-manifest.schema.json",
  "config/schemas/browser-validation-manifest.schema.json",
  "config/schemas/capability-intake-catalog.schema.json",
  "config/schemas/downstream-sync-manifest.schema.json",
  "config/schemas/enterprise-skill-bundles.schema.json",
  "config/schemas/operator-surface-manifest.schema.json",
  "config/schemas/operator-command-policy.schema.json",
  "config/schemas/runtime-topology-profile.schema.json",
  "config/sync/downstreams/flowcommander.sync-manifest.json",
  "config/workflows/agentmail_runtime.workflow.json",
  "config/workflows/browser_validation.workflow.json",
  "scripts/agentmail-doctor.mjs",
  "scripts/agentmail-live-check.mjs",
  "scripts/plan-browser-validation.mjs",
  "scripts/validate-agentmail-runtime.mjs",
  "scripts/validate-browser-validation.mjs",
  "scripts/bootstrap-recovery.sh",
  "scripts/runtime-doctor.sh",
  "scripts/worker-status.sh",
  "scripts/sync-openclaw-workspaces.sh",
  "scripts/validate-capability-intake.mjs",
  "scripts/validate-enterprise-skill-bundles.mjs",
  "scripts/validate-operator-surfaces.mjs",
  "scripts/run-operator-action.mjs",
  "scripts/validate-runtime-topology-profiles.mjs",
];

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing file: ${relativePath}`);
  }
  return fs.readFileSync(absolutePath, "utf8");
}

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`missing file: ${relativePath}`);
  }
}

const agents = read("AGENTS.md");
for (const expected of ["`RUNBOOK.md`", "`TASK_STATE.md`", "`WORK_IN_PROGRESS.md`"]) {
  if (!agents.includes(expected)) {
    fail(`AGENTS.md must mention ${expected}`);
  }
}

const bootstrapStub = read("BOOTSTRAP.md");
if (!bootstrapStub.includes("context/BOOTSTRAP.md")) {
  fail("BOOTSTRAP.md must point to context/BOOTSTRAP.md");
}

const bootstrap = read("context/BOOTSTRAP.md");
for (const expected of ["`RUNBOOK.md`", "`TASK_STATE.md`", "`.ona/skills/INDEX.md`"]) {
  if (!bootstrap.includes(expected)) {
    fail(`context/BOOTSTRAP.md must mention ${expected}`);
  }
}

const runbook = read("RUNBOOK.md");
for (const expected of ["git status", "make doctor-plus", "make bootstrap-recovery", "make agentmail-runtime-validate", "make browser-validation-validate"]) {
  if (!runbook.includes(expected)) {
    fail(`RUNBOOK.md must mention ${expected}`);
  }
}

const readme = read("README.md");
for (const expected of [
  "config/routines/automindlab-core-routines.json",
  "config/skills/automindlab-baseline-pack.json",
  "docs/REPO_BOUNDARY_POLICY.md",
  "config/email/agentmail-runtime-manifest.json",
  "docs/AGENTMAIL_RUNTIME_CONTRACT.md",
  "docs/AGENTMAIL_OPENCLAW_SETUP.md",
  "config/browser-validation/enterprise-browser-validation.manifest.json",
  "docs/BROWSER_VALIDATION_CONTRACT.md",
  "config/skills/enterprise-skill-bundles.json",
  "docs/ENTERPRISE_SKILL_BUNDLES.md",
  "config/schemas/worker-task.schema.json",
  "config/github/automation-contract.json",
  "config/sync/downstreams/flowcommander.sync-manifest.json",
  "config/intake/approved.json",
  "config/operator/operator-surface-manifest.json",
  "config/runtime-profiles/openclaw.enterprise-host-worker.json",
  "docs/CAPABILITY_INTAKE_POLICY.md",
  "docs/OPERATOR_SURFACE_CONTRACT.md",
  "docs/PLATFORM_OWNERSHIP_AND_POSITIONING.md",
  "docs/RUNTIME_PROFILE_COMPATIBILITY.md",
]) {
  if (!readme.includes(expected)) {
    fail(`README.md must mention ${expected}`);
  }
}

const taskState = read("TASK_STATE.md");
for (const expected of ["## Current status", "- Description:", "- Next intended step:", "- Verification complete:"]) {
  if (!taskState.includes(expected)) {
    fail(`TASK_STATE.md must include ${expected}`);
  }
}

const wip = read("WORK_IN_PROGRESS.md");
for (const expected of ["## Current focus", "## Current work packet", "## Next milestone", "## Risks and watchouts"]) {
  if (!wip.includes(expected)) {
    fail(`WORK_IN_PROGRESS.md must include ${expected}`);
  }
}

const boundary = read("docs/REPO_BOUNDARY_POLICY.md");
if (!boundary.includes("`bmo-stack`") || !boundary.toLowerCase().includes("downstream") || !boundary.includes("config/intake/")) {
  fail("docs/REPO_BOUNDARY_POLICY.md must mention bmo-stack, downstream boundaries, and config/intake/");
}

const network = read("docs/NETWORK_POLICY.md");
for (const expected of ["`automind-host`", "`automind-worker`", "operator-visible", "escalate: true"]) {
  if (!network.includes(expected)) {
    fail(`docs/NETWORK_POLICY.md must mention ${expected}`);
  }
}

const delegationDoc = read("docs/WORKER_DELEGATION_PROTOCOL.md");
for (const expected of ["config/schemas/worker-task.schema.json", "config/schemas/worker-result.schema.json"]) {
  if (!delegationDoc.includes(expected)) {
    fail(`docs/WORKER_DELEGATION_PROTOCOL.md must mention ${expected}`);
  }
}

const automationDoc = read("docs/GITHUB_AUTONOMY.md");
for (const expected of [
  "config/github/automation-contract.json",
  ".github/autonomy/execution-policy.json",
  "validate-github-automation.mjs",
  "github-autonomy-selftest.mjs",
]) {
  if (!automationDoc.includes(expected)) {
    fail(`docs/GITHUB_AUTONOMY.md must mention ${expected}`);
  }
}

const downstreamDoc = read("docs/DOWNSTREAM_SYNC_CONTRACT.md");
if (!downstreamDoc.includes("config/sync/downstreams/flowcommander.sync-manifest.json")) {
  fail("docs/DOWNSTREAM_SYNC_CONTRACT.md must mention config/sync/downstreams/flowcommander.sync-manifest.json");
}

const intakeDoc = read("docs/CAPABILITY_INTAKE_POLICY.md");
for (const expected of ["config/intake/approved.json", "config/intake/rejected.json", "validate-capability-intake.mjs", "agentmail-to", "MoneyPrinterV2"]) {
  if (!intakeDoc.includes(expected)) {
    fail(`docs/CAPABILITY_INTAKE_POLICY.md must mention ${expected}`);
  }
}

const agentmailDoc = read("docs/AGENTMAIL_RUNTIME_CONTRACT.md");
for (const expected of [
  "config/email/agentmail-runtime-manifest.json",
  "config/examples/openclaw-agentmail-skill.example.json",
  "scripts/agentmail-live-check.mjs",
]) {
  if (!agentmailDoc.includes(expected)) {
    fail(`docs/AGENTMAIL_RUNTIME_CONTRACT.md must mention ${expected}`);
  }
}

const browserValidationDoc = read("docs/BROWSER_VALIDATION_CONTRACT.md");
for (const expected of [
  "config/browser-validation/enterprise-browser-validation.manifest.json",
  "scripts/validate-browser-validation.mjs",
  "scripts/plan-browser-validation.mjs",
]) {
  if (!browserValidationDoc.includes(expected)) {
    fail(`docs/BROWSER_VALIDATION_CONTRACT.md must mention ${expected}`);
  }
}

const bundleDoc = read("docs/ENTERPRISE_SKILL_BUNDLES.md");
for (const expected of [
  "config/skills/enterprise-skill-bundles.json",
  "config/schemas/enterprise-skill-bundles.schema.json",
  "scripts/validate-enterprise-skill-bundles.mjs",
]) {
  if (!bundleDoc.includes(expected)) {
    fail(`docs/ENTERPRISE_SKILL_BUNDLES.md must mention ${expected}`);
  }
}

const operatorSurfaceDoc = read("docs/OPERATOR_SURFACE_CONTRACT.md");
for (const expected of ["config/operator/operator-surface-manifest.json", "config/operator/operator-command-policy.json", "run-operator-action.mjs"]) {
  if (!operatorSurfaceDoc.includes(expected)) {
    fail(`docs/OPERATOR_SURFACE_CONTRACT.md must mention ${expected}`);
  }
}

const operatorPolicyDoc = read("docs/OPERATOR_APPROVAL_POLICY.md");
for (const expected of ["config/operator/operator-command-policy.json", "validate-operator-surfaces.mjs", "prompt"]) {
  if (!operatorPolicyDoc.includes(expected)) {
    fail(`docs/OPERATOR_APPROVAL_POLICY.md must mention ${expected}`);
  }
}

const profileDoc = read("docs/RUNTIME_PROFILE_COMPATIBILITY.md");
for (const expected of ["OpenClaw", "NemoClaw", "contract-validated", "fixture-validated", "validate-runtime-topology-profiles.mjs"]) {
  if (!profileDoc.includes(expected)) {
    fail(`docs/RUNTIME_PROFILE_COMPATIBILITY.md must mention ${expected}`);
  }
}

const ownershipDoc = read("docs/PLATFORM_OWNERSHIP_AND_POSITIONING.md");
for (const expected of ["config/intake/", "typed contracts", "diagnostics", "growth hacks"]) {
  if (!ownershipDoc.includes(expected)) {
    fail(`docs/PLATFORM_OWNERSHIP_AND_POSITIONING.md must mention ${expected}`);
  }
}

console.log("AutoMindLab repo operating system files are valid");
