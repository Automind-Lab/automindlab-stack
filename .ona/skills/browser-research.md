# Browser Research Skill

## Purpose
Run bounded browser-assisted research when web interaction adds signal that plain retrieval may miss.

## When to use
- a task depends on current web state or multi-step browsing
- a source requires navigation rather than one-shot retrieval
- the host needs a browser-capable worker to gather evidence before synthesis

## Workflow
1. Define the research goal and the minimum evidence needed.
2. Visit only the pages relevant to the goal.
3. Record source URL, page title, timestamp, and the exact evidence gathered.
4. Return a structured finding bundle to the host.
5. Escalate if the page requires login, payment, or risky actions.

## Output shape
```json
{
  "goal": "string",
  "visited": [{"url": "string", "title": "string"}],
  "findings": [{"claim": "string", "evidence": "string"}],
  "uncertainty": "low|medium|high",
  "escalate": false
}
```

## Guardrails
- do not submit irreversible forms
- do not authenticate with private credentials without host approval
- prefer read-only browsing unless the task explicitly allows action
