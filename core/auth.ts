export function getCoinwEnv() {
  const apiKey = process.env.COINW_API_KEY || '';
  const apiSecret = process.env.COINW_API_SECRET || '';
  const baseUrl = process.env.COINW_BASE_URL || 'https://api.coinw.com';

  return {
    apiKey,
    apiSecret,
    baseUrl
  };
}

export function assertPrivateAuth() {
  const { apiKey, apiSecret } = getCoinwEnv();
  if (!apiKey || !apiSecret) {
    throw new Error('Missing COINW_API_KEY or COINW_API_SECRET');
  }
}
