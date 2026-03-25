# FLOWCOMMANDER Integration Contract

This document defines the current contract between FLOWCOMMANDER and the AutoMindLab diagnostic runtime.

## Contract version

`2026-03-24.v1`

All requests and responses include a `contract_version` field with this value.
Future breaking changes must increment the version.

## Endpoint

- `POST /api/diagnose`
- `GET /api/health`

## Request shape

```json
{
  "contract_version": "2026-03-24.v1",
  "symptom": "lowPressure",
  "responses": [
    {
      "stepKey": "string",
      "prompt": "string",
      "responseValue": "string",
      "notes": "string or null"
    }
  ],
  "siteContext": {},
  "technicianContext": {},
  "environmentalContext": {},
  "safetyContext": {},
  "partsContext": {}
}
```

Required fields: `contract_version`, `symptom`, `responses`.
Optional context fields: `siteContext`, `technicianContext`, `environmentalContext`, `safetyContext`, `partsContext`.

Known symptom values: `lowPressure`, `pressureOscillation`, `highAmps`, `pumpCycling`, `lagPumpNotEngaging`, `abnormalFrequencyBehavior`, `communicationTimeSyncAnomaly`, `generalPerformanceIssue`.
Unknown symptom values default to `generalPerformanceIssue`.

See: `services/diagnostic/contracts/diagnose.request.schema.json`

## Response envelope

All responses — including errors and fallbacks — are wrapped in the contract envelope:

```json
{
  "contract_version": "2026-03-24.v1",
  "advisory": true,
  "status": "ok | partial | error",
  "output": {},
  "uncertainty": "string or null",
  "safe_action": "string",
  "escalation": false,
  "metadata": {}
}
```

- `advisory` is always `true`. Output must not be treated as a confirmed diagnosis.
- `status: "ok"` — consultation succeeded.
- `status: "partial"` — runtime fallback was used; `escalation` will be `true`.
- `status: "error"` — request was malformed (e.g. missing `symptom`); HTTP 400.
- `escalation: true` means the response must be routed to a human operator before acting.
- `safe_action` is always present and provides the recommended next step.

See: `services/diagnostic/contracts/diagnose.response.schema.json`

## Output payload (inside `output`)

When `status` is `ok` or `partial`, `output` contains the diagnostic advisory:

```json
{
  "probableCauses": [
    { "cause": "string", "confidence": "high|medium|low", "evidence": ["string"] }
  ],
  "nextChecks": [
    { "action": "string", "tool": "string", "safety": "string", "priority": "high|medium|low" }
  ],
  "partsToConsider": [
    { "part": "string", "reason": "string", "compatibility": "string", "urgency": "string" }
  ],
  "escalationCriteria": [
    { "condition": "string", "threshold": "string", "action": "string", "timeline": "string" }
  ],
  "closeOutNote": "string",
  "alternativePaths": [
    { "name": "string", "description": "string", "trigger": "string" }
  ],
  "metadata": {
    "confidence": "high|medium|low",
    "timestamp": "ISO 8601",
    "consultationId": "string",
    "dataQuality": "good|fair|poor",
    "limitations": ["string"],
    "originalSymptom": "string",
    "councilSeatsConsulted": ["string"]
  }
}
```

When `status` is `error`, `output` is `null`.

## Important notes for mobile clients

- `nextChecks`, `partsToConsider`, `escalationCriteria`, and `alternativePaths` are structured object arrays, not simple strings.
- `confidence` and `timestamp` live inside `output.metadata`, not at the envelope top level.
- Always parse the envelope first, then access `output` only when `status` is `ok` or `partial`.
- Always fall back gracefully if `output` is null or `escalation` is true.

## Contract schemas

Formal JSON schemas (JSON Schema 2020-12) are in:
- `services/diagnostic/contracts/diagnose.request.schema.json`
- `services/diagnostic/contracts/diagnose.response.schema.json`

Example payloads are in:
- `config/examples/flowcommander-diagnostic-request.example.json`
- `config/examples/flowcommander-diagnostic-response.example.json`

## Integration checklist

1. Match FLOWCOMMANDER Dart models to the contract envelope shape, not just the inner `output` fields.
2. Move the consultation client into the `apps/mobile` package boundary.
3. Surface the diagnostic enhancement in the technician UI after workflow completion.
4. Preserve native workflow completion when the runtime is unavailable (`escalation: true` or network error).
5. Never persist advisory output as a confirmed diagnosis without field verification.
