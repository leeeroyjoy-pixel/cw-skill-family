import crypto from 'node:crypto';

export function buildTimestamp() {
  return Date.now().toString();
}

/**
 * Spot private REST signing (from CoinW docs):
 * 1. append api_key into params
 * 2. sort params by key asc
 * 3. join as key=value&...
 * 4. append secret_key=YOUR_SECRET
 * 5. md5 uppercase
 */
export function signSpotParams(params: Record<string, any>, secret: string): string {
  const sortedEntries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b));

  const joined = sortedEntries.map(([k, v]) => `${k}=${String(v)}`).join('&');
  const signPayload = `${joined}&secret_key=${secret}`;
  return crypto.createHash('md5').update(signPayload, 'utf8').digest('hex').toUpperCase();
}

/**
 * Futures private REST signing (from CoinW docs):
 * GET:  timestamp + METHOD + apiPath(+ ?queryString)
 * Other: timestamp + METHOD + apiPath + JSON.stringify(body)
 * Then HMAC-SHA256 + Base64
 */
export function signFuturesRequest(input: {
  timestamp: string;
  method: string;
  apiPath: string;
  query?: Record<string, any>;
  body?: Record<string, any>;
  secret: string;
}): string {
  const method = input.method.toUpperCase();
  const queryString = input.query
    ? Object.entries(input.query)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';

  const payload = method === 'GET'
    ? `${input.timestamp}${method}${input.apiPath}${queryString ? `?${queryString}` : ''}`
    : `${input.timestamp}${method}${input.apiPath}${JSON.stringify(input.body || {})}`;

  return crypto
    .createHmac('sha256', input.secret)
    .update(payload, 'utf8')
    .digest('base64');
}
