export const getTickerSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    market: { type: 'string', enum: ['spot', 'futures'] }
  },
  required: ['symbol', 'market']
};

export const getKlinesSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    market: { type: 'string', enum: ['spot', 'futures'] },
    interval: { type: 'string' },
    limit: { type: 'number' }
  },
  required: ['symbol', 'market', 'interval']
};
