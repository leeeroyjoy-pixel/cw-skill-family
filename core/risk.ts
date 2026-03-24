type RiskConfig = {
  dry_run_default: boolean;
  require_confirm_for_live: boolean;
  allowed_symbols: string[];
  spot_max_quote_per_order: number;
  futures_max_margin_per_order: number;
  max_leverage_by_symbol: Record<string, number>;
};

export function resolveMode(input: { dry_run?: boolean; confirm?: boolean }, config: RiskConfig) {
  const dryRun = input.dry_run ?? config.dry_run_default;
  if (dryRun) return 'dry_run' as const;
  return input.confirm ? 'live' as const : 'dry_run' as const;
}

export function checkSymbolAllowed(symbol: string, config: RiskConfig) {
  return config.allowed_symbols.includes(symbol);
}

export function checkSpotQuoteAllowed(quoteAmount: number, config: RiskConfig) {
  return quoteAmount <= config.spot_max_quote_per_order;
}

export function checkFuturesMarginAllowed(margin: number, config: RiskConfig) {
  return margin <= config.futures_max_margin_per_order;
}

export function checkLeverageAllowed(symbol: string, leverage: number, config: RiskConfig) {
  const max = config.max_leverage_by_symbol[symbol] ?? 1;
  return leverage <= max;
}

export function assertLiveAllowed(
  input: { dry_run?: boolean; confirm?: boolean },
  config: RiskConfig
) {
  const dryRun = input.dry_run ?? config.dry_run_default;
  if (!dryRun && config.require_confirm_for_live && !input.confirm) {
    throw new Error('Live execution requires confirm=true');
  }
}
