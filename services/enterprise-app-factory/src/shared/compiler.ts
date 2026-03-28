import {
  BASE_APPROVAL_GATES,
  BASE_AUTOMATIONS,
  BASE_NOTIFICATIONS,
  BASE_REPORTS,
  BASE_SETTINGS,
  COMPLIANCE_LIBRARY,
  ENTITY_LIBRARY,
  INTEGRATION_LIBRARY,
  ROLE_LIBRARY,
  WORKFLOW_LIBRARY,
} from "./catalog.js";
import { ADAPTER_SDK_CATALOG, getAdapterDefinition } from "./adapter-sdk.js";
import { buildDesignHandoff } from "./design-handoff.js";
import { DOMAIN_PACK_CATALOG } from "./domain-packs.js";
import { runEnterpriseAppFactoryEvals } from "./eval-harness.js";
import type {
  AdapterBinding,
  AdapterSdkDefinition,
  ApiContractDraft,
  ApprovalGate,
  BusinessEntity,
  CompilerReport,
  CompilerStageResult,
  CompiledModuleSelection,
  ComplianceRequirement,
  DataModelDraft,
  DesignHandoffPackage,
  DomainPackSummary,
  EnterpriseAppSpec,
  EvalSuiteResult,
  GeneratedRuntimeKit,
  IntegrationDefinition,
  ModuleRegistryEntry,
  NavigationItem,
  OperatorPromptInput,
  PermissionMatrixEntry,
  RoleDefinition,
  ThemeConfig,
  UiModuleDefinition,
  Uncertainty,
  WorkflowDefinition,
} from "./contracts.js";
import { MODULE_REGISTRY, getModuleRegistryEntry } from "./module-registry.js";
import { buildGeneratedRuntimeKit } from "./runtime-kit.js";

export const COMPILER_VERSION = "2026-03-28.compiler.v2";
export const SPEC_VERSION = "2026-03-28.spec.v2";
export const TARGET_RUNTIME = "generated-runtime-kit.v2";

export interface CompiledEnterpriseApp {
  spec: EnterpriseAppSpec;
  compilerReport: CompilerReport;
  runtimeKit: GeneratedRuntimeKit;
  designHandoff: DesignHandoffPackage;
  evalSuite: EvalSuiteResult;
  moduleRegistry: ModuleRegistryEntry[];
  selectedDomainPacks: DomainPackSummary[];
  domainPackCatalog: DomainPackSummary[];
  adapterCatalog: AdapterSdkDefinition[];
}

