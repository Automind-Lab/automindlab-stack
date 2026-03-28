import { APP_FACTORY_AGENT_REGISTRY, getAgentDefinition } from "../shared/agent-registry.js";
import type {
  AgentDefinition,
  AgentFinding,
  AgentRecommendation,
  AgentRun,
  AgentRunNode,
  AgentRunRequest,
  EnterpriseAppSpec,
  Uncertainty,
} from "../shared/contracts.js";

function now(): string {
  return new Date().toISOString();
}

function createAgentRunId(): string {
  return `agent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createNodeId(agentKey: string, depth: number): string {
  return `${agentKey}_${depth}_${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeSpec(spec: EnterpriseAppSpec, request: AgentRunRequest): string {
  return [
    spec.customerProfile.name,
    spec.customerProfile.businessSummary,
    spec.appPurpose,
    spec.businessDomain,
    spec.assumptions.join(" "),
    spec.unresolvedItems.join(" "),
    request.focus.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function hasAny(text: string, values: string[]): boolean {
  return values.some((value) => text.includes(value.toLowerCase()));
}

function finding(severity: AgentFinding["severity"], title: string, detail: string, safeAction: string): AgentFinding {
  return { severity, title, detail, safeAction };
}

function recommendation(
  key: string,
  title: string,
  rationale: string,
  owner: string,
  priority: AgentRecommendation["priority"],
  blocking = false,
): AgentRecommendation {
  return { key, title, rationale, owner, priority, blocking };
}

interface AgentAnalysis {
  summary: string;
  findings: AgentFinding[];
  recommendations: AgentRecommendation[];
  childKeys: string[];
}

interface AnalysisContext {
  request: AgentRunRequest;
  spec: EnterpriseAppSpec;
  normalized: string;
  warnings: string[];
}

function analyzeTesla(context: AnalysisContext): AgentAnalysis {
  const futureReadyIntegrations = context.spec.integrations.filter((integration) => integration.mode === "future-ready");
  const findings: AgentFinding[] = [];
  if (futureReadyIntegrations.length > 0) {
    findings.push(
      finding(
        "warning",
        "Future-ready integrations still need explicit activation contracts",
        `The spec names ${futureReadyIntegrations.length} integration placeholder(s) that should stay advisory until customer-specific contracts are approved.`,
        "Keep the generated app contract-first and block any irreversible sync until the downstream app confirms vendor, fields, and approval policy.",
      ),
    );
  }
  if (context.spec.blueprint.backgroundOperations.length > 0) {
    findings.push(
      finding(
        "info",
        "Background operations are visible in the blueprint",
        "The spec already identifies restart-sensitive background operations, which is the right place to enforce observability and failure-state visibility.",
        "Keep each background operation attributable and restart-safe in the generated app.",
      ),
    );
  }

  return {
    summary: "Workflow interactions and integration seams are coherent, but they still need explicit host-owned ingress boundaries and downstream approval controls.",
    findings,
    recommendations: [
      recommendation(
        "tesla-host-boundary",
        "Keep every external ingress on the host path",
        "The factory should never let a generated worker or delegated agent become a front door for external channels or direct business-state writes.",
        "automind-host",
        "now",
        true,
      ),
      recommendation(
        "tesla-restart-safety",
        "Surface restart-safe checkpoints for background work",
        "Workflow and repair operations are more testable when every long-running step records visible checkpoints.",
        "workflow-systems-analyst",
        "next",
      ),
    ],
    childKeys: ["workflow-systems-analyst", "integration-boundary-reviewer"],
  };
}

function analyzeWorkflowSystems(context: AnalysisContext): AgentAnalysis {
  const approvalSteps = context.spec.coreWorkflows.flatMap((workflow) => workflow.steps).filter((step) => step.approvalGateKey);
  return {
    summary: `The spec contains ${context.spec.coreWorkflows.length} workflow(s) and ${approvalSteps.length} approval-gated step(s); the runtime should keep those state changes explicit and replayable.`,
    findings: [
      finding(
        approvalSteps.length > 0 ? "warning" : "info",
        "Workflow sequencing should stay explicit",
        "Approval-bearing steps, state transitions, and automated follow-ups should remain observable instead of hidden inside free-form agent behavior.",
        "Model workflow transitions as typed, auditable steps with visible failure states.",
      ),
    ],
    recommendations: [
      recommendation(
        "workflow-smoke-plan",
        "Preserve a smoke-check path for the highest-risk flows",
        "Operators need a fast way to validate dispatch, approval, and reporting routes after generation.",
        "smoke-check-planner",
        "next",
      ),
    ],
    childKeys: ["smoke-check-planner"],
  };
}

function analyzeIntegrationBoundary(context: AnalysisContext): AgentAnalysis {
  const identityIntegration = context.spec.integrations.find((integration) => integration.key === "identity_provider");
  return {
    summary: "Integration posture is appropriately contract-first, with identity and external sync surfaces kept future-ready until deployment-specific decisions are confirmed.",
    findings: [
      finding(
        identityIntegration ? "warning" : "info",
        "Identity provider remains unresolved",
        identityIntegration
          ? identityIntegration.notes
          : "Identity provider selection was not surfaced explicitly in the integration list.",
        "Keep authentication strategy configurable and document the required production cutover path before go-live.",
      ),
    ],
    recommendations: [
      recommendation(
        "integration-host-ownership",
        "Keep runtime-owned approvals on the host",
        "No generated sub-agent or worker path should bypass host review for authenticated or irreversible external operations.",
        "automind-host",
        "now",
      ),
    ],
    childKeys: [],
  };
}

function analyzeLeonardo(context: AnalysisContext): AgentAnalysis {
  return {
    summary: `The current blueprint spans ${context.spec.businessEntities.length} business entit${context.spec.businessEntities.length === 1 ? "y" : "ies"}, ${context.spec.uiModules.length} UI module(s), and ${context.spec.apiDraft.endpoints.length} API draft endpoint(s) with a coherent handoff path.`,
    findings: [
      finding(
        "info",
        "The spec already ties modules, entities, and routes together",
        "That keeps generation consistent and reduces the risk of one-off screen drift.",
        "Preserve spec-driven composition and avoid raw string-driven generation paths.",
      ),
    ],
    recommendations: [
      recommendation(
        "leonardo-data-contract",
        "Review entity coverage against the API draft",
        "The typed spec should remain the single source of truth for what gets composed into the generated app.",
        "data-contract-designer",
        "next",
      ),
      recommendation(
        "leonardo-screen-map",
        "Keep screen map and design export aligned",
        "The app stays easier to refine in Figma or design tooling when the screen inventory and token package stay current.",
        "screen-map-planner",
        "next",
      ),
    ],
    childKeys: ["data-contract-designer", "screen-map-planner"],
  };
}

function analyzeDataContract(context: AnalysisContext): AgentAnalysis {
  const entityCount = context.spec.businessEntities.length;
  const endpointCount = context.spec.apiDraft.endpoints.length;
  return {
    summary: `Entity coverage looks reasonable for the first slice: ${entityCount} entity definitions are backed by ${endpointCount} drafted endpoint(s) and a tenant-aware ownership statement.`,
    findings: [
      finding(
        endpointCount < entityCount ? "warning" : "info",
        "Entity and API draft coverage should stay in sync",
        "Each generated entity screen becomes safer to refine when the API draft stays explicit about read, create, update, and approval-bound actions.",
        "Expand the API draft when new entity operations are introduced instead of allowing implicit handlers to appear later.",
      ),
    ],
    recommendations: [
      recommendation(
        "data-contract-schema",
        "Run a consistency pass on entity relationships",
        "Entity relationships, field sets, and workflow touchpoints should line up before deeper customer customization begins.",
        "entity-schema-check",
        "later",
      ),
    ],
    childKeys: ["entity-schema-check"],
  };
}

function analyzeEntitySchema(context: AnalysisContext): AgentAnalysis {
  const orphanedEntities = context.spec.businessEntities.filter((entity) => entity.relatedEntities.length === 0);
  return {
    summary: "Entity structure is usable for generation, with enough field-level detail to drive tables, forms, and reports from a shared contract.",
    findings: orphanedEntities.length > 0
      ? [
          finding(
            "info",
            "Some entities are intentionally stand-alone",
            `${orphanedEntities.length} entity definition(s) do not currently reference related entities; that may be acceptable for summary or lookup domains.`,
            "Only add relationships when they materially improve workflow or reporting behavior.",
          ),
        ]
      : [],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeScreenMap(context: AnalysisContext): AgentAnalysis {
  return {
    summary: `The navigation, module, and design export surfaces line up around ${context.spec.navigation.length} route-backed screen(s), which keeps downstream design refinement practical.`,
    findings: [
      finding(
        "info",
        "Design handoff remains optional and non-blocking",
        "That keeps generation reliable even when Figma or another design tool is unavailable.",
        "Keep the design adapter boundary external and configuration-driven.",
      ),
    ],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeJobs(context: AnalysisContext): AgentAnalysis {
  const downloadFocus = hasAny(context.normalized, ["download", "package", "test", "handoff"]);
  return {
    summary: "The operator journey is now centered on parse, review, generate, verify, and handoff; the remaining work is to keep that path obvious, downloadable, and low-anxiety.",
    findings: [
      finding(
        downloadFocus ? "warning" : "info",
        "Operators need a visible package-ready handoff",
        "A generated workspace is more actionable when the console also exposes a downloadable package, startup steps, and a test checklist.",
        "Package the verified workspace into a downloadable artifact and attach a concise operator handoff summary.",
      ),
    ],
    recommendations: [
      recommendation(
        "jobs-operator-ui",
        "Keep the operator console practical instead of flashy",
        "Enterprise builders work best when validation state, risks, and download actions are easy to scan.",
        "operator-experience-planner",
        "now",
      ),
      recommendation(
        "jobs-download-handoff",
        "Attach package and test instructions to successful jobs",
        "The download should be ready to test without requiring operators to guess what to run next.",
        "download-handoff-planner",
        "now",
      ),
    ],
    childKeys: ["operator-experience-planner", "download-handoff-planner"],
  };
}

function analyzeOperatorExperience(): AgentAnalysis {
  return {
    summary: "The UI should bias toward legibility: clear approval state, visible uncertainty, and obvious next steps for parse, council review, generation, and download.",
    findings: [
      finding(
        "info",
        "Operator-facing language should stay utility-first",
        "The console works best as an operational workspace, not a marketing-style dashboard.",
        "Keep headings, statuses, and action labels direct and audit-friendly.",
      ),
    ],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeDownloadHandoff(context: AnalysisContext): AgentAnalysis {
  const hasLinkedJob = Boolean(context.request.linkedGenerationJobId);
  return {
    summary: "Package handoff should always answer three questions: what was generated, how to start it, and what to test first.",
    findings: [
      finding(
        hasLinkedJob ? "info" : "warning",
        hasLinkedJob ? "This council run is linked to a generation job" : "No generation job is linked yet",
        hasLinkedJob
          ? "When linked to a generation job, the council runtime can point operators directly at the right package and test checklist."
          : "A council review can run before generation, but the downloadable package only exists after a successful verified generation job.",
        "After generation succeeds, attach the package archive and startup checklist directly to the job artifacts.",
      ),
    ],
    recommendations: [
      recommendation(
        "download-handoff-check",
        "Verify package artifact presence on completed jobs",
        "A verified generated workspace should also be downloadable for handoff and testing.",
        "download-check",
        "now",
      ),
      recommendation(
        "download-customization-check",
        "Point operators at post-generation edit surfaces",
        "Package readiness should include where to change branding, workflows, permissions, and design tokens next.",
        "customization-check",
        "next",
      ),
    ],
    childKeys: ["download-check", "customization-check"],
  };
}

function analyzeDownloadCheck(): AgentAnalysis {
  return {
    summary: "Download readiness depends on packaging the verified workspace into a stable archive with an obvious filename.",
    findings: [
      finding(
        "info",
        "Package naming should stay deterministic",
        "Operators should be able to tell which customer and run a download belongs to without opening it.",
        "Use the customer slug and generation timestamp in the archive filename.",
      ),
    ],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeCustomizationCheck(context: AnalysisContext): AgentAnalysis {
  return {
    summary: "Customization guidance should stay close to the generated workspace so branding, permissions, and workflow edits are easy to make after generation.",
    findings: [
      finding(
        "info",
        "The generated app remains editable by humans",
        `That matches the spec for ${context.spec.customerProfile.name} and keeps the factory from locking operators into one-off output.`,
        "Keep spec, design handoff, and runtime theme files easy to locate from the package.",
      ),
    ],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeMarcus(context: AnalysisContext): AgentAnalysis {
  return {
    summary: "The highest-risk areas remain the right ones: approval-bearing workflow actions, tenant isolation, role expansion, and external sync activation.",
    findings: [
      finding(
        context.spec.approvalGates.length > 0 ? "warning" : "info",
        "Approval gates should stay attached to irreversible actions",
        "The generated app should never bury destructive or high-impact actions behind implicit agent output.",
        "Keep approval-gated actions explicit in both workflow screens and API handlers.",
      ),
    ],
    recommendations: [
      recommendation(
        "marcus-tenant-review",
        "Run a tenant and least-privilege review",
        "Multi-tenant readiness is only credible when permissions, auditability, and data ownership stay aligned.",
        "tenant-safety-auditor",
        "now",
      ),
      recommendation(
        "marcus-approval-review",
        "Check approval coverage against workflow and API drafts",
        "Approval rules need to match the irreversible actions operators can actually trigger.",
        "approval-gate-auditor",
        "now",
      ),
    ],
    childKeys: ["tenant-safety-auditor", "approval-gate-auditor"],
  };
}

function analyzeTenantSafety(context: AnalysisContext): AgentAnalysis {
  const auditorRole = context.spec.userRoles.find((role) => role.key === "auditor");
  return {
    summary: "Least-privilege posture is present in the spec, but it still needs explicit review whenever roles, approvals, or tenant-scoped entities expand.",
    findings: [
      finding(
        auditorRole ? "info" : "warning",
        auditorRole ? "Auditor visibility is present" : "Auditor role is missing",
        auditorRole
          ? "A dedicated auditor role helps keep review and operational access separate."
          : "Review-only access is useful when approval evidence and workflow history must be attributable.",
        "Keep review and operational rights distinct instead of bundling them into one broad admin role.",
      ),
    ],
    recommendations: [
      recommendation(
        "tenant-permission-check",
        "Inspect permission breadth role by role",
        "The permission matrix should remain the smallest useful one for each role.",
        "permission-check",
        "next",
      ),
      recommendation(
        "tenant-audit-check",
        "Check meaningful audit-event visibility",
        "Approval, generation, and tenant-sensitive actions should remain attributable in logs.",
        "audit-log-check",
        "next",
      ),
    ],
    childKeys: ["permission-check", "audit-log-check"],
  };
}

function analyzePermissionCheck(context: AnalysisContext): AgentAnalysis {
  const broadRoles = context.spec.permissions
    .reduce<Map<string, Set<string>>>((map, entry) => {
      const bucket = map.get(entry.roleKey) ?? new Set<string>();
      entry.actions.forEach((action) => bucket.add(action));
      map.set(entry.roleKey, bucket);
      return map;
    }, new Map())
    .entries();
  const broadRoleKeys = Array.from(broadRoles)
    .filter(([, actions]) => actions.size >= 5)
    .map(([roleKey]) => roleKey);

  return {
    summary: "Permission structure is explicit enough to review, which is the important prerequisite for enterprise-safe refinement.",
    findings: broadRoleKeys.length > 0
      ? [
          finding(
            "info",
            "Some roles span many actions",
            `${broadRoleKeys.join(", ")} currently cover broad action sets, which may be acceptable for admins but deserves review for everyone else.`,
            "Review broad roles before go-live and split approval authority from routine operational rights when needed.",
          ),
        ]
      : [],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeAuditLogCheck(): AgentAnalysis {
  return {
    summary: "The factory already records generation requests and outcomes, but the deployed customer app still needs its own workflow and approval audit trail.",
    findings: [
      finding(
        "warning",
        "Factory audit events do not replace downstream business audit logs",
        "The factory can prove what it generated and when, but it cannot become the source of truth for live customer workflow history.",
        "Keep generated-app audit views and persistence ownership explicit in the customer runtime.",
      ),
    ],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeApprovalGate(context: AnalysisContext): AgentAnalysis {
  return {
    summary: `The spec defines ${context.spec.approvalGates.length} approval gate(s) and ${context.spec.apiDraft.endpoints.filter((endpoint) => endpoint.approvalGateKey).length} approval-aware endpoint(s), which is a good baseline for enterprise-safe behavior.`,
    findings: [
      finding(
        "info",
        "Approval gates exist in both workflow and API drafts",
        "That alignment reduces the chance of a UI-level approval rule being bypassed by an unguarded handler later.",
        "Keep approval gate keys flowing from spec to routes, handlers, and audit events.",
      ),
    ],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeBobRoss(): AgentAnalysis {
  return {
    summary: "The generated app should feel calm to refine: clear docs, obvious design exports, and a package that operators can start without reverse-engineering the workspace.",
    findings: [
      finding(
        "info",
        "Editability remains a first-class requirement",
        "Human refinement after generation is part of the product goal, not an afterthought.",
        "Keep generated files legible and point operators directly to the safe customization surfaces.",
      ),
    ],
    recommendations: [
      recommendation(
        "bob-customization-guide",
        "Keep the customization guide close to the package",
        "Operators should not have to hunt for where branding, workflows, and permissions live after generation.",
        "customization-guide-editor",
        "next",
      ),
    ],
    childKeys: ["customization-guide-editor"],
  };
}

function analyzeCustomizationGuideEditor(): AgentAnalysis {
  return {
    summary: "The best handoff keeps the next-edit surfaces obvious: spec, design package, theme styles, and architecture notes.",
    findings: [],
    recommendations: [],
    childKeys: [],
  };
}

function analyzeAgent(agent: AgentDefinition, context: AnalysisContext): AgentAnalysis {
  switch (agent.key) {
    case "tesla":
      return analyzeTesla(context);
    case "workflow-systems-analyst":
      return analyzeWorkflowSystems(context);
    case "integration-boundary-reviewer":
      return analyzeIntegrationBoundary(context);
    case "leonardo":
      return analyzeLeonardo(context);
    case "data-contract-designer":
      return analyzeDataContract(context);
    case "entity-schema-check":
      return analyzeEntitySchema(context);
    case "screen-map-planner":
      return analyzeScreenMap(context);
    case "jobs":
      return analyzeJobs(context);
    case "operator-experience-planner":
      return analyzeOperatorExperience();
    case "download-handoff-planner":
      return analyzeDownloadHandoff(context);
    case "download-check":
      return analyzeDownloadCheck();
    case "customization-check":
      return analyzeCustomizationCheck(context);
    case "marcus":
      return analyzeMarcus(context);
    case "tenant-safety-auditor":
      return analyzeTenantSafety(context);
    case "permission-check":
      return analyzePermissionCheck(context);
    case "audit-log-check":
      return analyzeAuditLogCheck();
    case "approval-gate-auditor":
      return analyzeApprovalGate(context);
    case "bob-ross":
      return analyzeBobRoss();
    case "customization-guide-editor":
      return analyzeCustomizationGuideEditor();
    case "smoke-check-planner":
      return {
        summary: "A generated app is easier to trust when it includes explicit smoke checks for its most important routes and workflows.",
        findings: [],
        recommendations: [
          recommendation(
            "smoke-core-routes",
            "Smoke the dashboard, entity, approval, and settings surfaces",
            "Those pages prove the generated app booted correctly and the core module shell is intact.",
            "generated-customer-app",
            "later",
          ),
        ],
        childKeys: [],
      };
    default:
      return {
        summary: `${agent.name} completed a bounded review.`,
        findings: [],
        recommendations: [],
        childKeys: [],
      };
  }
}

function deriveSeatKeys(spec: EnterpriseAppSpec, request: AgentRunRequest, warnings: string[]): string[] {
  const requested = request.requestedSeatKeys
    .map((seatKey) => seatKey.trim())
    .filter(Boolean);
  const validRequested = requested.filter((seatKey) => {
    const agent = getAgentDefinition(seatKey);
    if (!agent || agent.type !== "council-seat") {
      warnings.push(`Ignored unknown or non-seat agent key: ${seatKey}`);
      return false;
    }
    return true;
  });

  if (validRequested.length > 0) {
    return validRequested;
  }

  const derived = new Set<string>(["tesla", "leonardo", "marcus", "jobs"]);
  const focusText = request.focus.join(" ").toLowerCase();
  if (
    spec.unresolvedItems.length >= 5 ||
    hasAny(focusText, ["handoff", "custom", "design", "download", "test"])
  ) {
    derived.add("bob-ross");
  }
  return Array.from(derived);
}

function buildUncertainty(spec: EnterpriseAppSpec, warnings: string[]): Uncertainty {
  const reasons = [...spec.uncertainty.reasons];
  if (warnings.length > 0) {
    reasons.push("Some requested agent keys or capabilities were ignored because they are outside the constrained registry.");
  }
  const missingContext = [...spec.uncertainty.missingContext];
  const operatorQuestions = [...spec.uncertainty.operatorQuestions];
  const level = spec.uncertainty.level === "high" && warnings.length === 0 ? "high" : spec.uncertainty.level;
  return {
    level,
    reasons,
    missingContext,
    operatorQuestions,
  };
}

export class DeterministicCouncilRuntime {
  async run(request: AgentRunRequest): Promise<AgentRun> {
    const warnings: string[] = [];
    const logs: AgentRun["logs"] = [];
    const context: AnalysisContext = {
      request: {
        ...request,
        providerMode: "deterministic",
      },
      spec: request.spec,
      normalized: normalizeSpec(request.spec, request),
      warnings,
    };
    const selectedSeatKeys = deriveSeatKeys(request.spec, request, warnings);
    const delegationPlan: AgentRun["delegationPlan"] = [];

    const buildNode = (
      agentKey: string,
      depth: number,
      purpose: string,
      remainingDelegation: number,
    ): AgentRunNode => {
      const agent = getAgentDefinition(agentKey);
      if (!agent) {
        warnings.push(`Missing registry entry for ${agentKey}`);
        return {
          id: createNodeId(agentKey, depth),
          agentKey,
          name: agentKey,
          type: "specialist",
          depth,
          status: "failed",
          purpose,
          summary: `Missing agent definition for ${agentKey}.`,
          findings: [
            finding(
              "error",
              "Agent definition missing",
              `The runtime could not locate a registry definition for ${agentKey}.`,
              "Add the missing agent definition or remove the delegation reference.",
            ),
          ],
          recommendations: [],
          children: [],
        };
      }

      logs.push({
        at: now(),
        agentKey,
        depth,
        message: `Running ${agent.name}`,
        level: "info",
      });

      const analysis = analyzeAgent(agent, context);
      const children: AgentRunNode[] = [];

      if (request.allowDelegation && remainingDelegation > 0 && depth < request.maxDelegationDepth) {
        for (const childKey of analysis.childKeys.filter((candidate) => agent.allowedDelegates.includes(candidate))) {
          const childDefinition = getAgentDefinition(childKey);
          const nextRemainingDelegation = childDefinition ? Math.min(remainingDelegation - 1, childDefinition.maxDelegationDepth) : 0;
          delegationPlan.push({
            from: agentKey,
            to: childKey,
            purpose: `${agent.name} delegated ${purpose.toLowerCase()}`,
            reason: analysis.summary,
          });
          children.push(buildNode(childKey, depth + 1, `Delegated by ${agent.name}`, nextRemainingDelegation));
        }
      }

      return {
        id: createNodeId(agentKey, depth),
        agentKey,
        name: agent.name,
        type: agent.type,
        depth,
        status: "completed",
        purpose,
        summary: analysis.summary,
        findings: analysis.findings,
        recommendations: analysis.recommendations,
        children,
      };
    };

    const childNodes = selectedSeatKeys.map((seatKey) => {
      const seat = getAgentDefinition(seatKey);
      return buildNode(seatKey, 1, "Seat review", seat?.maxDelegationDepth ?? 0);
    });
    const root: AgentRunNode = {
      id: createNodeId("automind-host", 0),
      agentKey: "automind-host",
      name: APP_FACTORY_AGENT_REGISTRY.host.name,
      type: "host",
      depth: 0,
      status: "completed",
      purpose: "Host synthesis",
      summary: `Ran a bounded council review using ${selectedSeatKeys.length} seat(s) and ${delegationPlan.length} delegated check(s).`,
      findings: warnings.length > 0
        ? [
            finding(
              "warning",
              "Some requested capabilities were constrained",
              warnings.join(" "),
              "Stay inside the registry-defined delegation model for reliable, testable output.",
            ),
          ]
        : [],
      recommendations: [
        recommendation(
          "host-review-output",
          "Keep the council output advisory and operator-visible",
          "The council runtime helps structure judgment, but it should not silently commit downstream state.",
          "automind-host",
          "now",
          true,
        ),
      ],
      children: childNodes,
    };

    const summary = childNodes.map((node) => node.summary).join(" ");

    return {
      id: createAgentRunId(),
      status: "completed",
      createdAt: now(),
      updatedAt: now(),
      providerMode: "deterministic",
      operator: request.operator,
      linkedGenerationJobId: request.linkedGenerationJobId,
      request: {
        ...request,
        providerMode: "deterministic",
      },
      selectedSeatKeys,
      summary,
      root,
      delegationPlan,
      capabilityMatrix: APP_FACTORY_AGENT_REGISTRY.capabilityMatrix,
      uncertainty: buildUncertainty(request.spec, warnings),
      warnings,
      logs,
    };
  }
}
