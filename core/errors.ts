export function normalizeCoinwError(err: any) {
  return {
    code: err?.code || 'UNKNOWN_ERROR',
    message: err?.message || 'Unknown CoinW error',
    retryable: false
  };
}
