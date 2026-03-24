# Market Skill

This folder is the skill-level domain package for CoinW market data.

## Purpose
Expose readonly CoinW market capabilities in a skill-local layout.

## Files
- `SKILL.md` — behavior and usage summary
- `skill.yaml` — capability manifest
- `index.ts` — skill-level entrypoint
- `references/` — endpoints and status notes

## Current implementation strategy
At the current stage, `index.ts` re-exports the existing root implementation from `../../market/index`.
This keeps the repository stable while moving toward a more independent skill-domain layout.

## Most relevant references
- `references/endpoints.md`
- `references/status.md`
- root `METHOD_STATUS_MATRIX.md`
