# AGENTS Improvement Spec

Audit date: 2025-07-14  
Scope: `AGENTS.md`, `context/`, `.ona/`, agent skill files, CI, scripts, service layer

---

## What is good

### AGENTS.md
- Topology is clear: host/worker split with sandbox modes stated explicitly.
- Operational rule ("keep host and worker separate") is a single, enforceable sentence.
- Council routing section correctly marks specialist output as advisory.

### context/
- `BOOTSTRAP.md` defines a deterministic startup order — agents know exactly what to read and in what sequence.
- `COUNCIL_OF_13.md` maps each seat to a concrete invocation trigger and a diagnostic workflow mix. This is actionable, not decorative.
- `PUMP_SPECIALIST.md` is the strongest file in the repo: typed input/output contract, domain flowcharts, non-negotiable safety rules, versioned.
- Individual council seat files (e.g. `NIKOLA_TESLA.md`) follow a consistent schema: seat, contribution, invoke-when, best-output, anti-patterns.

### Infrastructure
- `configure-openclaw-agents.sh` is idempotent (upsert logic), uses `set -euo pipefail`, and externalises all IDs via env vars.
- `runtime-doctor.sh` gives operators a fast pre-flight check with actionable fix hints.
- CI validates council seat count, key file presence, and JS syntax — catches structural regressions.
- Dart client (`diagnostic_consultation_service.dart`) has a fallback path and typed request/response models.

---

## What is missing

### 1. AGENTS.md has no agent capability or constraint table
The file names the two agents but does not state what each agent **can** and **cannot** do. An agent reading it cannot determine: which tools are available to the host vs worker, what the worker's execution scope covers, or what the host must never delegate.

### 2. No delegation protocol
There is no documented contract for how `automind-host` hands work to `automind-worker`. No message format, no acknowledgement pattern, no timeout or failure behaviour. The split topology is declared but not operationalised.

### 3. No `.ona/skills/` directory
The `.ona/` directory contains only a `review/comments.json` stub. There are no skill files. The bootstrap sequence references identity and council files but there is no reusable skill layer for common agent workflows (e.g. "run a diagnostic consultation", "escalate to human", "validate council output before persisting").

### 4. Council seats reference figures outside the Council of 13
`PUMP_SPECIALIST.md` lists Marie Curie, Alan Turing, Rosalind Franklin, and George Washington Carver as council influences. None of these appear in `COUNCIL_OF_13.md`. This creates a silent inconsistency: the specialist draws from seats that do not exist in the declared council.

### 5. `consultation-service.js` imports modules that do not exist
The file requires `../../context/council/PRISMO`, `../../context/council/AUTOMINDLAB`, and `../diagnostic/PUMP_SPECIALIST`. None of these paths resolve to real files. The service will throw at startup. CI only checks syntax (`node --check`), not module resolution.

### 6. No escalation or uncertainty protocol in AGENTS.md
`SOUL.md` mentions "make safety and uncertainty explicit" but there is no shared protocol defining what that means in practice: what triggers escalation, what the output shape of an uncertain response looks like, or who receives the escalation.

### 7. No `.cursor/rules/` or equivalent editor-side rules
There are no editor-level agent rules. Developers working in this repo have no in-editor guidance on how to extend council seats, add specialists, or maintain the input/output contracts.

### 8. `USER.md` is thin
It names three user types (operators, builders, consumer apps) but gives no context about their goals, constraints, or how the runtime should adapt its behaviour for each.

### 9. No test coverage for the diagnostic service
`package.json` has no test script. CI validates syntax but not behaviour. The consultation service has no unit tests for its fallback path, output schema validation, or error handling.

### 10. `runtime-doctor.sh` does not check council file integrity
The doctor script checks for tool presence and config file existence but does not verify that the council seat count matches the expected 13, that `BOOTSTRAP.md` is present in the workspace, or that the specialist file is readable.

---

## What is wrong

### 1. `consultation-service.js` will fail at runtime
Broken imports (`PRISMO`, `AUTOMINDLAB`, `PUMP_SPECIALIST`) mean the service cannot start. This is a hard defect, not a gap.

### 2. Council of 13 count is actually 14 seat files
`context/council/` contains 14 `.md` files (13 named seats + `COUNCIL_OF_13.md`). The CI check correctly excludes `COUNCIL_OF_13.md` and passes at `>= 13`. But `PUMP_SPECIALIST.md` lives in `context/council/diagnostic/` and is not counted. The seat files themselves are correct at 13, but the `PUMP_SPECIALIST.md` council influence list references 4 figures not in the council, which is a semantic error.

### 3. `AGENTS.md` is a coding-rules file, not an agent-readable spec
The current `AGENTS.md` is injected as a system-level coding rule (visible in the environment context). Its content is minimal enough that it functions as a constraint header, but it lacks the operational depth that agents need to make routing decisions without ambiguity.

### 4. `configure-openclaw-agents.sh` silently ignores identity errors
The two `openclaw agents set-identity` calls use `|| true`, swallowing failures. If identity seeding fails, the agent workspace is misconfigured with no signal to the operator.

---

## Concrete improvement spec

### S-1 — Expand AGENTS.md with capability and constraint tables

Add two sections to `AGENTS.md`:

```markdown
## Capabilities

### automind-host
- may call external APIs and channel bindings
- may read all context/ files
- may invoke council reasoning
- may delegate tasks to automind-worker via the delegation protocol
- must not execute untrusted code directly

### automind-worker
- may execute delegated tasks in isolation
- may read context/ files seeded into its workspace
- must not accept requests directly from external channels
- must not persist business records — return structured output only

## Delegation protocol
1. Host packages task as a structured JSON payload: `{ taskId, type, input, contextRefs[] }`
2. Worker executes and returns: `{ taskId, status, output, uncertainty, escalate }`
3. If `escalate: true`, host routes to human operator before acting on output
4. Timeout: worker tasks must complete within 30 s or return a partial result with `status: "timeout"`
```

