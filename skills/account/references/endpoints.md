# Account Endpoints Reference

This file maps the current confirmed or high-confidence account-facing CoinW endpoints used by the `cw-account-skill`.

## Spot private
- `POST /api/v1/private?command=returnBalances`

## Futures private
- `GET /v1/perpum/account/getUserAssets`
- `GET /v1/perpum/positions/all`

## Authentication notes
### Spot private
- add `api_key` to params
- sort params ascending by key
- append `secret_key=...`
- MD5 uppercase

### Futures private
- sign payload using `timestamp + METHOD + apiPath (+ query/body)`
- HMAC-SHA256
- Base64
- send via headers: `sign`, `api_key`, `timestamp`
