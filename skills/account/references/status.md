# Account Status Reference

## Current readiness
The account domain has moved past pure skeleton status.

### Practical status
- endpoint paths largely known
- private signing rules confirmed from docs
- should still be validated in the user environment before broad agent use

## Recommended exposure policy
Expose carefully to:
- risk agents
- portfolio observers
- account monitoring agents

Do not assume all private paths are production-confirmed without validation.

## Validation order
1. `get_spot_balances()`
2. `get_positions()`
3. `get_futures_account()`
