import { spotPrivateRequest, futuresPrivateRequest } from '../core/client';
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
      code: 'ACCOUNT_ERROR',
      message
    },
    meta: {
      exchange: 'coinw',
      market,
      timestamp: Date.now()
    }
  };
}

export async function get_spot_balances() {
  try {
    const raw = await spotPrivateRequest('/api/v1/private?command=returnBalances', 'POST', {});
    return ok({ account_type: 'spot', raw }, 'spot');
  } catch (e: any) {
    return fail(e.message, 'spot');
  }
}

export async function get_futures_account() {
  try {
    const raw = await futuresPrivateRequest('/v1/perpum/account/getUserAssets', 'GET', {});
    return ok({ account_type: 'futures', raw }, 'futures');
  } catch (e: any) {
    return fail(e.message, 'futures');
  }
}

export async function get_positions(input?: { symbol?: string }) {
  try {
    const raw = await futuresPrivateRequest('/v1/perpum/positions/all', 'GET', {});
    return ok({ symbol: input?.symbol, raw }, 'futures');
  } catch (e: any) {
    return fail(e.message, 'futures');
  }
}
