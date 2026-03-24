# Execution Endpoints Reference

This file maps the current execution-facing CoinW endpoints used by the `cw-execution-skill`.

## Spot private
### Place order
- `POST /api/v1/private?command=doTrade`
- Key fields:
  - `symbol`
  - `type`
  - `amount`
  - `rate`
  - `funds`
  - `isMarket`
  - `out_trade_no`

### Cancel order
- `POST /api/v1/private?command=cancelOrder`

### Cancel all spot orders
- `POST /api/v1/private?command=cancelAllOrder`

## Futures private
### Place order
- `POST /v1/perpum/order`

### Cancel one order
- `DELETE /v1/perpum/order`

### Cancel batch orders
- `DELETE /v1/perpum/batchOrders`

### Close position
- `DELETE /v1/perpum/positions`

## Important semantic note
The current `cancel_all_orders` name in the repository is stricter on spot than on futures.
For futures it currently maps more naturally to batch-cancel semantics, not guaranteed unconditional full cancel-all semantics.
