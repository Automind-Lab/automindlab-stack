export type ConfidenceLevel = "low" | "medium" | "high";
export type IssueSeverity = "error" | "warning" | "info";
export type JobStatus = "queued" | "running" | "completed" | "failed" | "interrupted";
export type AgentProviderMode = "deterministic";
export type AgentNodeType = "host" | "council-seat" | "specialist";
export type AgentRecommendationPriority = "now" | "next" | "later";
export type CapabilitySupportLevel = "supported" | "planned" | "unsupported";
export type CompilerStageStatus = "completed" | "warning" | "blocked";
export type ModuleKind =
  | "shell"
  | "dashboard"
  | "data"
  | "workflow"
  | "approval"
  | "audit"
  | "access"
  | "integration"
  | "notification"
  | "reporting"
  | "settings";
export type RuntimeWidgetKind =
  | "stat-grid"
  | "workflow-list"
  | "entity-table"
  | "approval-list"
  | "audit-feed"
  | "report-list"
  | "settings-list"
  | "integration-list"
  | "role-list"
  | "notification-list"
  | "copy-block";
export type AdapterCategory = "design" | "identity" | "files" | "erp" | "notifications" | "analytics";
export type AdapterMode = "optional" | "active" | "future-ready";
export type AdapterBindingStatus = "selected" | "optional" | "deferred";
export type EvalStatus = "passed" | "warning" | "failed";

export interface BrandingConstraints {
  primaryColor?: string;
  secondaryColor?: string;
  tone?: string;
  logoHint?: string;
}

export interface PromptConstraints {
  industry?: string;
  compliance: string[];
  integrations: string[];
  branding?: BrandingConstraints;
  roles: string[];
  approvalRequirements: string[];
  environment?: string;
  deploymentTarget?: string;
  tenancy?: "single-tenant" | "multi-tenant" | "regional";
}

export interface OperatorPromptInput {
  customerName: string;
  businessDescription: string;
  applicationNeeds: string;
  constraints: PromptConstraints;
}

export interface ThemeConfig {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  canvasColor: string;
  headingFont: string;
  bodyFont: string;
  density: "comfortable" | "balanced" | "dense";
  logoTreatment: string;
}

export interface CustomerProfile {
  name: string;
  slug: string;
  businessSummary: string;
  industry: string;
  deploymentEnvironment: string;
  tenancy: string;
  branding: ThemeConfig;
}

export interface EntityField {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "datetime" | "enum" | "boolean" | "text" | "json";
  required: boolean;
  description: string;
}

export interface BusinessEntity {
  key: string;
  label: string;
  description: string;
  ownership: string;
  tenantScoped: boolean;
  operations: string[];
  relatedEntities: string[];
  fields: EntityField[];
}

export interface WorkflowStep {
  key: string;
  label: string;
  ownerRoles: string[];
  action: string;
  auditEvent: string;
  approvalGateKey?: string;
}

export interface WorkflowDefinition {
  key: string;
  name: string;
  description: string;
  triggers: string[];
  actors: string[];
  steps: WorkflowStep[];
  automationHints: string[];
}

export interface RoleDefinition {
  key: string;
  name: string;
  description: string;
  inheritsFrom: string[];
  visibleModules: string[];
  responsibilities: string[];
  approvalScope: string[];
}

export interface PermissionMatrixEntry {
  roleKey: string;
  resource: string;
  actions: string[];
  approvalRequiredFor: string[];
}

export interface IntegrationDefinition {
  key: string;
  name: string;
  category: "data" | "identity" | "notifications" | "erp" | "files" | "analytics";
  mode: "active" | "future-ready";
  direction: "inbound" | "outbound" | "bidirectional";
  notes: string;
}

export interface ComplianceRequirement {
  key: string;
  name: string;
  rationale: string;
  controls: string[];
}

export interface UiModuleDefinition {
  key: string;
  name: string;
  purpose: string;
  route: string;
  primitive: string;
  roles: string[];
}

export interface NavigationItem {
  key: string;
  label: string;
  route: string;
  moduleKey: string;
  requiredRoles: string[];
}

export interface DataTableDraft {
  name: string;
  purpose: string;
  owner: string;
  columns: string[];
}

