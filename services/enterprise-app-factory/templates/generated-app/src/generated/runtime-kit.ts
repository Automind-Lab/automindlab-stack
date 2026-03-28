import type { GeneratedRuntimeKitManifest } from "../types.js";

export const runtimeKit: GeneratedRuntimeKitManifest = {
  kitVersion: "template-runtime-kit",
  compilerVersion: "template-compiler",
  shell: {
    homePageKey: "dashboard",
    tenantBanner: "Generated apps remain tenant-aware and own downstream business persistence after deployment.",
    approvalBanner: "Irreversible actions stay explicit and approval-gated in the generated runtime.",
  },
  moduleSelections: [
    { key: "dashboard", name: "Operations Dashboard", route: "/dashboard", kind: "dashboard", source: "base", editableSurfaces: ["metric definitions"] },
    { key: "workflows", name: "Workflow Orchestrator", route: "/workflows", kind: "workflow", source: "base", editableSurfaces: ["stage labels"] },
  ],
  pages: [
    {
      key: "dashboard",
      title: "Operations Dashboard",
      route: "/dashboard",
      moduleKey: "dashboard",
      layout: "kpi-ribbon-and-ops-board",
      summary: "Runtime kit placeholder for __APP_NAME__.",
      roles: ["platform_admin"],
      widgets: [
        { key: "workflow-highlights", title: "Workflow Highlights", kind: "workflow-list", source: "spec.coreWorkflows", description: "Show core workflow coverage." },
        { key: "report-highlights", title: "Reports", kind: "report-list", source: "spec.reportingViews", description: "Show report coverage." },
      ],
      emptyState: "Replace sample content during generation.",
      approvalHints: [],
    },
  ],
  adapters: [
    { key: "design-handoff-adapter", name: "Design Handoff Adapter", status: "selected", mode: "active" },
  ],
  editableFiles: [
    { label: "Structured app spec", path: "src/generated/app-spec.ts", purpose: "Refine generated business contracts." },
    { label: "Runtime kit manifest", path: "src/generated/runtime-kit.ts", purpose: "Refine page and widget composition." },
  ],
  smokeChecks: [
    "Open the dashboard and confirm the runtime kit loaded.",
  ],
};
