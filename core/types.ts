export type MarketType = 'spot' | 'futures';

export type SkillResult<T = any> = {
  success: boolean;
  mode?: 'readonly' | 'dry_run' | 'live';
  data: T | null;
  error: null | {
    code: string;
    message: string;
    retryable?: boolean;
  };
  meta: {
    exchange: 'coinw';
    market?: MarketType;
    timestamp: number;
  };
};

export type RiskCheckResult = {
  symbol_allowed?: boolean;
  size_allowed?: boolean;
  leverage_allowed?: boolean;
  confirm_allowed?: boolean;
};

export type ExecutionBaseInput = {
  dry_run?: boolean;
  confirm?: boolean;
  client_order_id?: string;
};

export type TickerInput = {
  symbol: string;
  market: MarketType;
};

export type KlinesInput = {
  symbol: string;
  market: MarketType;
  interval: string;
  limit?: number;
};

export type OrderbookInput = {
  symbol: string;
  market: MarketType;
  depth?: number;
};
