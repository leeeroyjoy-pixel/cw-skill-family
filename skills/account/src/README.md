# Account Skill Source Layer

This directory is the future home for account-domain implementation.

## Current state
The account skill currently re-exports the root implementation.
This `src/` layer is added now to make future migration cleaner.

## Planned migration path
1. keep `skills/account/index.ts` stable
2. move implementation gradually into `skills/account/src/`
3. reduce dependence on root `account/` over time
