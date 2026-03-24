# cw-account-skill

## Purpose
Provide CoinW private account state for other agents.

## Scope
- spot balances
- futures account assets
- current positions

## Recommended users
- portfolio agents
- risk agents
- account monitoring agents

## Safety
- private API required
- no default trading
- users must supply their own local credentials

## Current readiness
See root `METHOD_STATUS_MATRIX.md`.
Current practical status: high-confidence but should be validated in the user environment before broad agent use.

## Inputs / outputs
Use structured JSON input and structured JSON output.
Refer to root:
- `schemas.md`
- `USAGE_AND_SETUP.md`
- `VALIDATION_CHECKLIST.md`

## References
See `references/`.
