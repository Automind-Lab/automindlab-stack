import type {
  ContentModelEntry,
  DesignComponentManifestEntry,
  DesignHandoffPackage,
  DesignImportRequest,
  DesignImportResult,
  DesignToken,
  DesignTokenCollection,
  EnterpriseAppSpec,
  GeneratedRuntimeKit,
  PageSectionMapEntry,
  ScreenMapEntry,
  ThemeConfig,
  ThemeVariable,
} from "./contracts.js";

function buildTokens(spec: EnterpriseAppSpec): DesignToken[] {
  return [
    { name: "color.brand.primary", value: spec.customerProfile.branding.primaryColor, type: "color" },
    { name: "color.brand.secondary", value: spec.customerProfile.branding.secondaryColor, type: "color" },
    { name: "color.brand.accent", value: spec.customerProfile.branding.accentColor, type: "color" },
    { name: "color.surface.default", value: spec.customerProfile.branding.surfaceColor, type: "color" },
    { name: "color.canvas.default", value: spec.customerProfile.branding.canvasColor, type: "color" },
    { name: "font.heading", value: spec.customerProfile.branding.headingFont, type: "font" },
    { name: "font.body", value: spec.customerProfile.branding.bodyFont, type: "font" },
    { name: "spacing.section", value: "24px", type: "spacing" },
    { name: "spacing.panel.gap", value: "16px", type: "spacing" },
    { name: "radius.panel", value: "18px", type: "radius" },
    { name: "shadow.panel", value: "0 18px 48px rgba(17, 24, 39, 0.10)", type: "shadow" },
  ];
}

function buildTokenCollections(tokens: DesignToken[]): DesignTokenCollection[] {
  return [
    {
      key: "brand-colors",
      name: "Brand Colors",
      tokenNames: tokens.filter((token) => token.type === "color").map((token) => token.name),
    },
    {
      key: "typography",
      name: "Typography",
      tokenNames: tokens.filter((token) => token.type === "font").map((token) => token.name),
    },
    {
      key: "layout",
      name: "Layout",
      tokenNames: tokens.filter((token) => token.type === "spacing" || token.type === "radius" || token.type === "shadow").map((token) => token.name),
    },
  ];
}

function buildThemeVariables(tokens: DesignToken[]): ThemeVariable[] {
  return tokens.map((token) => ({
    name: token.name,
    cssVar: `--${token.name.replace(/\./g, "-")}`,
    value: token.value,
  }));
}

function buildComponentManifest(runtimeKit: GeneratedRuntimeKit): DesignComponentManifestEntry[] {
  return runtimeKit.moduleSelections.map((moduleSelection) => ({
    key: moduleSelection.key,
    name: moduleSelection.name,
    sourceModule: moduleSelection.key,
    editableProps: moduleSelection.editableSurfaces,
  }));
}

function buildScreenMap(runtimeKit: GeneratedRuntimeKit): ScreenMapEntry[] {
  return runtimeKit.pages.map((page) => ({
    key: page.key,
    title: page.title,
    route: page.route,
    purpose: page.summary,
  }));
}

function buildPageSections(runtimeKit: GeneratedRuntimeKit): PageSectionMapEntry[] {
  return runtimeKit.pages.flatMap((page) =>
    page.widgets.map((widget) => ({
      key: `${page.key}.${widget.key}`,
      screenKey: page.key,
      moduleKey: page.moduleKey,
      title: widget.title,
      primitive: widget.kind,
      copyKeys: [`${page.key}.summary`, `${page.key}.${widget.key}.title`],
    })),
  );
}

function buildContentModel(spec: EnterpriseAppSpec): ContentModelEntry[] {
  return spec.businessEntities.map((entity) => ({
    key: entity.key,
    entityKey: entity.key,
    label: entity.label,
    ownership: entity.ownership,
    fields: entity.fields.map((field) => field.label),
    notes: [
      entity.description,
      entity.tenantScoped ? "Tenant scoped by default." : "Confirm tenant ownership before production use.",
    ],
  }));
}

export function buildDesignHandoff(spec: EnterpriseAppSpec, runtimeKit: GeneratedRuntimeKit): DesignHandoffPackage {
  const tokens = buildTokens(spec);
  return {
    generatedAt: new Date().toISOString(),
    themeConfig: spec.customerProfile.branding,
    tokens,
    tokenCollections: buildTokenCollections(tokens),
    themeVariables: buildThemeVariables(tokens),
    componentManifest: buildComponentManifest(runtimeKit),
    screenMap: buildScreenMap(runtimeKit),
    pageSections: buildPageSections(runtimeKit),
    contentModel: buildContentModel(spec),
    copyMap: [
      { key: "summary", text: spec.summary, location: "application shell header" },
      { key: "purpose", text: spec.appPurpose, location: "overview screen" },
      ...runtimeKit.pages.map((page) => ({
        key: `${page.key}.summary`,
        text: page.summary,
        location: page.route,
      })),
      ...runtimeKit.pages.flatMap((page) =>
        page.widgets.map((widget) => ({
          key: `${page.key}.${widget.key}.title`,
          text: widget.title,
          location: `${page.route}#${widget.key}`,
        })),
      ),
    ],
    figmaAdapter: {
      enabled: false,
      mode: "optional",
      adapterKey: "figma-bridge-adapter",
      importContract: "design-handoff-package.v2",
      exportContract: "design-handoff-package.v2",
      notes: [
        "Figma integration is adapter-based and optional.",
        "Generation does not fail when no design adapter is configured.",
        "Use the token, section, and content model payloads as the boundary for future Figma MCP work.",
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
    if (!Array.isArray(parsed.tokenCollections) || parsed.tokenCollections.length === 0) {
      warnings.push("Token collections are empty.");
    }
    if (!Array.isArray(parsed.screenMap) || parsed.screenMap.length === 0) {
      warnings.push("Screen map is empty.");
    }
    if (!Array.isArray(parsed.pageSections) || parsed.pageSections.length === 0) {
      warnings.push("Page section map is empty.");
    }
    if (!Array.isArray(parsed.componentManifest) || parsed.componentManifest.length === 0) {
      warnings.push("Component manifest is empty.");
    }
    if (!Array.isArray(parsed.contentModel) || parsed.contentModel.length === 0) {
      warnings.push("Content model is empty.");
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
