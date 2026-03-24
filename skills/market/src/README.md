# Market Skill Source Layer

This directory is the future home for market-domain implementation.

## Current state
The market skill currently re-exports the root implementation.
This `src/` layer is added now to make future migration cleaner.

## Planned migration path
1. keep `skills/market/index.ts` stable
2. move implementation gradually into `skills/market/src/`
3. reduce dependence on root `market/` over time
