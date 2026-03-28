import type {
  ApprovalGate,
  AutomationOpportunity,
  BusinessEntity,
  ComplianceRequirement,
  IntegrationDefinition,
  NotificationRule,
  ReportingView,
  RoleDefinition,
  SettingsSection,
  WorkflowDefinition,
} from "./contracts.js";

export const ROLE_LIBRARY: Record<string, RoleDefinition> = {
  platform_admin: {
    key: "platform_admin",
    name: "Platform Admin",
    description: "Configures tenant defaults, identity, integration surfaces, and approval policy.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "entity-workbench", "workflow-orchestrator", "approvals", "audit", "roles", "integrations", "notifications", "reports", "settings"],
    responsibilities: ["Configure tenant-level settings", "Manage integrations", "Review privileged changes"],
    approvalScope: ["rbac", "integrations", "settings", "data-export"],
  },
  operations_manager: {
    key: "operations_manager",
    name: "Operations Manager",
    description: "Owns throughput, escalations, approvals, and operational policies.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "entity-workbench", "workflow-orchestrator", "approvals", "audit", "roles", "notifications", "reports", "settings"],
    responsibilities: ["Own day-to-day operations", "Approve urgent exceptions", "Monitor SLA and risk"],
    approvalScope: ["urgent-replacement", "bulk-import", "status-override"],
  },
  approver: {
    key: "approver",
    name: "Approver",
    description: "Approves explicitly gated operational actions without full administrative access.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "approvals", "audit", "reports"],
    responsibilities: ["Review irreversible actions", "Document business justification"],
    approvalScope: ["urgent-replacement", "inventory-disposition", "manual-export"],
  },
  auditor: {
    key: "auditor",
    name: "Auditor",
    description: "Reviews audit history, approvals, and compliance evidence.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "audit", "approvals", "roles", "reports"],
    responsibilities: ["Validate controls", "Trace important workflow events"],
    approvalScope: [],
  },
  dispatch_coordinator: {
    key: "dispatch_coordinator",
    name: "Dispatch Coordinator",
    description: "Coordinates field work, routing, and schedule changes.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "dispatch-board", "workflow-orchestrator", "notifications", "reports"],
    responsibilities: ["Schedule jobs", "Assign field work", "Track in-flight exceptions"],
    approvalScope: [],
  },
  warehouse_lead: {
    key: "warehouse_lead",
    name: "Warehouse Lead",
    description: "Owns inventory status, handoffs, and physical movement events.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "inventory-readiness", "entity-workbench", "workflow-orchestrator", "notifications", "reports"],
    responsibilities: ["Maintain inventory truth", "Confirm readiness states", "Record location changes"],
    approvalScope: ["inventory-disposition"],
  },
  technician: {
    key: "technician",
    name: "Technician",
    description: "Executes assigned tasks and updates operational status from the field.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "task-assignment", "service-ticket-console", "workflow-orchestrator"],
    responsibilities: ["Execute assigned tasks", "Capture service notes", "Confirm completion state"],
    approvalScope: [],
  },
  account_manager: {
    key: "account_manager",
    name: "Account Manager",
    description: "Owns account-level visibility, service coordination, and customer escalations.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "account-operations", "reports"],
    responsibilities: ["Monitor account health", "Review service history"],
    approvalScope: [],
  },
  reporting_analyst: {
    key: "reporting_analyst",
    name: "Reporting Analyst",
    description: "Curates report definitions and validates KPI outputs.",
    inheritsFrom: [],
    visibleModules: ["dashboard", "reports", "audit"],
    responsibilities: ["Design reports", "Validate trend narratives"],
    approvalScope: [],
  },
};

