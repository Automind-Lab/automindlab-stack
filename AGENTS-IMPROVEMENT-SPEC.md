# AGENTS Improvement Spec

Audit date: 2025-07-14
Last updated: 2026-03-25
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
- `BOOTSTRAP.md` defines a deterministic startup order — agents know exactly what to read and in what sequence.
- `COUNCIL_OF_13.md` maps each seat to a concrete invocation trigger and a diagnostic workflow mix. This is actionable, not decorative.
- `PUMP_SPECIALIST.md` is the strongest file in the repo: typed input/output contract, domain flowcharts, non-negotiable safety rules, versioned. Council influence list is now limited to seats declared in `COUNCIL_OF_13.md`.
- Individual council seat files (e.g. `NIKOLA_TESLA.md`) follow a consistent schema: seat, contribution, invoke-when, best-output, anti-patterns.
- `USER.md` defines three user types (operators, builders, consumer applications) with goals, constraints, and runtime expectations for each.

### .ona/skills/
- Six skill files cover the core reusable workflows: `diagnostic-consultation`, `council-query`, `council-review`, `escalate-to-human`, `memory-capture`, `browser-research`.
- `index.json` is a machine-readable registry mapping skills to file paths, actions, and trigger keywords.
- `INDEX.md` provides a human-readable directory of available skills.

### Diagnostic service
- `consultation-service.js` is self-contained with no external imports — all council logic is embedded as inline constants.
- `server.js` wraps all responses in a versioned contract envelope (`contract_version`, `advisory`, `status`, `output`, `safe_action`, `escalation`, `metadata`).
- `services/diagnostic/contracts/` contains JSON schemas for both request and response, and a contract README.
- Full test suite in `services/diagnostic/test/` covers fallback behavior, health endpoint, missing symptom, valid consultation, contract envelope, schema validation, and example payloads.
- `package.json` includes a `test` script; CI runs `npm test`.

### Infrastructure
- `configure-openclaw-agents.sh` is idempotent (upsert logic), uses `set -euo pipefail`, and externalises all IDs via env vars.
- `runtime-doctor.sh` gives operators a fast pre-flight check with actionable fix hints.
- CI validates council seat count, key file presence, JS syntax, module resolution, and diagnostic tests — catches structural regressions.
- Dart client (`diagnostic_consultation_service.dart`) has a fallback path and typed request/response models.
- `.cursor/rules/agents.md` provides editor-side guidance for extending council seats and specialists.

---

## Resolved items (from original 2025-07-14 audit)

| Item | Status | Resolution |
|------|--------|------------|
| S-1: AGENTS.md missing capability/constraint tables | Resolved | Capability and constraint tables added; delegation protocol and escalation protocol documented |
| S-2: No `.ona/skills/` directory | Resolved | Six skill files created with machine-readable registry |
| S-3: PUMP_SPECIALIST.md referenced non-council figures | Resolved | Council influence list updated to use only declared Council of 13 seats |
| S-4: `consultation-service.js` broken imports | Resolved | Service is self-contained; no external module imports |
| S-5: No escalation/uncertainty protocol | Resolved | Uncertainty and escalation section added to `AGENTS.md` with trigger conditions and output shape |
| S-6: `configure-openclaw-agents.sh` silently swallows identity errors | Open | `|| true` pattern still present; identity seeding failures are non-fatal but not surfaced to operators |
| S-7: `runtime-doctor.sh` missing council integrity check | Open | Doctor script does not yet verify council seat count or specialist file presence |
| S-8: No test coverage for diagnostic service | Resolved | Full test suite added; CI runs `npm test` |
| S-9: `USER.md` too thin | Resolved | Per-user-type goals, constraints, and runtime expectations added |
| S-10: No `.cursor/rules/` editor guidance | Resolved | `.cursor/rules/agents.md` created |

---

## Remaining open items

### S-6 — Fix silent identity errors in configure-openclaw-agents.sh

The two `openclaw agents set-identity` calls use `|| true`, swallowing failures. If identity seeding fails, the agent workspace is misconfigured with no signal to the operator.

Recommended fix — replace `|| true` with an explicit warning:

```bash
openclaw agents set-identity --workspace "$HOST_WORKSPACE" --from-identity \
  || echo "Warning: host identity seeding failed — verify workspace manually"
openclaw agents set-identity --workspace "$WORKER_WORKSPACE" --from-identity \
  || echo "Warning: worker identity seeding failed — verify workspace manually"
```

This preserves non-fatal behaviour (identity seeding may not be available in all environments) while surfacing the failure to the operator.

### S-7 — Add council integrity check to runtime-doctor.sh

The doctor script does not verify that the council seat count matches the expected 13 or that key runtime files are present in the workspace.

Recommended addition after existing tool checks:

```bash
echo
count=$(find "$ROOT_DIR/context/council" -maxdepth 1 -name '*.md' ! -name 'COUNCIL_OF_13.md' | wc -l | tr -d ' ')
if [ "$count" -ge 13 ]; then
  echo "council seats: $count (ok)"
else
  echo "council seats: $count (expected >= 13)"
fi

for f in BOOTSTRAP.md; do
  if [[ -f "$HOST_WORKSPACE/$f" ]]; then
    echo "workspace $f: present"
  else
    echo "workspace $f: missing — run make configure-agents"
  fi
done
```

---

## Priority order (remaining)

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| P2 | S-6: Fix silent identity errors in configure-openclaw-agents.sh | Low | Operator visibility |
| P2 | S-7: Add council integrity check to runtime-doctor.sh | Low | Operational hygiene |
