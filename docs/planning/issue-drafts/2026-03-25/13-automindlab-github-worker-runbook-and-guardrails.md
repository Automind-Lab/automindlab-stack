# Title

docs: add GitHub worker runbook, safety guardrails, and approval model for AutoMindLab

# Labels

docs, github, automation, safety, automindlab, enterprise, priority:P1

## Summary
Document how GitHub workers are allowed to plan, execute, verify, sync, and escalate changes in `automindlab-stack`.

## Problem
Enterprise autonomy without a runbook will create policy drift, unsafe execution, and poor auditability.

## Goal
Define explicit operational rules before expanding GitHub-side autonomy.

## Scope
- worker responsibilities
- allowed actions
- blocked actions
- policy gates
- escalation triggers
- rollback expectations

## Proposed files
- `docs/GITHUB_WORKER_RUNBOOK.md`
- `docs/GITHUB_AUTONOMY.md`

## Tasks
- [ ] Define planner, policy, executor, verifier, and sync worker roles
- [ ] Define labels or issue states that gate execution
- [ ] Define when human approval is required
- [ ] Define rollback and revert expectations
- [ ] Define limits for self-modifying behavior

## Acceptance criteria
- [ ] GitHub autonomy rules are explicit
- [ ] Unsafe issue classes are blocked from autonomous execution
- [ ] Operators can tell why a worker did or did not act
- [ ] Rollback expectations are documented before execution expands
