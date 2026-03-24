// Account skill schema mapping layer.
// The root account module currently exposes simpler method signatures.
// This file exists to make the skill-domain package structure more complete
// and to provide a stable place for future account-specific schemas.

export const getSpotBalancesSchema = {
  type: 'object',
  properties: {},
  additionalProperties: false
};

export const getFuturesAccountSchema = {
  type: 'object',
  properties: {},
  additionalProperties: false
};

export const getPositionsSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' }
  },
  additionalProperties: false
};
