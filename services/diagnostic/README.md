# AutoMindLab Diagnostic Service

This service exposes the advisory diagnostic runtime used by consumer applications.

## Endpoints

- `GET /api/health` — returns `{ status: "ok", service: "automindlab-diagnostic-consultation" }`
- `POST /api/diagnose` — returns a versioned contract envelope with diagnostic advisory output

Default port: `3001` (override with `PORT` environment variable).

## Contract version

`2026-03-24.v1`

All responses include `contract_version` in the envelope. See `contracts/` for JSON schemas.

## Run locally

```bash
npm install
npm start
```

## Test locally

```bash
npm test
```

## Response envelope

Every response from `POST /api/diagnose` is wrapped in the contract envelope:

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

## Contract schemas

- `contracts/diagnose.request.schema.json`
- `contracts/diagnose.response.schema.json`
- `contracts/README_FLOWCOMMANDER.md`

## Notes

- output is advisory and structured; never authoritative
- consumer applications own workflow decisions and persistence
- when `escalation` is true, route to a human operator before acting
- use the Pump Specialist brief (`context/council/diagnostic/PUMP_SPECIALIST.md`) as the domain source of truth for pump diagnostics
- full integration contract is documented in `docs/FLOWCOMMANDER_INTEGRATION_CONTRACT.md`
