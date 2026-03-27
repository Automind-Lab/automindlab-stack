# Network Policy and Approval Boundaries

## Goal

Keep AutoMindLab useful without turning enterprise runtime access into an uncontrolled side channel.

## Runtime surfaces

Treat network access differently by owner surface:

- `automind-host`
  - external-facing and operator-visible
  - may call approved APIs and front-door bindings
  - must keep approvals, irreversible actions, and final messaging on the host path
- `automind-worker`
  - isolated execution path only
  - should use the least egress necessary for the delegated task
  - should return structured uncertainty and escalation instead of broad autonomous action
- GitHub automation and self-hosted runners
  - must stay inside repo-visible workflows, policies, and verification steps
  - should default to dry-run or planner-first behavior for changes with write impact
- downstream service consumers
  - consume contracts and guidance only
  - keep their own product-specific auth, persistence, and business approvals

## Approval model

### 1. Low-risk read access

Examples:

- public documentation lookups
- public issue or package metadata
- read-only validation checks

Default:

- allow when it is expected by the active task
- record destination and purpose in an operator-visible path when the check matters

### 2. Authenticated read or write integrations

Examples:

- GitHub mutations
- downstream product admin APIs
- cloud control APIs

Default:

- require explicit operator intent
- keep credentials scoped to the smallest useful permission set
- verify success in an operator-visible way

### 3. Broad or infrastructure-sensitive access

Examples:

- bootstrapping or package installs across many sources
- control-plane mutations
- secrets rotation
- tenant-affecting writes

Default:

- require explicit approval
- prefer a runbook or workflow over free-form commands
- define rollback or safe fallback before execution

## Verification checklist

Before granting or using networked capability, confirm:

1. the target system is the intended one
2. the task really needs network access
3. the action is read-only or has explicit approval
4. the result is visible to the operator
5. there is a safe failure story

## Escalation rule

If uncertainty is high and the next networked action is irreversible:

- set `escalate: true`
- include `reason`, `missingContext`, and `safeAction`
- route to human review before proceeding

## Related

- `docs/WORKER_DELEGATION_PROTOCOL.md`
- `docs/GITHUB_AUTONOMY.md`
- `docs/REPO_BOUNDARY_POLICY.md`
- `config/skills/automindlab-baseline-pack.json`
