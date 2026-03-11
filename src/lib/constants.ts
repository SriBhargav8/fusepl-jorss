// Market constants — see spec: "Market Constants" table
export const MARKET_CONSTANTS = {
  RISK_FREE_RATE: 0.07,            // 7.0% — 10yr India govt bond
  EQUITY_RISK_PREMIUM: 0.075,      // 7.5% — Damodaran
  GDP_GROWTH_CAP: 0.055,           // 5.5% — terminal growth rate
  MARKET_VOLATILITY: 0.22,         // 22% — Nifty 50 5yr historical
  TAX_RATE: 0.25,                  // 25% — Indian corporate tax
  OPERATING_MARGIN_PROXY: 0.75,    // FCF = revenue × margin × 0.75
  GROWTH_DECAY_FACTOR: 0.85,       // growth decays at 0.85/year
  MC_ITERATIONS_DESKTOP: 10_000,
  MC_ITERATIONS_MOBILE: 2_000,
  MC_MIN_VALID_ITERATIONS: 1_000,
  MC_GROWTH_STD_FACTOR: 0.3,      // std = growth × 0.3
  MC_WACC_STD: 0.02,
  VOLATILITY_CLAMP_MIN: 0.40,
  VOLATILITY_CLAMP_MAX: 0.80,
  STARTUP_VOLATILITY_PREMIUM: 1.5,
} as const

// Illiquidity discount by stage
export const ILLIQUIDITY_DISCOUNT: Record<string, number> = {
  idea: 0.35,
  pre_seed: 0.35,
  seed: 0.35,
  pre_series_a: 0.35,
  series_a: 0.30,
  series_b: 0.25,
  series_c_plus: 0.20,
}

// Default ESOP pool by stage
export const DEFAULT_ESOP_PCT: Record<string, number> = {
  idea: 10,
  pre_seed: 10,
  seed: 12,
  pre_series_a: 10,
  series_a: 15,
  series_b: 10,
  series_c_plus: 10,
}
