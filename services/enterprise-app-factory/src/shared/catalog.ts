import type {
  AutomationOpportunity,
  BusinessEntity,
  ComplianceRequirement,
  IntegrationDefinition,
  NotificationRule,
  ReportingView,
  RoleDefinition,
  SettingsSection,
  UiModuleDefinition,
} from "./contracts.js";

export const BASE_MODULES: UiModuleDefinition[] = [
  {
    key: "dashboard",
    name: "Operations Dashboard",
    purpose: "Give operators a live view of workload, approvals, risk, and throughput.",
    route: "/dashboard",
    primitive: "kpi-ribbon-and-ops-board",
    roles: ["platform_admin", "operations_manager", "dispatch_coordinator", "auditor"],
  },
  {
    key: "entities",
    name: "Entity Workbench",
    purpose: "Manage business entities through typed forms, tables, and detail views.",
    route: "/entities",
    primitive: "crud-grid-with-detail-rail",
    roles: ["platform_admin", "operations_manager", "dispatch_coordinator", "warehouse_lead", "technician"],
  },
  {
    key: "workflows",
    name: "Workflow Orchestrator",
    purpose: "Track multi-step operational flows with visible ownership and escalation.",
    route: "/workflows",
    primitive: "timeline-with-stage-actions",
    roles: ["platform_admin", "operations_manager", "dispatch_coordinator", "warehouse_lead", "technician"],
  },
  {
    key: "approvals",
    name: "Approval Center",
    purpose: "Keep irreversible actions behind explicit review and audit events.",
    route: "/approvals",
    primitive: "approval-queue",
    roles: ["platform_admin", "operations_manager", "approver", "auditor"],
  },
  {
    key: "audit",
    name: "Audit Stream",
    purpose: "Trace meaningful workflow events and changes across the tenant boundary.",
    route: "/audit",
    primitive: "append-only-event-log",
    roles: ["platform_admin", "operations_manager", "auditor"],
  },
  {
    key: "roles",
    name: "Roles and Access",
    purpose: "Review least-privilege access and approval scopes by role.",
    route: "/roles",
    primitive: "permissions-matrix",
    roles: ["platform_admin", "operations_manager", "auditor"],
  },
  {
    key: "integrations",
    name: "Integrations",
    purpose: "Make sync boundaries, credential ownership, and failure modes explicit.",
    route: "/integrations",
    primitive: "integration-registry",
    roles: ["platform_admin", "operations_manager"],
  },
  {
    key: "notifications",
    name: "Notifications",
    purpose: "Configure operator-facing rules and escalation paths.",
    route: "/notifications",
    primitive: "rules-and-routing",
    roles: ["platform_admin", "operations_manager"],
  },
  {
    key: "reports",
    name: "Reports",
    purpose: "Expose operational summaries and trend views for review.",
    route: "/reports",
    primitive: "report-catalog",
    roles: ["platform_admin", "operations_manager", "auditor", "reporting_analyst"],
  },
  {
    key: "settings",
    name: "Settings",
    purpose: "Handle tenant-aware configuration without hard-coding secrets or approvals.",
    route: "/settings",
    primitive: "settings-rail",
    roles: ["platform_admin", "operations_manager"],
  },
];

export const BASE_ROLES: RoleDefinition[] = [
  {
    key: "platform_admin",
    name: "Platform Admin",
    description: "Configures tenant defaults, identity, integration surfaces, and approval policy.",
    inheritsFrom: [],
    visibleModules: BASE_MODULES.map((module) => module.key),
    responsibilities: ["Configure tenant-level settings", "Manage integrations", "Review privileged changes"],
    approvalScope: ["rbac", "integrations", "settings", "data-export"],
  },
  {
    key: "operations_manager",
    name: "Operations Manager",
    description: "Owns throughput, escalations, approvals, and operational policies.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "entities", "workflows", "approvals", "audit", "roles", "notifications", "reports", "settings"],
    responsibilities: ["Own day-to-day operations", "Approve urgent exceptions", "Monitor SLA and risk"],
    approvalScope: ["urgent-replacement", "bulk-import", "status-override"],
  },
  {
    key: "approver",
    name: "Approver",
    description: "Approves explicitly gated operational actions without full administrative access.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "approvals", "audit", "reports"],
    responsibilities: ["Review irreversible actions", "Document business justification"],
    approvalScope: ["urgent-replacement", "inventory-disposition", "manual-export"],
  },
  {
    key: "auditor",
    name: "Auditor",
    description: "Reviews audit history, approvals, and compliance evidence.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "audit", "approvals", "roles", "reports"],
    responsibilities: ["Validate controls", "Trace important workflow events"],
    approvalScope: [],
  },
];

