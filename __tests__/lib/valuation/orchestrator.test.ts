import { describe, it, expect } from 'vitest'
import { calculateValuation } from '@/lib/valuation'
import type { WizardInputs } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas_horizontal', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 50_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: 1000, ltv: 5000,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['proprietary_tech'], patents_count: 1,
    strategic_partnerships: 'one', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 10,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

describe('calculateValuation (orchestrator)', () => {
  it('runs all 10 methods for revenue companies', () => {
    const result = calculateValuation(makeInputs())
    expect(result.methods).toHaveLength(10)
    const applicable = result.methods.filter(m => m.applicable)
    expect(applicable.length).toBeGreaterThanOrEqual(8)
  })

  it('covers all 4 approach categories', () => {
    const result = calculateValuation(makeInputs())
    const approaches = new Set(result.methods.map(m => m.approach))
    expect(approaches).toContain('income')
    expect(approaches).toContain('market')
    expect(approaches).toContain('asset_cost')
    expect(approaches).toContain('vc_startup')
  })

  it('marks revenue-dependent methods as not applicable for pre-revenue', () => {
    const result = calculateValuation(makeInputs({ annual_revenue: 0, gross_margin_pct: 0 }))
    const revenueMultiple = result.methods.find(m => m.method === 'revenue_multiple')
    const ebitdaMultiple = result.methods.find(m => m.method === 'ebitda_multiple')
    expect(revenueMultiple?.applicable).toBe(false)
    expect(ebitdaMultiple?.applicable).toBe(false)
  })

  it('computes weighted composite from applicable methods', () => {
    const result = calculateValuation(makeInputs())
    expect(result.composite_value).toBeGreaterThan(0)
    const values = result.methods.filter(m => m.applicable).map(m => m.value)
    expect(result.composite_value).toBeGreaterThanOrEqual(Math.min(...values) * 0.5)
    expect(result.composite_value).toBeLessThanOrEqual(Math.max(...values) * 1.5)
  })

  it('excludes methods with confidence < 0.3 from composite', () => {
    const result = calculateValuation(makeInputs())
    const included = result.methods.filter(m => m.applicable && m.confidence >= 0.3)
    expect(included.length).toBeGreaterThanOrEqual(3)
  })

  it('computes confidence score 0-100', () => {
    const result = calculateValuation(makeInputs())
    expect(result.confidence_score).toBeGreaterThanOrEqual(0)
    expect(result.confidence_score).toBeLessThanOrEqual(100)
  })

  it('includes IBC recovery range', () => {
    const result = calculateValuation(makeInputs())
    expect(result.ibc_recovery_range).toBeDefined()
    expect(result.ibc_recovery_range!.low).toBeLessThan(result.ibc_recovery_range!.high)
  })

  it('runs Monte Carlo simulation with valid percentiles', () => {
    const result = calculateValuation(makeInputs())
    expect(result.monte_carlo).not.toBeNull()
    expect(result.monte_carlo!.p10).toBeGreaterThan(0)
    expect(result.monte_carlo!.p50).toBeGreaterThan(0)
    expect(result.monte_carlo!.p90).toBeGreaterThan(0)
    expect(result.monte_carlo!.p10).toBeLessThan(result.monte_carlo!.p50)
    expect(result.monte_carlo!.p50).toBeLessThan(result.monte_carlo!.p90)
    expect(result.monte_carlo!.iterations_total).toBe(10000)
    expect(result.monte_carlo!.iterations_valid).toBeGreaterThan(1000)
  })

  it('uses MC P10/P90 for composite range instead of placeholders', () => {
    const result = calculateValuation(makeInputs())
    expect(result.composite_low).toBe(result.monte_carlo!.p10)
    expect(result.composite_high).toBe(result.monte_carlo!.p90)
  })

  it('runs Monte Carlo for pre-revenue startups', () => {
    const result = calculateValuation(makeInputs({ annual_revenue: 0, gross_margin_pct: 0 }))
    expect(result.monte_carlo).not.toBeNull()
    expect(result.monte_carlo!.p50).toBeGreaterThan(0)
  })

  it('produces different results for different sectors', () => {
    const saas = calculateValuation(makeInputs({ sector: 'saas_horizontal' }))
    const agritech = calculateValuation(makeInputs({ sector: 'agritech_precision' }))
    expect(saas.composite_value).not.toBe(agritech.composite_value)
  })

  it('produces different results for different stages', () => {
    const seed = calculateValuation(makeInputs({ stage: 'seed' }))
    const seriesA = calculateValuation(makeInputs({ stage: 'series_a' }))
    expect(seed.composite_value).not.toBe(seriesA.composite_value)
  })
})
