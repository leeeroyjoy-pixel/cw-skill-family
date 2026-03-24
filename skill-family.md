# CW Skill Family Design

## 1. cw-market-skill
Purpose:
- provide public market data
- support research/reporting/monitoring agents

Methods:
- get_spot_symbols
- get_futures_symbols
- get_ticker
- get_all_tickers
- get_klines
- get_orderbook
- get_futures_instruments

## 2. cw-account-skill
Purpose:
- provide private account state
- support portfolio/risk/account agents

Methods:
- get_spot_balances
- get_futures_account
- get_positions

## 3. cw-execution-skill
Purpose:
- provide semi-automatic trading actions
- dry-run first, live only with confirm=true

Methods:
- spot_buy_by_quote
- spot_sell_by_base
- open_futures_long
- open_futures_short
- close_futures_position
- cancel_all_orders

## Permission model

### market
- readonly
- no trading

### account
- account-read
- no trading

### execution
- trading enabled
- risk policy required