export const ENTITY_LIBRARY: Record<string, BusinessEntity> = {
  shipment_order: {
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
      { key: "priority", label: "Priority", type: "enum", required: true, description: "Operational priority used for dispatch." },
    ],
  },
  service_ticket: {
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
      { key: "resolutionState", label: "Resolution State", type: "enum", required: true, description: "Current progress toward closure." },
    ],
  },
  inventory_item: {
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
      { key: "condition", label: "Condition", type: "enum", required: true, description: "Operational condition at current step." },
    ],
  },
  account: {
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
      { key: "status", label: "Status", type: "enum", required: true, description: "Commercial account status." },
    ],
  },
  task_assignment: {
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
      { key: "state", label: "State", type: "enum", required: true, description: "Current execution state." },
    ],
  },
  approval_request: {
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
      { key: "decisionState", label: "Decision State", type: "enum", required: true, description: "Approval lifecycle state." },
    ],
  },
};

export const WORKFLOW_LIBRARY: Record<string, WorkflowDefinition> = {
  dispatch: {
    key: "dispatch",
    name: "Dispatch and Fulfillment",
    description: "Coordinate service requests, dispatch decisions, and execution visibility.",
    triggers: ["New customer request", "Reschedule or escalation event"],
    actors: ["dispatch_coordinator", "technician", "operations_manager"],
    steps: [
      { key: "intake", label: "Intake", ownerRoles: ["dispatch_coordinator"], action: "Create order or service request", auditEvent: "workflow.dispatch.intake" },
      { key: "assign", label: "Assign", ownerRoles: ["dispatch_coordinator"], action: "Assign task and route", auditEvent: "workflow.dispatch.assign" },
      { key: "execute", label: "Execute", ownerRoles: ["technician", "warehouse_lead"], action: "Deliver, pick up, or service the order", auditEvent: "workflow.dispatch.execute" },
      { key: "close", label: "Close", ownerRoles: ["operations_manager"], action: "Confirm completion", auditEvent: "workflow.dispatch.close" },
    ],
    automationHints: ["Auto-prioritize at-risk orders", "Notify owners when service window is threatened"],
  },
  inventory: {
    key: "inventory",
    name: "Inventory and Readiness Flow",
    description: "Track item movement, readiness state, and warehouse ownership transitions.",
    triggers: ["Item intake", "Cleaning completion", "Location change"],
    actors: ["warehouse_lead", "technician", "operations_manager"],
    steps: [
      { key: "receive", label: "Receive", ownerRoles: ["warehouse_lead"], action: "Receive or inspect the item", auditEvent: "workflow.inventory.receive" },
      { key: "status", label: "Status Update", ownerRoles: ["warehouse_lead", "technician"], action: "Update readiness or condition", auditEvent: "workflow.inventory.status" },
      { key: "transfer", label: "Transfer", ownerRoles: ["warehouse_lead"], action: "Move item between locations", auditEvent: "workflow.inventory.transfer" },
      { key: "retire", label: "Retire", ownerRoles: ["operations_manager"], action: "Retire or write off item", approvalGateKey: "inventory-disposition", auditEvent: "workflow.inventory.retire" },
    ],
    automationHints: ["Flag stale inventory states", "Create follow-up tasks after condition changes"],
  },
  service_resolution: {
    key: "service_resolution",
    name: "Service Resolution",
    description: "Triage service tickets, assign ownership, and verify close-out evidence.",
    triggers: ["Ticket created", "Customer escalation", "Field update received"],
    actors: ["dispatch_coordinator", "technician", "operations_manager"],
    steps: [
      { key: "triage", label: "Triage", ownerRoles: ["dispatch_coordinator"], action: "Classify issue and expected urgency", auditEvent: "workflow.service.triage" },
      { key: "assign", label: "Assign", ownerRoles: ["dispatch_coordinator"], action: "Assign a technician or operational owner", auditEvent: "workflow.service.assign" },
      { key: "resolve", label: "Resolve", ownerRoles: ["technician"], action: "Perform the service work and capture notes", auditEvent: "workflow.service.resolve" },
      { key: "verify", label: "Verify", ownerRoles: ["operations_manager"], action: "Confirm outcome and reopen risk if needed", auditEvent: "workflow.service.verify" },
    ],
    automationHints: ["Escalate blocked tickets automatically", "Notify account owners when SLA risk rises"],
  },
  approval: {
    key: "approval",
    name: "Exception and Approval Flow",
    description: "Route irreversible or high-risk actions through explicit review.",
    triggers: ["Urgent replacement request", "Bulk import", "Role expansion"],
    actors: ["operations_manager", "approver", "auditor"],
    steps: [
      { key: "request", label: "Request", ownerRoles: ["dispatch_coordinator", "warehouse_lead", "operations_manager"], action: "Submit a gated request", auditEvent: "workflow.approval.request" },
      { key: "review", label: "Review", ownerRoles: ["approver"], action: "Review business justification", approvalGateKey: "urgent-replacement", auditEvent: "workflow.approval.review" },
      { key: "decision", label: "Decision", ownerRoles: ["approver", "operations_manager"], action: "Approve or reject", approvalGateKey: "urgent-replacement", auditEvent: "workflow.approval.decision" },
    ],
    automationHints: ["Escalate when approval SLA is breached", "Capture approval evidence automatically"],
  },
  reporting: {
    key: "reporting",
    name: "Reporting and Sync Review",
    description: "Prepare summaries and contract-first integration handoffs.",
    triggers: ["End of day", "Scheduled export", "Manual review"],
    actors: ["operations_manager", "reporting_analyst", "platform_admin"],
    steps: [
      { key: "triage", label: "Triage", ownerRoles: ["operations_manager"], action: "Review incoming work", auditEvent: "workflow.generic.triage" },
      { key: "execute", label: "Execute", ownerRoles: ["dispatch_coordinator", "technician"], action: "Perform the work", auditEvent: "workflow.generic.execute" },
      { key: "verify", label: "Verify", ownerRoles: ["operations_manager"], action: "Confirm close-out and evidence", auditEvent: "workflow.generic.verify" },
    ],
    automationHints: ["Generate daily digest", "Queue ERP sync draft after approval"],
  },
};

