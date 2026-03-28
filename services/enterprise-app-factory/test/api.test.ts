import request from "supertest";
import { app } from "../src/server/app.js";

test("health endpoint returns service status", async () => {
  const response = await request(app).get("/api/health");
  expect(response.status).toBe(200);
  expect(response.body.status).toBe("ok");
});

test("parse endpoint returns spec preview", async () => {
  const response = await request(app)
    .post("/api/factory/parse")
    .send({
      customerName: "Northstar Medical Logistics",
      businessDescription: "Coordinates hospital equipment delivery and warehouse movement.",
      applicationNeeds: "Needs dispatch workflows, audit logs, approvals, and reporting.",
      constraints: {
        industry: "Healthcare Logistics",
        compliance: ["Auditability"],
        integrations: ["CSV import/export"],
        branding: {},
        roles: [],
        approvalRequirements: [],
        environment: "multi-environment",
        tenancy: "multi-tenant",
      },
    });

  expect(response.status).toBe(200);
  expect(response.body.spec.customerProfile.slug).toBe("northstar-medical-logistics");
  expect(response.body.validation.valid).toBe(true);
  expect(response.body.compilerReport.compilerVersion).toContain("compiler");
  expect(response.body.runtimeKit.kitVersion).toContain("runtime-kit");
  expect(response.body.evalSuite.score).toBeGreaterThan(0);
});

test("agent registry endpoint returns bounded council capabilities", async () => {
  const response = await request(app).get("/api/factory/agent-registry");
  expect(response.status).toBe(200);
  expect(response.body.providerModes).toContain("deterministic");
  expect(response.body.capabilityMatrix.some((entry: { key: string }) => entry.key === "job-by-job-subdelegation")).toBe(true);
});

test("compiler catalog endpoints expose modules, packs, and adapters", async () => {
  const [modules, packs, adapters] = await Promise.all([
    request(app).get("/api/factory/module-registry"),
    request(app).get("/api/factory/domain-packs"),
    request(app).get("/api/factory/adapters"),
  ]);

  expect(modules.status).toBe(200);
  expect(packs.status).toBe(200);
  expect(adapters.status).toBe(200);
  expect(modules.body.some((entry: { key: string }) => entry.key === "dashboard")).toBe(true);
  expect(packs.body.some((entry: { key: string }) => entry.key === "core-operations")).toBe(true);
  expect(adapters.body.some((entry: { key: string }) => entry.key === "design-handoff-adapter")).toBe(true);
});

test("agent run endpoint returns a nested council review", async () => {
  const response = await request(app)
    .post("/api/factory/agent-runs")
    .send({
      prompt: {
        customerName: "Northstar Medical Logistics",
        businessDescription: "Coordinates hospital equipment delivery and warehouse movement.",
        applicationNeeds: "Needs dispatch workflows, audit logs, approvals, and reporting.",
        constraints: {
          industry: "Healthcare Logistics",
          compliance: ["Auditability"],
          integrations: ["CSV import/export"],
          branding: {},
          roles: [],
          approvalRequirements: [],
          environment: "multi-environment",
          tenancy: "multi-tenant",
        },
      },
      spec: (await request(app)
        .post("/api/factory/parse")
        .send({
          customerName: "Northstar Medical Logistics",
          businessDescription: "Coordinates hospital equipment delivery and warehouse movement.",
          applicationNeeds: "Needs dispatch workflows, audit logs, approvals, and reporting.",
          constraints: {
            industry: "Healthcare Logistics",
            compliance: ["Auditability"],
            integrations: ["CSV import/export"],
            branding: {},
            roles: [],
            approvalRequirements: [],
            environment: "multi-environment",
            tenancy: "multi-tenant",
          },
        })).body.spec,
      operator: "Test Operator",
      focus: ["architecture", "security", "download"],
      requestedSeatKeys: [],
      allowDelegation: true,
      maxDelegationDepth: 3,
      providerMode: "deterministic",
    });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("completed");
  expect(response.body.selectedSeatKeys.length).toBeGreaterThan(0);
  expect(response.body.root.children.length).toBeGreaterThan(0);
});
