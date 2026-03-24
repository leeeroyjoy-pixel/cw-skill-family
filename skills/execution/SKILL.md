# cw-execution-skill

## Purpose
Provide semi-automatic CoinW execution actions for other agents.

## Scope
- spot buy by quote
- spot sell by base
- futures long / short open
- futures close position
- order cancellation helpers

## Recommended users
- execution agents
- supervised trading agents
- strategy operators with human confirmation loops

## Safety
- dry-run first
- confirm required for live
- symbol allowlist enforced
- size and leverage caps enforced
- not all live paths are fully validated yet

## Current readiness
See root `METHOD_STATUS_MATRIX.md`.
Current practical status: use as a dry-run-first execution layer, not a blind production-live trading layer.

## Inputs / outputs
Use structured JSON input and structured JSON output.
Refer to root:
- `risk-policy.md`
- `VALIDATION_CHECKLIST.md`
- `AGENT_CONSUMPTION_GUIDE.md`

## References
See `references/`.