export const INTEGRATION_LIBRARY: Record<string, IntegrationDefinition> = {
  erp_sync: {
    key: "erp_sync",
    name: "ERP Sync",
    category: "erp",
    mode: "future-ready",
    direction: "bidirectional",
    notes: "Expose contract-first sync boundaries and hold credentials outside generated code.",
  },
  csv_exchange: {
    key: "csv_exchange",
    name: "CSV Exchange",
    category: "files",
    mode: "active",
    direction: "bidirectional",
    notes: "Bulk import and export must remain approval-gated when they mutate multiple records.",
  },
  email_notifications: {
    key: "email_notifications",
    name: "Email Notifications",
    category: "notifications",
    mode: "active",
    direction: "outbound",
    notes: "Keep templates editable and route secret ownership through environment-configured providers.",
  },
  identity_provider: {
    key: "identity_provider",
    name: "Enterprise Identity Provider",
    category: "identity",
    mode: "future-ready",
    direction: "inbound",
    notes: "Prefer SAML or OIDC at deployment time, but do not hard-code provider assumptions.",
  },
};

export const COMPLIANCE_LIBRARY: Record<string, ComplianceRequirement> = {
  "health-operations-traceability": {
    key: "health-operations-traceability",
    name: "Healthcare Operations Traceability",
    rationale: "Medical logistics flows need asset, chain-of-custody, and service history visibility.",
    controls: ["Regional tenant boundaries", "Audit log on inventory and service changes", "Approval gate for urgent replacements"],
  },
  "audit-evidence": {
    key: "audit-evidence",
    name: "Audit Evidence",
    rationale: "Meaningful workflow events must stay attributable and reviewable.",
    controls: ["Append-only audit stream", "Actor attribution", "Approval decision capture"],
  },
  "tenant-isolation": {
    key: "tenant-isolation",
    name: "Tenant Isolation",
    rationale: "Generated apps must remain safe to run for multiple customers or business units.",
    controls: ["Tenant-scoped entities", "Role-aware data access", "Explicit environment boundaries"],
  },
};

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
  {
    key: "adapter-health-review",
    name: "Adapter Health Review",
    trigger: "A configured adapter misses a sync, export, or notification run",
    outcome: "Surface a visible recovery TODO instead of silently mutating customer state",
    humanReview: "Operator approves recovery or retry steps",
  },
];

