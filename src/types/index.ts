// ============================================================
// Enumerations
// ============================================================

export const STARTUP_CATEGORIES = [
  'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking', 'fintech_lending',
  'fintech_wealthtech', 'd2c', 'edtech', 'healthtech_products', 'healthtech_services',
  'ecommerce_general', 'ecommerce_grocery', 'ecommerce_fashion', 'marketplace',
  'agritech', 'logistics', 'cleantech', 'deeptech', 'ai_ml', 'gaming',
  'real_estate_tech', 'auto_mobility', 'manufacturing', 'media_advertising',
  'telecom', 'travel_hospitality', 'social_impact', 'b2b_services', 'legaltech',
  'hrtech', 'foodtech', 'spacetech', 'biotech', 'cybersecurity', 'web3_blockchain',
  'drone_tech', 'retail_tech', 'sportstech', 'pet_care', 'other',
] as const

export type StartupCategory = typeof STARTUP_CATEGORIES[number]

export const CATEGORY_LABELS: Record<StartupCategory, string> = {
  saas: 'SaaS / Cloud Software',
  fintech_payments: 'Fintech — Payments & UPI',
  fintech_insurance: 'Fintech — InsurTech',
  fintech_banking: 'Fintech — NeoBank / Banking',
  fintech_lending: 'Fintech — Lending & BNPL',
  fintech_wealthtech: 'Fintech — WealthTech / Investments',
  d2c: 'D2C / Consumer Brand',
  edtech: 'EdTech / Online Learning',
  healthtech_products: 'HealthTech — MedDevices & Diagnostics',
  healthtech_services: 'HealthTech — Telemedicine & Wellness',
  ecommerce_general: 'E-Commerce — General',
  ecommerce_grocery: 'E-Commerce — Grocery & Quick Commerce',
  ecommerce_fashion: 'E-Commerce — Fashion & Lifestyle',
  marketplace: 'Marketplace / Aggregator',
  agritech: 'AgriTech / FarmTech',
  logistics: 'Logistics & Supply Chain',
  cleantech: 'CleanTech / EV / Green Energy',
  deeptech: 'DeepTech / Robotics',
  ai_ml: 'AI / Machine Learning / GenAI',
  gaming: 'Gaming & Entertainment',
  real_estate_tech: 'PropTech / Real Estate',
  auto_mobility: 'Auto & Mobility',
  manufacturing: 'Manufacturing / Industrial IoT',
  media_advertising: 'Media, AdTech & Content',
  telecom: 'Telecom & Connectivity',
  travel_hospitality: 'Travel & Hospitality',
  social_impact: 'Social Impact / NGO Tech',
  b2b_services: 'B2B Services & Enterprise',
  legaltech: 'LegalTech / RegTech',
  hrtech: 'HRTech / Workforce',
  foodtech: 'FoodTech / Cloud Kitchen',
  spacetech: 'SpaceTech / Aerospace',
  biotech: 'BioTech / Life Sciences',
  cybersecurity: 'Cybersecurity',
  web3_blockchain: 'Web3 / Blockchain / Crypto',
  drone_tech: 'Drone Tech / UAV',
  retail_tech: 'Retail Tech / POS',
  sportstech: 'SportsTech / Fitness',
  pet_care: 'Pet Care & Animal Health',
  other: 'Other',
}

export const STAGES = [
  'idea', 'pre_seed', 'seed', 'pre_series_a',
  'series_a', 'series_b', 'series_c_plus',
] as const

export type Stage = typeof STAGES[number]

export const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idea Stage',
  pre_seed: 'Pre-Seed',
  seed: 'Seed',
  pre_series_a: 'Pre-Series A',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c_plus: 'Series C+',
}

export const BUSINESS_MODELS = [
  'saas_subscription', 'marketplace_commission', 'ecommerce_product',
  'advertising', 'freemium', 'transaction_based', 'licensing',
  'services', 'hardware_software', 'affiliate', 'data_monetization',
  'api_as_service', 'managed_service', 'franchise', 'rental_leasing',
  'hybrid', 'other',
] as const

export type BusinessModel = typeof BUSINESS_MODELS[number]

export const BUSINESS_MODEL_LABELS: Record<BusinessModel, string> = {
  saas_subscription: 'SaaS / Subscription',
  marketplace_commission: 'Marketplace / Commission',
  ecommerce_product: 'E-Commerce / Product Sales',
  advertising: 'Advertising / AdTech',
  freemium: 'Freemium (Free + Premium)',
  transaction_based: 'Transaction Fee / Per-Use',
  licensing: 'Licensing / White-Label',
  services: 'Professional Services',
  hardware_software: 'Hardware + Software Bundle',
  affiliate: 'Affiliate / Referral',
  data_monetization: 'Data Monetization / Analytics',
  api_as_service: 'API-as-a-Service',
  managed_service: 'Managed Service / BPO',
  franchise: 'Franchise Model',
  rental_leasing: 'Rental / Leasing',
  hybrid: 'Hybrid (Multiple Revenue Streams)',
  other: 'Other',
}

export const DEV_STAGES = [
  'idea', 'prototype', 'mvp', 'beta', 'production', 'scaling',
] as const

export type DevStage = typeof DEV_STAGES[number]