function now(): string {
  return new Date().toISOString();
}

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
    input.constraints.environment ?? "",
    input.constraints.deploymentTarget ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function containsAny(haystack: string, keywords: string[]): boolean {
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function uniqueStrings(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)));
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
  if (containsAny(normalized, ["service", "technician", "field"])) {
    return "Field Service Operations";
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

function selectDomainPacks(normalized: string): DomainPackSummary[] {
  const selected = DOMAIN_PACK_CATALOG.filter((pack) => pack.key === "core-operations");
  for (const pack of DOMAIN_PACK_CATALOG) {
    if (pack.key === "core-operations") {
      continue;
    }
    if (containsAny(normalized, pack.triggerKeywords)) {
      selected.push(pack);
    }
  }
  return selected;
}

function lookupRoleKey(raw: string): string | undefined {
  const slug = slugify(raw);
  if (ROLE_LIBRARY[slug]) {
    return slug;
  }
  if (containsAny(raw.toLowerCase(), ["dispatch"])) {
    return "dispatch_coordinator";
  }
  if (containsAny(raw.toLowerCase(), ["warehouse", "inventory"])) {
    return "warehouse_lead";
  }
  if (containsAny(raw.toLowerCase(), ["technician", "field", "service"])) {
    return "technician";
  }
  if (containsAny(raw.toLowerCase(), ["account", "customer"])) {
    return "account_manager";
  }
  if (containsAny(raw.toLowerCase(), ["report"])) {
    return "reporting_analyst";
  }
  return undefined;
}

function buildRoles(domainPacks: DomainPackSummary[], input: OperatorPromptInput): RoleDefinition[] {
  const roleKeys = uniqueStrings(domainPacks.flatMap((pack) => pack.roleKeys));
  const roles = roleKeys
    .map((key) => ROLE_LIBRARY[key])
    .filter((role): role is RoleDefinition => Boolean(role));

  for (const explicitRole of input.constraints.roles) {
    const mappedKey = lookupRoleKey(explicitRole);
    if (mappedKey && ROLE_LIBRARY[mappedKey]) {
      roles.push(ROLE_LIBRARY[mappedKey]);
      continue;
    }
    const customKey = slugify(explicitRole);
    roles.push({
      key: customKey,
      name: explicitRole,
      description: `Explicitly requested role for ${input.customerName}.`,
      inheritsFrom: [],
      visibleModules: ["dashboard", "entity-workbench", "workflow-orchestrator"],
      responsibilities: ["Role-specific operational work"],
      approvalScope: [],
    });
  }

  return Array.from(new Map(roles.map((role) => [role.key, role])).values());
}

function buildEntities(domainPacks: DomainPackSummary[]): BusinessEntity[] {
  const entityKeys = uniqueStrings(domainPacks.flatMap((pack) => pack.entityKeys));
  const selected = entityKeys
    .map((key) => ENTITY_LIBRARY[key])
    .filter((entity): entity is BusinessEntity => Boolean(entity));
  return selected.length > 0 ? selected : [ENTITY_LIBRARY.approval_request];
}

function lookupIntegrationKey(raw: string): string | undefined {
  const lower = raw.toLowerCase();
  if (containsAny(lower, ["erp", "sap", "oracle", "netsuite"])) {
    return "erp_sync";
  }
  if (containsAny(lower, ["csv", "import", "export"])) {
    return "csv_exchange";
  }
  if (containsAny(lower, ["email", "notification", "alert"])) {
    return "email_notifications";
  }
  if (containsAny(lower, ["identity", "sso", "okta", "entra", "oidc", "saml"])) {
    return "identity_provider";
  }
  return undefined;
}

function buildIntegrations(domainPacks: DomainPackSummary[], input: OperatorPromptInput): IntegrationDefinition[] {
  const selected = domainPacks.flatMap((pack) => pack.integrationKeys).map((key) => INTEGRATION_LIBRARY[key]).filter(Boolean);
  for (const requested of input.constraints.integrations) {
    const key = lookupIntegrationKey(requested);
    if (key && INTEGRATION_LIBRARY[key]) {
      selected.push(INTEGRATION_LIBRARY[key]);
      continue;
    }
    selected.push({
      key: slugify(requested),
      name: requested,
      category: "data",
      mode: "future-ready",
      direction: "bidirectional",
      notes: "Explicitly requested integration with a contract-first placeholder until deployment review confirms ownership and fields.",
    });
  }
  if (!selected.some((item) => item.key === "identity_provider")) {
    selected.push(INTEGRATION_LIBRARY.identity_provider);
  }
  return Array.from(new Map(selected.map((integration) => [integration.key, integration])).values());
}

function lookupComplianceKey(raw: string): string | undefined {
  const lower = raw.toLowerCase();
  if (containsAny(lower, ["medical", "hospital", "traceability"])) {
    return "health-operations-traceability";
  }
  if (containsAny(lower, ["audit"])) {
    return "audit-evidence";
  }
  if (containsAny(lower, ["tenant", "multi-tenant"])) {
    return "tenant-isolation";
  }
  return undefined;
}

function buildCompliance(domainPacks: DomainPackSummary[], input: OperatorPromptInput): ComplianceRequirement[] {
  const selected = domainPacks.flatMap((pack) => pack.complianceKeys).map((key) => COMPLIANCE_LIBRARY[key]).filter(Boolean);
  for (const requested of input.constraints.compliance) {
    const key = lookupComplianceKey(requested);
    if (key && COMPLIANCE_LIBRARY[key]) {
      selected.push(COMPLIANCE_LIBRARY[key]);
      continue;
    }
    selected.push({
      key: slugify(requested),
      name: requested,
      rationale: `Operator requested ${requested} as a compliance or safety constraint.`,
      controls: ["Document this control explicitly in deployment review", "Add customer-specific evidence requirements before go-live"],
    });
  }
  return Array.from(new Map(selected.map((requirement) => [requirement.key, requirement])).values());
}

function buildWorkflows(domainPacks: DomainPackSummary[], input: OperatorPromptInput, normalized: string): WorkflowDefinition[] {
  const workflowKeys = uniqueStrings(domainPacks.flatMap((pack) => pack.workflowKeys));
  const selected = workflowKeys.map((key) => WORKFLOW_LIBRARY[key]).filter((workflow): workflow is WorkflowDefinition => Boolean(workflow));
  if ((input.constraints.approvalRequirements.length > 0 || containsAny(normalized, ["approval", "approve"])) && !selected.some((workflow) => workflow.key === "approval")) {
    selected.push(WORKFLOW_LIBRARY.approval);
  }
  if (!selected.some((workflow) => workflow.key === "reporting")) {
    selected.push(WORKFLOW_LIBRARY.reporting);
  }
  return Array.from(new Map(selected.map((workflow) => [workflow.key, workflow])).values());
}

function buildApprovalGates(input: OperatorPromptInput): ApprovalGate[] {
  const gates = [...BASE_APPROVAL_GATES];
  for (const requested of input.constraints.approvalRequirements) {
    const key = slugify(requested);
    if (gates.some((gate) => gate.key === key)) {
      continue;
    }
    gates.push({
      key,
      name: requested,
      description: `Operator-requested approval guardrail for ${requested}.`,
      risk: "high",
      trigger: `Any workflow action classified as ${requested}.`,
      requiredRoles: ["operations_manager", "approver"],
      auditEvent: `approval.${key}.reviewed`,
    });
  }
  return gates;
}

function selectionSource(moduleKey: string, domainPacks: DomainPackSummary[]): "base" | "domain-pack" | "explicit" {
  return domainPacks.some((pack) => pack.key !== "core-operations" && pack.moduleKeys.includes(moduleKey))
    ? "domain-pack"
    : "base";
}

function buildModuleSelections(
  domainPacks: DomainPackSummary[],
  roles: RoleDefinition[],
  normalized: string,
): CompiledModuleSelection[] {
  const selectedKeys = uniqueStrings(domainPacks.flatMap((pack) => pack.moduleKeys));

  if (containsAny(normalized, ["csv", "import", "export"]) && !selectedKeys.includes("integrations")) {
    selectedKeys.push("integrations");
  }

  return selectedKeys
    .map((key) => getModuleRegistryEntry(key))
    .filter((entry): entry is ModuleRegistryEntry => Boolean(entry))
    .map((entry) => ({
      key: entry.key,
      name: entry.name,
      route: entry.route,
      kind: entry.kind,
      source: selectionSource(entry.key, domainPacks),
      reason: `Selected from ${selectionSource(entry.key, domainPacks) === "domain-pack" ? "domain pack coverage" : "core compiler coverage"} for the requested workflows and operators.`,
      roles: entry.defaultRoles.filter((roleKey) => roles.some((role) => role.key === roleKey)),
      domainTags: entry.domainTags,
      editableSurfaces: entry.editableSurfaces,
    }));
}

function buildUiModules(moduleSelections: CompiledModuleSelection[]): UiModuleDefinition[] {
  return moduleSelections.map((selection) => {
    const entry = getModuleRegistryEntry(selection.key);
    return {
      key: selection.key,
      name: selection.name,
      purpose: entry?.description ?? selection.reason,
      route: selection.route,
      primitive: entry?.primitive ?? "typed-module-surface",
      roles: selection.roles,
    };
  });
}

function buildNavigation(moduleSelections: CompiledModuleSelection[]): NavigationItem[] {
  return moduleSelections.map((moduleSelection) => ({
    key: moduleSelection.key,
    label: moduleSelection.name,
    route: moduleSelection.route,
    moduleKey: moduleSelection.key,
    requiredRoles: moduleSelection.roles,
  }));
}

function buildAdapterBindings(
  domainPacks: DomainPackSummary[],
  integrations: IntegrationDefinition[],
  moduleSelections: CompiledModuleSelection[],
): AdapterBinding[] {
  const adapterKeys = uniqueStrings([
    "design-handoff-adapter",
    "figma-bridge-adapter",
    ...domainPacks.flatMap((pack) => pack.adapterKeys),
    ...moduleSelections.flatMap((selection) => getModuleRegistryEntry(selection.key)?.requiredAdapterKeys ?? []),
    ...(integrations.some((integration) => integration.key === "csv_exchange") ? ["csv-batch-gateway"] : []),
    ...(integrations.some((integration) => integration.key === "erp_sync") ? ["erp-sync-sdk"] : []),
    ...(integrations.some((integration) => integration.key === "identity_provider") ? ["identity-provider-adapter"] : []),
    ...(integrations.some((integration) => integration.key === "email_notifications") ? ["notification-router-adapter"] : []),
  ]);

  return adapterKeys
    .map((key) => getAdapterDefinition(key))
    .filter((definition): definition is AdapterSdkDefinition => Boolean(definition))
    .map((definition) => ({
      key: definition.key,
      name: definition.name,
      mode: definition.mode,
      status:
        definition.key === "figma-bridge-adapter"
          ? "optional"
          : definition.mode === "future-ready"
            ? "deferred"
            : "selected",
      reason: definition.description,
      reviewNotes: [definition.runtimeBoundary, definition.failureMode],
    }));
}

function buildPermissionMatrix(
  roles: RoleDefinition[],
  entities: BusinessEntity[],
  approvalGates: ApprovalGate[],
): PermissionMatrixEntry[] {
  const approvalMap = new Set(approvalGates.map((gate) => gate.key));
  const entries: PermissionMatrixEntry[] = [];
  for (const role of roles) {
    for (const entity of entities) {
      const actions = entity.operations.filter((operation) => {
        if (role.key === "auditor") {
          return operation === "read";
        }
        if (role.key === "technician") {
          return ["read", "update", "complete", "resolve"].includes(operation);
        }
        return true;
      });
      const approvalRequiredFor = entity.operations.filter((operation) => {
        const approvalMatch =
          (operation === "retire" && approvalMap.has("inventory-disposition")) ||
          (operation === "assign" && approvalMap.has("rbac-change")) ||
          (operation === "complete" && approvalMap.has("urgent-replacement")) ||
          (operation === "approve" && approvalMap.has("urgent-replacement"));
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

function buildApiDraft(
  entities: BusinessEntity[],
  workflows: WorkflowDefinition[],
  approvalGates: ApprovalGate[],
): ApiContractDraft {
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
  for (const gate of approvalGates) {
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

function buildAssumptions(
  input: OperatorPromptInput,
  integrations: IntegrationDefinition[],
  adapters: AdapterBinding[],
): string[] {
  const assumptions = [
    "Generated apps use tenant-scoped application data and do not persist shared runtime-owned business state in automindlab-stack.",
    "Secrets, provider credentials, and customer-specific deployment values are injected through environment or deployment config only.",
    "Approval-gated actions remain blocked until an authenticated operator approves them in the generated app.",
    "The compiler assembles apps from module registry entries, domain packs, and adapter manifests rather than free-form code generation.",
  ];
  if (!input.constraints.environment) {
    assumptions.push("Environment defaults to a local-first development workspace with later promotion to staging and production.");
  }
  if (integrations.some((integration) => integration.key === "erp_sync")) {
    assumptions.push("ERP support remains contract-first until vendor, field mapping, and approval posture are confirmed.");
  }
  if (adapters.some((adapter) => adapter.key === "figma-bridge-adapter")) {
    assumptions.push("Figma support stays adapter-based and optional; generation never depends on it.");
  }
  return assumptions;
}

function buildUnresolvedItems(
  input: OperatorPromptInput,
  integrations: IntegrationDefinition[],
  adapters: AdapterBinding[],
): string[] {
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
  if (adapters.some((adapter) => adapter.key === "figma-bridge-adapter")) {
    unresolved.push("Decide whether a future Figma bridge adapter should be configured or left optional.");
  }
  if (!input.constraints.environment) {
    unresolved.push("Confirm the initial deployment environment and promotion process.");
  }
  return unresolved;
}

function buildUncertainty(unresolvedItems: string[], integrations: IntegrationDefinition[], adapters: AdapterBinding[]): Uncertainty {
  const reasons = [
    "The compiler is deterministic and typed, but some customer deployment and adapter choices remain open on purpose.",
  ];
  if (integrations.some((integration) => integration.mode === "future-ready")) {
    reasons.push("At least one requested integration is represented as a future-ready contract placeholder, not a live connection.");
  }
  if (adapters.some((adapter) => adapter.status === "deferred")) {
    reasons.push("At least one adapter remains deferred until customer-specific configuration is confirmed.");
  }
  const level = unresolvedItems.length >= 6 ? "low" : unresolvedItems.length >= 4 ? "medium" : "high";
  return {
    level,
    reasons,
    missingContext: unresolvedItems,
    operatorQuestions: unresolvedItems.slice(0, 4),
  };
}

function buildBlueprint(moduleSelections: CompiledModuleSelection[], workflows: WorkflowDefinition[]): EnterpriseAppSpec["blueprint"] {
  return {
    layout: "Three-zone operator workspace with navigation rail, primary execution surface, and contextual audit and approval rail.",
    routeGroups: moduleSelections.map((selection) => selection.route),
    reusablePrimitives: uniqueStrings(moduleSelections.map((selection) => getModuleRegistryEntry(selection.key)?.primitive ?? "typed-module-surface")),
    backgroundOperations: [
      "generation job tracking",
      "verification command orchestration",
      "design handoff packaging",
      "eval summary generation",
      ...workflows.map((workflow) => `${workflow.key}-workflow-monitor`),
    ],
    observability: [
      "file-backed job logs",
      "audit event append log",
      "visible verification step results",
      "health endpoint with service status",
      "compiler eval summary",
    ],
    persistenceOwnership: "Generated customer apps own their own business records, workflow outcomes, and approval decisions. The factory only owns advisory specs, compiler metadata, job metadata, and generation artifacts.",
  };
}

function makeStage(
  key: string,
  name: string,
  summary: string,
  selectedKeys: string[],
  warnings: string[] = [],
): CompilerStageResult {
  return {
    key,
    name,
    status: warnings.length > 0 ? "warning" : "completed",
    summary,
    selectedKeys,
    warnings,
  };
}

export function compileEnterpriseApp(input: OperatorPromptInput): CompiledEnterpriseApp {
  const normalized = normalizeText(input);
  const industry = inferIndustry(input, normalized);
  const domainPacks = selectDomainPacks(normalized);
  const roles = buildRoles(domainPacks, input);
  const entities = buildEntities(domainPacks);
  const integrations = buildIntegrations(domainPacks, input);
  const approvalGates = buildApprovalGates(input);
  const workflows = buildWorkflows(domainPacks, input, normalized);
  const moduleSelections = buildModuleSelections(domainPacks, roles, normalized);
  const uiModules = buildUiModules(moduleSelections);
  const navigation = buildNavigation(moduleSelections);
  const adapterBindings = buildAdapterBindings(domainPacks, integrations, moduleSelections);
  const complianceRequirements = buildCompliance(domainPacks, input);
  const assumptions = buildAssumptions(input, integrations, adapterBindings);
  const unresolvedItems = buildUnresolvedItems(input, integrations, adapterBindings);
  const uncertainty = buildUncertainty(unresolvedItems, integrations, adapterBindings);
  const theme = buildTheme(input, industry);
  const permissions = buildPermissionMatrix(roles, entities, approvalGates);
  const dataModel = buildDataModel(entities);
  const apiDraft = buildApiDraft(entities, workflows, approvalGates);

  const stageResults: CompilerStageResult[] = [
    makeStage("normalize", "Normalize Prompt", `Normalized operator prompt for ${input.customerName}.`, [slugify(input.customerName)]),
    makeStage(
      "domain-packs",
      "Select Domain Packs",
      `Selected ${domainPacks.length} domain pack(s) to cover the requested customer case.`,
      domainPacks.map((pack) => pack.key),
      domainPacks.length === 1 ? ["Only the baseline core operations pack matched. Consider adding customer-specific detail if broader coverage is needed."] : [],
    ),
    makeStage("modules", "Select Modules", `Selected ${moduleSelections.length} module(s) from the registry.`, moduleSelections.map((selection) => selection.key)),
    makeStage("adapters", "Bind Adapters", `Selected ${adapterBindings.length} adapter binding(s).`, adapterBindings.map((binding) => binding.key)),
  ];

  const compilerReportBase: CompilerReport = {
    compilerVersion: COMPILER_VERSION,
    specVersion: SPEC_VERSION,
    targetRuntime: TARGET_RUNTIME,
    selectedDomainPackKeys: domainPacks.map((pack) => pack.key),
    selectedModuleKeys: moduleSelections.map((selection) => selection.key),
    selectedAdapterKeys: adapterBindings.map((binding) => binding.key),
    stageResults: [
      ...stageResults,
      makeStage("spec-assembly", "Assemble Spec", `Built typed entities, workflows, permissions, approvals, and adapter bindings for ${input.customerName}.`, [
        ...entities.map((entity) => entity.key),
        ...workflows.map((workflow) => workflow.key),
      ]),
    ],
    notes: [
      ...domainPacks.flatMap((pack) => pack.notes),
      "The compiler keeps uncertainty, deferred integrations, and post-generation edit surfaces visible.",
    ],
  };

  const specBase: EnterpriseAppSpec = {
    schemaVersion: SPEC_VERSION,
    generatedAt: now(),
    compiler: compilerReportBase,
    customerProfile: {
      name: input.customerName,
      slug: slugify(input.customerName),
      businessSummary: input.businessDescription.trim(),
      industry,
      deploymentEnvironment: input.constraints.environment?.trim() || "local-first with promotion to staging and production",
      tenancy:
        input.constraints.tenancy === "single-tenant"
          ? "single-tenant deployment requested; spec still keeps tenant boundaries explicit"
          : "multi-tenant ready with tenant-scoped business entities",
      branding: theme,
    },
    businessDomain: `${industry} operations`,
    appPurpose: input.applicationNeeds.trim(),
    summary: `${input.customerName} needs an internal enterprise app built from reusable modules, domain packs, and typed contracts for ${input.applicationNeeds.trim()}`,
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
    coreWorkflows: workflows,
    businessEntities: entities,
    userRoles: roles,
    permissions,
    integrations,
    complianceRequirements,
    navigation,
    uiModules,
    moduleSelections,
    adapterBindings,
    dataModel,
    apiDraft,
    automationOpportunities: [...BASE_AUTOMATIONS],
    approvalGates,
    notificationRules: [...BASE_NOTIFICATIONS],
    reportingViews: [...BASE_REPORTS],
    settingsSections: [...BASE_SETTINGS],
    assumptions,
    unresolvedItems,
    uncertainty,
    blueprint: buildBlueprint(moduleSelections, workflows),
  };

  const runtimeKit = buildGeneratedRuntimeKit(specBase, moduleSelections, adapterBindings);
  const designHandoff = buildDesignHandoff(specBase, runtimeKit);
  const evalSuite = runEnterpriseAppFactoryEvals(specBase, runtimeKit, designHandoff);

  const compilerReport: CompilerReport = {
    ...compilerReportBase,
    stageResults: [
      ...compilerReportBase.stageResults,
      makeStage("runtime-kit", "Build Runtime Kit", `Built runtime kit with ${runtimeKit.pages.length} page(s).`, runtimeKit.pages.map((page) => page.key)),
      makeStage("design-handoff", "Build Design Handoff", `Built design handoff with ${designHandoff.tokens.length} token(s) and ${designHandoff.screenMap.length} screen(s).`, designHandoff.screenMap.map((screen) => screen.key)),
      makeStage(
        "evals",
        "Run Compiler Evals",
        evalSuite.summary,
        evalSuite.cases.map((item) => item.key),
        evalSuite.overallStatus === "warning"
          ? evalSuite.cases.filter((item) => item.status === "warning").map((item) => item.summary)
          : evalSuite.overallStatus === "failed"
            ? evalSuite.cases.filter((item) => item.status === "failed").map((item) => item.summary)
            : [],
      ),
    ],
  };

  const spec: EnterpriseAppSpec = {
    ...specBase,
    compiler: compilerReport,
  };

  return {
    spec,
    compilerReport,
    runtimeKit,
    designHandoff,
    evalSuite,
    moduleRegistry: MODULE_REGISTRY,
    selectedDomainPacks: domainPacks,
    domainPackCatalog: DOMAIN_PACK_CATALOG,
    adapterCatalog: ADAPTER_SDK_CATALOG,
  };
}
