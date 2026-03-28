export interface BrandingTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  canvasColor: string;
  [key: string]: unknown;
}

export interface NavigationItem {
  key: string;
  label: string;
  route: string;
  [key: string]: unknown;
}

export interface EntityField {
  key: string;
  label: string;
  type: string;
  [key: string]: unknown;
}

export interface BusinessEntity {
  key: string;
  label: string;
  description: string;
  fields: EntityField[];
  operations: string[];
  [key: string]: unknown;
}

export interface WorkflowStep {
  key: string;
  label: string;
  action: string;
  ownerRoles: string[];
  [key: string]: unknown;
}

export interface WorkflowDefinition {
  key: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  [key: string]: unknown;
}

export interface UserRole {
  key: string;
  name: string;
  description: string;
  visibleModules: string[];
  approvalScope: string[];
  [key: string]: unknown;
}

export interface IntegrationDefinition {
  key: string;
  name: string;
  notes: string;
  mode: string;
  direction: string;
  [key: string]: unknown;
}

export interface ApprovalGate {
  key: string;
  name: string;
  trigger: string;
  description: string;
  requiredRoles: string[];
  [key: string]: unknown;
}

export interface NotificationRule {
  key: string;
  name: string;
  trigger: string;
  channel: string;
  escalation: string;
  [key: string]: unknown;
}

export interface ReportingView {
  key: string;
  name: string;
  purpose: string;
  cadence: string;
  [key: string]: unknown;
}

export interface SettingsSection {
  key: string;
  name: string;
  purpose: string;
  owners: string[];
  [key: string]: unknown;
}

export interface RuntimeWidget {
  key: string;
  title: string;
  kind: string;
  source: string;
  description: string;
}

export interface RuntimeKitPage {
  key: string;
  title: string;
  route: string;
  moduleKey: string;
  layout: string;
  summary: string;
  roles: string[];
  widgets: RuntimeWidget[];
  emptyState: string;
  approvalHints: string[];
}

export interface GeneratedRuntimeKitManifest {
  kitVersion: string;
  compilerVersion: string;
  moduleSelections: Array<{ key: string; name: string; route: string; kind: string; source: string; reason?: string; roles?: string[]; domainTags?: string[]; editableSurfaces: string[] }>;
  pages: RuntimeKitPage[];
  adapters: Array<{ key: string; name: string; status: string; mode: string; reason?: string; reviewNotes?: string[] }>;
  editableFiles: Array<{ label: string; path: string; purpose: string; required?: boolean }>;
  shell: { homePageKey: string; navigationStyle?: string; density?: string; tenantBanner: string; approvalBanner: string };
  smokeChecks: string[];
}

export interface GeneratedEvalSuite {
  suiteVersion: string;
  overallStatus: string;
  score: number;
  summary: string;
  cases: Array<{ key: string; label: string; status: string; summary: string; details: string[] }>;
}

export interface GeneratedCompilerReport {
  compilerVersion: string;
  selectedDomainPackKeys: string[];
  selectedModuleKeys: string[];
  selectedAdapterKeys: string[];
  [key: string]: unknown;
}

export interface GeneratedAppSpec {
  customerProfile: {
    name: string;
    branding: BrandingTheme;
    [key: string]: unknown;
  };
  summary: string;
  navigation: NavigationItem[];
  businessEntities: BusinessEntity[];
  coreWorkflows: WorkflowDefinition[];
  userRoles: UserRole[];
  integrations: IntegrationDefinition[];
  approvalGates: ApprovalGate[];
  notificationRules: NotificationRule[];
  reportingViews: ReportingView[];
  settingsSections: SettingsSection[];
  adapterBindings: Array<{ key: string; name: string; status: string; reason: string; mode?: string; reviewNotes?: string[] }>;
  blueprint: {
    persistenceOwnership: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
