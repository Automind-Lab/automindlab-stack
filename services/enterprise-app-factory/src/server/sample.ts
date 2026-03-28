import type { OperatorPromptInput } from "../shared/contracts.js";

export const NORTHSTAR_MEDICAL_LOGISTICS_PROMPT: OperatorPromptInput = {
  customerName: "Northstar Medical Logistics",
  businessDescription:
    "Coordinates medical equipment delivery, pickup, cleaning status, warehouse movement, and hospital service requests across multiple regions.",
  applicationNeeds:
    "Build an internal operations app with dispatch dashboard, service tickets, pickup and delivery workflows, warehouse inventory status, hospital account views, technician task assignments, approvals for urgent replacements, audit logs, role-based access, and reporting. Include admin settings, notification rules, CSV import and export, and future ERP integration support.",
  constraints: {
    industry: "Healthcare Logistics",
    compliance: ["Auditability", "Traceability"],
    integrations: ["CSV import/export", "Future ERP integration"],
    branding: {
      primaryColor: "#153f69",
      secondaryColor: "#5f95aa",
      tone: "calm, operational, highly legible",
      logoHint: "Northstar monogram with a compass-star accent",
    },
    roles: ["Dispatch Coordinator", "Warehouse Lead", "Technician", "Account Manager"],
    approvalRequirements: ["Urgent replacement approval", "Bulk inventory changes"],
    environment: "multi-environment",
    deploymentTarget: "internal web application",
    tenancy: "multi-tenant",
  },
};