export const NOTIFICATION_LIBRARY: Record<string, NotificationRule> = {
  "approval-needed": {
    key: "approval-needed",
    name: "Approval Needed",
    trigger: "A gated workflow action enters pending approval",
    channel: "email-or-in-app",
    escalation: "Escalate to the next approver after SLA breach",
  },
  "workflow-at-risk": {
    key: "workflow-at-risk",
    name: "Workflow At Risk",
    trigger: "A dispatch or service workflow crosses its risk threshold",
    channel: "in-app",
    escalation: "Notify operations manager and attach audit context",
  },
};

export const REPORT_LIBRARY: Record<string, ReportingView> = {
  throughput: {
    key: "throughput",
    name: "Operational Throughput",
    purpose: "Show workload movement, completion rates, and backlog shape.",
    cadence: "daily",
  },
  "approval-latency": {
    key: "approval-latency",
    name: "Approval Latency",
    purpose: "Track time-to-decision for gated actions.",
    cadence: "weekly",
  },
  "adapter-health": {
    key: "adapter-health",
    name: "Adapter Health",
    purpose: "Track adapter failures, deferred integrations, and operational recovery needs.",
    cadence: "daily",
  },
};

export const SETTINGS_LIBRARY: Record<string, SettingsSection> = {
  "tenant-config": {
    key: "tenant-config",
    name: "Tenant Configuration",
    purpose: "Manage branding, regional defaults, and workflow policies.",
    owners: ["platform_admin", "operations_manager"],
  },
  "access-policy": {
    key: "access-policy",
    name: "Access Policy",
    purpose: "Review role-to-permission mapping and approval scopes.",
    owners: ["platform_admin", "auditor"],
  },
  "integration-routing": {
    key: "integration-routing",
    name: "Integration Routing",
    purpose: "Configure sync schedules, file exchange, and notification pathways.",
    owners: ["platform_admin", "operations_manager"],
  },
  "adapter-policy": {
    key: "adapter-policy",
    name: "Adapter Policy",
    purpose: "Review adapter configuration, boundary rules, and deferred integrations.",
    owners: ["platform_admin", "operations_manager", "auditor"],
  },
};

export const BASE_NOTIFICATIONS = Object.values(NOTIFICATION_LIBRARY);
export const BASE_REPORTS = Object.values(REPORT_LIBRARY);
export const BASE_SETTINGS = Object.values(SETTINGS_LIBRARY);

export const BASE_APPROVAL_GATES: ApprovalGate[] = [
  {
    key: "urgent-replacement",
    name: "Urgent Replacement Approval",
    description: "Require explicit approval before replacing or issuing high-priority equipment outside normal planning.",
    risk: "high",
    trigger: "A workflow requests an urgent replacement, swap, or status override.",
    requiredRoles: ["operations_manager", "approver"],
    auditEvent: "approval.urgent_replacement.reviewed",
  },
  {
    key: "inventory-disposition",
    name: "Inventory Disposition Approval",
    description: "Protect retirement, disposal, or write-off actions for tenant-scoped inventory.",
    risk: "critical",
    trigger: "An operator attempts to retire, dispose, or write off tracked equipment.",
    requiredRoles: ["operations_manager", "approver"],
    auditEvent: "approval.inventory_disposition.reviewed",
  },
  {
    key: "bulk-import",
    name: "Bulk Import Approval",
    description: "Review bulk CSV changes before mutating large sets of business records.",
    risk: "high",
    trigger: "A CSV or integration batch affects multiple tenant-scoped records.",
    requiredRoles: ["platform_admin", "operations_manager"],
    auditEvent: "approval.bulk_import.reviewed",
  },
  {
    key: "rbac-change",
    name: "Role and Permission Change Approval",
    description: "Review least-privilege changes that expand access or approval authority.",
    risk: "high",
    trigger: "An admin modifies role definitions, privileged permissions, or approval scopes.",
    requiredRoles: ["platform_admin", "auditor"],
    auditEvent: "approval.rbac_change.reviewed",
  },
];

export function values<T>(record: Record<string, T>): T[] {
  return Object.values(record);
}
