# cw-execution-skill

Semi-automatic execution skill for CoinW.

## Methods
- spot_buy_by_quote
- spot_sell_by_base
- open_futures_long
- open_futures_short
- close_futures_position
- cancel_all_orders

## Safety
- dry-run by default
- live requires confirm=true
- symbol allowlist enforced
- size and leverage caps enforced
