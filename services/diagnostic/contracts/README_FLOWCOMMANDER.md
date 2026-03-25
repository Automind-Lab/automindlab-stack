# FLOWCOMMANDER ↔ AutoMindLab Contract

This directory defines the integration contract between:
- FLOWCOMMANDER (consumer application)
- AutoMindLab (advisory runtime)

## Key Rules

- AutoMindLab output is ALWAYS advisory
- No runtime response should be treated as authoritative
- All responses include `contract_version`, `advisory`, `status`, `output`, `safe_action`, `escalation`, and `metadata`
- All responses are parseable even on failure (`status: "error"` returns a structured envelope with `output: null`)

## Versioning

Current version:

```
2026-03-24.v1
```

Future changes must:
- bump version
- remain backward compatible where possible

## Contract enforcement (implemented)

- Request validation is enforced in `server.js` — missing `symptom` returns HTTP 400 with a structured envelope
- All responses (success, partial, and error) are wrapped in the contract envelope
- Contract tests in `test/contract.test.js` verify envelope shape on success and error paths
- Formal JSON schemas in this directory validate both request and response shapes

## Schemas

- `diagnose.request.schema.json` — validates incoming FLOWCOMMANDER requests
- `diagnose.response.schema.json` — validates all runtime responses

## Consumer Expectations (FLOWCOMMANDER)

- Must parse the contract envelope before accessing `output`
- Must fallback safely when `output` is null or `escalation` is true
- Must NOT persist advisory output as a confirmed diagnosis without field verification

## Full contract documentation

See `docs/FLOWCOMMANDER_INTEGRATION_CONTRACT.md` in the repository root for the complete request and response shapes, symptom values, and integration checklist.