### S-2 — Create `.ona/skills/` with three baseline skills

Create the following skill files:

**`.ona/skills/diagnostic-consultation.md`**  
Workflow: receive symptom → validate input contract → call Pump Specialist → validate output schema → return structured guidance. Include explicit uncertainty and escalation steps.

**`.ona/skills/council-query.md`**  
Workflow: identify relevant council seats → compose lens mix → synthesise output → mark as advisory → return with confidence level.

**`.ona/skills/escalate-to-human.md`**  
Workflow: conditions that trigger escalation → output format for escalation notice → who receives it → what the agent must not do while awaiting human response.

### S-3 — Fix PUMP_SPECIALIST.md council references

Remove Marie Curie, Alan Turing, Rosalind Franklin, and George Washington Carver from the council influence list in `PUMP_SPECIALIST.md`. Replace with seats that exist in `COUNCIL_OF_13.md`. Suggested replacements:
- Marie Curie → Leonardo da Vinci (structural/material analysis)
- Alan Turing → Nikola Tesla (already present; algorithmic logic maps to systems thinking)
- Rosalind Franklin → Albert Einstein (first-principles structural reasoning)
- George Washington Carver → Marcus Aurelius (resource discipline, sustainable practice)

### S-4 — Fix consultation-service.js broken imports

The service must not import non-existent modules. Two options:

**Option A (preferred):** Remove the Prismo, AutoMindLab, and PumpSpecialist class imports. The service is a thin HTTP adapter — it should not instantiate council objects. Move any council-derived logic into the request handler as plain functions or inline constants.

**Option B:** Create stub modules at the referenced paths that export the expected classes, with a clear comment that they are runtime-injected placeholders.

Either way, add a module resolution check to CI:
```yaml
- name: Verify module resolution
  run: node -e "require('./services/diagnostic/consultation-service')"
  working-directory: .
```

### S-5 — Add escalation protocol to SOUL.md or AGENTS.md

Define what "make uncertainty explicit" means in practice:

```markdown
## Uncertainty and escalation

An agent response must include an `uncertainty` field when:
- input data is missing or contradictory
- confidence in the output is below the medium threshold
- the task involves safety-critical decisions

Escalation is required when:
- `uncertainty` is high AND the decision is irreversible
- a safety rule in the specialist brief is triggered
- the consumer application has not provided required context after one retry

Escalation output shape:
{ "escalate": true, "reason": "string", "missingContext": ["string"], "safeAction": "string" }
```

### S-6 — Fix silent identity errors in configure-openclaw-agents.sh

Replace `|| true` with explicit error handling:

```bash
openclaw agents set-identity --workspace "$HOST_WORKSPACE" --from-identity \
  || echo "Warning: host identity seeding failed — verify workspace manually"
openclaw agents set-identity --workspace "$WORKER_WORKSPACE" --from-identity \
  || echo "Warning: worker identity seeding failed — verify workspace manually"
```

This preserves non-fatal behaviour (identity seeding may not be available in all environments) while surfacing the failure to the operator.

### S-7 — Add council integrity check to runtime-doctor.sh

Add after the existing tool checks:

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

### S-8 — Add a test script to the diagnostic service

Add to `services/diagnostic/package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "node --test test/"
}
```

Add `services/diagnostic/test/consultation.test.js` covering:
- fallback response shape when service throws
- `/api/health` returns 200
- `/api/diagnose` returns 400 when `symptom` is missing
- `/api/diagnose` returns a valid output schema for a known symptom

Update CI to run `npm test` in the diagnostic service job.

### S-9 — Expand USER.md

Add per-user-type context:

```markdown
## Operators
- need fast runtime health checks and clear error messages
- should receive escalation notices before irreversible actions
- do not need to understand council internals

## Builders
- extend council seats and specialist briefs
- must follow the input/output contract in PUMP_SPECIALIST.md as the template
- should run make doctor before pushing changes

## Consumer applications
- call /api/diagnose with a typed DiagnosticConsultationRequest
- own persistence and business workflow decisions
- must not treat advisory output as confirmed diagnosis without field verification
```

### S-10 — Add `.cursor/rules/` for editor-side guidance

Create `.cursor/rules/agents.md` with:
- how to add a new council seat (file location, required schema fields)
- how to add a new specialist (location, required input/output contract, council influence list rules)
- the rule that specialist output is advisory unless a consumer app explicitly persists it
- the rule that external channels must not be routed to the worker

---

## Priority order

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| P0 | S-4: Fix broken imports in consultation-service.js | Low | Blocks service startup |
| P0 | S-3: Fix PUMP_SPECIALIST council references | Low | Semantic correctness |
| P1 | S-1: Expand AGENTS.md with capability/constraint tables | Low | Agent routing clarity |
| P1 | S-5: Add escalation protocol | Low | Safety completeness |
| P1 | S-2: Create .ona/skills/ baseline | Medium | Reusable agent workflows |
| P2 | S-6: Fix silent identity errors | Low | Operator visibility |
| P2 | S-7: Add council integrity to runtime-doctor | Low | Operational hygiene |
| P2 | S-8: Add diagnostic service tests | Medium | Regression safety |
| P3 | S-9: Expand USER.md | Low | Context completeness |
| P3 | S-10: Add .cursor/rules/ | Low | Developer experience |
