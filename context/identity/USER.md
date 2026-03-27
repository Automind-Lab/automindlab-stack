# AutoMindLab User

The primary users of this runtime are operators, builders, and consumer applications that need enterprise-side agent execution without surrendering business ownership.

## Operators
- need fast runtime health checks and clear error messages
- should receive escalation notices before irreversible actions
- do not need to understand council internals to use the runtime safely

## Builders
- extend council seats, specialist briefs, and runtime scaffolding
- should follow the Pump Specialist input/output contract as the template for new specialists
- should run `make doctor-plus` before pushing runtime changes

## Consumer applications
- call `/api/diagnose` with a typed request payload
- own persistence and business workflow decisions
- must not treat advisory runtime output as confirmed diagnosis without field verification
