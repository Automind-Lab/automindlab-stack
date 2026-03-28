import {
  BASE_AUTOMATIONS,
  BASE_MODULES,
  BASE_NOTIFICATIONS,
  BASE_REPORTS,
  BASE_ROLES,
  BASE_SETTINGS,
  COMPLIANCE_LIBRARY,
  DOMAIN_ROLE_LIBRARY,
  ENTITY_LIBRARY,
  INTEGRATION_LIBRARY,
} from "./catalog.js";
import type {
  ApiContractDraft,
  ApprovalGate,
  AutomationOpportunity,
  BusinessEntity,
  ComplianceRequirement,
  DataModelDraft,
  EnterpriseAppSpec,
  IntegrationDefinition,
  NavigationItem,
  NotificationRule,
  OperatorPromptInput,
  PermissionMatrixEntry,
  ReportingView,
  RoleDefinition,
  SettingsSection,
  ThemeConfig,
  UiModuleDefinition,
  Uncertainty,
  WorkflowDefinition,
  WorkflowStep,
} from "./contracts.js";

const SPEC_VERSION = "2026-03-27.v1";

export function slugify(input: string): string {
  let result = "";
  let lastWasDash = false;

  for (const character of input.toLowerCase()) {
    const isAlphaNumeric = (character >= "a" && character <= "z") || (character >= "0" && character <= "9");
    if (isAlphaNumeric) {
      result += character;
      lastWasDash = false;
      continue;
    }
    if (!lastWasDash && result.length > 0) {
      result += "-";
      lastWasDash = true;
    }
  }

  return result.endsWith("-") ? result.slice(0, -1) : result;
}

function normalizeText(input: OperatorPromptInput): string {
  return [
    input.customerName,
    input.businessDescription,
    input.applicationNeeds,
    input.constraints.industry ?? "",
    input.constraints.compliance.join(" "),
    input.constraints.integrations.join(" "),
    input.constraints.roles.join(" "),
    input.constraints.approvalRequirements.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function containsAny(haystack: string, keywords: string[]): boolean {
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function dedupeByKey<T extends { key: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.key)) {
      return false;
    }
    seen.add(item.key);
    return true;
  });
}

function inferIndustry(input: OperatorPromptInput, normalized: string): string {
  if (input.constraints.industry?.trim()) {
    return input.constraints.industry.trim();
  }
  if (containsAny(normalized, ["medical", "hospital", "healthcare"])) {
    return "Healthcare Operations";
  }
  if (containsAny(normalized, ["logistics", "warehouse", "delivery"])) {
    return "Logistics";
  }
  return "Enterprise Operations";
}

function buildTheme(input: OperatorPromptInput, industry: string): ThemeConfig {
  const branding = input.constraints.branding ?? {};
  const medicalPalette = {
    primaryColor: "#12416b",
    secondaryColor: "#4f91a8",
    accentColor: "#d97a2b",
    surfaceColor: "#f3f7f8",
    canvasColor: "#e4edf0",
  };
  const defaultPalette = {
    primaryColor: "#22304a",
    secondaryColor: "#4d627c",
    accentColor: "#b86b35",
    surfaceColor: "#f5f5f2",
    canvasColor: "#ebe9e2",
  };
  const chosen = industry.toLowerCase().includes("health") ? medicalPalette : defaultPalette;
  return {
    brandName: input.customerName,
    primaryColor: branding.primaryColor ?? chosen.primaryColor,
    secondaryColor: branding.secondaryColor ?? chosen.secondaryColor,
    accentColor: chosen.accentColor,
    surfaceColor: chosen.surfaceColor,
    canvasColor: chosen.canvasColor,
    headingFont: "\"Bahnschrift SemiBold\", \"Aptos Display\", sans-serif",
    bodyFont: "\"Aptos\", \"Segoe UI Variable Text\", sans-serif",
    density: "balanced",
    logoTreatment: branding.logoHint ?? `${input.customerName} wordmark with restrained enterprise styling`,
  };
}