export const DOMAIN_ROLE_LIBRARY: Array<{ keywords: string[]; role: RoleDefinition }> = [
  {
    keywords: ["dispatch", "delivery", "pickup"],
    role: {
      key: "dispatch_coordinator",
      name: "Dispatch Coordinator",
      description: "Coordinates field work, routing, and schedule changes.",
      inheritsFrom: [],
      visibleModules: ["dashboard", "entities", "workflows", "notifications", "reports"],
      responsibilities: ["Schedule jobs", "Assign field work", "Track in-flight exceptions"],
      approvalScope: [],
    },
  },
  {
    keywords: ["warehouse", "inventory", "cleaning"],
    role: {
      key: "warehouse_lead",
      name: "Warehouse Lead",
      description: "Owns inventory status, handoffs, and physical movement events.",
      inheritsFrom: [],
      visibleModules: ["dashboard", "entities", "workflows", "notifications", "reports"],
      responsibilities: ["Maintain inventory truth", "Confirm readiness states", "Record location changes"],
      approvalScope: ["inventory-disposition"],
    },
  },
  {
    keywords: ["technician", "service ticket", "field"],
    role: {
      key: "technician",
      name: "Technician",
      description: "Executes assigned tasks and updates operational status from the field.",
      inheritsFrom: [],
      visibleModules: ["dashboard", "entities", "workflows"],
      responsibilities: ["Execute assigned tasks", "Capture service notes", "Confirm completion state"],
      approvalScope: [],
    },
  },
  {
    keywords: ["hospital", "account", "customer"],
    role: {
      key: "account_manager",
      name: "Account Manager",
      description: "Owns account-level visibility, service coordination, and customer escalations.",
      inheritsFrom: [],
      visibleModules: ["dashboard", "entities", "reports"],
      responsibilities: ["Monitor account health", "Review service history"],
      approvalScope: [],
    },
  },
  {
    keywords: ["report", "analytics"],
    role: {
      key: "reporting_analyst",
      name: "Reporting Analyst",
      description: "Curates report definitions and validates KPI outputs.",
      inheritsFrom: [],
      visibleModules: ["dashboard", "reports", "audit"],
      responsibilities: ["Design reports", "Validate trend narratives"],
      approvalScope: [],
    },
  },
];

