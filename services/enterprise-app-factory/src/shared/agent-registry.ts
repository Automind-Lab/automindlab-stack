import type { AgentDefinition, AgentRegistry } from "./contracts.js";

function councilSeat(
  key: string,
  name: string,
  lens: string,
  description: string,
  capabilities: string[],
  allowedDelegates: string[],
): AgentDefinition {
  return {
    key,
    name,
    type: "council-seat",
    description,
    lens,
    capabilities,
    allowedDelegates,
    maxDelegationDepth: 2,
    boundaries: [
      "Advisory only until the host or operator approves a next step",
      "Must keep uncertainty explicit when customer context is incomplete",
      "Must not persist downstream business state",
    ],
  };
}

function specialist(
  key: string,
  name: string,
  lens: string,
  description: string,
  capabilities: string[],
  allowedDelegates: string[] = [],
): AgentDefinition {
  return {
    key,
    name,
    type: "specialist",
    description,
    lens,
    capabilities,
    allowedDelegates,
    maxDelegationDepth: allowedDelegates.length > 0 ? 1 : 0,
    boundaries: [
      "Bounded to the parent task and typed output contract",
      "No external-channel writes or irreversible actions",
      "Escalate instead of assuming when the spec is ambiguous",
    ],
  };
}

export const HOST_AGENT: AgentDefinition = {
  key: "automind-host",
  name: "AutoMindLab Host",
  type: "host",
  description: "Owns the operator interaction, final messaging, approvals, and explicit escalation boundary.",
  lens: "Host review and final responsibility",
  capabilities: ["conversation", "approval review", "audit visibility", "final synthesis"],
  allowedDelegates: ["tesla", "leonardo", "jobs", "marcus", "bob-ross"],
  maxDelegationDepth: 3,
  boundaries: [
    "No direct persistence of downstream business records",
    "No external channel routed directly to the worker path",
    "Irreversible actions stay operator-visible",
  ],
};