function collectRoles(normalized: string, input: OperatorPromptInput): RoleDefinition[] {
  const roles = [...BASE_ROLES];
  for (const candidate of DOMAIN_ROLE_LIBRARY) {
    if (containsAny(normalized, candidate.keywords)) {
      roles.push(candidate.role);
    }
  }
  for (const explicitRole of input.constraints.roles) {
    const slug = slugify(explicitRole);
    if (!roles.some((role) => role.key === slug)) {
      roles.push({
        key: slug,
        name: explicitRole,
        description: `Explicitly requested role for ${input.customerName}.`,
        inheritsFrom: [],
        visibleModules: ["dashboard", "entities", "workflows"],
        responsibilities: ["Role-specific operational work"],
        approvalScope: [],
      });
    }
  }
  return dedupeByKey(roles);
}

function collectEntities(normalized: string): BusinessEntity[] {
  const entities = ENTITY_LIBRARY
    .filter((candidate) => containsAny(normalized, candidate.keywords))
    .map((candidate) => candidate.entity);
  if (entities.length === 0) {
    entities.push(ENTITY_LIBRARY[0].entity);
  }
  return dedupeByKey(entities);
}

function collectIntegrations(normalized: string, input: OperatorPromptInput): IntegrationDefinition[] {
  const integrations = INTEGRATION_LIBRARY
    .filter((candidate) => containsAny(normalized, candidate.keywords))
    .map((candidate) => candidate.integration);

  for (const requested of input.constraints.integrations) {
    const candidate = INTEGRATION_LIBRARY.find((entry) => containsAny(requested.toLowerCase(), entry.keywords));
    if (candidate) {
      integrations.push(candidate.integration);
      continue;
    }
    integrations.push({
      key: slugify(requested),
      name: requested,
      category: "data",
      mode: "future-ready",
      direction: "bidirectional",
      notes: "Explicitly requested integration with contract-first placeholder support.",
    });
  }

  if (!integrations.some((integration) => integration.key === "identity_provider")) {
    integrations.push({
      key: "identity_provider",
      name: "Enterprise Identity Provider",
      category: "identity",
      mode: "future-ready",
      direction: "inbound",
      notes: "Leave provider selection unresolved until deployment planning confirms the customer identity stack.",
    });
  }
  return dedupeByKey(integrations);
}

function collectCompliance(normalized: string, input: OperatorPromptInput): ComplianceRequirement[] {
  const requirements = COMPLIANCE_LIBRARY
    .filter((candidate) => containsAny(normalized, candidate.keywords))
    .map((candidate) => candidate.requirement);
  for (const requested of input.constraints.compliance) {
    const slug = slugify(requested);
    if (!requirements.some((requirement) => requirement.key === slug)) {
      requirements.push({
        key: slug,
        name: requested,
        rationale: `Operator requested ${requested} as a compliance or safety constraint.`,
        controls: ["Document this control explicitly in deployment review", "Add customer-specific evidence requirements before go-live"],
      });
    }
  }
  return dedupeByKey(requirements);
}

function collectModules(roles: RoleDefinition[]): UiModuleDefinition[] {
  return BASE_MODULES.map((module) => ({
    ...module,
    roles: module.roles.filter((roleKey) => roles.some((role) => role.key === roleKey)),
  }));
}

