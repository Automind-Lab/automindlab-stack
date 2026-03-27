# AGENTS Improvement Spec

Audit date: 2025-07-14
Last updated: 2026-03-27
Scope: `AGENTS.md`, `context/`, `.ona/`, agent skill files, CI, scripts, service layer

---

## What is good

### AGENTS.md
- Topology is clear: host/worker split with sandbox modes stated explicitly.
- Capability and constraint tables define what each agent may and must not do.
- Delegation protocol is documented with payload shape, response shape, and timeout rules.
- Uncertainty and escalation section defines trigger conditions and output shape.
- Operational rule ("keep host and worker separate") is a single, enforceable sentence.
- Council routing section correctly marks specialist output as advisory.

### context/
- `BOOTSTRAP.md` defines a deterministic startup order so agents know what to read and in what sequence.
- `COUNCIL_OF_13.md` maps each seat to a concrete invocation trigger and workflow mix.
- `PUMP_SPECIALIST.md` is versioned, typed, and constrained to the declared Council of 13.
- Individual council seat files follow a consistent schema: seat, contribution, invoke-when, best-output, anti-patterns.
- `USER.md` defines operators, builders, and consumer applications with goals, constraints, and runtime expectations.

### .ona/skills/
- Core reusable workflows are present for consultation, council use, escalation, memory capture, browser research, routing checks, runtime doctoring, recovery, and workflow validation.
- `index.json` is a machine-readable registry mapping skills to file paths, actions, and trigger keywords.
- `INDEX.md` provides a human-readable directory and recommended usage path.

### Diagnostic service
- `consultation-service.js` is self-contained with no fragile external imports.
- `server.js` wraps responses in a versioned contract envelope.
- `services/diagnostic/contracts/` contains JSON schemas for both request and response, plus contract guidance.
- Tests cover fallback behavior, health endpoint, contract shape, schema files, and example payloads.

### Infrastructure and governance
- `configure-openclaw-agents.sh` is idempotent, surfaces identity seeding warnings, and externalizes all IDs via env vars.
- `runtime-doctor.sh` verifies key repo surfaces, council integrity, contracts, automation, intake catalogs, and runtime profiles.
- CI validates council seat count, repo operating-system rules, workflow hygiene, runtime contracts, capability intake, runtime profiles, and diagnostic tests.
- `config/intake/` gives the repo a governed front door for external capabilities.
- `config/runtime-profiles/` makes OpenClaw/NemoClaw runtime expectations explicit without overclaiming implementation status.

---

## Resolved items (from original 2025-07-14 audit)

| Item | Status | Resolution |
|------|--------|------------|
| S-1: AGENTS.md missing capability/constraint tables | Resolved | Capability and constraint tables added; delegation protocol and escalation protocol documented |
| S-2: No `.ona/skills/` directory | Resolved | Skills directory created with machine-readable registry and expanded enterprise routines |
| S-3: PUMP_SPECIALIST.md referenced non-council figures | Resolved | Council influence list updated to use only declared Council of 13 seats |
| S-4: `consultation-service.js` broken imports | Resolved | Service is self-contained; no external module imports |
| S-5: No escalation/uncertainty protocol | Resolved | Uncertainty and escalation section added to `AGENTS.md` with trigger conditions and output shape |
| S-6: `configure-openclaw-agents.sh` silently swallows identity errors | Resolved | Identity seeding keeps non-fatal behavior but now surfaces explicit operator warnings |
| S-7: `runtime-doctor.sh` missing council integrity check | Resolved | Doctor script now verifies council seat count, key files, and runtime validators |
| S-8: No test coverage for diagnostic service | Resolved | Full test suite added; CI runs `npm test` |
| S-9: `USER.md` too thin | Resolved | Per-user-type goals, constraints, and runtime expectations added |
| S-10: No `.cursor/rules/` editor guidance | Resolved | `.cursor/rules/agents.md` created |

---

## Remaining open items

No AGENTS-level critical gaps remain from the original audit.

The remaining work is evidence-oriented rather than contract-oriented:

- prove OpenClaw against a live gateway on a machine that actually has `openclaw` and seeded workspaces
- expand NemoClaw from contract-validated to implementation-validated only when a real runtime surface exists here