export const COUNCIL_AND_SPECIALISTS: AgentDefinition[] = [
  councilSeat(
    "tesla",
    "Nikola Tesla",
    "Hidden system interactions and orchestration boundaries",
    "Reviews workflow interactions, integration seams, and runtime boundaries before generation or repair.",
    ["workflow review", "integration boundary review", "runtime topology review"],
    ["workflow-systems-analyst", "integration-boundary-reviewer"],
  ),
  councilSeat(
    "leonardo",
    "Leonardo da Vinci",
    "Cross-domain synthesis of entities, screens, and contracts",
    "Reviews information architecture, entity relationships, and end-to-end blueprint coherence.",
    ["data model review", "screen map review", "architecture synthesis"],
    ["data-contract-designer", "screen-map-planner"],
  ),
  councilSeat(
    "jobs",
    "Steve Jobs",
    "Product focus and operator-facing clarity",
    "Reviews operator UX, generated app cohesion, and packaging/test handoff quality.",
    ["operator UX review", "preview review", "handoff review"],
    ["operator-experience-planner", "download-handoff-planner"],
  ),
  councilSeat(
    "marcus",
    "Marcus Aurelius",
    "Discipline, safety, least privilege, and escalation judgment",
    "Reviews approval gates, tenant boundaries, and risky irreversible actions.",
    ["approval policy review", "tenant safety review", "audit review"],
    ["tenant-safety-auditor", "approval-gate-auditor"],
  ),
  councilSeat(
    "bob-ross",
    "Bob Ross",
    "Calm operator enablement and customization clarity",
    "Reviews the customization handoff, documentation, and whether the generated app is editable without fear.",
    ["handoff clarity review", "editability review", "onboarding review"],
    ["customization-guide-editor"],
  ),
  specialist(
    "workflow-systems-analyst",
    "Workflow Systems Analyst",
    "Examines task sequencing, automation touchpoints, and failure visibility",
    "Analyzes workflow triggers, approvals, and background operations for safe restart behavior.",
    ["workflow step analysis", "restart-safety review"],
    ["smoke-check-planner"],
  ),
  specialist(
    "integration-boundary-reviewer",
    "Integration Boundary Reviewer",
    "Checks ingress, egress, and host/worker boundaries",
    "Makes sure external integrations stay contract-first and never turn the worker into a front door.",
    ["integration review", "host-worker boundary review"],
  ),
  specialist(
    "data-contract-designer",
    "Data Contract Designer",
    "Checks entities, API draft coverage, and persistence ownership",
    "Reviews entity coverage, tenant scoping, and API draft completeness.",
    ["entity review", "API draft review"],
    ["entity-schema-check"],
  ),
  specialist(
    "screen-map-planner",
    "Screen Map Planner",
    "Checks routes, modules, and design handoff consistency",
    "Reviews screen map completeness and how the generated UI aligns with the spec.",
    ["screen inventory review", "design handoff review"],
  ),
  specialist(
    "operator-experience-planner",
    "Operator Experience Planner",
    "Checks intake, review, and job-inspection clarity",
    "Reviews whether operators can understand and act on the generated outputs quickly.",
    ["operator flow review", "status clarity review"],
  ),
  specialist(
    "download-handoff-planner",
    "Download Handoff Planner",
    "Checks package readiness and startup/test clarity",
    "Reviews downloadable artifacts, startup steps, and test-readiness handoff.",
    ["package readiness review", "startup instruction review"],
    ["download-check", "customization-check"],
  ),
  specialist(
    "tenant-safety-auditor",
    "Tenant Safety Auditor",
    "Checks tenant boundaries and least-privilege defaults",
    "Reviews tenancy, approval scope, and whether destructive paths are explicitly guarded.",
    ["tenant boundary review", "least privilege review"],
    ["permission-check", "audit-log-check"],
  ),
  specialist(
    "approval-gate-auditor",
    "Approval Gate Auditor",
    "Checks irreversible actions and required approver coverage",
    "Reviews whether approval gates match the risky actions in the workflows and API draft.",
    ["approval gate review", "risk review"],
  ),
  specialist(
    "customization-guide-editor",
    "Customization Guide Editor",
    "Checks post-generation editability and documentation usefulness",
    "Reviews whether humans can safely refine branding, workflows, and permissions after generation.",
    ["documentation review", "editability review"],
  ),
  specialist(
    "smoke-check-planner",
    "Smoke Check Planner",
    "Checks how key pages and flows should be verified",
    "Suggests high-signal smoke checks for the generated app package.",
    ["smoke test review"],
  ),
  specialist(
    "entity-schema-check",
    "Entity Schema Check",
    "Checks entity and API alignment",
    "Looks for mismatches between entity model, workflows, and API endpoints.",
    ["schema consistency review"],
  ),
  specialist(
    "download-check",
    "Download Check",
    "Checks packaged artifact presence and naming",
    "Verifies that a generated workspace also has a downloadable package for handoff.",
    ["artifact review"],
  ),
  specialist(
    "customization-check",
    "Customization Check",
    "Checks where operators should edit the generated app next",
    "Reviews whether the package points clearly to theme, workflow, and permissions customization surfaces.",
    ["customization review"],
  ),
  specialist(
    "permission-check",
    "Permission Check",
    "Checks least-privilege coverage in the permission matrix",
    "Reviews whether every role is scoped to the smallest useful set of actions.",
    ["permission matrix review"],
  ),
  specialist(
    "audit-log-check",
    "Audit Log Check",
    "Checks whether meaningful actions are attributable",
    "Reviews audit visibility for generation, approval, and workflow-relevant actions.",
    ["audit visibility review"],
  ),
];

export const APP_FACTORY_AGENT_REGISTRY: AgentRegistry = {
  providerModes: ["deterministic"],
  host: HOST_AGENT,
  agents: COUNCIL_AND_SPECIALISTS,
  capabilityMatrix: [
    {
      key: "structured-council-review",
      label: "Structured council review",
      support: "supported",
      notes: "The host can run a bounded multi-seat review with nested delegates and typed output.",
    },
    {
      key: "job-by-job-subdelegation",
      label: "Job-by-job subdelegation",
      support: "supported",
      notes: "Council seats can spawn allowed specialists, and some specialists can create one more bounded layer of checks.",
    },
    {
      key: "downloadable-packages",
      label: "Downloadable generated packages",
      support: "supported",
      notes: "Completed generation jobs can emit a downloadable archive for operator handoff and testing.",
    },
    {
      key: "arbitrary-tool-use",
      label: "Arbitrary tool use",
      support: "unsupported",
      notes: "This runtime does not expose open-ended tool execution equivalent to Codex desktop.",
    },
    {
      key: "unbounded-recursive-agents",
      label: "Unbounded recursive agents",
      support: "unsupported",
      notes: "Delegation depth and delegate sets are constrained by registry policy for reliability and auditability.",
    },
    {
      key: "general-purpose-coding-agent",
      label: "General-purpose coding agent parity",
      support: "planned",
      notes: "The factory now has a constrained advisory council runtime, not full Codex feature parity.",
    },
  ],
};

export function getAgentDefinition(key: string): AgentDefinition | undefined {
  if (key === HOST_AGENT.key) {
    return HOST_AGENT;
  }
  return COUNCIL_AND_SPECIALISTS.find((agent) => agent.key === key);
}