export interface DataRelationshipDraft {
  from: string;
  to: string;
  relationship: string;
}

export interface DataModelDraft {
  tables: DataTableDraft[];
  relationships: DataRelationshipDraft[];
}

export interface ApiEndpointDraft {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  purpose: string;
  roles: string[];
  approvalGateKey?: string;
}

export interface ApiContractDraft {
  endpoints: ApiEndpointDraft[];
}

export interface AutomationOpportunity {
  key: string;
  name: string;
  trigger: string;
  outcome: string;
  humanReview: string;
}

export interface ApprovalGate {
  key: string;
  name: string;
  description: string;
  risk: "moderate" | "high" | "critical";
  trigger: string;
  requiredRoles: string[];
  auditEvent: string;
}

export interface NotificationRule {
  key: string;
  name: string;
  trigger: string;
  channel: string;
  escalation: string;
}

export interface ReportingView {
  key: string;
  name: string;
  purpose: string;
  cadence: string;
}

export interface SettingsSection {
  key: string;
  name: string;
  purpose: string;
  owners: string[];
}

export interface IdentityAndAccessModel {
  authStrategy: string;
  tenantIsolation: string;
  leastPrivilegeNotes: string[];
  approvalPolicy: string;
}

export interface BlueprintDefinition {
  layout: string;
  routeGroups: string[];
  reusablePrimitives: string[];
  backgroundOperations: string[];
  observability: string[];
  persistenceOwnership: string;
}

export interface Uncertainty {
  level: ConfidenceLevel;
  reasons: string[];
  missingContext: string[];
  operatorQuestions: string[];
}

export interface RuntimeWidgetBlueprint {
  key: string;
  title: string;
  kind: RuntimeWidgetKind;
  source: string;
  description: string;
}

export interface ModuleRegistryEntry {
  key: string;
  name: string;
  description: string;
  kind: ModuleKind;
  route: string;
  primitive: string;
  domainTags: string[];
  defaultRoles: string[];
  editableSurfaces: string[];
  requiredAdapterKeys: string[];
  approvalTouchpoints: string[];
  observability: string[];
  widgetBlueprints: RuntimeWidgetBlueprint[];
}

export interface DomainPackSummary {
  key: string;
  name: string;
  version: string;
  description: string;
  triggerKeywords: string[];
  selectedWhen: string;
  moduleKeys: string[];
  roleKeys: string[];
  entityKeys: string[];
  workflowKeys: string[];
  integrationKeys: string[];
  complianceKeys: string[];
  adapterKeys: string[];
  notes: string[];
}

export interface AdapterSdkDefinition {
  key: string;
  name: string;
  category: AdapterCategory;
  mode: AdapterMode;
  description: string;
  runtimeBoundary: string;
  secretsModel: string;
  failureMode: string;
  configFields: string[];
  hookPoints: string[];
}

export interface AdapterBinding {
  key: string;
  name: string;
  mode: AdapterMode;
  status: AdapterBindingStatus;
  reason: string;
  reviewNotes: string[];
}

export interface CompilerStageResult {
  key: string;
  name: string;
  status: CompilerStageStatus;
  summary: string;
  selectedKeys: string[];
  warnings: string[];
}

export interface CompiledModuleSelection {
  key: string;
  name: string;
  route: string;
  kind: ModuleKind;
  source: "base" | "domain-pack" | "explicit";
  reason: string;
  roles: string[];
  domainTags: string[];
  editableSurfaces: string[];
}

export interface CompilerReport {
  compilerVersion: string;
  specVersion: string;
  targetRuntime: string;
  selectedDomainPackKeys: string[];
  selectedModuleKeys: string[];
  selectedAdapterKeys: string[];
  stageResults: CompilerStageResult[];
  notes: string[];
}

export interface RuntimeKitEditableFile {
  label: string;
  path: string;
  purpose: string;
  required: boolean;
}

export interface RuntimeKitPage {
  key: string;
  title: string;
  route: string;
  moduleKey: string;
  layout: string;
  summary: string;
  roles: string[];
  widgets: RuntimeWidgetBlueprint[];
  emptyState: string;
  approvalHints: string[];
}

