export { openFuturesLongSchema } from '../../execution/schemas';

export const spotBuyByQuoteSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    quote_amount: { type: 'number' },
    price: { type: 'number' },
    order_type: { type: 'string', enum: ['market', 'limit'] },
    client_order_id: { type: 'string' },
    dry_run: { type: 'boolean' },
    confirm: { type: 'boolean' }
  },
  required: ['symbol', 'quote_amount']
};

export const spotSellByBaseSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    base_amount: { type: 'number' },
    price: { type: 'number' },
    order_type: { type: 'string', enum: ['market', 'limit'] },
    client_order_id: { type: 'string' },
    dry_run: { type: 'boolean' },
    confirm: { type: 'boolean' }
  },
  required: ['symbol', 'base_amount']
};
