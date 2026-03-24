# CW Risk Policy

## Default mode
- dry_run_default: true
- require_confirm_for_live: true

## Symbol allowlist
Allowed:
- BTCUSDT
- ETHUSDT
- SOLUSDT

## Spot limits
- max_quote_per_order: 200 USDT

## Futures limits
- max_margin_per_order: 100 USDT

## Leverage limits
- BTCUSDT: 5
- ETHUSDT: 4
- SOLUSDT: 3

## Live execution requirements
A live order requires:
1. dry_run = false
2. confirm = true
3. symbol is allowlisted
4. order size is within cap
5. leverage is within cap

## Logging
Every execution call should log:
- caller
- input
- dry-run/live mode
- risk check result
- exchange response
- timestamp
