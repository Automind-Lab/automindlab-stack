import { DeterministicCouncilRuntime } from "../src/server/agent-runtime.js";
import { buildEnterpriseAppSpec } from "../src/shared/spec-builder.js";
import { NORTHSTAR_MEDICAL_LOGISTICS_PROMPT } from "../src/server/sample.js";

test("deterministic council runtime creates nested delegated output", async () => {
  const runtime = new DeterministicCouncilRuntime();
  const spec = buildEnterpriseAppSpec(NORTHSTAR_MEDICAL_LOGISTICS_PROMPT);

  const run = await runtime.run({
    prompt: NORTHSTAR_MEDICAL_LOGISTICS_PROMPT,
    spec,
    operator: "Test Operator",
    focus: ["architecture", "download", "security"],
    requestedSeatKeys: [],
    allowDelegation: true,
    maxDelegationDepth: 3,
    providerMode: "deterministic",
  });

  expect(run.status).toBe("completed");
  expect(run.root.children.length).toBeGreaterThan(0);
  expect(run.delegationPlan.length).toBeGreaterThan(0);
  expect(run.capabilityMatrix.some((entry) => entry.key === "general-purpose-coding-agent")).toBe(true);
});