export interface GeneratedRuntimeKit {
  kitVersion: string;
  compilerVersion: string;
  shell: {
    homePageKey: string;
    navigationStyle: string;
    density: string;
    tenantBanner: string;
    approvalBanner: string;
  };
  moduleSelections: CompiledModuleSelection[];
  pages: RuntimeKitPage[];
  adapters: AdapterBinding[];
  editableFiles: RuntimeKitEditableFile[];
  smokeChecks: string[];
}

export interface EvalCaseResult {
  key: string;
  label: string;
  status: EvalStatus;
  summary: string;
  details: string[];
}

export interface EvalSuiteResult {
  suiteVersion: string;
  overallStatus: EvalStatus;
  score: number;
  summary: string;
  cases: EvalCaseResult[];
}

export interface EnterpriseAppSpec {
  schemaVersion: string;
  generatedAt: string;
  compiler: CompilerReport;
  customerProfile: CustomerProfile;
  businessDomain: string;
  appPurpose: string;
  summary: string;
  identityAndAccess: IdentityAndAccessModel;
  coreWorkflows: WorkflowDefinition[];
  businessEntities: BusinessEntity[];
  userRoles: RoleDefinition[];
  permissions: PermissionMatrixEntry[];
  integrations: IntegrationDefinition[];
  complianceRequirements: ComplianceRequirement[];
  navigation: NavigationItem[];
  uiModules: UiModuleDefinition[];
  moduleSelections: CompiledModuleSelection[];
  adapterBindings: AdapterBinding[];
  dataModel: DataModelDraft;
  apiDraft: ApiContractDraft;
  automationOpportunities: AutomationOpportunity[];
  approvalGates: ApprovalGate[];
  notificationRules: NotificationRule[];
  reportingViews: ReportingView[];
  settingsSections: SettingsSection[];
  assumptions: string[];
  unresolvedItems: string[];
  uncertainty: Uncertainty;
  blueprint: BlueprintDefinition;
}

export interface ValidationIssue {
  code: string;
  severity: IssueSeverity;
  path: string;
  message: string;
  suggestedAction: string;
}

export interface ValidationResult {
  valid: boolean;
  confidence: ConfidenceLevel;
  issues: ValidationIssue[];
  summary: string;
}

export interface DesignToken {
  name: string;
  value: string;
  type: "color" | "font" | "spacing" | "radius" | "shadow";
}

export interface DesignTokenCollection {
  key: string;
  name: string;
  tokenNames: string[];
}

export interface ThemeVariable {
  name: string;
  cssVar: string;
  value: string;
}

export interface DesignComponentManifestEntry {
  key: string;
  name: string;
  sourceModule: string;
  editableProps: string[];
}

export interface ScreenMapEntry {
  key: string;
  title: string;
  route: string;
  purpose: string;
}

export interface PageSectionMapEntry {
  key: string;
  screenKey: string;
  moduleKey: string;
  title: string;
  primitive: string;
  copyKeys: string[];
}

export interface ContentModelEntry {
  key: string;
  entityKey: string;
  label: string;
  ownership: string;
  fields: string[];
  notes: string[];
}

export interface CopyMapEntry {
  key: string;
  text: string;
  location: string;
}

export interface FigmaAdapterDefinition {
  enabled: boolean;
  mode: "optional" | "configured";
  adapterKey: string;
  importContract: string;
  exportContract: string;
  notes: string[];
}

export interface DesignHandoffPackage {
  generatedAt: string;
  themeConfig: ThemeConfig;
  tokens: DesignToken[];
  tokenCollections: DesignTokenCollection[];
  themeVariables: ThemeVariable[];
  componentManifest: DesignComponentManifestEntry[];
  screenMap: ScreenMapEntry[];
  pageSections: PageSectionMapEntry[];
  contentModel: ContentModelEntry[];
  copyMap: CopyMapEntry[];
  figmaAdapter: FigmaAdapterDefinition;
}

export interface GenerationApproval {
  approvedBy: string;
  approvedAt: string;
  reason: string;
  acknowledgedRisks: string[];
}

export interface GenerationRequest {
  prompt: OperatorPromptInput;
  spec: EnterpriseAppSpec;
  approval: GenerationApproval;
}

