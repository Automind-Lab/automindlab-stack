import type {
  EnterpriseAppSpec,
  ValidationIssue,
  ValidationResult,
} from "./contracts.js";

function push(issues: ValidationIssue[], issue: ValidationIssue): void {
  issues.push(issue);
}

function hasApprovalGate(spec: EnterpriseAppSpec, key: string): boolean {
  return spec.approvalGates.some((gate) => gate.key === key);
}

export function validatePromptInput(input: {
  customerName?: string;
  businessDescription?: string;
  applicationNeeds?: string;
}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!input.customerName?.trim()) {
    push(issues, {
      code: "prompt.customer_name.required",
      severity: "error",
      path: "customerName",
      message: "Customer name is required.",
      suggestedAction: "Provide the enterprise customer name before parsing.",
    });
  }
  if (!input.businessDescription?.trim()) {
    push(issues, {
      code: "prompt.business_description.required",
      severity: "error",
      path: "businessDescription",
      message: "Business description is required.",
      suggestedAction: "Describe what the customer does operationally.",
    });
  }
  if (!input.applicationNeeds?.trim()) {
    push(issues, {
      code: "prompt.application_needs.required",
      severity: "error",
      path: "applicationNeeds",
      message: "Application needs are required.",
      suggestedAction: "Describe the workflows, users, and outputs the app must support.",
    });
  }
  return issues;
}

export function validateEnterpriseAppSpec(spec: EnterpriseAppSpec): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!spec.customerProfile.name.trim()) {
    push(issues, {
      code: "spec.customer_profile.name.required",
      severity: "error",
      path: "customerProfile.name",
      message: "Customer profile name is required.",
      suggestedAction: "Provide a customer name before generation.",
    });
  }

  if (!spec.compiler.compilerVersion.trim()) {
    push(issues, {
      code: "spec.compiler.version.required",
      severity: "error",
      path: "compiler.compilerVersion",
      message: "Compiler version metadata is required.",
      suggestedAction: "Build the spec through the versioned compiler pipeline.",
    });
  }

  if (!spec.customerProfile.tenancy.toLowerCase().includes("tenant")) {
    push(issues, {
      code: "spec.tenancy.explicit",
      severity: "error",
      path: "customerProfile.tenancy",
      message: "Tenant boundaries must be explicit.",
      suggestedAction: "Set tenant-aware deployment or isolation language in the spec.",
    });
  }

  if (spec.coreWorkflows.length === 0) {
    push(issues, {
      code: "spec.workflows.required",
      severity: "error",
      path: "coreWorkflows",
      message: "At least one workflow is required for generation.",
      suggestedAction: "Infer or add a core workflow from the operator prompt.",
    });
  }

  if (spec.businessEntities.length === 0) {
    push(issues, {
      code: "spec.entities.required",
      severity: "error",
      path: "businessEntities",
      message: "At least one business entity is required.",
      suggestedAction: "Add entity definitions before generation.",
    });
  }

  if (spec.userRoles.length < 2) {
    push(issues, {
      code: "spec.roles.minimum",
      severity: "warning",
      path: "userRoles",
      message: "Enterprise apps should expose more than one role to preserve least privilege.",
      suggestedAction: "Add an operational role and an approval or audit role.",
    });
  }

  if (spec.moduleSelections.length < 4) {
    push(issues, {
      code: "spec.module_selections.minimum",
      severity: "warning",
      path: "moduleSelections",
      message: "The generated runtime should expose a broad enough module set to be useful and reviewable.",
      suggestedAction: "Add module coverage for dashboard, workflow, governance, and settings surfaces.",
    });
  }

  if (spec.adapterBindings.length === 0) {
    push(issues, {
      code: "spec.adapter_bindings.required",
      severity: "warning",
      path: "adapterBindings",
      message: "Adapter bindings should remain explicit even when they are optional or deferred.",
      suggestedAction: "Add typed adapter bindings for design, identity, and integration surfaces.",
    });
  }

  if (!spec.identityAndAccess.authStrategy.trim()) {
    push(issues, {
      code: "spec.auth_strategy.required",
      severity: "error",
      path: "identityAndAccess.authStrategy",
      message: "An auth strategy is required.",
      suggestedAction: "Set the auth strategy before generation.",
    });
  }

  if (!spec.identityAndAccess.approvalPolicy.toLowerCase().includes("approval")) {
    push(issues, {
      code: "spec.approval_policy.explicit",
      severity: "warning",
      path: "identityAndAccess.approvalPolicy",
      message: "Approval policy should be explicit for irreversible actions.",
      suggestedAction: "Add an approval policy statement to the spec.",
    });
  }

  if (!hasApprovalGate(spec, "urgent-replacement")) {
    push(issues, {
      code: "spec.approval_gate.urgent_replacement",
      severity: "warning",
      path: "approvalGates",
      message: "Urgent replacement actions should remain approval-gated.",
      suggestedAction: "Add an urgent replacement approval gate.",
    });
  }

  if (!hasApprovalGate(spec, "bulk-import")) {
    push(issues, {
      code: "spec.approval_gate.bulk_import",
      severity: "warning",
      path: "approvalGates",
      message: "Bulk imports should remain approval-gated.",
      suggestedAction: "Add a bulk import approval gate for multi-record mutations.",
    });
  }

  if (spec.complianceRequirements.length === 0) {
    push(issues, {
      code: "spec.compliance.inferred_only",
      severity: "warning",
      path: "complianceRequirements",
      message: "No explicit compliance requirements were provided.",
      suggestedAction: "Confirm compliance posture before production implementation.",
    });
  }

  if (spec.unresolvedItems.length === 0) {
    push(issues, {
      code: "spec.unresolved_items.required",
      severity: "warning",
      path: "unresolvedItems",
      message: "A production-minded spec should capture unresolved items instead of hiding uncertainty.",
      suggestedAction: "Add operator-visible unresolved items and follow-up questions.",
    });
  }

  if (spec.uncertainty.reasons.length === 0 || spec.uncertainty.missingContext.length === 0) {
    push(issues, {
      code: "spec.uncertainty.explicit",
      severity: "error",
      path: "uncertainty",
      message: "Uncertainty reporting must be explicit.",
      suggestedAction: "Populate uncertainty reasons and missing context before generation.",
    });
  }

  if (!spec.blueprint.persistenceOwnership.toLowerCase().includes("generated customer apps own")) {
    push(issues, {
      code: "spec.persistence_ownership.boundary",
      severity: "error",
      path: "blueprint.persistenceOwnership",
      message: "Persistence ownership boundary must stay explicit.",
      suggestedAction: "State that generated customer apps own business records and workflow outcomes.",
    });
  }

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const confidence =
    errorCount > 0 ? "low" :
    warningCount > 4 ? "medium" :
    spec.uncertainty.level;

  return {
    valid: errorCount === 0,
    confidence,
    issues,
    summary:
      errorCount > 0
        ? `Spec has ${errorCount} blocking issue(s) and ${warningCount} warning(s).`
        : `Spec is generation-ready with ${warningCount} warning(s) and explicit uncertainty.`,
  };
}
