import { getCoinwEnv, assertPrivateAuth } from './auth';
import { buildTimestamp, signSpotParams, signFuturesRequest } from './signer';

async function httpJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();

  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new Error(JSON.stringify(json));
  }

  return json;
}

function encodeQuery(query?: Record<string, any>) {
  return query
    ? new URLSearchParams(
        Object.entries(query).reduce<Record<string, string>>((acc, [k, v]) => {
          if (v !== undefined && v !== null) acc[k] = String(v);
          return acc;
        }, {})
      ).toString()
    : '';
}

export async function publicGet(path: string, query?: Record<string, any>) {
  const { baseUrl } = getCoinwEnv();
  const qs = encodeQuery(query);
  return httpJson(`${baseUrl}${path}${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function spotPrivateRequest(apiPath: string, method: 'GET' | 'POST', params?: Record<string, any>) {
  assertPrivateAuth();
  const { baseUrl, apiKey, apiSecret } = getCoinwEnv();
  const merged = { ...(params || {}), api_key: apiKey };
  const sign = signSpotParams(merged, apiSecret);
  const qs = encodeQuery({ sign, ...merged });
  const url = `${baseUrl}${apiPath}${apiPath.includes('?') ? '&' : '?'}${qs}`;

  if (method === 'POST') {
    return httpJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
  }

  return httpJson(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function futuresPrivateRequest(
  apiPath: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  payload?: Record<string, any>
) {
  assertPrivateAuth();
  const { baseUrl, apiKey, apiSecret } = getCoinwEnv();
  const timestamp = buildTimestamp();
  const body = payload || {};
  const query = method === 'GET' ? body : undefined;

  const sign = signFuturesRequest({
    timestamp,
    method,
    apiPath,
    query,
    body,
    secret: apiSecret
  });

  const headers: Record<string, string> = {
    sign,
    api_key: apiKey,
    timestamp
  };

  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const qs = method === 'GET' ? encodeQuery(query) : '';
  const url = `${baseUrl}${apiPath}${qs ? `?${qs}` : ''}`;

  return httpJson(url, {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(body)
  });
}