export interface GenerationArtifact {
  key: string;
  type: "workspace" | "archive" | "design" | "docs" | "manifest" | "runtime-kit" | "eval";
  path: string;
  label: string;
  downloadable?: boolean;
  downloadName?: string;
}

export interface VerificationStepResult {
  step: string;
  status: "passed" | "failed" | "skipped";
  details: string;
}

export interface RepairSummary {
  attempted: boolean;
  actions: string[];
  unresolved: string[];
}

export interface GenerationLogEntry {
  at: string;
  stage: string;
  message: string;
  level: "info" | "warning" | "error";
}

export interface OperatorHandoffLink {
  label: string;
  path: string;
}

export interface OperatorHandoff {
  startupInstructions: string[];
  architectureSummary: string[];
  assumptions: string[];
  knownLimitations: string[];
  nextRecommendedEdits: string[];
  customizationAreas: OperatorHandoffLink[];
  runtimeKitHighlights: string[];
  adapterReviewAreas: string[];
  approvalReviewAreas: string[];
  testingChecklist: string[];
}

export interface GenerationJob {
  id: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  prompt: OperatorPromptInput;
  spec: EnterpriseAppSpec;
  compilerReport: CompilerReport;
  validation: ValidationResult;
  runtimeKit: GeneratedRuntimeKit;
  evalSuite: EvalSuiteResult;
  approval: GenerationApproval;
  workspacePath?: string;
  artifacts: GenerationArtifact[];
  verification: VerificationStepResult[];
  repairSummary: RepairSummary;
  logs: GenerationLogEntry[];
  handoff?: OperatorHandoff;
  failureReason?: string;
}

export interface DesignImportRequest {
  packageName: string;
  json: string;
}

export interface DesignImportResult {
  valid: boolean;
  warnings: string[];
  proposedTheme?: ThemeConfig;
  parsedPackage?: Partial<DesignHandoffPackage>;
}

export interface AgentCapabilityStatus {
  key: string;
  label: string;
  support: CapabilitySupportLevel;
  notes: string;
}

export interface AgentDefinition {
  key: string;
  name: string;
  type: AgentNodeType;
  description: string;
  lens: string;
  capabilities: string[];
  allowedDelegates: string[];
  maxDelegationDepth: number;
  boundaries: string[];
}

export interface AgentRegistry {
  providerModes: AgentProviderMode[];
  host: AgentDefinition;
  agents: AgentDefinition[];
  capabilityMatrix: AgentCapabilityStatus[];
}

export interface AgentRunRequest {
  prompt: OperatorPromptInput;
  spec: EnterpriseAppSpec;
  operator: string;
  focus: string[];
  requestedSeatKeys: string[];
  allowDelegation: boolean;
  maxDelegationDepth: number;
  providerMode?: AgentProviderMode;
  linkedGenerationJobId?: string;
}

export interface AgentFinding {
  severity: IssueSeverity;
  title: string;
  detail: string;
  safeAction: string;
}

export interface AgentRecommendation {
  key: string;
  title: string;
  rationale: string;
  priority: AgentRecommendationPriority;
  owner: string;
  blocking: boolean;
}

export interface AgentDelegationPlanEntry {
  from: string;
  to: string;
  purpose: string;
  reason: string;
}

export interface AgentExecutionLogEntry {
  at: string;
  agentKey: string;
  depth: number;
  message: string;
  level: "info" | "warning" | "error";
}

export interface AgentRunNode {
  id: string;
  agentKey: string;
  name: string;
  type: AgentNodeType;
  depth: number;
  status: JobStatus;
  purpose: string;
  summary: string;
  findings: AgentFinding[];
  recommendations: AgentRecommendation[];
  children: AgentRunNode[];
}

export interface AgentRun {
  id: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  providerMode: AgentProviderMode;
  operator: string;
  linkedGenerationJobId?: string;
  request: AgentRunRequest;
  selectedSeatKeys: string[];
  summary: string;
  root: AgentRunNode;
  delegationPlan: AgentDelegationPlanEntry[];
  capabilityMatrix: AgentCapabilityStatus[];
  uncertainty: Uncertainty;
  warnings: string[];
  logs: AgentExecutionLogEntry[];
  failureReason?: string;
}
