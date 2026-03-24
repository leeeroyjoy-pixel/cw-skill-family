# Account Skill

This folder is the skill-level domain package for CoinW private account access.

## Purpose
Expose balances, account assets, and positions in a skill-local layout.

## Files
- `SKILL.md` — behavior and usage summary
- `skill.yaml` — capability manifest
- `index.ts` — skill-level entrypoint
- `references/` — endpoint and readiness notes

## Current implementation strategy
At the current stage, `index.ts` re-exports the existing root implementation from `../../account/index`.
This keeps the repository stable while moving toward a more independent skill-domain layout.

## Most relevant references
- `references/endpoints.md`
- `references/status.md`
- root `VALIDATION_CHECKLIST.md`
