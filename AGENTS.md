# AGENTS

AutoMindLab uses a split OpenClaw topology.

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

### automind-worker
- may execute delegated isolated tasks in the agent sandbox
- may read seeded context files in its workspace
- may validate structured outputs before returning them to the host
- must not accept requests directly from external channels
- must not become the default agent
- must not persist business records or bypass host review

## Delegation protocol
1. The host packages delegated work as structured JSON: `{ taskId, type, input, contextRefs[], timeoutMs }`.
2. The worker returns structured JSON: `{ taskId, status, output, uncertainty, escalate, safeAction }`.
3. If `escalate` is `true`, the host routes the result to a human operator before any irreversible action.
4. Worker tasks should complete within 30 seconds or return a partial result with `status: "timeout"`.

## Council routing
- the Council of 13 provides strategic lenses and orchestration guidance
- specialist agents convert council reasoning into structured outputs
- specialist output remains advisory unless a consumer application explicitly persists it

## Uncertainty and escalation
- include an explicit uncertainty field when input data is missing, contradictory, or safety-critical
- escalate when uncertainty is high and the decision is irreversible
- escalate when a specialist safety rule is triggered
- escalate when required context is still missing after one retry
- escalation output should include `reason`, `missingContext`, and `safeAction`

## Operational rule
Keep host and worker responsibilities separate.
Do not route external channels directly to the worker.
