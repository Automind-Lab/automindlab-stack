# Title

github: add policy-gated issue-to-PR worker pipeline for AutoMindLab

# Labels

github, automation, workers, automindlab, enterprise, priority:P1

## Summary
Create a GitHub-driven worker pipeline that can turn approved AutoMindLab issues into bounded implementation branches and draft pull requests.

## Problem
Current GitHub automation validates repository health and service correctness, but it does not yet implement an autonomous issue-to-change loop.

## Goal
Make GitHub the main control plane for enterprise runtime upgrades while preserving policy and review boundaries.

## Desired flow
1. issue is labeled `autonomy:ready`
2. planner worker converts the issue into a scoped implementation plan
3. policy worker checks whether the requested change is allowed for autonomy
4. executor worker creates a branch and applies bounded changes
5. verifier worker runs tests and posts a structured report
6. PR is opened with risks, policy basis, and rollback notes

## Proposed files
- `.github/workflows/issue-to-pr.yml`
- `scripts/github-issue-planner.sh`
- `scripts/github-policy-check.sh`
- `scripts/github-change-executor.sh`
- `docs/GITHUB_AUTONOMY.md`

## Tasks
- [ ] Define issue eligibility rules
- [ ] Define policy gates for autonomous execution
- [ ] Define branch naming and PR naming rules
- [ ] Require structured verifier output before PR open
- [ ] Document failure, retry, and escalation paths

## Acceptance criteria
- [ ] A labeled issue can produce a draft PR without manual local work
- [ ] The pipeline is policy-gated and auditable
- [ ] Failures post structured status back to GitHub
- [ ] Unsafe or ambiguous issues do not auto-execute
