import type {
  AdapterBinding,
  CompiledModuleSelection,
  EnterpriseAppSpec,
  GeneratedRuntimeKit,
  RuntimeKitEditableFile,
  RuntimeKitPage,
} from "./contracts.js";
import { getModuleRegistryEntry } from "./module-registry.js";

export const RUNTIME_KIT_VERSION = "2026-03-28.runtime-kit.v2";

function buildPages(moduleSelections: CompiledModuleSelection[], spec: EnterpriseAppSpec): RuntimeKitPage[] {
  return moduleSelections.map((moduleSelection) => {
    const registryEntry = getModuleRegistryEntry(moduleSelection.key);
    return {
      key: moduleSelection.key,
      title: moduleSelection.name,
      route: moduleSelection.route,
      moduleKey: moduleSelection.key,
      layout: registryEntry?.primitive ?? "typed-module-surface",
      summary: registryEntry?.description ?? `Generated module for ${moduleSelection.name}.`,
      roles: moduleSelection.roles,
      widgets: registryEntry?.widgetBlueprints ?? [],
      emptyState: `No live ${moduleSelection.name.toLowerCase()} data is configured yet. Replace sample content after deployment-specific wiring is complete.`,
      approvalHints: spec.approvalGates
        .filter((gate) => registryEntry?.approvalTouchpoints.includes(gate.key) ?? false)
        .map((gate) => `${gate.name}: ${gate.trigger}`),
    };
  });
}

function buildEditableFiles(spec: EnterpriseAppSpec): RuntimeKitEditableFile[] {
  const slug = spec.customerProfile.slug;
  return [
    {
      label: "Structured app spec",
      path: `src/generated/app-spec.ts`,
      purpose: "Refine the compiled business model, workflows, permissions, and adapter bindings.",
      required: true,
    },
    {
      label: "Runtime kit manifest",
      path: `src/generated/runtime-kit.ts`,
      purpose: "Review page composition, widgets, and editable runtime surfaces.",
      required: true,
    },
    {
      label: "Eval report",
      path: `src/generated/eval-suite.ts`,
      purpose: "Inspect the generated factory eval results and remaining warnings.",
      required: true,
    },
    {
      label: "Theme and runtime styles",
      path: `src/styles.css`,
      purpose: `Apply ${slug} branding and layout refinements.`,
      required: true,
    },
    {
      label: "Design handoff package",
      path: `design/design-handoff.json`,
      purpose: "Share or import design-facing tokens, pages, sections, and content model artifacts.",
      required: true,
    },
  ];
}

export function buildGeneratedRuntimeKit(
  spec: EnterpriseAppSpec,
  moduleSelections: CompiledModuleSelection[],
  adapters: AdapterBinding[],
): GeneratedRuntimeKit {
  return {
    kitVersion: RUNTIME_KIT_VERSION,
    compilerVersion: spec.compiler.compilerVersion,
    shell: {
      homePageKey: moduleSelections[0]?.key ?? "dashboard",
      navigationStyle: "left-rail with route-backed operational modules",
      density: spec.customerProfile.branding.density,
      tenantBanner: "Generated apps remain tenant-aware and own downstream business persistence after deployment.",
      approvalBanner: "Irreversible actions stay explicit and approval-gated in the generated runtime.",
    },
    moduleSelections,
    pages: buildPages(moduleSelections, spec),
    adapters,
    editableFiles: buildEditableFiles(spec),
    smokeChecks: [
      "Open the dashboard and verify the compiled navigation renders every selected module.",
      "Inspect one data-heavy page, one workflow-heavy page, and the approvals page.",
      "Review the integration and settings surfaces for unresolved adapter and identity decisions.",
      "Confirm the eval report and design handoff artifacts are present in the generated workspace.",
    ],
  };
}
