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
  blueprint: {
    persistenceOwnership: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
