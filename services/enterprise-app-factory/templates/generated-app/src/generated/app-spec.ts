import type { GeneratedAppSpec } from "../types.js";

export const appSpec: GeneratedAppSpec = {
  customerProfile: {
    name: "__APP_NAME__",
    branding: {
      primaryColor: "__APP_PRIMARY__",
      secondaryColor: "__APP_SECONDARY__",
      accentColor: "__APP_ACCENT__",
      surfaceColor: "__APP_SURFACE__",
      canvasColor: "__APP_CANVAS__"
    }
  },
  summary: "__APP_SUMMARY__",
  navigation: [],
  businessEntities: [],
  coreWorkflows: [],
  userRoles: [],
  integrations: [],
  approvalGates: [],
  notificationRules: [],
  reportingViews: [],
  settingsSections: [],
  blueprint: {
    persistenceOwnership: "Generated customer apps own their own business records and workflow outcomes."
  }
};
