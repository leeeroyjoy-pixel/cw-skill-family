# CW Skills Layout

This directory is the Binance-skills-hub-style evolution layer for the `cw` project.

## Goal
Restructure `cw` into business-domain skill units that are easier for other agents to understand and consume.

## Included draft skill domains
- `market`
- `account`
- `execution`

Each domain is intended to become a more independent skill package over time, with:
- `SKILL.md`
- `CHANGELOG.md`
- `LICENSE.md`
- `references/`
- implementation entrypoint(s)

## Current status
This `skills/` directory is an organizational layer added after the initial MVP release.
It does not fully replace the existing root-level structure yet.