export const ENTITY_LIBRARY: Array<{ keywords: string[]; entity: BusinessEntity }> = [
  {
    keywords: ["dispatch", "delivery", "pickup"],
    entity: {
      key: "shipment_order",
      label: "Shipment Order",
      description: "Tracks delivery and pickup obligations, timing, and status.",
      ownership: "operations",
      tenantScoped: true,
      operations: ["create", "read", "update", "assign", "reschedule", "complete"],
      relatedEntities: ["account", "service_ticket", "task_assignment", "inventory_item"],
      fields: [
        { key: "orderNumber", label: "Order Number", type: "string", required: true, description: "Human-readable order reference." },
        { key: "serviceWindow", label: "Service Window", type: "datetime", required: true, description: "Planned customer-facing service time." },
        { key: "status", label: "Status", type: "enum", required: true, description: "Current execution state." },
        { key: "priority", label: "Priority", type: "enum", required: true, description: "Operational priority used for dispatch." }
      ]
    }
  },
  {
    keywords: ["service ticket", "service request", "ticket"],
    entity: {
      key: "service_ticket",
      label: "Service Ticket",
      description: "Captures customer-reported work, triage, and resolution state.",
      ownership: "operations",
      tenantScoped: true,
      operations: ["create", "read", "update", "triage", "resolve", "reopen"],
      relatedEntities: ["account", "task_assignment", "approval_request"],
      fields: [
        { key: "ticketNumber", label: "Ticket Number", type: "string", required: true, description: "Unique service ticket identifier." },
        { key: "issueType", label: "Issue Type", type: "enum", required: true, description: "Requested service category." },
        { key: "requestedBy", label: "Requested By", type: "string", required: true, description: "Customer contact or source system." },
        { key: "resolutionState", label: "Resolution State", type: "enum", required: true, description: "Current progress toward closure." }
      ]
    }
  },
  {
    keywords: ["warehouse", "inventory", "equipment", "cleaning"],
    entity: {
      key: "inventory_item",
      label: "Inventory Item",
      description: "Represents equipment, readiness state, and warehouse location.",
      ownership: "warehouse",
      tenantScoped: true,
      operations: ["create", "read", "update", "transfer", "mark-ready", "retire"],
      relatedEntities: ["shipment_order", "service_ticket", "approval_request"],
      fields: [
        { key: "assetTag", label: "Asset Tag", type: "string", required: true, description: "Equipment identifier." },
        { key: "currentLocation", label: "Current Location", type: "string", required: true, description: "Warehouse or in-field location." },
        { key: "readinessState", label: "Readiness State", type: "enum", required: true, description: "Cleaning or service readiness state." },
        { key: "condition", label: "Condition", type: "enum", required: true, description: "Operational condition at current step." }
      ]
    }
  },
  {
    keywords: ["hospital", "account", "customer"],
    entity: {
      key: "account",
      label: "Account",
      description: "Represents a customer account, service profile, and regional footprint.",
      ownership: "customer-ops",
      tenantScoped: true,
      operations: ["create", "read", "update", "link-orders", "view-history"],
      relatedEntities: ["shipment_order", "service_ticket", "report_snapshot"],
      fields: [
        { key: "accountName", label: "Account Name", type: "string", required: true, description: "Customer-visible account name." },
        { key: "region", label: "Region", type: "string", required: true, description: "Primary service region." },
        { key: "serviceTier", label: "Service Tier", type: "enum", required: true, description: "Operational priority tier." },
        { key: "status", label: "Status", type: "enum", required: true, description: "Commercial account status." }
      ]
    }
  },
  {
    keywords: ["technician", "task", "assignment"],
    entity: {
      key: "task_assignment",
      label: "Task Assignment",
      description: "Assigns operational work to a person or team with due dates and evidence.",
      ownership: "operations",
      tenantScoped: true,
      operations: ["create", "read", "update", "assign", "complete", "escalate"],
      relatedEntities: ["service_ticket", "shipment_order", "account"],
      fields: [
        { key: "taskCode", label: "Task Code", type: "string", required: true, description: "Task identifier." },
        { key: "assignedTo", label: "Assigned To", type: "string", required: true, description: "Operator or technician owner." },
        { key: "dueAt", label: "Due At", type: "datetime", required: true, description: "Expected completion timestamp." },
        { key: "state", label: "State", type: "enum", required: true, description: "Current execution state." }
      ]
    }
  },
  {
    keywords: ["approval", "approve", "urgent replacement", "replacement"],
    entity: {
      key: "approval_request",
      label: "Approval Request",
      description: "Captures explicitly gated actions and the justification behind them.",
      ownership: "governance",
      tenantScoped: true,
      operations: ["create", "read", "approve", "reject", "escalate"],
      relatedEntities: ["inventory_item", "service_ticket", "shipment_order"],
      fields: [
        { key: "requestType", label: "Request Type", type: "enum", required: true, description: "Type of action requiring approval." },
        { key: "requestedBy", label: "Requested By", type: "string", required: true, description: "Operator initiating the request." },
        { key: "riskLevel", label: "Risk Level", type: "enum", required: true, description: "Operational or compliance risk." },
        { key: "decisionState", label: "Decision State", type: "enum", required: true, description: "Approval lifecycle state." }
      ]
    }
  }
];

