# cw-market-skill

## Purpose
Provide CoinW market data access for other agents.

## Scope
- spot symbols
- futures instruments
- tickers
- klines
- orderbooks

## Recommended users
- research agents
- monitoring agents
- reporting agents

## Safety
- readonly only
- no trading actions
- does not require personal credentials for public endpoints

## Current readiness
See root `METHOD_STATUS_MATRIX.md`.
Current practical status: this is the most reusable part of the repository.

## Inputs / outputs
Use structured JSON input and structured JSON output.
Refer to root:
- `schemas.md`
- `VALIDATION_CHECKLIST.md`

## References
See `references/`.
