import { describe, it, expect } from 'vitest'
import { calculateRunway, computeDerivedFields } from '@/lib/calculators/burn-rate'

describe('calculateRunway', () => {
  it('returns months of runway', () => {
    expect(calculateRunway(1_000_000, 100_000)).toBe(10)
  })

  it('returns Infinity when burn is 0', () => {
    expect(calculateRunway(1_000_000, 0)).toBe(Infinity)
  })

  it('returns 0 when cash is 0', () => {
    expect(calculateRunway(0, 100_000)).toBe(0)
  })
})

describe('computeDerivedFields', () => {
  it('computes all derived fields', () => {
    const derived = computeDerivedFields({
      monthly_burn: 500_000,
      cash_in_bank: 6_000_000,
      cac: 1000,
      ltv: 5000,
      patents_count: 2,
      stage: 'seed',
      sector: 'saas',
    })
    expect(derived.runway_months).toBe(12)
    expect(derived.ltv_cac_ratio).toBe(5)
    expect(derived.has_patents).toBe(true)
    expect(derived.default_esop_pct).toBe(12)
    expect(derived.startup_volatility).toBeGreaterThanOrEqual(0.40)
    expect(derived.startup_volatility).toBeLessThanOrEqual(0.80)
  })
})
