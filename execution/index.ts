import { spotPrivateRequest, futuresPrivateRequest } from '../core/client';
import {
  resolveMode,
  checkSymbolAllowed,
  checkSpotQuoteAllowed,
  checkFuturesMarginAllowed,
  checkLeverageAllowed,
  assertLiveAllowed
} from '../core/risk';
import type { SkillResult } from '../core/types';

const config = {
  dry_run_default: true,
  require_confirm_for_live: true,
  allowed_symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
  spot_max_quote_per_order: 200,
  futures_max_margin_per_order: 100,
  max_leverage_by_symbol: {
    BTCUSDT: 5,
    ETHUSDT: 4,
    SOLUSDT: 3
  }
};

function toSpotPair(symbol: string) {
  return symbol.includes('_') ? symbol : symbol.replace('USDT', '_USDT');
}

function toFuturesBase(symbol: string) {
  return symbol.replace('_USDT', '').replace('USDT', '').toLowerCase();
}

function success(data: any, mode: 'dry_run' | 'live', market: 'spot' | 'futures', risk_checks?: any): SkillResult {
  return {
    success: true,
    mode,
    data: {
      ...data,
      risk_checks
    },
    error: null,
    meta: {
      exchange: 'coinw',
      market,
      timestamp: Date.now()
    }
  };
}

function failure(message: string, mode: 'dry_run' | 'live', market: 'spot' | 'futures'): SkillResult {
  return {
    success: false,
    mode,
    data: null,
    error: {
      code: 'EXECUTION_ERROR',
      message
    },
    meta: {
      exchange: 'coinw',
      market,
      timestamp: Date.now()
    }
  };
}

export async function spot_buy_by_quote(input: {
  symbol: string;
  quote_amount: number;
  price?: number;
  order_type?: 'market' | 'limit';
  client_order_id?: string;
  dry_run?: boolean;
  confirm?: boolean;
}) {
  const mode = resolveMode(input, config);
  const risk_checks = {
    symbol_allowed: checkSymbolAllowed(input.symbol, config),
    size_allowed: checkSpotQuoteAllowed(input.quote_amount, config),
    confirm_allowed: mode === 'dry_run' || !!input.confirm
  };

  if (!risk_checks.symbol_allowed) return failure('Symbol not allowed', mode, 'spot');
  if (!risk_checks.size_allowed) return failure('Spot order size exceeds cap', mode, 'spot');

  try {
    assertLiveAllowed(input, config);

    if (mode === 'dry_run') {
      return success({ action: 'spot_buy_by_quote', symbol: input.symbol, quote_amount: input.quote_amount, order_type: input.order_type ?? 'market' }, mode, 'spot', risk_checks);
    }

    const isMarket = (input.order_type ?? 'market') === 'market';
    const raw = await spotPrivateRequest('/api/v1/private?command=doTrade', 'POST', {
      symbol: toSpotPair(input.symbol),
      type: '0',
      ...(isMarket ? { funds: String(input.quote_amount), isMarket: 'true' } : { amount: String(input.quote_amount), rate: String(input.price ?? ''), isMarket: 'false' }),
      out_trade_no: input.client_order_id ?? `cw-buy-${Date.now()}`
    });

    return success({ action: 'spot_buy_by_quote', symbol: input.symbol, raw }, mode, 'spot', risk_checks);
  } catch (e: any) {
    return failure(e.message, mode, 'spot');
  }
}

