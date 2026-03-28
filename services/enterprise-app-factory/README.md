# Enterprise App Factory

This service adds a constrained internal builder surface to `automindlab-stack`.

It gives operators a practical path to:

- intake a customer application request
- compile the prompt into a versioned typed spec using reusable domain packs, module registry entries, and adapter bindings
- validate assumptions, conflicts, risks, and approval gates
- run a bounded council review with typed nested delegation
- generate a customer-specific application workspace plus runtime kit and eval artifacts from reusable primitives
- verify the generated workspace with install, lint, typecheck, test, smoke, and build steps
- package the verified workspace into a downloadable archive with startup and test instructions
- export design-handoff artifacts without hard-coupling runtime success to Figma

## Boundaries

- the operator console is advisory until an operator explicitly approves generation
- the council runtime is advisory and registry-bounded, not full Codex parity
- generated output is editable by humans after generation
- generated apps remain responsible for their own persistence of business records
- no external channel is routed directly to the worker
- approval gates and audit events remain explicit

## Run locally

```bash
npm install
npm run dev
```

API default: `http://127.0.0.1:3102`

Web default: `http://127.0.0.1:5174`

## Validate locally

```bash
npm run ci
npm run council:sample
npm run sample
npm run verify:sample
```

## Key directories

- `src/shared/` typed contracts, compiler, module registry, domain packs, adapter SDK metadata, validator, runtime kit, eval harness, and design handoff builders
- `src/server/` API routes, file-backed job store, bounded council runtime, generation pipeline, and CLI
- `src/client/` operator console UI
- `templates/generated-app/` reusable generated app runtime copied into customer workspaces
- `../../data/app-factory/downloads/` downloadable generated workspace archives

## Sample generated app

The sample prompt for `Northstar Medical Logistics` is built into the service.
Run `npm run sample` to refresh `generated-apps/northstar-medical-logistics/` and produce a downloadable archive in `data/app-factory/downloads/`.
