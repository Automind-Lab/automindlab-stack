# AutoMindLab Diagnostic Service

This service exposes the advisory diagnostic runtime used by consumer applications.

## Endpoints

- `GET /api/health`
- `POST /api/diagnose`

## Run locally

```bash
npm install
npm start
```

## Test locally

```bash
npm test
```

## Notes

- output is advisory and structured
- consumer applications still own workflow decisions and persistence
- use the Pump Specialist brief as the domain source of truth for pump diagnostics
