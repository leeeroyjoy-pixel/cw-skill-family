# CW Skill Family

A CoinW-oriented agent skill family, evolving toward a Binance-skills-hub-style structure.

## What this repository is
This repository is a **CoinW skill family MVP** designed for agent use.
It currently supports three main domains:

- **market** — readonly public market data
- **account** — private account state and balances
- **execution** — dry-run-first semi-automatic execution

It is uploadable, shareable, and reusable, but should still be described as:

> A CoinW skill family MVP with partial real endpoint replacement, validated signing rules, and a dry-run-first execution model.

It is **not yet a guaranteed production-live trading package**.

---

## Skills hub layout
This repository now includes a `skills/` layer inspired by the organization style of Binance Skills Hub.

### Main skill domains
- `skills/market/`
- `skills/account/`
- `skills/execution/`

Each domain is being shaped into a more independent skill unit with:
- `SKILL.md`
- `CHANGELOG.md`
- `LICENSE.md`
- `references/`

---

## Quick navigation

### If you want the most reusable part first
Start with:
- `skills/market/`

### If you want private account access
See:
- `skills/account/`

### If you want supervised trading actions
See:
- `skills/execution/`

### If you want the current overall project status
Read:
- `METHOD_STATUS_MATRIX.md`
- `VALIDATION_CHECKLIST.md`
- `GAP_TRACKER.md`

---

## Current readiness
### Best ready
- `cw-market-skill`

### High-confidence but should be validated in the user environment
- `cw-account-skill`

### Dry-run first, do not assume live-ready
- `cw-execution-skill`

---

## Safety model
- `dry_run_default = true`
- `require_confirm_for_live = true`
- symbol allowlist enforced
- size caps enforced
- leverage caps enforced

---

## No personal credentials included
This repository contains **no personal API key, secret, or account identifier**.
Users must configure credentials locally.

See:
- `USAGE_AND_SETUP.md`
- `.env.example`

---

## Important docs
### Hub-level docs
- `METHOD_STATUS_MATRIX.md` — per-method readiness
- `VALIDATION_CHECKLIST.md` — test sequence before live usage
- `AGENT_CONSUMPTION_GUIDE.md` — how other agents should use this package
- `REAL_ENDPOINT_PROGRESS.md` — confirmed real endpoints and signing rules
- `GAP_TRACKER.md` — remaining risks and missing pieces

### Skill-level docs
- `skills/market/SKILL.md`
- `skills/account/SKILL.md`
- `skills/execution/SKILL.md`

---

## Recommended usage order
1. Use market capabilities first
2. Validate private account capabilities in your own environment
3. Keep execution in dry-run mode until explicitly validated

---

## Examples
See `examples/` for sample invocations.

---

## Environment variables
Users should set locally:
- `COINW_API_KEY`
- `COINW_API_SECRET`
- `COINW_BASE_URL`

---

## License
MIT
