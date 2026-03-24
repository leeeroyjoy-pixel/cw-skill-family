# CW Schemas

## Standard result

```json
{
  "success": true,
  "mode": "readonly|dry_run|live",
  "data": {},
  "error": null,
  "meta": {
    "exchange": "coinw",
    "market": "spot|futures",
    "timestamp": 1711111111111
  }
}
```

## Execution dry-run input example

```json
{
  "symbol": "BTCUSDT",
  "margin_usdt": 100,
  "leverage": 3,
  "dry_run": true,
  "confirm": false
}
```

## Execution live input example

```json
{
  "symbol": "BTCUSDT",
  "margin_usdt": 100,
  "leverage": 3,
  "dry_run": false,
  "confirm": true
}
```

## Market ticker input

```json
{
  "symbol": "BTCUSDT",
  "market": "spot"
}
```

## Positions input

```json
{
  "symbol": "BTCUSDT"
}
```