export async function spot_sell_by_base(input: {
  symbol: string;
  base_amount: number;
  price?: number;
  order_type?: 'market' | 'limit';
  client_order_id?: string;
  dry_run?: boolean;
  confirm?: boolean;
}) {
  const mode = resolveMode(input, config);
  const risk_checks = {
    symbol_allowed: checkSymbolAllowed(input.symbol, config),
    confirm_allowed: mode === 'dry_run' || !!input.confirm
  };

  if (!risk_checks.symbol_allowed) return failure('Symbol not allowed', mode, 'spot');

  try {
    assertLiveAllowed(input, config);

    if (mode === 'dry_run') {
      return success({ action: 'spot_sell_by_base', symbol: input.symbol, base_amount: input.base_amount, order_type: input.order_type ?? 'market' }, mode, 'spot', risk_checks);
    }

    const isMarket = (input.order_type ?? 'market') === 'market';
    const raw = await spotPrivateRequest('/api/v1/private?command=doTrade', 'POST', {
      symbol: toSpotPair(input.symbol),
      type: '1',
      ...(isMarket ? { amount: String(input.base_amount), isMarket: 'true' } : { amount: String(input.base_amount), rate: String(input.price ?? ''), isMarket: 'false' }),
      out_trade_no: input.client_order_id ?? `cw-sell-${Date.now()}`
    });

    return success({ action: 'spot_sell_by_base', symbol: input.symbol, raw }, mode, 'spot', risk_checks);
  } catch (e: any) {
    return failure(e.message, mode, 'spot');
  }
}

export async function open_futures_long(input: {
  symbol: string;
  margin_usdt: number;
  leverage: number;
  positionModel?: 0 | 1;
  order_type?: 'market' | 'limit';
  price?: number;
  dry_run?: boolean;
  confirm?: boolean;
}) {
  const mode = resolveMode(input, config);
  const risk_checks = {
    symbol_allowed: checkSymbolAllowed(input.symbol, config),
    size_allowed: checkFuturesMarginAllowed(input.margin_usdt, config),
    leverage_allowed: checkLeverageAllowed(input.symbol, input.leverage, config),
    confirm_allowed: mode === 'dry_run' || !!input.confirm
  };

  if (!risk_checks.symbol_allowed) return failure('Symbol not allowed', mode, 'futures');
  if (!risk_checks.size_allowed) return failure('Futures margin exceeds cap', mode, 'futures');
  if (!risk_checks.leverage_allowed) return failure('Leverage exceeds cap', mode, 'futures');

  try {
    assertLiveAllowed(input, config);

    if (mode === 'dry_run') {
      return success({ action: 'open_futures_long', symbol: input.symbol, margin_usdt: input.margin_usdt, leverage: input.leverage, estimated_notional: input.margin_usdt * input.leverage }, mode, 'futures', risk_checks);
    }

    const raw = await futuresPrivateRequest('/v1/perpum/order', 'POST', {
      instrument: toFuturesBase(input.symbol),
      direction: 'long',
      leverage: input.leverage,
      quantityUnit: 0,
      quantity: input.margin_usdt,
      positionModel: input.positionModel ?? 1,
      positionType: input.order_type === 'limit' ? 'plan' : 'execute',
      ...(input.price ? { openPrice: input.price } : {})
    });

    return success({ action: 'open_futures_long', symbol: input.symbol, raw }, mode, 'futures', risk_checks);
  } catch (e: any) {
    return failure(e.message, mode, 'futures');
  }
}

export async function open_futures_short(input: {
  symbol: string;
  margin_usdt: number;
  leverage: number;
  positionModel?: 0 | 1;
  order_type?: 'market' | 'limit';
  price?: number;
  dry_run?: boolean;
  confirm?: boolean;
}) {
  const mode = resolveMode(input, config);
  const risk_checks = {
    symbol_allowed: checkSymbolAllowed(input.symbol, config),
    size_allowed: checkFuturesMarginAllowed(input.margin_usdt, config),
    leverage_allowed: checkLeverageAllowed(input.symbol, input.leverage, config),
    confirm_allowed: mode === 'dry_run' || !!input.confirm
  };

  if (!risk_checks.symbol_allowed) return failure('Symbol not allowed', mode, 'futures');
  if (!risk_checks.size_allowed) return failure('Futures margin exceeds cap', mode, 'futures');
  if (!risk_checks.leverage_allowed) return failure('Leverage exceeds cap', mode, 'futures');

  try {
    assertLiveAllowed(input, config);

    if (mode === 'dry_run') {
      return success({ action: 'open_futures_short', symbol: input.symbol, margin_usdt: input.margin_usdt, leverage: input.leverage, estimated_notional: input.margin_usdt * input.leverage }, mode, 'futures', risk_checks);
    }

    const raw = await futuresPrivateRequest('/v1/perpum/order', 'POST', {
      instrument: toFuturesBase(input.symbol),
      direction: 'short',
      leverage: input.leverage,
      quantityUnit: 0,
      quantity: input.margin_usdt,
      positionModel: input.positionModel ?? 1,
      positionType: input.order_type === 'limit' ? 'plan' : 'execute',
      ...(input.price ? { openPrice: input.price } : {})
    });

    return success({ action: 'open_futures_short', symbol: input.symbol, raw }, mode, 'futures', risk_checks);
  } catch (e: any) {
    return failure(e.message, mode, 'futures');
  }
}

