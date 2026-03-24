# Execution Skill Source Layer

This directory is the future home for execution-domain implementation.

## Current state
The execution skill currently re-exports the root implementation.
This `src/` layer is added now to make future migration cleaner.

## Planned migration path
1. keep `skills/execution/index.ts` stable
2. move implementation gradually into `skills/execution/src/`
3. reduce dependence on root `execution/` over time
