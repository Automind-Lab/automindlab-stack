# AGENTS

AutoMindLab uses a split OpenClaw topology.

## Startup surface

Read these files before changing runtime behavior, policy, or contracts:

1. `AGENTS.md`
2. `RUNBOOK.md`
3. `context/BOOTSTRAP.md`
4. `context/identity/IDENTITY.md`
5. `context/identity/SOUL.md`
6. `context/council/COUNCIL_OF_13.md`
7. `TASK_STATE.md`
8. `WORK_IN_PROGRESS.md`
9. `.ona/skills/INDEX.md`
10. `docs/NETWORK_POLICY.md` for external access, approvals, or automation work

## Roles

### automind-host
- host-facing conversational runtime
- default agent
- sandbox mode `off`
- owns front-door channels and operator interaction

### automind-worker
- dedicated sandbox worker
- sandbox mode `all`
- sandbox scope `agent`
- executes delegated runtime tasks that need isolation

## Capabilities and constraints

### automind-host
- may call external APIs and front-door channel bindings
- may read all repository context files and specialist briefs
- may invoke council reasoning and specialist workflows
- may delegate isolated execution to `automind-worker`
- must not execute untrusted code directly
- must not persist business records owned by consumer applications
- must keep final external messaging, approvals, and irreversible actions on the host path

### automind-worker
- may execute delegated isolated tasks in the agent sandbox
- may read seeded context files in its workspace
- may validate structured outputs before returning them to the host
- must not accept direct requests from external channels
- must not become the default agent
- must not persist business records or bypass host review

## Source of truth rules

- `automindlab-stack` owns runtime topology, council and specialist routing, enterprise runbooks, and reusable service contracts.
- downstream consumer applications own user experience, business records, approvals, and workflow outcomes.
- `bmo-stack` is a reference implementation only. Translate useful patterns into AutoMindLab-native form instead of copying local operator assumptions.
- when a capability belongs to a downstream product, document the handoff instead of absorbing the product into this repo.

## Delegation protocol

1. The host packages delegated work as structured JSON. See `config/schemas/worker-task.schema.json`.
2. The worker returns structured JSON with explicit uncertainty and escalation fields. See `config/schemas/worker-result.schema.json`.
3. If `escalate` is `true`, the host routes the result to a human operator before any irreversible action.
4. Worker tasks should complete within 30 seconds or return partial output with `status: "timeout"` or `status: "partial"`.

## Council routing

- the Council of 13 provides strategic lenses and orchestration guidance
- specialist agents convert council reasoning into structured outputs
- specialist output remains advisory unless a consumer application explicitly persists it
- host review stays explicit even when worker or specialist output looks high confidence

## Uncertainty and escalation

- include an explicit uncertainty object when input data is missing, contradictory, or safety-critical
- escalate when uncertainty is high and the decision is irreversible
- escalate when a specialist safety rule is triggered
- escalate when required context is still missing after one retry
- escalation output should include `reason`, `missingContext`, and `safeAction`

## Operating rules

- keep host and worker responsibilities separate
- do not route external channels directly to the worker
- use `routines.md` and `RUNBOOK.md` before ad hoc recovery steps
- update `TASK_STATE.md` and `WORK_IN_PROGRESS.md` before long-running or interrupted work
