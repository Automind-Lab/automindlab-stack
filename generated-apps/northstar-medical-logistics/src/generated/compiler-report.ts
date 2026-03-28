import type { GeneratedCompilerReport } from "../types.js";

export const compilerReport: GeneratedCompilerReport = {
  "compilerVersion": "2026-03-28.compiler.v2",
  "specVersion": "2026-03-28.spec.v2",
  "targetRuntime": "generated-runtime-kit.v2",
  "selectedDomainPackKeys": [
    "core-operations",
    "healthcare-logistics",
    "warehouse-operations",
    "field-service",
    "account-governance"
  ],
  "selectedModuleKeys": [
    "dashboard",
    "entity-workbench",
    "workflow-orchestrator",
    "approvals",
    "audit",
    "roles",
    "integrations",
    "notifications",
    "reports",
    "settings",
    "dispatch-board",
    "inventory-readiness",
    "service-ticket-console",
    "account-operations",
    "task-assignment"
  ],
  "selectedAdapterKeys": [
    "design-handoff-adapter",
    "figma-bridge-adapter",
    "notification-router-adapter",
    "identity-provider-adapter",
    "csv-batch-gateway",
    "erp-sync-sdk"
  ],
  "stageResults": [
    {
      "key": "normalize",
      "name": "Normalize Prompt",
      "status": "completed",
      "summary": "Normalized operator prompt for Northstar Medical Logistics.",
      "selectedKeys": [
        "northstar-medical-logistics"
      ],
      "warnings": []
    },
    {
      "key": "domain-packs",
      "name": "Select Domain Packs",
      "status": "completed",
      "summary": "Selected 5 domain pack(s) to cover the requested customer case.",
      "selectedKeys": [
        "core-operations",
        "healthcare-logistics",
        "warehouse-operations",
        "field-service",
        "account-governance"
      ],
      "warnings": []
    },
    {
      "key": "modules",
      "name": "Select Modules",
      "status": "completed",
      "summary": "Selected 15 module(s) from the registry.",
      "selectedKeys": [
        "dashboard",
        "entity-workbench",
        "workflow-orchestrator",
        "approvals",
        "audit",
        "roles",
        "integrations",
        "notifications",
        "reports",
        "settings",
        "dispatch-board",
        "inventory-readiness",
        "service-ticket-console",
        "account-operations",
        "task-assignment"
      ],
      "warnings": []
    },
    {
      "key": "adapters",
      "name": "Bind Adapters",
      "status": "completed",
      "summary": "Selected 6 adapter binding(s).",
      "selectedKeys": [
        "design-handoff-adapter",
        "figma-bridge-adapter",
        "notification-router-adapter",
        "identity-provider-adapter",
        "csv-batch-gateway",
        "erp-sync-sdk"
      ],
      "warnings": []
    },
    {
      "key": "spec-assembly",
      "name": "Assemble Spec",
      "status": "completed",
      "summary": "Built typed entities, workflows, permissions, approvals, and adapter bindings for Northstar Medical Logistics.",
      "selectedKeys": [
        "approval_request",
        "shipment_order",
        "service_ticket",
        "inventory_item",
        "account",
        "task_assignment",
        "reporting",
        "approval",
        "dispatch",
        "inventory",
        "service_resolution"
      ],
      "warnings": []
    },
    {
      "key": "runtime-kit",
      "name": "Build Runtime Kit",
      "status": "completed",
      "summary": "Built runtime kit with 15 page(s).",
      "selectedKeys": [
        "dashboard",
        "entity-workbench",
        "workflow-orchestrator",
        "approvals",
        "audit",
        "roles",
        "integrations",
        "notifications",
        "reports",
        "settings",
        "dispatch-board",
        "inventory-readiness",
        "service-ticket-console",
        "account-operations",
        "task-assignment"
      ],
      "warnings": []
    },
    {
      "key": "design-handoff",
      "name": "Build Design Handoff",
      "status": "completed",
      "summary": "Built design handoff with 11 token(s) and 15 screen(s).",
      "selectedKeys": [
        "dashboard",
        "entity-workbench",
        "workflow-orchestrator",
        "approvals",
        "audit",
        "roles",
        "integrations",
        "notifications",
        "reports",
        "settings",
        "dispatch-board",
        "inventory-readiness",
        "service-ticket-console",
        "account-operations",
        "task-assignment"
      ],
      "warnings": []
    },
    {
      "key": "evals",
      "name": "Run Compiler Evals",
      "status": "completed",
      "summary": "Compiler evals passed. Score 100.",
      "selectedKeys": [
        "tenant-boundary",
        "approval-coverage",
        "module-coverage",
        "adapter-boundaries",
        "editability",
        "design-handoff",
        "uncertainty-visible"
      ],
      "warnings": []
    }
  ],
  "notes": [
    "Preserves least privilege and auditability defaults even when the prompt is sparse.",
    "Provides the operator-visible admin/reporting/governance shell for all generated apps.",
    "Adds chain-of-custody friendly entities and readiness-state views.",
    "Keeps ERP and design tooling future-ready rather than hard coupled.",
    "Strengthens readiness and disposition controls for tenant-scoped assets.",
    "Keeps operator-visible service resolution and assignment flows aligned.",
    "Makes account visibility and governance controls first-class instead of implicit.",
    "The compiler keeps uncertainty, deferred integrations, and post-generation edit surfaces visible."
  ]
};