export const DEV_STAGE_LABELS: Record<DevStage, string> = {
  idea: 'Idea',
  prototype: 'Prototype',
  mvp: 'MVP',
  beta: 'Beta',
  production: 'Production',
  scaling: 'Scaling',
}

export const COMPETITIVE_ADVANTAGES = [
  'network_effects', 'proprietary_tech', 'brand', 'cost_advantage',
  'switching_costs', 'regulatory', 'data_moat', 'first_mover',
  'exclusive_partnerships', 'patents_ip', 'distribution', 'community',
  'vertical_integration', 'none',
] as const

export type CompetitiveAdvantage = typeof COMPETITIVE_ADVANTAGES[number]

export const COMPETITIVE_ADVANTAGE_LABELS: Record<CompetitiveAdvantage, string> = {
  network_effects: 'Network Effects',
  proprietary_tech: 'Proprietary Technology / Trade Secrets',
  brand: 'Strong Brand Recognition',
  cost_advantage: 'Cost / Unit Economics Advantage',
  switching_costs: 'High Switching Costs / Lock-in',
  regulatory: 'Regulatory Moat / Licenses',
  data_moat: 'Data Moat / Unique Dataset',
  first_mover: 'First Mover Advantage',
  exclusive_partnerships: 'Exclusive Partnerships / Contracts',
  patents_ip: 'Patents / Registered IP',
  distribution: 'Superior Distribution / Channel',
  community: 'Strong Community / User Base',
  vertical_integration: 'Vertical Integration',
  none: 'None Yet',
}

export const PARTNERSHIP_LEVELS = ['none', 'one', 'multiple'] as const
export type PartnershipLevel = typeof PARTNERSHIP_LEVELS[number]

export const PARTNERSHIP_LABELS: Record<PartnershipLevel, string> = {
  none: 'None',
  one: 'One Key Partner',
  multiple: 'Multiple Partners',
}

export const VALUATION_PURPOSES = [
  'indicative', 'fundraising', 'esop', 'rule_11ua', 'fema', 'ma',
] as const
export type ValuationPurpose = typeof VALUATION_PURPOSES[number]

export const PURPOSE_LABELS: Record<ValuationPurpose, string> = {
  indicative: 'Indicative Valuation',
  fundraising: 'Fundraising',
  esop: 'ESOP Valuation',
  rule_11ua: 'Tax / Rule 11UA',
  fema: 'FEMA Pricing',
  ma: 'M&A Advisory',
}

export const PURPOSE_PRICES: Record<ValuationPurpose, number> = {
  indicative: 0,
  fundraising: 499900,
  esop: 499900,
  rule_11ua: 999900,
  fema: 1499900,
  ma: 1499900,
}

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
  warnings?: CrossMethodWarning[]
}

export interface CrossMethodWarning {
  method: string
  message: string
  severity: 'info' | 'warning'
}

export interface SensitivityResult {
  variable: string
  baseValue: number
  steps: { label: string; value: number; valuation: number }[]
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
  shareholders: CapTableEntry[]
  post_money: number
  new_investor_pct: number
  founder_pct_after: number
}

// ============================================================
// Investor Matching
// ============================================================

export interface Investor {
  name: string
  type: 'vc' | 'pe' | 'angel' | 'angel_network' | 'family_office' | 'cvc' | 'government'
  sectors: StartupCategory[]
  stages: Stage[]
  check_size_min_cr: number
  check_size_max_cr: number
  city: string
  portfolio_highlights: string[]
  last_active_year: number
  website: string
  sweet_spot_cr?: number | null
  deals_per_year?: number | null
  follow_on_rate?: number | null
  board_seat?: boolean
  lead_investor?: boolean
  co_invest_with?: string[]
  geographic_focus?: string[]
  thesis_summary?: string | null
  contact_method?: 'website' | 'linkedin' | 'referral_only'
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
  sector: StartupCategory
  stage_at_round: Stage
  last_round_size_cr: number
  valuation_cr: number
  revenue_cr: number | null
  year: number
  city: string
  business_model: BusinessModel
  source: string
  revenue_multiple?: number | null
  ebitda_cr?: number | null
  ebitda_multiple?: number | null
  arr_cr?: number | null
  employees?: number | null
  founded_year?: number | null
  deal_type?: 'primary' | 'secondary' | 'ipo' | 'acquisition'
  currency_original?: 'INR' | 'USD'
  notes?: string | null
}

export interface ListedComparable {
  name: string
  ticker: string
  sector: StartupCategory
  market_cap_cr: number
  revenue_cr: number
  ebitda_cr: number
  pe_ratio: number | null
  ev_revenue: number
  ev_ebitda: number | null
  as_of_date: string
  source: 'BSE' | 'NSE' | 'screener.in'
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
  report_type: ValuationPurpose
  purpose: string
}

// ============================================================
// Deal Check (Investor Module)
// ============================================================

export type DealVerdict = 'green' | 'yellow' | 'red' | 'blue'

export interface DealCheckInput {
  sector: StartupCategory
  stage: Stage
  revenue_cr: number
  growth_pct: number
  raise_cr: number
  ask_cr: number
}

export interface DealCheckResult {
  verdict: DealVerdict
  label: string
  explanation: string
  fairValue: number
  impliedMultiple: number
  sectorMedianMultiple: number
  dilutionPct: number
  comparables: ComparableCompany[]
  negotiationInsight: string
}
