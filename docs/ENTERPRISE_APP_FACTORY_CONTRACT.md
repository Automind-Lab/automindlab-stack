# Enterprise App Factory Contract

This document defines the AutoMindLab-owned contract for the internal Enterprise App Factory.

## Source of truth

- `services/enterprise-app-factory/`
- `config/schemas/enterprise-app-factory-prompt.schema.json`
- `config/schemas/enterprise-app-spec.schema.json`
- `config/schemas/enterprise-app-generation-request.schema.json`
- `config/schemas/enterprise-app-design-handoff.schema.json`
- `config/schemas/enterprise-app-agent-run-request.schema.json`
- `config/schemas/enterprise-app-agent-run.schema.json`
- `config/examples/enterprise-app-factory-prompt.example.json`
- `config/examples/enterprise-app-spec.example.json`
- `config/examples/enterprise-app-design-handoff.example.json`
- `config/examples/enterprise-app-agent-run-request.example.json`
- `config/examples/enterprise-app-agent-run.example.json`
- `generated-apps/`

## What this surface owns

- the internal operator console for intake, spec review, and generation status
- the typed prompt-to-spec translation and validation flow
- the bounded council and specialist review runtime with typed nested delegation
- the approval-gated generation job contract
- the generated workspace template system, downloadable package, and design handoff package
- file-backed generation logs and audit events under `data/app-factory/`

## What this surface does not own

- direct end-user workflow execution for downstream customer tenants
- production business record persistence for generated customer apps
- secrets, deployment credentials, or runtime provider configuration
- a hard dependency on Figma or any external design tool
- unrestricted Codex-desktop-style tool use or unbounded recursive agents

## Approval model

- parsing and validation are advisory and reversible
- council runs are advisory and reversible, even when they include nested delegates
- workspace generation is prompt-gated and requires explicit approval metadata
- downloadable packages are produced only from successfully verified workspaces
- generated workspaces remain editable and must keep approval-gated actions explicit
- irreversible business actions remain the responsibility of the generated customer app

## Agent runtime boundary

The council runtime is intentionally constrained:

- host review stays explicit
- council seats can delegate only to registry-approved specialists
- specialists may create only one more bounded layer of checks when the registry allows it
- unsupported capability gaps stay visible in the capability matrix
- generated or agent-produced output remains advisory until an operator or downstream app confirms it

## Design handoff boundary

The design package is Figma-friendly but adapter-based:

- theme config
- design tokens
- component manifest
- screen map
- copy map
- optional future Figma adapter metadata

Generation must succeed even when no Figma adapter is configured.

## Ownership rule

Generated customer apps own their own business records, workflow outcomes, and approval decisions after deployment.
The factory only owns advisory specs, council runs, generation jobs, logs, and artifacts.
