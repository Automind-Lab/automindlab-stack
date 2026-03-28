import type { GeneratedAppSpec } from "../types.js";

export const appSpec: GeneratedAppSpec = {
  "schemaVersion": "2026-03-27.v1",
  "generatedAt": "2026-03-28T02:30:09.509Z",
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
  "summary": "Northstar Medical Logistics needs an internal enterprise app built from reusable primitives for Build an internal operations app with dispatch dashboard, service tickets, pickup and delivery workflows, warehouse inventory status, hospital account views, technician task assignments, approvals for urgent replacements, audit logs, role-based access, and reporting. Include admin settings, notification rules, CSV import and export, and future ERP integration support.",
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
    }
  ],
  "businessEntities": [
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
    },
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
        "entities",
        "workflows",
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
        "entities",
        "workflows",
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
      "key": "dispatch_coordinator",
      "name": "Dispatch Coordinator",
      "description": "Coordinates field work, routing, and schedule changes.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "entities",
        "workflows",
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
        "entities",
        "workflows",
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
        "entities",
        "workflows"
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
        "entities",
        "reports"
      ],
      "responsibilities": [
        "Monitor account health",
        "Review service history"
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
      "key": "dispatch-coordinator",
      "name": "Dispatch Coordinator",
      "description": "Explicitly requested role for Northstar Medical Logistics.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "entities",
        "workflows"
      ],
      "responsibilities": [
        "Role-specific operational work"
      ],
      "approvalScope": []
    },
    {
      "key": "warehouse-lead",
      "name": "Warehouse Lead",
      "description": "Explicitly requested role for Northstar Medical Logistics.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "entities",
        "workflows"
      ],
      "responsibilities": [
        "Role-specific operational work"
      ],
      "approvalScope": []
    },
    {
      "key": "account-manager",
      "name": "Account Manager",
      "description": "Explicitly requested role for Northstar Medical Logistics.",
      "inheritsFrom": [],
      "visibleModules": [
        "dashboard",
        "entities",
        "workflows"
      ],
      "responsibilities": [
        "Role-specific operational work"
      ],
      "approvalScope": []
    }
  ],
  "permissions": [
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
      "roleKey": "platform_admin",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
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
      "roleKey": "operations_manager",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
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
      "roleKey": "approver",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
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
      "roleKey": "auditor",
      "resource": "approval_request",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": []
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
      "roleKey": "dispatch_coordinator",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
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
      "roleKey": "warehouse_lead",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
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
        "update"
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
      "roleKey": "technician",
      "resource": "approval_request",
      "actions": [
        "read"
      ],
      "approvalRequiredFor": []
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
      "approvalRequiredFor": []
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
      "roleKey": "reporting_analyst",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "dispatch-coordinator",
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
      "roleKey": "dispatch-coordinator",
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
      "roleKey": "dispatch-coordinator",
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
      "roleKey": "dispatch-coordinator",
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
      "roleKey": "dispatch-coordinator",
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
      "roleKey": "dispatch-coordinator",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "warehouse-lead",
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
      "roleKey": "warehouse-lead",
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
      "roleKey": "warehouse-lead",
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
      "roleKey": "warehouse-lead",
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
      "roleKey": "warehouse-lead",
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
      "roleKey": "warehouse-lead",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
    },
    {
      "roleKey": "account-manager",
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
      "roleKey": "account-manager",
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
      "roleKey": "account-manager",
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
      "roleKey": "account-manager",
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
      "roleKey": "account-manager",
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
      "roleKey": "account-manager",
      "resource": "approval_request",
      "actions": [
        "create",
        "read",
        "approve",
        "reject",
        "escalate"
      ],
      "approvalRequiredFor": []
    }
  ],
  "integrations": [
    {
      "key": "erp_sync",
      "name": "ERP Sync",
      "category": "erp",
      "mode": "future-ready",
      "direction": "bidirectional",
      "notes": "Expose contract-first sync boundaries and hold credentials outside generated code."
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
      "key": "email_notifications",
      "name": "Email Notifications",
      "category": "notifications",
      "mode": "active",
      "direction": "outbound",
      "notes": "Keep templates editable and route secret ownership through environment-configured providers."
    },
    {
      "key": "identity_provider",
      "name": "Enterprise Identity Provider",
      "category": "identity",
      "mode": "future-ready",
      "direction": "inbound",
      "notes": "Leave provider selection unresolved until deployment planning confirms the customer identity stack."
    }
  ],
  "complianceRequirements": [
    {
      "key": "health-operations-traceability",
      "name": "Healthcare Operations Traceability",
      "rationale": "Medical logistics flows need asset, chain-of-custody, and service history visibility.",
      "controls": [
        "Regional tenant boundaries",
        "Audit log on inventory and service changes",
        "Approval gate for urgent replacements"
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
      "key": "auditability",
      "name": "Auditability",
      "rationale": "Operator requested Auditability as a compliance or safety constraint.",
      "controls": [
        "Document this control explicitly in deployment review",
        "Add customer-specific evidence requirements before go-live"
      ]
    },
    {
      "key": "traceability",
      "name": "Traceability",
      "rationale": "Operator requested Traceability as a compliance or safety constraint.",
      "controls": [
        "Document this control explicitly in deployment review",
        "Add customer-specific evidence requirements before go-live"
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
      "key": "entities",
      "label": "Entity Workbench",
      "route": "/entities",
      "moduleKey": "entities",
      "requiredRoles": [
        "platform_admin",
        "operations_manager",
        "dispatch_coordinator",
        "warehouse_lead",
        "technician"
      ]
    },
    {
      "key": "workflows",
      "label": "Workflow Orchestrator",
      "route": "/workflows",
      "moduleKey": "workflows",
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
      "key": "entities",
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
      "key": "workflows",
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
    }
  ],
  "dataModel": {
    "tables": [
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
      },
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
      }
    ],
    "relationships": [
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
      },
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
      }
    ]
  },
  "apiDraft": {
    "endpoints": [
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
    }
  ],
  "assumptions": [
    "Generated apps use tenant-scoped application data and do not persist shared runtime-owned business state in automindlab-stack.",
    "Secrets, provider credentials, and customer-specific deployment values are injected through environment or deployment config only.",
    "Approval-gated actions remain blocked until an authenticated operator approves them in the generated app.",
    "The first version prioritizes internal operations and back-office workflows over external customer-facing portals."
  ],
  "unresolvedItems": [
    "Select the customer identity provider and login method for production deployment.",
    "Confirm tenant partition strategy across regions and environments.",
    "Confirm notification destinations and escalation targets.",
    "Define record retention windows for audit and workflow history.",
    "Choose the ERP vendor, sync direction, and approved field-level contract."
  ],
  "uncertainty": {
    "level": "medium",
    "reasons": [
      "The spec is intentionally constrained and typed, but some customer deployment decisions remain open.",
      "At least one requested integration is represented as a future-ready contract placeholder, not a live connection."
    ],
    "missingContext": [
      "Select the customer identity provider and login method for production deployment.",
      "Confirm tenant partition strategy across regions and environments.",
      "Confirm notification destinations and escalation targets.",
      "Define record retention windows for audit and workflow history.",
      "Choose the ERP vendor, sync direction, and approved field-level contract."
    ],
    "operatorQuestions": [
      "Select the customer identity provider and login method for production deployment.",
      "Confirm tenant partition strategy across regions and environments.",
      "Confirm notification destinations and escalation targets.",
      "Define record retention windows for audit and workflow history."
    ]
  },
  "blueprint": {
    "layout": "Three-zone operator workspace with navigation rail, primary execution surface, and contextual audit/approval rail.",
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
      "/settings"
    ],
    "reusablePrimitives": [
      "tenant-aware dashboard shell",
      "typed CRUD table and detail form",
      "workflow timeline",
      "approval queue",
      "audit event feed",
      "permissions matrix",
      "design token export"
    ],
    "backgroundOperations": [
      "generation job tracking",
      "verification command orchestration",
      "daily digest candidate generation",
      "dispatch-workflow-monitor",
      "inventory-workflow-monitor",
      "approval-workflow-monitor",
      "reporting-workflow-monitor"
    ],
    "observability": [
      "file-backed job logs",
      "audit event append log",
      "visible verification step results",
      "health endpoint with service status"
    ],
    "persistenceOwnership": "Generated customer apps own their own business records, workflow outcomes, and approval decisions. The factory only owns advisory specs, job metadata, and generation artifacts."
  }
};
