export const openFuturesLongSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    margin_usdt: { type: 'number' },
    leverage: { type: 'number' },
    order_type: { type: 'string', enum: ['market', 'limit'] },
    take_profit_pct: { type: 'number' },
    stop_loss_pct: { type: 'number' },
    dry_run: { type: 'boolean' },
    confirm: { type: 'boolean' }
  },
  required: ['symbol', 'margin_usdt', 'leverage']
};