export async function close_futures_position(input: {
  position_id: string | number;
  symbol?: string;
  close_ratio?: number;
  close_num?: number;
  order_type?: 'market' | 'limit';
  price?: number;
  dry_run?: boolean;
  confirm?: boolean;
}) {
  const mode = resolveMode(input, config);
  const symbol = input.symbol ?? 'BTCUSDT';
  const risk_checks = {
    symbol_allowed: checkSymbolAllowed(symbol, config),
    confirm_allowed: mode === 'dry_run' || !!input.confirm
  };

  if (!risk_checks.symbol_allowed) return failure('Symbol not allowed', mode, 'futures');

  try {
    assertLiveAllowed(input, config);

    if (mode === 'dry_run') {
      return success({ action: 'close_futures_position', position_id: input.position_id, close_ratio: input.close_ratio ?? 1 }, mode, 'futures', risk_checks);
    }

    const raw = await futuresPrivateRequest('/v1/perpum/positions', 'DELETE', {
      id: input.position_id,
      ...(input.close_num !== undefined ? { closeNum: input.close_num } : {}),
      ...(input.close_ratio !== undefined ? { closeRate: input.close_ratio } : {}),
      ...(input.order_type === 'limit' ? { positionType: 'plan', orderPrice: input.price } : { positionType: 'execute' })
    });

    return success({ action: 'close_futures_position', position_id: input.position_id, raw }, mode, 'futures', risk_checks);
  } catch (e: any) {
    return failure(e.message, mode, 'futures');
  }
}

export async function cancel_all_orders(input: {
  symbol?: string;
  market: 'spot' | 'futures';
  order_ids?: Array<string | number>;
  posType?: 'execute' | 'plan' | 'moveStop' | 'stopProfitLoss';
  confirm?: boolean;
  dry_run?: boolean;
}) {
  const mode = resolveMode(input, config);
  const symbol = input.symbol ?? 'BTCUSDT';
  const risk_checks = {
    symbol_allowed: checkSymbolAllowed(symbol, config),
    confirm_allowed: mode === 'dry_run' || !!input.confirm
  };

  if (!risk_checks.symbol_allowed) return failure('Symbol not allowed', mode, input.market);

  try {
    assertLiveAllowed(input, config);

    if (mode === 'dry_run') {
      return success({ action: 'cancel_all_orders', symbol, market: input.market, order_ids: input.order_ids }, mode, input.market, risk_checks);
    }

    const raw = input.market === 'spot'
      ? await spotPrivateRequest('/api/v1/private?command=cancelAllOrder', 'POST', { currencyPair: toSpotPair(symbol) })
      : await futuresPrivateRequest('/v1/perpum/batchOrders', 'DELETE', {
          ...(input.posType ? { posType: input.posType } : {}),
          sourceIds: input.order_ids ?? []
        });

    return success({ action: 'cancel_all_orders', symbol, market: input.market, raw }, mode, input.market, risk_checks);
  } catch (e: any) {
    return failure(e.message, mode, input.market);
  }
}
