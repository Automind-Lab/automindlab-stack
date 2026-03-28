import type {
  DesignHandoffPackage,
  EnterpriseAppSpec,
  EvalCaseResult,
  EvalStatus,
  EvalSuiteResult,
  GeneratedRuntimeKit,
} from "./contracts.js";

export const EVAL_SUITE_VERSION = "2026-03-28.eval-suite.v2";

function makeCase(
  key: string,
  label: string,
  status: EvalStatus,
  summary: string,
  details: string[],
): EvalCaseResult {
  return { key, label, status, summary, details };
}

function overallStatus(cases: EvalCaseResult[]): EvalStatus {
  if (cases.some((item) => item.status === "failed")) {
    return "failed";
  }
  if (cases.some((item) => item.status === "warning")) {
    return "warning";
  }
  return "passed";
}

function score(cases: EvalCaseResult[]): number {
  const total = cases.reduce((sum, item) => {
    switch (item.status) {
      case "passed":
        return sum + 1;
      case "warning":
        return sum + 0.5;
      default:
        return sum;
    }
  }, 0);
  return Math.round((total / Math.max(cases.length, 1)) * 100);
}

export function runEnterpriseAppFactoryEvals(
  spec: EnterpriseAppSpec,
  runtimeKit: GeneratedRuntimeKit,
  designHandoff: DesignHandoffPackage,
): EvalSuiteResult {
  const cases: EvalCaseResult[] = [];

  cases.push(
    makeCase(
      "tenant-boundary",
      "Tenant boundary clarity",
      spec.customerProfile.tenancy.toLowerCase().includes("tenant") ? "passed" : "failed",
      "Generated apps must keep tenant boundaries explicit.",
      [
        spec.customerProfile.tenancy,
        spec.blueprint.persistenceOwnership,
      ],
    ),
  );

  cases.push(
    makeCase(
      "approval-coverage",
      "Approval coverage",
      spec.approvalGates.length >= 2 ? "passed" : "warning",
      "Irreversible and bulk actions should remain approval-gated.",
      spec.approvalGates.map((gate) => `${gate.name}: ${gate.trigger}`),
    ),
  );

  cases.push(
    makeCase(
      "module-coverage",
      "Module coverage",
      runtimeKit.moduleSelections.length >= 6 ? "passed" : "warning",
      "The generated runtime kit should cover dashboard, data, workflow, governance, and settings surfaces.",
      runtimeKit.moduleSelections.map((moduleSelection) => `${moduleSelection.name} (${moduleSelection.kind})`),
    ),
  );

  cases.push(
    makeCase(
      "adapter-boundaries",
      "Adapter boundaries",
      spec.adapterBindings.length > 0 ? "passed" : "warning",
      "Adapters should remain explicit, typed, and operator-reviewable.",
      spec.adapterBindings.map((binding) => `${binding.name}: ${binding.status}`),
    ),
  );

  cases.push(
    makeCase(
      "editability",
      "Human editability",
      runtimeKit.editableFiles.length >= 4 ? "passed" : "warning",
      "Operators should have obvious post-generation edit surfaces.",
      runtimeKit.editableFiles.map((file) => `${file.label}: ${file.path}`),
    ),
  );

  cases.push(
    makeCase(
      "design-handoff",
      "Design handoff completeness",
      designHandoff.tokens.length > 0 && designHandoff.screenMap.length > 0 && designHandoff.contentModel.length > 0 ? "passed" : "warning",
      "Design export should contain tokens, screen inventory, and content model artifacts.",
      [
        `tokens=${designHandoff.tokens.length}`,
        `screens=${designHandoff.screenMap.length}`,
        `content-model=${designHandoff.contentModel.length}`,
      ],
    ),
  );

  cases.push(
    makeCase(
      "uncertainty-visible",
      "Uncertainty visibility",
      spec.unresolvedItems.length > 0 && spec.uncertainty.missingContext.length > 0 ? "passed" : "failed",
      "The compiler must keep assumptions and missing context visible.",
      [
        `unresolved=${spec.unresolvedItems.length}`,
        `missing-context=${spec.uncertainty.missingContext.length}`,
      ],
    ),
  );

  const status = overallStatus(cases);
  const suiteScore = score(cases);

  return {
    suiteVersion: EVAL_SUITE_VERSION,
    overallStatus: status,
    score: suiteScore,
    summary:
      status === "failed"
        ? `Compiler evals found blocking gaps. Score ${suiteScore}.`
        : status === "warning"
          ? `Compiler evals passed with warnings. Score ${suiteScore}.`
          : `Compiler evals passed. Score ${suiteScore}.`,
    cases,
  };
}
