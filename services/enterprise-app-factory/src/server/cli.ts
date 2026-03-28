import { EnterpriseAppFactoryService } from "./factory-service.js";
import { NORTHSTAR_MEDICAL_LOGISTICS_PROMPT } from "./sample.js";

async function main(): Promise<void> {
  const command = process.argv[2];
  const service = new EnterpriseAppFactoryService();
  if (command === "sample") {
    const parsed = await service.parsePrompt(NORTHSTAR_MEDICAL_LOGISTICS_PROMPT);
    const job = await service.runGenerationAndWait({
      prompt: NORTHSTAR_MEDICAL_LOGISTICS_PROMPT,
      spec: parsed.spec,
      approval: {
        approvedBy: process.env.AUTOMIND_APP_FACTORY_DEFAULT_OPERATOR ?? "Enterprise Operator",
        approvedAt: new Date().toISOString(),
        reason: "Refresh the canonical sample generated app.",
        acknowledgedRisks: ["Generated workspace files will be rewritten", "Verification commands will install dependencies if needed"],
      },
    });
    console.log(JSON.stringify({ jobId: job.id, status: job.status, workspacePath: job.workspacePath, artifacts: job.artifacts, handoff: job.handoff }, null, 2));
    return;
  }

  if (command === "verify-sample") {
    const parsed = await service.parsePrompt(NORTHSTAR_MEDICAL_LOGISTICS_PROMPT);
    const refreshed = await service.runGenerationAndWait({
      prompt: NORTHSTAR_MEDICAL_LOGISTICS_PROMPT,
      spec: parsed.spec,
      approval: {
        approvedBy: process.env.AUTOMIND_APP_FACTORY_DEFAULT_OPERATOR ?? "Enterprise Operator",
        approvedAt: new Date().toISOString(),
        reason: "Re-run sample workspace verification.",
        acknowledgedRisks: ["Generated workspace files will be rewritten", "Verification commands may install dependencies if needed"],
      },
    });
    console.log(JSON.stringify({ jobId: refreshed.id, status: refreshed.status, verification: refreshed.verification, artifacts: refreshed.artifacts }, null, 2));
    return;
  }

  if (command === "council-sample") {
    const parsed = await service.parsePrompt(NORTHSTAR_MEDICAL_LOGISTICS_PROMPT);
    const run = await service.createAgentRun({
      prompt: NORTHSTAR_MEDICAL_LOGISTICS_PROMPT,
      spec: parsed.spec,
      operator: process.env.AUTOMIND_APP_FACTORY_DEFAULT_OPERATOR ?? "Enterprise Operator",
      focus: ["architecture", "security", "download", "test"],
      requestedSeatKeys: [],
      allowDelegation: true,
      maxDelegationDepth: 3,
      providerMode: "deterministic",
    });
    console.log(JSON.stringify({ runId: run.id, status: run.status, selectedSeatKeys: run.selectedSeatKeys, summary: run.summary }, null, 2));
    return;
  }

  throw new Error("Unknown command. Use `sample`, `verify-sample`, or `council-sample`.");
}

void main();
