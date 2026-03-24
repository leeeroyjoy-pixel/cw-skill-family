# Market Status Reference

## Current readiness
The market domain is currently the strongest part of the `cw` repository.

### Practical status
- closest to reusable by other agents
- public endpoints confirmed from CoinW docs
- safest surface to expose first

## Suggested exposure policy
Safe to expose first:
- spot symbols
- futures instruments
- tickers
- klines
- orderbooks

## Validation order
1. `get_spot_symbols`
2. `get_all_tickers(spot)`
3. `get_klines(spot)`
4. `get_orderbook(spot)`
5. `get_futures_instruments`
6. `get_all_tickers(futures)`
7. `get_klines(futures)`
8. `get_orderbook(futures)`
