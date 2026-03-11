// ============================================================
// Enumerations
// ============================================================

export const STARTUP_CATEGORIES = [
  'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking',
  'd2c', 'edtech', 'healthtech_products', 'healthtech_services',
  'ecommerce_general', 'ecommerce_grocery', 'marketplace', 'agritech',
  'logistics', 'cleantech', 'deeptech', 'gaming', 'real_estate_tech',
  'auto_mobility', 'manufacturing', 'media_advertising', 'telecom',
  'travel_hospitality', 'social_impact', 'b2b_services', 'other',
] as const

export type StartupCategory = typeof STARTUP_CATEGORIES[number]

export const STAGES = [
  'idea', 'pre_seed', 'seed', 'pre_series_a',
  'series_a', 'series_b', 'series_c_plus',
] as const

export type Stage = typeof STAGES[number]

export const BUSINESS_MODELS = [
  'saas_subscription', 'marketplace_commission', 'ecommerce_product',
  'advertising', 'freemium', 'transaction_based', 'licensing',
  'services', 'hardware_software', 'other',
] as const

export type BusinessModel = typeof BUSINESS_MODELS[number]

export const DEV_STAGES = [
  'idea', 'prototype', 'mvp', 'beta', 'production', 'scaling',
] as const

export type DevStage = typeof DEV_STAGES[number]

export const COMPETITIVE_ADVANTAGES = [
  'network_effects', 'proprietary_tech', 'brand', 'cost_advantage',
  'switching_costs', 'regulatory', 'data_moat', 'none',
] as const

export type CompetitiveAdvantage = typeof COMPETITIVE_ADVANTAGES[number]

export const PARTNERSHIP_LEVELS = ['none', 'one', 'multiple'] as const
export type PartnershipLevel = typeof PARTNERSHIP_LEVELS[number]

// ============================================================
// Wizard Inputs (collected from user)
// ============================================================

export interface WizardInputs {
  // Step 1: Company Profile
  company_name: string
  sector: StartupCategory
  stage: Stage
  business_model: BusinessModel
  city: string
  founding_year: number

  // Step 2: Team
  team_size: number
  founder_experience: number      // 1-5
  domain_expertise: number        // 1-5
  previous_exits: boolean
  technical_cofounder: boolean
  key_hires: string[]             // ['cto', 'cfo', 'sales_lead']

  // Step 3: Financials
  annual_revenue: number          // in Rs (0 = pre-revenue)
  revenue_growth_pct: number
  gross_margin_pct: number
  monthly_burn: number
  cash_in_bank: number
  cac: number | null              // optional
  ltv: number | null              // optional
  last_round_size: number | null  // optional
  last_round_valuation: number | null // optional

  // Step 4: Market & Product
  tam: number                     // in Rs Cr
  dev_stage: DevStage
  competition_level: number       // 1-5
  competitive_advantages: CompetitiveAdvantage[]
  patents_count: number

  // Step 5: Strategic Factors
  strategic_partnerships: PartnershipLevel
  regulatory_risk: number         // 1-5
  revenue_concentration_pct: number | null
  international_revenue_pct: number

  // Step 6: ESOP & Cap Table (optional)
  esop_pool_pct: number | null
  time_to_liquidity_years: number | null
  current_cap_table: CapTableEntry[] | null
  target_raise: number | null
  expected_dilution_pct: number | null
}

export interface CapTableEntry {
  name: string
  percentage: number
  share_class: 'common' | 'preference' | 'esop'
}

// ============================================================
// Derived Fields (computed, not collected)
// ============================================================

export interface DerivedFields {
  runway_months: number           // Infinity if profitable
  ltv_cac_ratio: number | null
  has_patents: boolean
  default_esop_pct: number
  startup_volatility: number      // clamped 0.40-0.80
}

// ============================================================
// Valuation Results
// ============================================================

export type ValuationApproach = 'income' | 'market' | 'asset_cost' | 'vc_startup'