export const INTEGRATION_LIBRARY: Array<{ keywords: string[]; integration: IntegrationDefinition }> = [
  {
    keywords: ["erp", "sap", "oracle", "netsuite"],
    integration: {
      key: "erp_sync",
      name: "ERP Sync",
      category: "erp",
      mode: "future-ready",
      direction: "bidirectional",
      notes: "Expose contract-first sync boundaries and hold credentials outside generated code.",
    },
  },
  {
    keywords: ["csv", "import", "export"],
    integration: {
      key: "csv_exchange",
      name: "CSV Exchange",
      category: "files",
      mode: "active",
      direction: "bidirectional",
      notes: "Bulk import and export must remain approval-gated when they mutate multiple records.",
    },
  },
  {
    keywords: ["email", "notification", "alert"],
    integration: {
      key: "email_notifications",
      name: "Email Notifications",
      category: "notifications",
      mode: "active",
      direction: "outbound",
      notes: "Keep templates editable and route secret ownership through environment-configured providers.",
    },
  },
  {
    keywords: ["sso", "identity", "okta", "entra"],
    integration: {
      key: "identity_provider",
      name: "Enterprise Identity Provider",
      category: "identity",
      mode: "future-ready",
      direction: "inbound",
      notes: "Prefer SAML or OIDC at deployment time, but do not hard-code provider assumptions.",
    },
  },
];

export const COMPLIANCE_LIBRARY: Array<{ keywords: string[]; requirement: ComplianceRequirement }> = [
  {
    keywords: ["medical", "hospital", "healthcare"],
    requirement: {
      key: "health-operations-traceability",
      name: "Healthcare Operations Traceability",
      rationale: "Medical logistics flows need asset, chain-of-custody, and service history visibility.",
      controls: ["Regional tenant boundaries", "Audit log on inventory and service changes", "Approval gate for urgent replacements"],
    },
  },
  {
    keywords: ["audit", "auditability"],
    requirement: {
      key: "audit-evidence",
      name: "Audit Evidence",
      rationale: "Meaningful workflow events must stay attributable and reviewable.",
      controls: ["Append-only audit stream", "Actor attribution", "Approval decision capture"],
    },
  },
  {
    keywords: ["multi-tenant", "tenant"],
    requirement: {
      key: "tenant-isolation",
      name: "Tenant Isolation",
      rationale: "Generated apps must remain safe to run for multiple customers or business units.",
      controls: ["Tenant-scoped entities", "Role-aware data access", "Explicit environment boundaries"],
    },
  },
];

export const BASE_AUTOMATIONS: AutomationOpportunity[] = [
  {
    key: "sla-escalation",
    name: "SLA Escalation",
    trigger: "Workflow step exceeds its target window",
    outcome: "Create an escalation task and notify the owning operations manager",
    humanReview: "Manager confirms reschedule or override action",
  },
  {
    key: "digest-report",
    name: "Daily Operations Digest",
    trigger: "Start or end of operational day",
    outcome: "Summarize key throughput, backlog, approvals, and blocked work",
    humanReview: "Operator reviews before external distribution",
  },
];

export const BASE_NOTIFICATIONS: NotificationRule[] = [
  {
    key: "approval-needed",
    name: "Approval Needed",
    trigger: "A gated workflow action enters pending approval",
    channel: "email-or-in-app",
    escalation: "Escalate to the next approver after SLA breach",
  },
  {
    key: "workflow-at-risk",
    name: "Workflow At Risk",
    trigger: "A dispatch or service workflow crosses its risk threshold",
    channel: "in-app",
    escalation: "Notify operations manager and attach audit context",
  },
];

export const BASE_REPORTS: ReportingView[] = [
  {
    key: "throughput",
    name: "Operational Throughput",
    purpose: "Show workload movement, completion rates, and backlog shape.",
    cadence: "daily",
  },
  {
    key: "approval-latency",
    name: "Approval Latency",
    purpose: "Track time-to-decision for gated actions.",
    cadence: "weekly",
  },
];

export const BASE_SETTINGS: SettingsSection[] = [
  {
    key: "tenant-config",
    name: "Tenant Configuration",
    purpose: "Manage branding, regional defaults, and workflow policies.",
    owners: ["platform_admin", "operations_manager"],
  },
  {
    key: "access-policy",
    name: "Access Policy",
    purpose: "Review role-to-permission mapping and approval scopes.",
    owners: ["platform_admin", "auditor"],
  },
  {
    key: "integration-routing",
    name: "Integration Routing",
    purpose: "Configure sync schedules, file exchange, and notification pathways.",
    owners: ["platform_admin", "operations_manager"],
  },
];
