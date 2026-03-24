# Execution Skill

This folder is the skill-level domain package for CoinW execution actions.

## Purpose
Expose dry-run-first CoinW trading actions in a skill-local layout.

## Files
- `SKILL.md` — behavior and safety summary
- `skill.yaml` — capability manifest
- `index.ts` — skill-level entrypoint
- `references/` — endpoint and status notes

## Current implementation strategy
At the current stage, `index.ts` re-exports the existing root implementation from `../../execution/index`.
This keeps the repository stable while moving toward a more independent skill-domain layout.

## Important caution
This skill should still be treated as supervised and dry-run-first.
Do not assume full production-live readiness.

## Most relevant references
- `references/endpoints.md`
- `references/status.md`
- root `GAP_TRACKER.md`