function buildApprovalGates(input: OperatorPromptInput, normalized: string): ApprovalGate[] {
  const gates: ApprovalGate[] = [
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

  if (input.constraints.approvalRequirements.length > 0 || containsAny(normalized, ["approval", "approve"])) {
    for (const requested of input.constraints.approvalRequirements) {
      gates.push({
        key: slugify(requested),
        name: requested,
        description: `Operator-requested approval guardrail for ${requested}.`,
        risk: "high",
        trigger: `Any workflow action classified as ${requested}.`,
        requiredRoles: ["operations_manager", "approver"],
        auditEvent: `approval.${slugify(requested)}.reviewed`,
      });
    }
  }

  return dedupeByKey(gates);
}

function buildWorkflowSteps(key: string): WorkflowStep[] {
  switch (key) {
    case "dispatch":
      return [
        { key: "intake", label: "Intake", ownerRoles: ["dispatch_coordinator"], action: "Create order or service request", auditEvent: "workflow.dispatch.intake" },
        { key: "assign", label: "Assign", ownerRoles: ["dispatch_coordinator"], action: "Assign task and route", auditEvent: "workflow.dispatch.assign" },
        { key: "execute", label: "Execute", ownerRoles: ["technician", "warehouse_lead"], action: "Deliver, pick up, or service the order", auditEvent: "workflow.dispatch.execute" },
        { key: "close", label: "Close", ownerRoles: ["operations_manager"], action: "Confirm completion", auditEvent: "workflow.dispatch.close" },
      ];
    case "inventory":
      return [
        { key: "receive", label: "Receive", ownerRoles: ["warehouse_lead"], action: "Receive or inspect the item", auditEvent: "workflow.inventory.receive" },
        { key: "status", label: "Status Update", ownerRoles: ["warehouse_lead", "technician"], action: "Update readiness or condition", auditEvent: "workflow.inventory.status" },
        { key: "transfer", label: "Transfer", ownerRoles: ["warehouse_lead"], action: "Move item between locations", auditEvent: "workflow.inventory.transfer" },
        { key: "retire", label: "Retire", ownerRoles: ["operations_manager"], action: "Retire or write off item", approvalGateKey: "inventory-disposition", auditEvent: "workflow.inventory.retire" },
      ];
    case "approval":
      return [
        { key: "request", label: "Request", ownerRoles: ["dispatch_coordinator", "warehouse_lead", "operations_manager"], action: "Submit a gated request", auditEvent: "workflow.approval.request" },
        { key: "review", label: "Review", ownerRoles: ["approver"], action: "Review business justification", approvalGateKey: "urgent-replacement", auditEvent: "workflow.approval.review" },
        { key: "decision", label: "Decision", ownerRoles: ["approver", "operations_manager"], action: "Approve or reject", approvalGateKey: "urgent-replacement", auditEvent: "workflow.approval.decision" },
      ];
    default:
      return [
        { key: "triage", label: "Triage", ownerRoles: ["operations_manager"], action: "Review incoming work", auditEvent: "workflow.generic.triage" },
        { key: "execute", label: "Execute", ownerRoles: ["dispatch_coordinator", "technician"], action: "Perform the work", auditEvent: "workflow.generic.execute" },
        { key: "verify", label: "Verify", ownerRoles: ["operations_manager"], action: "Confirm close-out and evidence", auditEvent: "workflow.generic.verify" },
      ];
  }
}

function buildWorkflows(normalized: string, entities: BusinessEntity[]): WorkflowDefinition[] {
  const workflows: WorkflowDefinition[] = [];
  if (containsAny(normalized, ["dispatch", "delivery", "pickup"])) {
    workflows.push({
      key: "dispatch",
      name: "Dispatch and Fulfillment",
      description: "Coordinate service requests, dispatch decisions, and execution visibility.",
      triggers: ["New customer request", "Reschedule or escalation event"],
      actors: ["dispatch_coordinator", "technician", "operations_manager"],
      steps: buildWorkflowSteps("dispatch"),
      automationHints: ["Auto-prioritize at-risk orders", "Notify owners when service window is threatened"],
    });
  }
  if (containsAny(normalized, ["warehouse", "inventory", "cleaning"])) {
    workflows.push({
      key: "inventory",
      name: "Inventory and Readiness Flow",
      description: "Track item movement, readiness state, and warehouse ownership transitions.",
      triggers: ["Item intake", "Cleaning completion", "Location change"],
      actors: ["warehouse_lead", "technician", "operations_manager"],
      steps: buildWorkflowSteps("inventory"),
      automationHints: ["Flag stale inventory states", "Create follow-up tasks after condition changes"],
    });
  }
  if (containsAny(normalized, ["approval", "approve", "urgent replacement", "replacement"])) {
    workflows.push({
      key: "approval",
      name: "Exception and Approval Flow",
      description: "Route irreversible or high-risk actions through explicit review.",
      triggers: ["Urgent replacement request", "Bulk import", "Role expansion"],
      actors: ["operations_manager", "approver", "auditor"],
      steps: buildWorkflowSteps("approval"),
      automationHints: ["Escalate when approval SLA is breached", "Capture approval evidence automatically"],
    });
  }
  workflows.push({
    key: "reporting",
    name: "Reporting and Sync Review",
    description: "Prepare summaries and contract-first integration handoffs.",
    triggers: ["End of day", "Scheduled export", "Manual review"],
    actors: ["operations_manager", "reporting_analyst", "platform_admin"],
    steps: buildWorkflowSteps("default"),
    automationHints: ["Generate daily digest", "Queue ERP sync draft after approval"],
  });
  return dedupeByKey(workflows).filter((workflow) => workflow.steps.length > 0 && entities.length > 0);
}

function buildNavigation(modules: UiModuleDefinition[]): NavigationItem[] {
  return modules.map((module) => ({
    key: module.key,
    label: module.name,
    route: module.route,
    moduleKey: module.key,
    requiredRoles: module.roles,
  }));
}

function buildPermissionMatrix(roles: RoleDefinition[], entities: BusinessEntity[], gates: ApprovalGate[]): PermissionMatrixEntry[] {
  const approvalMap = new Set(gates.map((gate) => gate.key));
  const entries: PermissionMatrixEntry[] = [];
  for (const role of roles) {
    for (const entity of entities) {
      const actions = entity.operations.filter((operation) => {
        if (role.key === "auditor") {
          return operation === "read";
        }
        if (role.key === "technician") {
          return ["read", "update", "complete"].includes(operation);
        }
        return true;
      });
      const approvalRequiredFor = entity.operations.filter((operation) => {
        const approvalMatch =
          (operation === "retire" && approvalMap.has("inventory-disposition")) ||
          (operation === "assign" && approvalMap.has("rbac-change")) ||
          (operation === "complete" && approvalMap.has("urgent-replacement"));
        return approvalMatch;
      });
      entries.push({
        roleKey: role.key,
        resource: entity.key,
        actions,
        approvalRequiredFor,
      });
    }
  }
  return entries;
}

function buildDataModel(entities: BusinessEntity[]): DataModelDraft {
  return {
    tables: entities.map((entity) => ({
      name: entity.key,
      purpose: entity.description,
      owner: entity.ownership,
      columns: entity.fields.map((field) => field.key),
    })),
    relationships: entities.flatMap((entity) =>
      entity.relatedEntities.map((relatedEntity) => ({
        from: entity.key,
        to: relatedEntity,
        relationship: "references",
      })),
    ),
  };
}

function buildApiDraft(entities: BusinessEntity[], workflows: WorkflowDefinition[], gates: ApprovalGate[]): ApiContractDraft {
  const endpoints: ApiContractDraft["endpoints"] = entities.flatMap((entity) => [
    { method: "GET" as const, path: `/api/${entity.key}`, purpose: `List ${entity.label} records`, roles: ["platform_admin", "operations_manager"] },
    { method: "POST" as const, path: `/api/${entity.key}`, purpose: `Create ${entity.label} records`, roles: ["platform_admin", "operations_manager", "dispatch_coordinator"] },
    { method: "PATCH" as const, path: `/api/${entity.key}/:id`, purpose: `Update ${entity.label} records`, roles: ["platform_admin", "operations_manager", "dispatch_coordinator", "warehouse_lead", "technician"] },
  ]);

  for (const workflow of workflows) {
    endpoints.push({
      method: "POST",
      path: `/api/workflows/${workflow.key}/advance`,
      purpose: `Advance the ${workflow.name} workflow`,
      roles: workflow.actors,
      approvalGateKey: workflow.steps.find((step) => step.approvalGateKey)?.approvalGateKey,
    });
  }
  for (const gate of gates) {
    endpoints.push({
      method: "POST",
      path: `/api/approvals/${gate.key}/decision`,
      purpose: `Approve or reject ${gate.name}`,
      roles: gate.requiredRoles,
      approvalGateKey: gate.key,
    });
  }
  return { endpoints };
}

function buildAssumptions(input: OperatorPromptInput, integrations: IntegrationDefinition[], compliance: ComplianceRequirement[]): string[] {
  const assumptions = [
    "Generated apps use tenant-scoped application data and do not persist shared runtime-owned business state in automindlab-stack.",
    "Secrets, provider credentials, and customer-specific deployment values are injected through environment or deployment config only.",
    "Approval-gated actions remain blocked until an authenticated operator approves them in the generated app.",
    "The first version prioritizes internal operations and back-office workflows over external customer-facing portals.",
  ];
  if (!input.constraints.environment) {
    assumptions.push("Environment defaults to a local-first development workspace with later promotion to staging and production.");
  }
  if (!integrations.some((integration) => integration.key === "identity_provider")) {
    assumptions.push("Identity provider selection is deferred until implementation planning confirms the customer SSO stack.");
  }
  if (compliance.length === 0) {
    assumptions.push("No customer-specific compliance regime was supplied beyond production-safe defaults.");
  }
  return assumptions;
}

function buildUnresolvedItems(input: OperatorPromptInput, integrations: IntegrationDefinition[]): string[] {
  const unresolved = [
    "Select the customer identity provider and login method for production deployment.",
    "Confirm tenant partition strategy across regions and environments.",
    "Confirm notification destinations and escalation targets.",
    "Define record retention windows for audit and workflow history.",
  ];
  if (!input.constraints.branding?.primaryColor) {
    unresolved.push("Provide final brand tokens, logos, and any customer-specific type choices.");
  }
  if (integrations.some((integration) => integration.key === "erp_sync")) {
    unresolved.push("Choose the ERP vendor, sync direction, and approved field-level contract.");
  }
  if (!input.constraints.environment) {
    unresolved.push("Confirm the initial deployment environment and promotion process.");
  }
  return unresolved;
}

function buildUncertainty(unresolvedItems: string[], compliance: ComplianceRequirement[], integrations: IntegrationDefinition[]): Uncertainty {
  const reasons = [
    "The spec is intentionally constrained and typed, but some customer deployment decisions remain open.",
  ];
  if (integrations.some((integration) => integration.mode === "future-ready")) {
    reasons.push("At least one requested integration is represented as a future-ready contract placeholder, not a live connection.");
  }
  if (compliance.length === 0) {
    reasons.push("Compliance requirements were inferred from domain cues rather than supplied explicitly.");
  }
  const level = unresolvedItems.length >= 6 ? "low" : unresolvedItems.length >= 4 ? "medium" : "high";
  return {
    level,
    reasons,
    missingContext: unresolvedItems,
    operatorQuestions: unresolvedItems.slice(0, 4),
  };
}

function buildBlueprint(modules: UiModuleDefinition[], workflows: WorkflowDefinition[]): EnterpriseAppSpec["blueprint"] {
  return {
    layout: "Three-zone operator workspace with navigation rail, primary execution surface, and contextual audit/approval rail.",
    routeGroups: modules.map((module) => module.route),
    reusablePrimitives: [
      "tenant-aware dashboard shell",
      "typed CRUD table and detail form",
      "workflow timeline",
      "approval queue",
      "audit event feed",
      "permissions matrix",
      "design token export",
    ],
    backgroundOperations: [
      "generation job tracking",
      "verification command orchestration",
      "daily digest candidate generation",
      ...workflows.map((workflow) => `${workflow.key}-workflow-monitor`),
    ],
    observability: [
      "file-backed job logs",
      "audit event append log",
      "visible verification step results",
      "health endpoint with service status",
    ],
    persistenceOwnership: "Generated customer apps own their own business records, workflow outcomes, and approval decisions. The factory only owns advisory specs, job metadata, and generation artifacts.",
  };
}

export function buildEnterpriseAppSpec(input: OperatorPromptInput): EnterpriseAppSpec {
  const normalized = normalizeText(input);
  const industry = inferIndustry(input, normalized);
  const roles = collectRoles(normalized, input);
  const entities = collectEntities(normalized);
  const integrations = collectIntegrations(normalized, input);
  const complianceRequirements = collectCompliance(normalized, input);
  const uiModules = collectModules(roles);
  const approvalGates = buildApprovalGates(input, normalized);
  const coreWorkflows = buildWorkflows(normalized, entities);
  const assumptions = buildAssumptions(input, integrations, complianceRequirements);
  const unresolvedItems = buildUnresolvedItems(input, integrations);
  const uncertainty = buildUncertainty(unresolvedItems, complianceRequirements, integrations);
  const theme = buildTheme(input, industry);
  const navigation = buildNavigation(uiModules);
  const permissions = buildPermissionMatrix(roles, entities, approvalGates);
  const automationOpportunities: AutomationOpportunity[] = [...BASE_AUTOMATIONS];
  const notificationRules: NotificationRule[] = [...BASE_NOTIFICATIONS];
  const reportingViews: ReportingView[] = [...BASE_REPORTS];
  const settingsSections: SettingsSection[] = [...BASE_SETTINGS];
  const dataModel = buildDataModel(entities);
  const apiDraft: ApiContractDraft = buildApiDraft(entities, coreWorkflows, approvalGates);

  return {
    schemaVersion: SPEC_VERSION,
    generatedAt: new Date().toISOString(),
    customerProfile: {
      name: input.customerName,
      slug: slugify(input.customerName),
      businessSummary: input.businessDescription.trim(),
      industry,
      deploymentEnvironment: input.constraints.environment?.trim() || "local-first with promotion to staging and production",
      tenancy: input.constraints.tenancy === "single-tenant" ? "single-tenant deployment requested; spec still keeps tenant boundaries explicit" : "multi-tenant ready with tenant-scoped business entities",
      branding: theme,
    },
    businessDomain: `${industry} operations`,
    appPurpose: input.applicationNeeds.trim(),
    summary: `${input.customerName} needs an internal enterprise app built from reusable primitives for ${input.applicationNeeds.trim()}`,
    identityAndAccess: {
      authStrategy: "Enterprise SSO or local admin bootstrap with later IdP cutover",
      tenantIsolation: "Tenant-scoped rows, tenant-aware APIs, and no cross-tenant data access by default",
      leastPrivilegeNotes: [
        "Operators get only the modules required for their responsibilities",
        "Approval rights are separated from general operational access",
        "Generated app secrets stay outside source control",
      ],
      approvalPolicy: "Irreversible workflow actions require explicit approval plus audit capture",
    },
    coreWorkflows,
    businessEntities: entities,
    userRoles: roles,
    permissions,
    integrations,
    complianceRequirements,
    navigation,
    uiModules,
    dataModel,
    apiDraft,
    automationOpportunities,
    approvalGates,
    notificationRules,
    reportingViews,
    settingsSections,
    assumptions,
    unresolvedItems,
    uncertainty,
    blueprint: buildBlueprint(uiModules, coreWorkflows),
  };
}
