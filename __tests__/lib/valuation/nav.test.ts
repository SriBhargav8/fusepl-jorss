import { describe, it, expect } from 'vitest'
import { calculateNAV } from '@/lib/valuation/nav'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas_horizontal', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 2,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return { runway_months: 12, ltv_cac_ratio: null, has_patents: true, default_esop_pct: 12, startup_volatility: 0.50, ...overrides }
}

describe('calculateNAV', () => {
  it('returns applicable for all stages', () => {
    const result = calculateNAV(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('nav')
    expect(result.approach).toBe('asset_cost')
  })

  it('includes cash_in_bank as tangible asset', () => {
    const result = calculateNAV(makeInputs({ cash_in_bank: 10_000_000 }), makeDerived())
    expect((result.details as Record<string, unknown>).tangible_assets).toBe(10_000_000)
  })

  it('values technology based on dev_stage', () => {
    const idea = calculateNAV(makeInputs({ dev_stage: 'idea' }), makeDerived())
    const scaling = calculateNAV(makeInputs({ dev_stage: 'scaling' }), makeDerived())
    expect(scaling.value).toBeGreaterThan(idea.value)
  })

  it('values patents at Rs 25L each', () => {
    const noPat = calculateNAV(makeInputs({ patents_count: 0 }), makeDerived({ has_patents: false }))
    const twoPat = calculateNAV(makeInputs({ patents_count: 2 }), makeDerived({ has_patents: true }))
    expect(twoPat.value - noPat.value).toBeCloseTo(5_000_000, -5)
  })

  it('values customer relationships at 30% of revenue', () => {
    const noRev = calculateNAV(makeInputs({ annual_revenue: 0 }), makeDerived())
    const withRev = calculateNAV(makeInputs({ annual_revenue: 10_000_000 }), makeDerived())
    expect(withRev.value - noRev.value).toBeCloseTo(3_000_000, -5)
  })

  it('applies sector-specific tech multiplier', () => {
    const saas = calculateNAV(makeInputs({ sector: 'saas_horizontal', dev_stage: 'mvp' }), makeDerived())
    const mfg = calculateNAV(makeInputs({ sector: 'manufacturing_3d', dev_stage: 'mvp' }), makeDerived())
    // Hardware sectors get 2.0x tech multiplier vs software 1.5x
    expect(mfg.value).toBeGreaterThan(saas.value)
  })

  it('sets confidence 0.5', () => {
    expect(calculateNAV(makeInputs(), makeDerived()).confidence).toBe(0.5)
  })
})
