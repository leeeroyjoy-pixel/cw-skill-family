# Execution Status Reference

## Current readiness
The execution domain should still be treated as supervised and dry-run-first.

### Practical status
- spot execution has been aligned to `doTrade`
- futures order / close endpoints are documented and partially wired
- live behavior still needs careful validation

## Recommended exposure policy
Default exposure:
- dry-run only

Controlled exposure:
- allow trusted execution agents
- keep human confirmation in the loop
- start with small-size live validation

## Suggested validation order
1. `spot_buy_by_quote(... dry_run=true)`
2. `spot_sell_by_base(... dry_run=true)`
3. `open_futures_long(... dry_run=true)`
4. `open_futures_short(... dry_run=true)`
5. `close_futures_position(... dry_run=true)`
6. then small live validation if needed
