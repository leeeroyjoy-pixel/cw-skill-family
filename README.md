# CW Skill Family

Agent-oriented CoinW skill family (MVP) for:
- market data
- account inspection
- semi-automatic execution

## Project status
This repository is **uploadable and shareable**, but it should be described as:

> A CoinW skill family MVP for agents, with partial real endpoint replacement and a dry-run-first execution model.

It is **not yet a guaranteed production-live trading package**.

## Included skills
- `cw-market-skill`
- `cw-account-skill`
- `cw-execution-skill`

## Current readiness
### Best ready
- `cw-market-skill`

### High-confidence but should be validated in the user environment
- `cw-account-skill`

### Dry-run first, do not assume live-ready
- `cw-execution-skill`

## Safety model
- `dry_run_default = true`
- `require_confirm_for_live = true`
- symbol allowlist enforced
- size caps enforced
- leverage caps enforced

## No personal credentials included
This repository contains **no personal API key, secret, or account identifier**.
Users must configure credentials locally.

See:
- `USAGE_AND_SETUP.md`
- `.env.example`

## Important docs
- `METHOD_STATUS_MATRIX.md` — per-method readiness
- `VALIDATION_CHECKLIST.md` — test sequence before live usage
- `AGENT_CONSUMPTION_GUIDE.md` — how other agents should use this package
- `REAL_ENDPOINT_PROGRESS.md` — confirmed real endpoints and signing rules
- `GAP_TRACKER.md` — remaining risks and missing pieces

## Recommended usage
### Safe to expose first
- market methods

### Validate before exposing broadly
- account methods

### Keep dry-run by default
- execution methods

## Examples
See `examples/` for sample invocations.

## Environment variables
Users should set locally:
- `COINW_API_KEY`
- `COINW_API_SECRET`
- `COINW_BASE_URL`

## License
MIT
