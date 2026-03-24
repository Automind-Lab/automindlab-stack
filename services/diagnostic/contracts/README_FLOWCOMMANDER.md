# FLOWCOMMANDER ↔ AutoMindLab Contract (Scaffold)

This directory defines the integration contract between:
- FLOWCOMMANDER (consumer application)
- AutoMindLab (advisory runtime)

## Key Rules

- AutoMindLab output is ALWAYS advisory
- No runtime response should be treated as authoritative
- All responses must include `safe_action`
- All responses must be parseable even on failure

## Versioning

Current version:

```
2026-03-24.v1
```

Future changes must:
- bump version
- remain backward compatible where possible

## Next Steps (Required Implementation)

1. Enforce request validation in `server.js`
2. Wrap ALL responses in contract envelope
3. Add runtime validation before response return
4. Add contract tests

## Consumer Expectations (FLOWCOMMANDER)

- Must validate contract envelope
- Must fallback safely on invalid response
- Must NOT persist advisory output as truth

---

This is a scaffold only. Enforcement must be implemented in runtime code.
