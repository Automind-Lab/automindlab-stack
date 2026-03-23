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

## Council routing
- the Council of 13 provides strategic lenses and orchestration guidance
- specialist agents convert council reasoning into structured outputs
- specialist output remains advisory unless a consumer application explicitly persists it

## Operational rule
Keep host and worker responsibilities separate.
Do not route external channels directly to the worker.
