# FLOWCOMMANDER Integration Contract

This document defines the current contract between FLOWCOMMANDER and the AutoMindLab diagnostic runtime.

## Endpoint
- `POST /api/diagnose`

## Request shape
FLOWCOMMANDER should send:
- `symptom`
- `responses`
- `siteContext`
- `technicianContext`
- optional environmental, safety, and parts context when available

See:
- `config/examples/flowcommander-diagnostic-request.example.json`

## Response shape
The runtime returns a structured advisory payload with:
- `probableCauses[]`
- `nextChecks[]`
- `partsToConsider[]`
- `escalationCriteria[]`
- `closeOutNote`
- `alternativePaths[]`
- `metadata`

See:
- `config/examples/flowcommander-diagnostic-response.example.json`

## Important note for mobile clients
`nextChecks`, `partsToConsider`, `escalationCriteria`, and `alternativePaths` are structured object arrays, not simple strings.
`confidence` and `timestamp` live inside `metadata`, not at the top level.

## Integration priorities
1. Make the FLOWCOMMANDER Dart models match this response shape.
2. Move the consultation client into the `apps/mobile` package boundary.
3. Surface the enhancement in the technician UI after workflow completion.
4. Preserve native workflow completion when the runtime is unavailable.
