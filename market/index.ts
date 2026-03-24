import { publicGet } from '../core/client';
import type { SkillResult } from '../core/types';

function ok(data: any, market?: 'spot' | 'futures'): SkillResult {
  return {
    success: true,
    mode: 'readonly',
    data,
    error: null,
    meta: {
      exchange: 'coinw',
      market,
      timestamp: Date.now()
    }
  };
}

function fail(message: string, market?: 'spot' | 'futures'): SkillResult {
  return {
    success: false,
    mode: 'readonly',
    data: null,
    error: {
      code: 'MARKET_ERROR',
      message
    },
    meta: {
      exchange: 'coinw',
      market,
      timestamp: Date.now()
    }
  };
}

export async function get_spot_symbols() {
  try {
    const raw = await publicGet('/api/v1/public?command=returnSymbol');
    return ok({ market: 'spot', raw }, 'spot');
  } catch (e: any) {
    return fail(e.message, 'spot');
  }
}

export async function get_futures_symbols() {
  try {
    const raw = await publicGet('/v1/perpum/instruments');
    return ok({ market: 'futures', raw }, 'futures');
  } catch (e: any) {
    return fail(e.message, 'futures');
  }
}

export async function get_ticker(input: { symbol?: string; market: 'spot' | 'futures' }) {
  try {
    if (input.market === 'spot') {
      const raw = await publicGet('/api/v1/public?command=returnTicker');
      return ok({ symbol: input.symbol, raw }, 'spot');
    }
    const raw = input.symbol
      ? await publicGet('/v1/perpumPublic/ticker', { instrument: input.symbol.replace('_USDT', '').replace('USDT', '') })
      : await publicGet('/v1/perpumPublic/tickers');
    return ok({ symbol: input.symbol, raw }, 'futures');
  } catch (e: any) {
    return fail(e.message, input.market);
  }
}

export async function get_all_tickers(input: { market: 'spot' | 'futures' }) {
  try {
    const raw = input.market === 'spot'
      ? await publicGet('/api/v1/public?command=returnTicker')
      : await publicGet('/v1/perpumPublic/tickers');
    return ok({ raw }, input.market);
  } catch (e: any) {
    return fail(e.message, input.market);
  }
}

const PERIOD_MAP: Record<string, number> = {
  '1m': 60,
  '3m': 180,
  '5m': 300,
  '15m': 900,
  '30m': 1800,
  '2h': 7200,
  '4h': 14400
};

const GRANULARITY_MAP: Record<string, string> = {
  '1m': '1',
  '3m': '3',
  '5m': '5',
  '15m': '15',
  '30m': '30',
  '1h': '60',
  '4h': '240',
  '1d': 'D'
};

export async function get_klines(input: {
  symbol: string;
  market: 'spot' | 'futures';
  interval: string;
  limit?: number;
}) {
  try {
    if (input.market === 'spot') {
      const raw = await publicGet('/api/v1/public?command=returnChartData', {
        currencyPair: input.symbol.includes('_') ? input.symbol : input.symbol.replace('USDT', '_USDT'),
        period: PERIOD_MAP[input.interval] ?? 300
      });
      return ok({ symbol: input.symbol, interval: input.interval, raw }, 'spot');
    }

    const raw = await publicGet('/v1/perpumPublic/klines', {
      currencyCode: input.symbol.replace('_USDT', '').replace('USDT', ''),
      granularity: GRANULARITY_MAP[input.interval] ?? '5',
      limit: input.limit ?? 100
    });
    return ok({ symbol: input.symbol, interval: input.interval, raw }, 'futures');
  } catch (e: any) {
    return fail(e.message, input.market);
  }
}

export async function get_orderbook(input: {
  symbol: string;
  market: 'spot' | 'futures';
  depth?: number;
}) {
  try {
    if (input.market === 'spot') {
      const raw = await publicGet('/api/v1/public?command=returnOrderBook', {
        symbol: input.symbol.includes('_') ? input.symbol : input.symbol.replace('USDT', '_USDT'),
        size: input.depth ?? 5
      });
      return ok({ symbol: input.symbol, raw }, 'spot');
    }

    const raw = await publicGet('/v1/perpumPublic/depth', {
      base: input.symbol.replace('_USDT', '').replace('USDT', '')
    });
    return ok({ symbol: input.symbol, raw }, 'futures');
  } catch (e: any) {
    return fail(e.message, input.market);
  }
}

export async function get_futures_instruments(input?: { name?: string }) {
  try {
    const raw = await publicGet('/v1/perpum/instruments', input?.name ? { name: input.name } : undefined);
    return ok({ raw }, 'futures');
  } catch (e: any) {
    return fail(e.message, 'futures');
  }
}