export type ValuationMethodName =
  | 'dcf' | 'pwerm'                                           // Income
  | 'revenue_multiple' | 'ebitda_multiple' | 'comparable_txn'  // Market
  | 'nav' | 'replacement_cost'                                 // Asset/Cost
  | 'scorecard' | 'berkus' | 'risk_factor'                     // VC

export const METHOD_APPROACH: Record<ValuationMethodName, ValuationApproach> = {
  dcf: 'income', pwerm: 'income',
  revenue_multiple: 'market', ebitda_multiple: 'market', comparable_txn: 'market',
  nav: 'asset_cost', replacement_cost: 'asset_cost',
  scorecard: 'vc_startup', berkus: 'vc_startup', risk_factor: 'vc_startup',
}

export const APPROACH_ORDER: ValuationApproach[] = ['income', 'market', 'asset_cost', 'vc_startup']

export const APPROACH_LABELS: Record<ValuationApproach, string> = {
  income: 'Income Approach',
  market: 'Market Approach',
  asset_cost: 'Asset/Cost Approach',
  vc_startup: 'VC Methods',
}

export interface MethodResult {
  method: ValuationMethodName
  approach: ValuationApproach
  value: number                   // in Rs
  confidence: number              // 0.0 - 1.0
  details: Record<string, unknown> // method-specific breakdown
  applicable: boolean
}

export interface MonteCarloResult {
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
  iterations_valid: number
  iterations_total: number
}

export interface ValuationResult {
  methods: MethodResult[]
  composite_value: number         // weighted average in Rs
  composite_low: number           // P10
  composite_high: number          // P90
  confidence_score: number        // 0-100
  monte_carlo: MonteCarloResult | null
  ibc_recovery_range: { low: number; high: number; sector: string } | null
}

// ============================================================
// ESOP & Cap Table
// ============================================================

export interface ESOPResult {
  value_per_share: number
  total_pool_value: number
  return_multiple: number
  sensitivity: {
    conservative: { volatility: number; time: number; value: number }
    base: { volatility: number; time: number; value: number }
    optimistic: { volatility: number; time: number; value: number }
  }
}

export interface CapTableRound {
  raise_amount: number
  pre_money: number
  esop_expansion_pct: number
  esop_timing: 'pre_round' | 'post_round'
}

export interface CapTableResult {
  shareholders: { name: string; percentage: number; share_class: string }[]
  post_money: number
  new_investor_pct: number
  founder_pct_after: number
}

// ============================================================
// Investor Matching
// ============================================================

export interface Investor {
  name: string
  type: 'vc' | 'pe' | 'angel' | 'family_office' | 'cvc'
  sectors: string[]
  stages: string[]
  check_size_min_cr: number
  check_size_max_cr: number
  city: string
  portfolio_highlights: string[]
  last_active_year: number
  website: string
}

export interface InvestorMatch {
  investor: Investor
  score: number
  reasons: string[]
}

// ============================================================
// Comparable Companies
// ============================================================

export interface ComparableCompany {
  name: string
  sector: string
  stage_at_round: string
  last_round_size_cr: number
  valuation_cr: number
  revenue_cr: number | null
  year: number
  city: string
  business_model: string
  source: string
}

// ============================================================
// Damodaran Data
// ============================================================

export interface DamodaranBenchmark {
  ev_revenue: number
  ev_ebitda: number | null        // null for banks
  wacc: number                    // as decimal, e.g., 0.128
  beta: number
  gross_margin: number | null     // null for banks
}

export interface SectorMapping {
  label: string
  description: string
  primary_damodaran: string
  secondary_damodaran: string | null
  adjacent_sectors: string[]
}

// ============================================================
// Supabase / API
// ============================================================

export interface CaptureRequest {
  email: string
  valuation_inputs: WizardInputs
  valuation_result: ValuationResult
}

export interface CaptureResponse {
  report_id: string
  success: boolean
}

export interface CertifiedRequest {
  valuation_id: string
  report_type: 'rule_11ua' | 'fema' | 'general'
  purpose: string
}
