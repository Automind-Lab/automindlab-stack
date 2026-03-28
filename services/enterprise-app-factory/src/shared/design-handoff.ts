import type {
  DesignHandoffPackage,
  DesignImportRequest,
  DesignImportResult,
  EnterpriseAppSpec,
  ThemeConfig,
} from "./contracts.js";

export function buildDesignHandoff(spec: EnterpriseAppSpec): DesignHandoffPackage {
  return {
    generatedAt: new Date().toISOString(),
    themeConfig: spec.customerProfile.branding,
    tokens: [
      { name: "color.brand.primary", value: spec.customerProfile.branding.primaryColor, type: "color" },
      { name: "color.brand.secondary", value: spec.customerProfile.branding.secondaryColor, type: "color" },
      { name: "color.brand.accent", value: spec.customerProfile.branding.accentColor, type: "color" },
      { name: "color.surface.default", value: spec.customerProfile.branding.surfaceColor, type: "color" },
      { name: "color.canvas.default", value: spec.customerProfile.branding.canvasColor, type: "color" },
      { name: "font.heading", value: spec.customerProfile.branding.headingFont, type: "font" },
      { name: "font.body", value: spec.customerProfile.branding.bodyFont, type: "font" },
      { name: "spacing.section", value: "24px", type: "spacing" },
      { name: "radius.panel", value: "18px", type: "radius" },
    ],
    componentManifest: spec.uiModules.map((module) => ({
      key: module.key,
      name: module.name,
      sourceModule: module.key,
      editableProps: ["title", "emptyStateCopy", "accentColor", "tableDensity"],
    })),
    screenMap: spec.navigation.map((item) => ({
      key: item.key,
      title: item.label,
      route: item.route,
      purpose: spec.uiModules.find((module) => module.key === item.moduleKey)?.purpose ?? "Generated operator view",
    })),
    copyMap: [
      { key: "summary", text: spec.summary, location: "application shell header" },
      { key: "purpose", text: spec.appPurpose, location: "overview screen" },
      ...spec.reportingViews.map((report) => ({
        key: `report.${report.key}`,
        text: report.purpose,
        location: `reporting/${report.key}`,
      })),
    ],
    figmaAdapter: {
      enabled: false,
      mode: "optional",
      importContract: "design-handoff-package.v1",
      exportContract: "design-handoff-package.v1",
      notes: [
        "Figma integration is adapter-based and optional.",
        "Generation does not fail when no design adapter is configured.",
        "Use the token and screen map payloads as the boundary for future Figma MCP work.",
      ],
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function maybeThemeConfig(value: unknown): ThemeConfig | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const requiredKeys = ["brandName", "primaryColor", "secondaryColor", "accentColor", "surfaceColor", "canvasColor", "headingFont", "bodyFont", "density", "logoTreatment"];
  if (!requiredKeys.every((key) => typeof value[key] === "string")) {
    return undefined;
  }
  return value as unknown as ThemeConfig;
}

export function importDesignHandoff(request: DesignImportRequest): DesignImportResult {
  try {
    const parsed = JSON.parse(request.json) as unknown;
    if (!isRecord(parsed)) {
      return { valid: false, warnings: ["Parsed design package must be an object."] };
    }

    const warnings: string[] = [];
    const theme = maybeThemeConfig(parsed.themeConfig);
    if (!theme) {
      warnings.push("Theme config is missing or incomplete.");
    }
    if (!Array.isArray(parsed.tokens) || parsed.tokens.length === 0) {
      warnings.push("Design token list is empty.");
    }
    if (!Array.isArray(parsed.screenMap) || parsed.screenMap.length === 0) {
      warnings.push("Screen map is empty.");
    }
    if (!Array.isArray(parsed.componentManifest) || parsed.componentManifest.length === 0) {
      warnings.push("Component manifest is empty.");
    }
    return {
      valid: warnings.length === 0,
      warnings,
      proposedTheme: theme,
      parsedPackage: parsed as Partial<DesignHandoffPackage>,
    };
  } catch (error) {
    return {
      valid: false,
      warnings: [`Unable to parse design package: ${(error as Error).message}`],
    };
  }
}
