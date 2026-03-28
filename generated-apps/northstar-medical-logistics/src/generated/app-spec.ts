import type { GeneratedAppSpec } from "../types.js";

export const appSpec: GeneratedAppSpec = {
  "schemaVersion": "2026-03-28.spec.v2",
  "generatedAt": "2026-03-28T10:36:47.537Z",
  "compiler": {
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
  },
  "customerProfile": {
    "name": "Northstar Medical Logistics",
    "slug": "northstar-medical-logistics",
    "businessSummary": "Coordinates medical equipment delivery, pickup, cleaning status, warehouse movement, and hospital service requests across multiple regions.",
    "industry": "Healthcare Logistics",
    "deploymentEnvironment": "multi-environment",
    "tenancy": "multi-tenant ready with tenant-scoped business entities",
    "branding": {
      "brandName": "Northstar Medical Logistics",
      "primaryColor": "#153f69",
      "secondaryColor": "#5f95aa",
      "accentColor": "#d97a2b",
      "surfaceColor": "#f3f7f8",
      "canvasColor": "#e4edf0",
      "headingFont": "\"Bahnschrift SemiBold\", \"Aptos Display\", sans-serif",
      "bodyFont": "\"Aptos\", \"Segoe UI Variable Text\", sans-serif",
      "density": "balanced",
      "logoTreatment": "Northstar monogram with a compass-star accent"
    }
  },
  "businessDomain": "Healthcare Logistics operations",
  "appPurpose": "Build an internal operations app with dispatch dashboard, service tickets, pickup and delivery workflows, warehouse inventory status, hospital account views, technician task assignments, approvals for urgent replacements, audit logs, role-based access, and reporting. Include admin settings, notification rules, CSV import and export, and future ERP integration support.",
  "summary": "Northstar Medical Logistics needs an internal enterprise app built from reusable modules, domain packs, and typed contracts for Build an internal operations app with dispatch dashboard, service tickets, pickup and delivery workflows, warehouse inventory status, hospital account views, technician task assignments, approvals for urgent replacements, audit logs, role-based access, and reporting. Include admin settings, notification rules, CSV import and export, and future ERP integration support.",
  "identityAndAccess": {
    "authStrategy": "Enterprise SSO or local admin bootstrap with later IdP cutover",
    "tenantIsolation": "Tenant-scoped rows, tenant-aware APIs, and no cross-tenant data access by default",
    "leastPrivilegeNotes": [
      "Operators get only the modules required for their responsibilities",
      "Approval rights are separated from general operational access",
      "Generated app secrets stay outside source control"
    ],
    "approvalPolicy": "Irreversible workflow actions require explicit approval plus audit capture"
  },
  "coreWorkflows": [
    {
      "key": "reporting",
      "name": "Reporting and Sync Review",
      "description": "Prepare summaries and contract-first integration handoffs.",
      "triggers": [
        "End of day",
        "Scheduled export",
        "Manual review"
      ],
      "actors": [
        "operations_manager",
        "reporting_analyst",
        "platform_admin"
      ],
      "steps": [
        {
          "key": "triage",
          "label": "Triage",
          "ownerRoles": [
            "operations_manager"
          ],
          "action": "Review incoming work",
          "auditEvent": "workflow.generic.triage"
        },
        {
          "key": "execute",
          "label": "Execute",
          "ownerRoles": [
            "dispatch_coordinator",
            "technician"
          ],
          "action": "Perform the work",
          "auditEvent": "workflow.generic.execute"
        },
        {
          "key": "verify",
          "label": "Verify",
          "ownerRoles": [
            "operations_manager"
          ],
          "action": "Confirm close-out and evidence",
          "auditEvent": "workflow.generic.verify"
        }
      ],
      "automationHints": [
        "Generate daily digest",
        "Queue ERP sync draft after approval"
      ]
    },
    {
      "key": "approval",
      "name": "Exception and Approval Flow",
      "description": "Route irreversible or high-risk actions through explicit review.",
      "triggers": [
        "Urgent replacement request",
        "Bulk import",
        "Role expansion"
      ],
      "actors": [
        "operations_manager",
        "approver",
        "auditor"
      ],
      "steps": [
        {
          "key": "request",
          "label": "Request",
          "ownerRoles": [
            "dispatch_coordinator",
            "warehouse_lead",
            "operations_manager"
          ],
          "action": "Submit a gated request",
          "auditEvent": "workflow.approval.request"
        },
        {
          "key": "review",
          "label": "Review",
          "ownerRoles": [
            "approver"
          ],
          "action": "Review business justification",
          "approvalGateKey": "urgent-replacement",
          "auditEvent": "workflow.approval.review"
        },
        {
          "key": "decision",
          "label": "Decision",
          "ownerRoles": [
            "approver",
            "operations_manager"
          ],
          "action": "Approve or reject",
          "approvalGateKey": "urgent-replacement",
          "auditEvent": "workflow.approval.decision"
        }
      ],
      "automationHints": [
        "Escalate when approval SLA is breached",
        "Capture approval evidence automatically"
      ]
    },
    {
      "key": "dispatch",
      "name": "Dispatch and Fulfillment",
      "description": "Coordinate service requests, dispatch decisions, and execution visibility.",
      "triggers": [
        "New customer request",
        "Reschedule or escalation event"
      ],
      "actors": [
        "dispatch_coordinator",
        "technician",
        "operations_manager"
      ],
      "steps": [
        {
          "key": "intake",
          "label": "Intake",
          "ownerRoles": [
            "dispatch_coordinator"
          ],
          "action": "Create order or service request",
          "auditEvent": "workflow.dispatch.intake"
        },
        {
          "key": "assign",
          "label": "Assign",
          "ownerRoles": [
            "dispatch_coordinator"
          ],
          "action": "Assign task and route",
          "auditEvent": "workflow.dispatch.assign"
        },
        {
          "key": "execute",
          "label": "Execute",
          "ownerRoles": [
            "technician",
            "warehouse_lead"
          ],
          "action": "Deliver, pick up, or service the order",
          "auditEvent": "workflow.dispatch.execute"
        },
        {
          "key": "close",
          "label": "Close",
          "ownerRoles": [
            "operations_manager"
          ],
          "action": "Confirm completion",
          "auditEvent": "workflow.dispatch.close"
        }
      ],
      "automationHints": [
        "Auto-prioritize at-risk orders",
        "Notify owners when service window is threatened"
      ]
    },
    {
      "key": "inventory",
      "name": "Inventory and Readiness Flow",
      "description": "Track item movement, readiness state, and warehouse ownership transitions.",
      "triggers": [
        "Item intake",
        "Cleaning completion",
        "Location change"
      ],
      "actors": [
        "warehouse_lead",
        "technician",
        "operations_manager"
      ],
      "steps": [
        {
          "key": "receive",
          "label": "Receive",
          "ownerRoles": [
            "warehouse_lead"
          ],
          "action": "Receive or inspect the item",
          "auditEvent": "workflow.inventory.receive"
        },
        {
          "key": "status",
          "label": "Status Update",
          "ownerRoles": [
            "warehouse_lead",
            "technician"
          ],
          "action": "Update readiness or condition",
          "auditEvent": "workflow.inventory.status"
        },
        {
          "key": "transfer",
          "label": "Transfer",
          "ownerRoles": [
            "warehouse_lead"
          ],
          "action": "Move item between locations",
          "auditEvent": "workflow.inventory.transfer"
        },
        {
          "key": "retire",
          "label": "Retire",
          "ownerRoles": [
            "operations_manager"
          ],
          "action": "Retire or write off item",
          "approvalGateKey": "inventory-disposition",
          "auditEvent": "workflow.inventory.retire"
        }
      ],
      "automationHints": [
        "Flag stale inventory states",
        "Create follow-up tasks after condition changes"
      ]
    },
    {
      "key": "service_resolution",
      "name": "Service Resolution",
      "description": "Triage service tickets, assign ownership, and verify close-out evidence.",
      "triggers": [
        "Ticket created",
        "Customer escalation",
        "Field update received"
      ],
      "actors": [
        "dispatch_coordinator",
        "technician",
        "operations_manager"
      ],
      "steps": [
        {
          "key": "triage",
          "label": "Triage",
          "ownerRoles": [
            "dispatch_coordinator"
          ],
          "action": "Classify issue and expected urgency",
          "auditEvent": "workflow.service.triage"
        },
        {
          "key": "assign",
          "label": "Assign",
          "ownerRoles": [
            "dispatch_coordinator"
          ],
          "action": "Assign a technician or operational owner",
          "auditEvent": "workflow.service.assign"
        },
        {
          "key": "resolve",
          "label": "Resolve",
          "ownerRoles": [
            "technician"
          ],
          "action": "Perform the service work and capture notes",
          "auditEvent": "workflow.service.resolve"
        },
        {
          "key": "verify",
          "label": "Verify",
          "ownerRoles": [
            "operations_manager"
          ],
          "action": "Confirm outcome and reopen risk if needed",
          "auditEvent": "workflow.service.verify"
        }
      ],
      "automationHints": [
        "Escalate blocked tickets automatically",
        "Notify account owners when SLA risk rises"
      ]
    }
  ],
  "businessEntities": [
    {
      "key": "approval_request",
      "label": "Approval Request",
      "description": "Captures explicitly gated actions and the justification behind them.",
      "ownership": "governance",
      "tenantScoped": true,
      "operations": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "relatedEntities": [
        "inventory_item",
        "service_ticket",
        "shipment_order"
      ],
      "fields": [
        {
          "key": "requestType",
          "label": "Request Type",
          "type": "enum",
          "required": true,
          "description": "Type of action requiring approval."
        },
        {
          "key": "requestedBy",
          "label": "Requested By",
          "type": "string",
          "required": true,
          "description": "Operator initiating the request."
        },
        {
          "key": "riskLevel",
          "label": "Risk Level",
          "type": "enum",
          "required": true,
          "description": "Operational or compliance risk."
        },
        {
          "key": "decisionState",
          "label": "Decision State",
          "type": "enum",
          "required": true,
          "description": "Approval lifecycle state."
        }
      ]
    },
    {
      "key": "shipment_order",
      "label": "Shipment Order",
      "description": "Tracks delivery and pickup obligations, timing, and status.",
      "ownership": "operations",
      "tenantScoped": true,
      "operations": [
        "create",
        "read",
        "update",
        "assign",
        "reschedule",
        "complete"
      ],
      "relatedEntities": [
        "account",
        "service_ticket",
        "task_assignment",
        "inventory_item"
      ],
      "fields": [
        {
          "key": "orderNumber",
          "label": "Order Number",
          "type": "string",
          "required": true,
          "description": "Human-readable order reference."
        },
        {
          "key": "serviceWindow",
          "label": "Service Window",
          "type": "datetime",
          "required": true,
          "description": "Planned customer-facing service time."
        },
        {
          "key": "status",
          "label": "Status",
          "type": "enum",
          "required": true,
          "description": "Current execution state."
        },
        {
          "key": "priority",
          "label": "Priority",
          "type": "enum",
          "required": true,
          "description": "Operational priority used for dispatch."
        }
      ]
    },
    {
      "key": "service_ticket",
      "label": "Service Ticket",
      "description": "Captures customer-reported work, triage, and resolution state.",
      "ownership": "operations",
      "tenantScoped": true,
      "operations": [
        "create",
        "read",
        "update",
        "triage",
        "resolve",
        "reopen"
      ],
      "relatedEntities": [
        "account",
        "task_assignment",
        "approval_request"
      ],
      "fields": [
        {
          "key": "ticketNumber",
          "label": "Ticket Number",
          "type": "string",
          "required": true,
          "description": "Unique service ticket identifier."
        },
        {
          "key": "issueType",
          "label": "Issue Type",
          "type": "enum",
          "required": true,
          "description": "Requested service category."
        },
        {
          "key": "requestedBy",
          "label": "Requested By",
          "type": "string",
          "required": true,
          "description": "Customer contact or source system."
        },
        {
          "key": "resolutionState",
          "label": "Resolution State",
          "type": "enum",
          "required": true,
          "description": "Current progress toward closure."
        }
      ]
    },
    {
      "key": "inventory_item",
      "label": "Inventory Item",
      "description": "Represents equipment, readiness state, and warehouse location.",
      "ownership": "warehouse",
      "tenantScoped": true,
      "operations": [
        "create",
        "read",
        "update",
        "transfer",
        "mark-ready",
        "retire"
      ],
      "relatedEntities": [
        "shipment_order",
        "service_ticket",
        "approval_request"
      ],
      "fields": [
        {
          "key": "assetTag",
          "label": "Asset Tag",
          "type": "string",
          "required": true,
          "description": "Equipment identifier."
        },
        {
          "key": "currentLocation",
          "label": "Current Location",
          "type": "string",
          "required": true,
          "description": "Warehouse or in-field location."
        },
        {
          "key": "readinessState",
          "label": "Readiness State",
          "type": "enum",
          "required": true,
          "description": "Cleaning or service readiness state."
        },
        {
          "key": "condition",
          "label": "Condition",
          "type": "enum",
          "required": true,
          "description": "Operational condition at current step."
        }
      ]
    },
    {
      "key": "account",
      "label": "Account",
      "description": "Represents a customer account, service profile, and regional footprint.",
      "ownership": "customer-ops",
      "tenantScoped": true,
      "operations": [
        "create",
        "read",
        "update",
        "link-orders",
        "view-history"
      ],
      "relatedEntities": [
        "shipment_order",
        "service_ticket",
        "report_snapshot"
      ],
      "fields": [
        {
          "key": "accountName",
          "label": "Account Name",
          "type": "string",
          "required": true,
          "description": "Customer-visible account name."
        },
        {
          "key": "region",
          "label": "Region",
          "type": "string",
          "required": true,
          "description": "Primary service region."
        },
        {
          "key": "serviceTier",
          "label": "Service Tier",
          "type": "enum",
          "required": true,
          "description": "Operational priority tier."
        },
        {
          "key": "status",
          "label": "Status",
          "type": "enum",
          "required": true,
          "description": "Commercial account status."
        }
      ]
    },
    {
      "key": "task_assignment",
      "label": "Task Assignment",
      "description": "Assigns operational work to a person or team with due dates and evidence.",
      "ownership": "operations",
      "tenantScoped": true,
      "operations": [
        "create",
        "read",
        "update",
        "assign",
        "complete",
        "escalate"
      ],
      "relatedEntities": [
        "service_ticket",
        "shipment_order",
        "account"
      ],
      "fields": [
        {
          "key": "taskCode",
          "label": "Task Code",
          "type": "string",
          "required": true,
          "description": "Task identifier."
        },
        {
          "key": "assignedTo",
          "label": "Assigned To",
          "type": "string",
          "required": true,
          "description": "Operator or technician owner."
        },
        {
          "key": "dueAt",
          "label": "Due At",
          "type": "datetime",
          "required": true,
          "description": "Expected completion timestamp."
        },
        {
          "key": "state",
          "label": "State",
          "type": "enum",
          "required": true,
          "description": "Current execution state."
        }
      ]
    }
  ],
  "userRoles": [
    {
      "key": "platform_admin",
      "name": "Platform Admin",
      "description": "Configures tenant defaults, identity, integration surfaces, and approval policy.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "entity-workbench",
        "workflow-orchestrator",
        "approvals",
        "audit",
        "roles",
        "integrations",
        "notifications",
        "reports",
        "settings"
      ],
      "responsibilities": [
        "Configure tenant-level settings",
        "Manage integrations",
        "Review privileged changes"
      ],
      "approvalScope": [
        "rbac",
        "integrations",
        "settings",
        "data-export"
      ]
    },
    {
      "key": "operations_manager",
      "name": "Operations Manager",
      "description": "Owns throughput, escalations, approvals, and operational policies.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "entity-workbench",
        "workflow-orchestrator",
        "approvals",
        "audit",
        "roles",
        "notifications",
        "reports",
        "settings"
      ],
      "responsibilities": [
        "Own day-to-day operations",
        "Approve urgent exceptions",
        "Monitor SLA and risk"
      ],
      "approvalScope": [
        "urgent-replacement",
        "bulk-import",
        "status-override"
      ]
    },
    {
      "key": "approver",
      "name": "Approver",
      "description": "Approves explicitly gated operational actions without full administrative access.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "approvals",
        "audit",
        "reports"
      ],
      "responsibilities": [
        "Review irreversible actions",
        "Document business justification"
      ],
      "approvalScope": [
        "urgent-replacement",
        "inventory-disposition",
        "manual-export"
      ]
    },
    {
      "key": "auditor",
      "name": "Auditor",
      "description": "Reviews audit history, approvals, and compliance evidence.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "audit",
        "approvals",
        "roles",
        "reports"
      ],
      "responsibilities": [
        "Validate controls",
        "Trace important workflow events"
      ],
      "approvalScope": []
    },
    {
      "key": "reporting_analyst",
      "name": "Reporting Analyst",
      "description": "Curates report definitions and validates KPI outputs.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "reports",
        "audit"
      ],
      "responsibilities": [
        "Design reports",
        "Validate trend narratives"
      ],
      "approvalScope": []
    },
    {
      "key": "dispatch_coordinator",
      "name": "Dispatch Coordinator",
      "description": "Coordinates field work, routing, and schedule changes.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "dispatch-board",
        "workflow-orchestrator",
        "notifications",
        "reports"
      ],
      "responsibilities": [
        "Schedule jobs",
        "Assign field work",
        "Track in-flight exceptions"
      ],
      "approvalScope": []
    },
    {
      "key": "warehouse_lead",
      "name": "Warehouse Lead",
      "description": "Owns inventory status, handoffs, and physical movement events.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "inventory-readiness",
        "entity-workbench",
        "workflow-orchestrator",
        "notifications",
        "reports"
      ],
      "responsibilities": [
        "Maintain inventory truth",
        "Confirm readiness states",
        "Record location changes"
      ],
      "approvalScope": [
        "inventory-disposition"
      ]
    },
    {
      "key": "technician",
      "name": "Technician",
      "description": "Executes assigned tasks and updates operational status from the field.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "task-assignment",
        "service-ticket-console",
        "workflow-orchestrator"
      ],
      "responsibilities": [
        "Execute assigned tasks",
        "Capture service notes",
        "Confirm completion state"
      ],
      "approvalScope": []
    },
    {
      "key": "account_manager",
      "name": "Account Manager",
      "description": "Owns account-level visibility, service coordination, and customer escalations.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "account-operations",
        "reports"
      ],
      "responsibilities": [
        "Monitor account health",
        "Review service history"
      ],
      "approvalScope": []
    }
  ],
  "permissions": [
    {
      "roleKey": "platform_admin",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "platform_admin",
      "resource": "shipment_order",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "reschedule",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "platform_admin",
      "resource": "service_ticket",
      "actions": [
        "create",
        "read",
        "update",
        "triage",
        "resolve",
        "reopen"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "platform_admin",
      "resource": "inventory_item",
      "actions": [
        "create",
        "read",
        "update",
        "transfer",
        "mark-ready",
        "retire"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "platform_admin",
      "resource": "account",
      "actions": [
        "create",
        "read",
        "update",
        "link-orders",
        "view-history"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "platform_admin",
      "resource": "task_assignment",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "complete",
        "escalate"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "operations_manager",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "operations_manager",
      "resource": "shipment_order",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "reschedule",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "operations_manager",
      "resource": "service_ticket",
      "actions": [
        "create",
        "read",
        "update",
        "triage",
        "resolve",
        "reopen"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "operations_manager",
      "resource": "inventory_item",
      "actions": [
        "create",
        "read",
        "update",
        "transfer",
        "mark-ready",
        "retire"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "operations_manager",
      "resource": "account",
      "actions": [
        "create",
        "read",
        "update",
        "link-orders",
        "view-history"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "operations_manager",
      "resource": "task_assignment",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "complete",
        "escalate"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "approver",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "approver",
      "resource": "shipment_order",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "reschedule",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "approver",
      "resource": "service_ticket",
      "actions": [
        "create",
        "read",
        "update",
        "triage",
        "resolve",
        "reopen"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "approver",
      "resource": "inventory_item",
      "actions": [
        "create",
        "read",
        "update",
        "transfer",
        "mark-ready",
        "retire"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "approver",
      "resource": "account",
      "actions": [
        "create",
        "read",
        "update",
        "link-orders",
        "view-history"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "approver",
      "resource": "task_assignment",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "complete",
        "escalate"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "auditor",
      "resource": "approval_request",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "auditor",
      "resource": "shipment_order",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "auditor",
      "resource": "service_ticket",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "auditor",
      "resource": "inventory_item",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "auditor",
      "resource": "account",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "auditor",
      "resource": "task_assignment",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "reporting_analyst",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "reporting_analyst",
      "resource": "shipment_order",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "reschedule",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "reporting_analyst",
      "resource": "service_ticket",
      "actions": [
        "create",
        "read",
        "update",
        "triage",
        "resolve",
        "reopen"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "reporting_analyst",
      "resource": "inventory_item",
      "actions": [
        "create",
        "read",
        "update",
        "transfer",
        "mark-ready",
        "retire"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "reporting_analyst",
      "resource": "account",
      "actions": [
        "create",
        "read",
        "update",
        "link-orders",
        "view-history"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "reporting_analyst",
      "resource": "task_assignment",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "complete",
        "escalate"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "dispatch_coordinator",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "dispatch_coordinator",
      "resource": "shipment_order",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "reschedule",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "dispatch_coordinator",
      "resource": "service_ticket",
      "actions": [
        "create",
        "read",
        "update",
        "triage",
        "resolve",
        "reopen"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "dispatch_coordinator",
      "resource": "inventory_item",
      "actions": [
        "create",
        "read",
        "update",
        "transfer",
        "mark-ready",
        "retire"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "dispatch_coordinator",
      "resource": "account",
      "actions": [
        "create",
        "read",
        "update",
        "link-orders",
        "view-history"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "dispatch_coordinator",
      "resource": "task_assignment",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "complete",
        "escalate"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "warehouse_lead",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "warehouse_lead",
      "resource": "shipment_order",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "reschedule",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "warehouse_lead",
      "resource": "service_ticket",
      "actions": [
        "create",
        "read",
        "update",
        "triage",
        "resolve",
        "reopen"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "warehouse_lead",
      "resource": "inventory_item",
      "actions": [
        "create",
        "read",
        "update",
        "transfer",
        "mark-ready",
        "retire"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "warehouse_lead",
      "resource": "account",
      "actions": [
        "create",
        "read",
        "update",
        "link-orders",
        "view-history"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "warehouse_lead",
      "resource": "task_assignment",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "complete",
        "escalate"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "technician",
      "resource": "approval_request",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "technician",
      "resource": "shipment_order",
      "actions": [
        "read",
        "update",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "technician",
      "resource": "service_ticket",
      "actions": [
        "read",
        "update",
        "resolve"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "technician",
      "resource": "inventory_item",
      "actions": [
        "read",
        "update"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "technician",
      "resource": "account",
      "actions": [
        "read",
        "update"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "technician",
      "resource": "task_assignment",
      "actions": [
        "read",
        "update",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "account_manager",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": [
        "approve"
      ]
    },
    {
      "roleKey": "account_manager",
      "resource": "shipment_order",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "reschedule",
        "complete"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    },
    {
      "roleKey": "account_manager",
      "resource": "service_ticket",
      "actions": [
        "create",
        "read",
        "update",
        "triage",
        "resolve",
        "reopen"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "account_manager",
      "resource": "inventory_item",
      "actions": [
        "create",
        "read",
        "update",
        "transfer",
        "mark-ready",
        "retire"
      ],
      "approvalRequiredFor": [
        "retire"
      ]
    },
    {
      "roleKey": "account_manager",
      "resource": "account",
      "actions": [
        "create",
        "read",
        "update",
        "link-orders",
        "view-history"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "account_manager",
      "resource": "task_assignment",
      "actions": [
        "create",
        "read",
        "update",
        "assign",
        "complete",
        "escalate"
      ],
      "approvalRequiredFor": [
        "assign",
        "complete"
      ]
    }
  ],
  "integrations": [
    {
      "key": "identity_provider",
      "name": "Enterprise Identity Provider",
      "category": "identity",
      "mode": "future-ready",
      "direction": "inbound",
      "notes": "Prefer SAML or OIDC at deployment time, but do not hard-code provider assumptions."
    },
    {
      "key": "email_notifications",
      "name": "Email Notifications",
      "category": "notifications",
      "mode": "active",
      "direction": "outbound",
      "notes": "Keep templates editable and route secret ownership through environment-configured providers."
    },
    {
      "key": "csv_exchange",
      "name": "CSV Exchange",
      "category": "files",
      "mode": "active",
      "direction": "bidirectional",
      "notes": "Bulk import and export must remain approval-gated when they mutate multiple records."
    },
    {
      "key": "erp_sync",
      "name": "ERP Sync",
      "category": "erp",
      "mode": "future-ready",
      "direction": "bidirectional",
      "notes": "Expose contract-first sync boundaries and hold credentials outside generated code."
    }
  ],
  "complianceRequirements": [
    {
      "key": "tenant-isolation",
      "name": "Tenant Isolation",
      "rationale": "Generated apps must remain safe to run for multiple customers or business units.",
      "controls": [
        "Tenant-scoped entities",
        "Role-aware data access",
        "Explicit environment boundaries"
      ]
    },
    {
      "key": "audit-evidence",
      "name": "Audit Evidence",
      "rationale": "Meaningful workflow events must stay attributable and reviewable.",
      "controls": [
        "Append-only audit stream",
        "Actor attribution",
        "Approval decision capture"
      ]
    },
    {
      "key": "health-operations-traceability",
      "name": "Healthcare Operations Traceability",
      "rationale": "Medical logistics flows need asset, chain-of-custody, and service history visibility.",
      "controls": [
        "Regional tenant boundaries",
        "Audit log on inventory and service changes",
        "Approval gate for urgent replacements"
      ]
    }
  ],
  "navigation": [
    {
      "key": "dashboard",
      "label": "Operations Dashboard",
      "route": "/dashboard",
      "moduleKey": "dashboard",
      "requiredRoles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "auditor"
      ]
    },
    {
      "key": "entity-workbench",
      "label": "Entity Workbench",
      "route": "/entities",
      "moduleKey": "entity-workbench",
      "requiredRoles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "warehouse_lead",
        "technician"
      ]
    },
    {
      "key": "workflow-orchestrator",
      "label": "Workflow Orchestrator",
      "route": "/workflows",
      "moduleKey": "workflow-orchestrator",
      "requiredRoles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "warehouse_lead",
        "technician"
      ]
    },
    {
      "key": "approvals",
      "label": "Approval Center",
      "route": "/approvals",
      "moduleKey": "approvals",
      "requiredRoles": [
        "platform_admin",
        "operations_manager",
        "approver",
        "auditor"
      ]
    },
    {
      "key": "audit",
      "label": "Audit Stream",
      "route": "/audit",
      "moduleKey": "audit",
      "requiredRoles": [
        "platform_admin",
        "operations_manager",
        "auditor"
      ]
    },
    {
      "key": "roles",
      "label": "Roles and Access",
      "route": "/roles",
      "moduleKey": "roles",
      "requiredRoles": [
        "platform_admin",
        "operations_manager",
        "auditor"
      ]
    },
    {
      "key": "integrations",
      "label": "Integrations",
      "route": "/integrations",
      "moduleKey": "integrations",
      "requiredRoles": [
        "platform_admin",
        "operations_manager"
      ]
    },
    {
      "key": "notifications",
      "label": "Notifications",
      "route": "/notifications",
      "moduleKey": "notifications",
      "requiredRoles": [
        "platform_admin",
        "operations_manager"
      ]
    },
    {
      "key": "reports",
      "label": "Reports",
      "route": "/reports",
      "moduleKey": "reports",
      "requiredRoles": [
        "platform_admin",
        "operations_manager",
        "auditor",
        "reporting_analyst"
      ]
    },
    {
      "key": "settings",
      "label": "Settings",
      "route": "/settings",
      "moduleKey": "settings",
      "requiredRoles": [
        "platform_admin",
        "operations_manager"
      ]
    },
    {
      "key": "dispatch-board",
      "label": "Dispatch Board",
      "route": "/dispatch",
      "moduleKey": "dispatch-board",
      "requiredRoles": [
        "dispatch_coordinator",
        "operations_manager",
        "technician"
      ]
    },
    {
      "key": "inventory-readiness",
      "label": "Inventory Readiness",
      "route": "/inventory",
      "moduleKey": "inventory-readiness",
      "requiredRoles": [
        "warehouse_lead",
        "operations_manager",
        "technician"
      ]
    },
    {
      "key": "service-ticket-console",
      "label": "Service Ticket Console",
      "route": "/service-tickets",
      "moduleKey": "service-ticket-console",
      "requiredRoles": [
        "dispatch_coordinator",
        "technician",
        "operations_manager"
      ]
    },
    {
      "key": "account-operations",
      "label": "Account Operations",
      "route": "/accounts",
      "moduleKey": "account-operations",
      "requiredRoles": [
        "account_manager",
        "operations_manager",
        "dispatch_coordinator"
      ]
    },
    {
      "key": "task-assignment",
      "label": "Task Assignment Board",
      "route": "/tasks",
      "moduleKey": "task-assignment",
      "requiredRoles": [
        "technician",
        "dispatch_coordinator",
        "operations_manager"
      ]
    }
  ],
  "uiModules": [
    {
      "key": "dashboard",
      "name": "Operations Dashboard",
      "purpose": "Give operators a live view of workload, approvals, risk, and throughput.",
      "route": "/dashboard",
      "primitive": "kpi-ribbon-and-ops-board",
      "roles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "auditor"
      ]
    },
    {
      "key": "entity-workbench",
      "name": "Entity Workbench",
      "purpose": "Manage business entities through typed forms, tables, and detail views.",
      "route": "/entities",
      "primitive": "crud-grid-with-detail-rail",
      "roles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "warehouse_lead",
        "technician"
      ]
    },
    {
      "key": "workflow-orchestrator",
      "name": "Workflow Orchestrator",
      "purpose": "Track multi-step operational flows with visible ownership and escalation.",
      "route": "/workflows",
      "primitive": "timeline-with-stage-actions",
      "roles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "warehouse_lead",
        "technician"
      ]
    },
    {
      "key": "approvals",
      "name": "Approval Center",
      "purpose": "Keep irreversible actions behind explicit review and audit events.",
      "route": "/approvals",
      "primitive": "approval-queue",
      "roles": [
        "platform_admin",
        "operations_manager",
        "approver",
        "auditor"
      ]
    },
    {
      "key": "audit",
      "name": "Audit Stream",
      "purpose": "Trace meaningful workflow events and changes across the tenant boundary.",
      "route": "/audit",
      "primitive": "append-only-event-log",
      "roles": [
        "platform_admin",
        "operations_manager",
        "auditor"
      ]
    },
    {
      "key": "roles",
      "name": "Roles and Access",
      "purpose": "Review least-privilege access and approval scopes by role.",
      "route": "/roles",
      "primitive": "permissions-matrix",
      "roles": [
        "platform_admin",
        "operations_manager",
        "auditor"
      ]
    },
    {
      "key": "integrations",
      "name": "Integrations",
      "purpose": "Make sync boundaries, credential ownership, and failure modes explicit.",
      "route": "/integrations",
      "primitive": "integration-registry",
      "roles": [
        "platform_admin",
        "operations_manager"
      ]
    },
    {
      "key": "notifications",
      "name": "Notifications",
      "purpose": "Configure operator-facing rules and escalation paths.",
      "route": "/notifications",
      "primitive": "rules-and-routing",
      "roles": [
        "platform_admin",
        "operations_manager"
      ]
    },
    {
      "key": "reports",
      "name": "Reports",
      "purpose": "Expose operational summaries and trend views for review.",
      "route": "/reports",
      "primitive": "report-catalog",
      "roles": [
        "platform_admin",
        "operations_manager",
        "auditor",
        "reporting_analyst"
      ]
    },
    {
      "key": "settings",
      "name": "Settings",
      "purpose": "Handle tenant-aware configuration without hard-coding secrets or approvals.",
      "route": "/settings",
      "primitive": "settings-rail",
      "roles": [
        "platform_admin",
        "operations_manager"
      ]
    },
    {
      "key": "dispatch-board",
      "name": "Dispatch Board",
      "purpose": "A dispatch-focused board for delivery, pickup, and field-routing work.",
      "route": "/dispatch",
      "primitive": "dispatch-kanban",
      "roles": [
        "dispatch_coordinator",
        "operations_manager",
        "technician"
      ]
    },
    {
      "key": "inventory-readiness",
      "name": "Inventory Readiness",
      "purpose": "Show warehouse readiness, cleaning status, and movement events.",
      "route": "/inventory",
      "primitive": "readiness-board",
      "roles": [
        "warehouse_lead",
        "operations_manager",
        "technician"
      ]
    },
    {
      "key": "service-ticket-console",
      "name": "Service Ticket Console",
      "purpose": "Review service request intake, ownership, and field resolution state.",
      "route": "/service-tickets",
      "primitive": "ticket-console",
      "roles": [
        "dispatch_coordinator",
        "technician",
        "operations_manager"
      ]
    },
    {
      "key": "account-operations",
      "name": "Account Operations",
      "purpose": "Account-level visibility for service history, regions, and risk.",
      "route": "/accounts",
      "primitive": "account-summary-board",
      "roles": [
        "account_manager",
        "operations_manager",
        "dispatch_coordinator"
      ]
    },
    {
      "key": "task-assignment",
      "name": "Task Assignment Board",
      "purpose": "Track technician and operator assignments with due dates and escalation paths.",
      "route": "/tasks",
      "primitive": "assignment-board",
      "roles": [
        "technician",
        "dispatch_coordinator",
        "operations_manager"
      ]
    }
  ],
  "moduleSelections": [
    {
      "key": "dashboard",
      "name": "Operations Dashboard",
      "route": "/dashboard",
      "kind": "dashboard",
      "source": "base",
      "reason": "Selected from core compiler coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "auditor"
      ],
      "domainTags": [
        "core",
        "operations"
      ],
      "editableSurfaces": [
        "page title",
        "metric definitions",
        "alert copy"
      ]
    },
    {
      "key": "entity-workbench",
      "name": "Entity Workbench",
      "route": "/entities",
      "kind": "data",
      "source": "base",
      "reason": "Selected from core compiler coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "warehouse_lead",
        "technician"
      ],
      "domainTags": [
        "core",
        "data"
      ],
      "editableSurfaces": [
        "field labels",
        "empty states",
        "table density",
        "filter presets"
      ]
    },
    {
      "key": "workflow-orchestrator",
      "name": "Workflow Orchestrator",
      "route": "/workflows",
      "kind": "workflow",
      "source": "base",
      "reason": "Selected from core compiler coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "warehouse_lead",
        "technician"
      ],
      "domainTags": [
        "core",
        "workflow"
      ],
      "editableSurfaces": [
        "stage labels",
        "escalation copy",
        "checklist text"
      ]
    },
    {
      "key": "approvals",
      "name": "Approval Center",
      "route": "/approvals",
      "kind": "approval",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager",
        "approver",
        "auditor"
      ],
      "domainTags": [
        "core",
        "governance"
      ],
      "editableSurfaces": [
        "decision prompts",
        "risk labels",
        "approval instructions"
      ]
    },
    {
      "key": "audit",
      "name": "Audit Stream",
      "route": "/audit",
      "kind": "audit",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager",
        "auditor"
      ],
      "domainTags": [
        "core",
        "governance"
      ],
      "editableSurfaces": [
        "audit copy",
        "filter presets",
        "export labels"
      ]
    },
    {
      "key": "roles",
      "name": "Roles and Access",
      "route": "/roles",
      "kind": "access",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager",
        "auditor"
      ],
      "domainTags": [
        "core",
        "governance"
      ],
      "editableSurfaces": [
        "permission labels",
        "approval scope notes",
        "role summaries"
      ]
    },
    {
      "key": "integrations",
      "name": "Integrations",
      "route": "/integrations",
      "kind": "integration",
      "source": "base",
      "reason": "Selected from core compiler coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager"
      ],
      "domainTags": [
        "core",
        "integration"
      ],
      "editableSurfaces": [
        "integration notes",
        "adapter policy copy",
        "sync labels"
      ]
    },
    {
      "key": "notifications",
      "name": "Notifications",
      "route": "/notifications",
      "kind": "notification",
      "source": "base",
      "reason": "Selected from core compiler coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager"
      ],
      "domainTags": [
        "core",
        "operations"
      ],
      "editableSurfaces": [
        "notification copy",
        "channel labels",
        "escalation notes"
      ]
    },
    {
      "key": "reports",
      "name": "Reports",
      "route": "/reports",
      "kind": "reporting",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager",
        "auditor",
        "reporting_analyst"
      ],
      "domainTags": [
        "core",
        "analytics"
      ],
      "editableSurfaces": [
        "report titles",
        "metric descriptions",
        "cadence copy"
      ]
    },
    {
      "key": "settings",
      "name": "Settings",
      "route": "/settings",
      "kind": "settings",
      "source": "base",
      "reason": "Selected from core compiler coverage for the requested workflows and operators.",
      "roles": [
        "platform_admin",
        "operations_manager"
      ],
      "domainTags": [
        "core",
        "admin"
      ],
      "editableSurfaces": [
        "settings section copy",
        "tenant policy notes",
        "branding controls"
      ]
    },
    {
      "key": "dispatch-board",
      "name": "Dispatch Board",
      "route": "/dispatch",
      "kind": "workflow",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "dispatch_coordinator",
        "operations_manager",
        "technician"
      ],
      "domainTags": [
        "logistics",
        "field-service"
      ],
      "editableSurfaces": [
        "dispatch columns",
        "route copy",
        "priority badges"
      ]
    },
    {
      "key": "inventory-readiness",
      "name": "Inventory Readiness",
      "route": "/inventory",
      "kind": "data",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "warehouse_lead",
        "operations_manager",
        "technician"
      ],
      "domainTags": [
        "warehouse",
        "logistics"
      ],
      "editableSurfaces": [
        "status chips",
        "readiness copy",
        "storage views"
      ]
    },
    {
      "key": "service-ticket-console",
      "name": "Service Ticket Console",
      "route": "/service-tickets",
      "kind": "workflow",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "dispatch_coordinator",
        "technician",
        "operations_manager"
      ],
      "domainTags": [
        "field-service",
        "support"
      ],
      "editableSurfaces": [
        "ticket status labels",
        "triage prompts",
        "resolution copy"
      ]
    },
    {
      "key": "account-operations",
      "name": "Account Operations",
      "route": "/accounts",
      "kind": "data",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "account_manager",
        "operations_manager",
        "dispatch_coordinator"
      ],
      "domainTags": [
        "accounts",
        "customer-ops"
      ],
      "editableSurfaces": [
        "account summary copy",
        "region groupings",
        "service-tier labels"
      ]
    },
    {
      "key": "task-assignment",
      "name": "Task Assignment Board",
      "route": "/tasks",
      "kind": "workflow",
      "source": "domain-pack",
      "reason": "Selected from domain pack coverage for the requested workflows and operators.",
      "roles": [
        "technician",
        "dispatch_coordinator",
        "operations_manager"
      ],
      "domainTags": [
        "field-service",
        "operations"
      ],
      "editableSurfaces": [
        "task grouping",
        "assignment copy",
        "priority thresholds"
      ]
    }
  ],
  "adapterBindings": [
    {
      "key": "design-handoff-adapter",
      "name": "Design Handoff Adapter",
      "mode": "active",
      "status": "selected",
      "reason": "Exports a Figma-friendly design handoff package without making design tooling a runtime dependency.",
      "reviewNotes": [
        "Factory-owned export/import boundary only. Generation must still succeed when no external design adapter is configured.",
        "Export/import warnings remain visible to the operator and do not block spec parsing or generation."
      ]
    },
    {
      "key": "figma-bridge-adapter",
      "name": "Figma Bridge Adapter",
      "mode": "optional",
      "status": "optional",
      "reason": "Optional adapter boundary for future Figma API or MCP integration.",
      "reviewNotes": [
        "Adapter-only. No generated app or operator workflow may hard-require Figma availability.",
        "Gracefully degrade to the local design handoff package and surface a non-blocking warning."
      ]
    },
    {
      "key": "notification-router-adapter",
      "name": "Notification Router Adapter",
      "mode": "active",
      "status": "selected",
      "reason": "Maps notification rules to provider-neutral routing without baking secrets into generated code.",
      "reviewNotes": [
        "Notification sending is owned by the deployed customer app and its environment configuration.",
        "Generation keeps working and the generated app shows unresolved destinations until configured."
      ]
    },
    {
      "key": "identity-provider-adapter",
      "name": "Identity Provider Adapter",
      "mode": "future-ready",
      "status": "deferred",
      "reason": "Keeps SSO/IdP selection explicit without hard-coding provider assumptions.",
      "reviewNotes": [
        "Factory records the boundary and generated apps implement the final auth integration.",
        "Stay in deferred status until provider, redirect URIs, and tenant mapping are confirmed."
      ]
    },
    {
      "key": "csv-batch-gateway",
      "name": "CSV Batch Gateway",
      "mode": "active",
      "status": "selected",
      "reason": "Supports typed CSV import/export contracts with approval review for multi-record mutations.",
      "reviewNotes": [
        "Generated apps own batch persistence and execution; the factory only scaffolds the contract and review posture.",
        "Import stays blocked behind visible validation errors or approval requirements."
      ]
    },
    {
      "key": "erp-sync-sdk",
      "name": "ERP Sync SDK",
      "mode": "future-ready",
      "status": "deferred",
      "reason": "Defines a contract-first ERP adapter boundary with explicit approval and persistence ownership.",
      "reviewNotes": [
        "Generated apps own business writes; the adapter contract only describes how approved syncs should behave.",
        "Deferred until the customer confirms vendor, field mapping, direction, and approval posture."
      ]
    }
  ],
  "dataModel": {
    "tables": [
      {
        "name": "approval_request",
        "purpose": "Captures explicitly gated actions and the justification behind them.",
        "owner": "governance",
        "columns": [
          "requestType",
          "requestedBy",
          "riskLevel",
          "decisionState"
        ]
      },
      {
        "name": "shipment_order",
        "purpose": "Tracks delivery and pickup obligations, timing, and status.",
        "owner": "operations",
        "columns": [
          "orderNumber",
          "serviceWindow",
          "status",
          "priority"
        ]
      },
      {
        "name": "service_ticket",
        "purpose": "Captures customer-reported work, triage, and resolution state.",
        "owner": "operations",
        "columns": [
          "ticketNumber",
          "issueType",
          "requestedBy",
          "resolutionState"
        ]
      },
      {
        "name": "inventory_item",
        "purpose": "Represents equipment, readiness state, and warehouse location.",
        "owner": "warehouse",
        "columns": [
          "assetTag",
          "currentLocation",
          "readinessState",
          "condition"
        ]
      },
      {
        "name": "account",
        "purpose": "Represents a customer account, service profile, and regional footprint.",
        "owner": "customer-ops",
        "columns": [
          "accountName",
          "region",
          "serviceTier",
          "status"
        ]
      },
      {
        "name": "task_assignment",
        "purpose": "Assigns operational work to a person or team with due dates and evidence.",
        "owner": "operations",
        "columns": [
          "taskCode",
          "assignedTo",
          "dueAt",
          "state"
        ]
      }
    ],
    "relationships": [
      {
        "from": "approval_request",
        "to": "inventory_item",
        "relationship": "references"
      },
      {
        "from": "approval_request",
        "to": "service_ticket",
        "relationship": "references"
      },
      {
        "from": "approval_request",
        "to": "shipment_order",
        "relationship": "references"
      },
      {
        "from": "shipment_order",
        "to": "account",
        "relationship": "references"
      },
      {
        "from": "shipment_order",
        "to": "service_ticket",
        "relationship": "references"
      },
      {
        "from": "shipment_order",
        "to": "task_assignment",
        "relationship": "references"
      },
      {
        "from": "shipment_order",
        "to": "inventory_item",
        "relationship": "references"
      },
      {
        "from": "service_ticket",
        "to": "account",
        "relationship": "references"
      },
      {
        "from": "service_ticket",
        "to": "task_assignment",
        "relationship": "references"
      },
      {
        "from": "service_ticket",
        "to": "approval_request",
        "relationship": "references"
      },
      {
        "from": "inventory_item",
        "to": "shipment_order",
        "relationship": "references"
      },
      {
        "from": "inventory_item",
        "to": "service_ticket",
        "relationship": "references"
      },
      {
        "from": "inventory_item",
        "to": "approval_request",
        "relationship": "references"
      },
      {
        "from": "account",
        "to": "shipment_order",
        "relationship": "references"
      },
      {
        "from": "account",
        "to": "service_ticket",
        "relationship": "references"
      },
      {
        "from": "account",
        "to": "report_snapshot",
        "relationship": "references"
      },
      {
        "from": "task_assignment",
        "to": "service_ticket",
        "relationship": "references"
      },
      {
        "from": "task_assignment",
        "to": "shipment_order",
        "relationship": "references"
      },
      {
        "from": "task_assignment",
        "to": "account",
        "relationship": "references"
      }
    ]
  },
  "apiDraft": {
    "endpoints": [
      {
        "method": "GET",
        "path": "/api/approval_request",
        "purpose": "List Approval Request records",
        "roles": [
          "platform_admin",
          "operations_manager"
        ]
      },
      {
        "method": "POST",
        "path": "/api/approval_request",
        "purpose": "Create Approval Request records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator"
        ]
      },
      {
        "method": "PATCH",
        "path": "/api/approval_request/:id",
        "purpose": "Update Approval Request records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator",
          "warehouse_lead",
          "technician"
        ]
      },
      {
        "method": "GET",
        "path": "/api/shipment_order",
        "purpose": "List Shipment Order records",
        "roles": [
          "platform_admin",
          "operations_manager"
        ]
      },
      {
        "method": "POST",
        "path": "/api/shipment_order",
        "purpose": "Create Shipment Order records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator"
        ]
      },
      {
        "method": "PATCH",
        "path": "/api/shipment_order/:id",
        "purpose": "Update Shipment Order records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator",
          "warehouse_lead",
          "technician"
        ]
      },
      {
        "method": "GET",
        "path": "/api/service_ticket",
        "purpose": "List Service Ticket records",
        "roles": [
          "platform_admin",
          "operations_manager"
        ]
      },
      {
        "method": "POST",
        "path": "/api/service_ticket",
        "purpose": "Create Service Ticket records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator"
        ]
      },
      {
        "method": "PATCH",
        "path": "/api/service_ticket/:id",
        "purpose": "Update Service Ticket records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator",
          "warehouse_lead",
          "technician"
        ]
      },
      {
        "method": "GET",
        "path": "/api/inventory_item",
        "purpose": "List Inventory Item records",
        "roles": [
          "platform_admin",
          "operations_manager"
        ]
      },
      {
        "method": "POST",
        "path": "/api/inventory_item",
        "purpose": "Create Inventory Item records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator"
        ]
      },
      {
        "method": "PATCH",
        "path": "/api/inventory_item/:id",
        "purpose": "Update Inventory Item records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator",
          "warehouse_lead",
          "technician"
        ]
      },
      {
        "method": "GET",
        "path": "/api/account",
        "purpose": "List Account records",
        "roles": [
          "platform_admin",
          "operations_manager"
        ]
      },
      {
        "method": "POST",
        "path": "/api/account",
        "purpose": "Create Account records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator"
        ]
      },
      {
        "method": "PATCH",
        "path": "/api/account/:id",
        "purpose": "Update Account records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator",
          "warehouse_lead",
          "technician"
        ]
      },
      {
        "method": "GET",
        "path": "/api/task_assignment",
        "purpose": "List Task Assignment records",
        "roles": [
          "platform_admin",
          "operations_manager"
        ]
      },
      {
        "method": "POST",
        "path": "/api/task_assignment",
        "purpose": "Create Task Assignment records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator"
        ]
      },
      {
        "method": "PATCH",
        "path": "/api/task_assignment/:id",
        "purpose": "Update Task Assignment records",
        "roles": [
          "platform_admin",
          "operations_manager",
          "dispatch_coordinator",
          "warehouse_lead",
          "technician"
        ]
      },
      {
        "method": "POST",
        "path": "/api/workflows/reporting/advance",
        "purpose": "Advance the Reporting and Sync Review workflow",
        "roles": [
          "operations_manager",
          "reporting_analyst",
          "platform_admin"
        ]
      },
      {
        "method": "POST",
        "path": "/api/workflows/approval/advance",
        "purpose": "Advance the Exception and Approval Flow workflow",
        "roles": [
          "operations_manager",
          "approver",
          "auditor"
        ],
        "approvalGateKey": "urgent-replacement"
      },
      {
        "method": "POST",
        "path": "/api/workflows/dispatch/advance",
        "purpose": "Advance the Dispatch and Fulfillment workflow",
        "roles": [
          "dispatch_coordinator",
          "technician",
          "operations_manager"
        ]
      },
      {
        "method": "POST",
        "path": "/api/workflows/inventory/advance",
        "purpose": "Advance the Inventory and Readiness Flow workflow",
        "roles": [
          "warehouse_lead",
          "technician",
          "operations_manager"
        ],
        "approvalGateKey": "inventory-disposition"
      },
      {
        "method": "POST",
        "path": "/api/workflows/service_resolution/advance",
        "purpose": "Advance the Service Resolution workflow",
        "roles": [
          "dispatch_coordinator",
          "technician",
          "operations_manager"
        ]
      },
      {
        "method": "POST",
        "path": "/api/approvals/urgent-replacement/decision",
        "purpose": "Approve or reject Urgent Replacement Approval",
        "roles": [
          "operations_manager",
          "approver"
        ],
        "approvalGateKey": "urgent-replacement"
      },
      {
        "method": "POST",
        "path": "/api/approvals/inventory-disposition/decision",
        "purpose": "Approve or reject Inventory Disposition Approval",
        "roles": [
          "operations_manager",
          "approver"
        ],
        "approvalGateKey": "inventory-disposition"
      },
      {
        "method": "POST",
        "path": "/api/approvals/bulk-import/decision",
        "purpose": "Approve or reject Bulk Import Approval",
        "roles": [
          "platform_admin",
          "operations_manager"
        ],
        "approvalGateKey": "bulk-import"
      },
      {
        "method": "POST",
        "path": "/api/approvals/rbac-change/decision",
        "purpose": "Approve or reject Role and Permission Change Approval",
        "roles": [
          "platform_admin",
          "auditor"
        ],
        "approvalGateKey": "rbac-change"
      },
      {
        "method": "POST",
        "path": "/api/approvals/urgent-replacement-approval/decision",
        "purpose": "Approve or reject Urgent replacement approval",
        "roles": [
          "operations_manager",
          "approver"
        ],
        "approvalGateKey": "urgent-replacement-approval"
      },
      {
        "method": "POST",
        "path": "/api/approvals/bulk-inventory-changes/decision",
        "purpose": "Approve or reject Bulk inventory changes",
        "roles": [
          "operations_manager",
          "approver"
        ],
        "approvalGateKey": "bulk-inventory-changes"
      }
    ]
  },
  "automationOpportunities": [
    {
      "key": "sla-escalation",
      "name": "SLA Escalation",
      "trigger": "Workflow step exceeds its target window",
      "outcome": "Create an escalation task and notify the owning operations manager",
      "humanReview": "Manager confirms reschedule or override action"
    },
    {
      "key": "digest-report",
      "name": "Daily Operations Digest",
      "trigger": "Start or end of operational day",
      "outcome": "Summarize key throughput, backlog, approvals, and blocked work",
      "humanReview": "Operator reviews before external distribution"
    },
    {
      "key": "adapter-health-review",
      "name": "Adapter Health Review",
      "trigger": "A configured adapter misses a sync, export, or notification run",
      "outcome": "Surface a visible recovery TODO instead of silently mutating customer state",
      "humanReview": "Operator approves recovery or retry steps"
    }
  ],
  "approvalGates": [
    {
      "key": "urgent-replacement",
      "name": "Urgent Replacement Approval",
      "description": "Require explicit approval before replacing or issuing high-priority equipment outside normal planning.",
      "risk": "high",
      "trigger": "A workflow requests an urgent replacement, swap, or status override.",
      "requiredRoles": [
        "operations_manager",
        "approver"
      ],
      "auditEvent": "approval.urgent_replacement.reviewed"
    },
    {
      "key": "inventory-disposition",
      "name": "Inventory Disposition Approval",
      "description": "Protect retirement, disposal, or write-off actions for tenant-scoped inventory.",
      "risk": "critical",
      "trigger": "An operator attempts to retire, dispose, or write off tracked equipment.",
      "requiredRoles": [
        "operations_manager",
        "approver"
      ],
      "auditEvent": "approval.inventory_disposition.reviewed"
    },
    {
      "key": "bulk-import",
      "name": "Bulk Import Approval",
      "description": "Review bulk CSV changes before mutating large sets of business records.",
      "risk": "high",
      "trigger": "A CSV or integration batch affects multiple tenant-scoped records.",
      "requiredRoles": [
        "platform_admin",
        "operations_manager"
      ],
      "auditEvent": "approval.bulk_import.reviewed"
    },
    {
      "key": "rbac-change",
      "name": "Role and Permission Change Approval",
      "description": "Review least-privilege changes that expand access or approval authority.",
      "risk": "high",
      "trigger": "An admin modifies role definitions, privileged permissions, or approval scopes.",
      "requiredRoles": [
        "platform_admin",
        "auditor"
      ],
      "auditEvent": "approval.rbac_change.reviewed"
    },
    {
      "key": "urgent-replacement-approval",
      "name": "Urgent replacement approval",
      "description": "Operator-requested approval guardrail for Urgent replacement approval.",
      "risk": "high",
      "trigger": "Any workflow action classified as Urgent replacement approval.",
      "requiredRoles": [
        "operations_manager",
        "approver"
      ],
      "auditEvent": "approval.urgent-replacement-approval.reviewed"
    },
    {
      "key": "bulk-inventory-changes",
      "name": "Bulk inventory changes",
      "description": "Operator-requested approval guardrail for Bulk inventory changes.",
      "risk": "high",
      "trigger": "Any workflow action classified as Bulk inventory changes.",
      "requiredRoles": [
        "operations_manager",
        "approver"
      ],
      "auditEvent": "approval.bulk-inventory-changes.reviewed"
    }
  ],
  "notificationRules": [
    {
      "key": "approval-needed",
      "name": "Approval Needed",
      "trigger": "A gated workflow action enters pending approval",
      "channel": "email-or-in-app",
      "escalation": "Escalate to the next approver after SLA breach"
    },
    {
      "key": "workflow-at-risk",
      "name": "Workflow At Risk",
      "trigger": "A dispatch or service workflow crosses its risk threshold",
      "channel": "in-app",
      "escalation": "Notify operations manager and attach audit context"
    }
  ],
  "reportingViews": [
    {
      "key": "throughput",
      "name": "Operational Throughput",
      "purpose": "Show workload movement, completion rates, and backlog shape.",
      "cadence": "daily"
    },
    {
      "key": "approval-latency",
      "name": "Approval Latency",
      "purpose": "Track time-to-decision for gated actions.",
      "cadence": "weekly"
    },
    {
      "key": "adapter-health",
      "name": "Adapter Health",
      "purpose": "Track adapter failures, deferred integrations, and operational recovery needs.",
      "cadence": "daily"
    }
  ],
  "settingsSections": [
    {
      "key": "tenant-config",
      "name": "Tenant Configuration",
      "purpose": "Manage branding, regional defaults, and workflow policies.",
      "owners": [
        "platform_admin",
        "operations_manager"
      ]
    },
    {
      "key": "access-policy",
      "name": "Access Policy",
      "purpose": "Review role-to-permission mapping and approval scopes.",
      "owners": [
        "platform_admin",
        "auditor"
      ]
    },
    {
      "key": "integration-routing",
      "name": "Integration Routing",
      "purpose": "Configure sync schedules, file exchange, and notification pathways.",
      "owners": [
        "platform_admin",
        "operations_manager"
      ]
    },
    {
      "key": "adapter-policy",
      "name": "Adapter Policy",
      "purpose": "Review adapter configuration, boundary rules, and deferred integrations.",
      "owners": [
        "platform_admin",
        "operations_manager",
        "auditor"
      ]
    }
  ],
  "assumptions": [
    "Generated apps use tenant-scoped application data and do not persist shared runtime-owned business state in automindlab-stack.",
    "Secrets, provider credentials, and customer-specific deployment values are injected through environment or deployment config only.",
    "Approval-gated actions remain blocked until an authenticated operator approves them in the generated app.",
    "The compiler assembles apps from module registry entries, domain packs, and adapter manifests rather than free-form code generation.",
    "ERP support remains contract-first until vendor, field mapping, and approval posture are confirmed.",
    "Figma support stays adapter-based and optional; generation never depends on it."
  ],
  "unresolvedItems": [
    "Select the customer identity provider and login method for production deployment.",
    "Confirm tenant partition strategy across regions and environments.",
    "Confirm notification destinations and escalation targets.",
    "Define record retention windows for audit and workflow history.",
    "Choose the ERP vendor, sync direction, and approved field-level contract.",
    "Decide whether a future Figma bridge adapter should be configured or left optional."
  ],
  "uncertainty": {
    "level": "low",
    "reasons": [
      "The compiler is deterministic and typed, but some customer deployment and adapter choices remain open on purpose.",
      "At least one requested integration is represented as a future-ready contract placeholder, not a live connection.",
      "At least one adapter remains deferred until customer-specific configuration is confirmed."
    ],
    "missingContext": [
      "Select the customer identity provider and login method for production deployment.",
      "Confirm tenant partition strategy across regions and environments.",
      "Confirm notification destinations and escalation targets.",
      "Define record retention windows for audit and workflow history.",
      "Choose the ERP vendor, sync direction, and approved field-level contract.",
      "Decide whether a future Figma bridge adapter should be configured or left optional."
    ],
    "operatorQuestions": [
      "Select the customer identity provider and login method for production deployment.",
      "Confirm tenant partition strategy across regions and environments.",
      "Confirm notification destinations and escalation targets.",
      "Define record retention windows for audit and workflow history."
    ]
  },
  "blueprint": {
    "layout": "Three-zone operator workspace with navigation rail, primary execution surface, and contextual audit and approval rail.",
    "routeGroups": [
      "/dashboard",
      "/entities",
      "/workflows",
      "/approvals",
      "/audit",
      "/roles",
      "/integrations",
      "/notifications",
      "/reports",
      "/settings",
      "/dispatch",
      "/inventory",
      "/service-tickets",
      "/accounts",
      "/tasks"
    ],
    "reusablePrimitives": [
      "kpi-ribbon-and-ops-board",
      "crud-grid-with-detail-rail",
      "timeline-with-stage-actions",
      "approval-queue",
      "append-only-event-log",
      "permissions-matrix",
      "integration-registry",
      "rules-and-routing",
      "report-catalog",
      "settings-rail",
      "dispatch-kanban",
      "readiness-board",
      "ticket-console",
      "account-summary-board",
      "assignment-board"
    ],
    "backgroundOperations": [
      "generation job tracking",
      "verification command orchestration",
      "design handoff packaging",
      "eval summary generation",
      "reporting-workflow-monitor",
      "approval-workflow-monitor",
      "dispatch-workflow-monitor",
      "inventory-workflow-monitor",
      "service_resolution-workflow-monitor"
    ],
    "observability": [
      "file-backed job logs",
      "audit event append log",
      "visible verification step results",
      "health endpoint with service status",
      "compiler eval summary"
    ],
    "persistenceOwnership": "Generated customer apps own their own business records, workflow outcomes, and approval decisions. The factory only owns advisory specs, compiler metadata, job metadata, and generation artifacts."
  }
};
