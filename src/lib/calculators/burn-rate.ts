import type { DerivedFields, Stage, StartupCategory } from '@/types'
import { MARKET_CONSTANTS, DEFAULT_ESOP_PCT } from '@/lib/constants'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { clamp } from '@/lib/utils'

/** Calculate runway in months */
export function calculateRunway(cash_in_bank: number, monthly_burn: number): number {
  if (monthly_burn <= 0) return Infinity
  return cash_in_bank / monthly_burn
}

/** Compute all derived fields from wizard inputs */
export function computeDerivedFields(inputs: {
  monthly_burn: number
  cash_in_bank: number
  cac: number | null
  ltv: number | null
  patents_count: number
  stage: Stage
  sector: StartupCategory
}): DerivedFields {
  const runway_months = calculateRunway(inputs.cash_in_bank, inputs.monthly_burn)

  const ltv_cac_ratio = (inputs.cac && inputs.cac > 0 && inputs.ltv)
    ? inputs.ltv / inputs.cac
    : null

  const has_patents = inputs.patents_count > 0

  const default_esop_pct = DEFAULT_ESOP_PCT[inputs.stage] ?? 10

  const benchmark = getDamodaranBenchmark(inputs.sector)
  const rawVolatility = benchmark.beta * MARKET_CONSTANTS.MARKET_VOLATILITY * MARKET_CONSTANTS.STARTUP_VOLATILITY_PREMIUM
  const startup_volatility = clamp(
    rawVolatility,
    MARKET_CONSTANTS.VOLATILITY_CLAMP_MIN,
    MARKET_CONSTANTS.VOLATILITY_CLAMP_MAX
  )

  return {
    runway_months,
    ltv_cac_ratio,
    has_patents,
    default_esop_pct,
    startup_volatility,
  }
}
