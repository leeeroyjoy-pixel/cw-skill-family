# Market Endpoints Reference

This file maps the current confirmed market-facing CoinW endpoints used by the `cw-market-skill`.

## Spot public
- `GET /api/v1/public?command=returnSymbol`
- `GET /api/v1/public?command=returnTicker`
- `GET /api/v1/public?command=returnChartData`
- `GET /api/v1/public?command=returnOrderBook`

## Futures public
- `GET /v1/perpum/instruments`
- `GET /v1/perpumPublic/tickers`
- `GET /v1/perpumPublic/ticker`
- `GET /v1/perpumPublic/klines`
- `GET /v1/perpumPublic/depth`

## Symbol mapping notes
- Spot often uses `BTC_USDT`
- Futures often uses `BTC`
- Agent-facing input may use `BTCUSDT`

So the market layer currently normalizes among:
- `BTCUSDT`
- `BTC_USDT`
- `BTC`
