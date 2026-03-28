import { buildEnterpriseAppSpec } from "../src/shared/spec-builder.js";
import { validateEnterpriseAppSpec } from "../src/shared/spec-validation.js";
import { NORTHSTAR_MEDICAL_LOGISTICS_PROMPT } from "../src/server/sample.js";

test("buildEnterpriseAppSpec creates a constrained enterprise spec", () => {
  const spec = buildEnterpriseAppSpec(NORTHSTAR_MEDICAL_LOGISTICS_PROMPT);
  const validation = validateEnterpriseAppSpec(spec);

  expect(spec.customerProfile.slug).toBe("northstar-medical-logistics");
  expect(spec.businessEntities.some((entity) => entity.key === "inventory_item")).toBe(true);
  expect(spec.userRoles.some((role) => role.key === "dispatch_coordinator")).toBe(true);
  expect(spec.approvalGates.some((gate) => gate.key === "urgent-replacement")).toBe(true);
  expect(spec.integrations.some((integration) => integration.key === "erp_sync")).toBe(true);
  expect(validation.valid).toBe(true);
});
