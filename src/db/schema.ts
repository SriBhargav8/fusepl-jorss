import { pgTable, text, timestamp, uuid, integer, boolean, decimal, jsonb, bigserial, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name'),
  phone: text('phone'),
  companyName: text('company_name'),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  source: text('source').default('organic'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
});

export const valuations = pgTable('valuations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  email: text('email'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),

  // Step 1: Company Profile
  companyName: text('company_name'),
  sector: text('sector').notNull(),
  stage: text('stage').notNull(),
  businessModel: text('business_model'),
  city: text('city'),
  foundingYear: integer('founding_year'),

  // Step 2: Team
  teamSize: integer('team_size'),
  founderExperience: integer('founder_experience'),
  domainExpertise: integer('domain_expertise'),
  previousExits: boolean('previous_exits').default(false),
  technicalCofounder: boolean('technical_cofounder').default(false),
  keyHires: jsonb('key_hires').default([]),

  // Step 3: Financials
  annualRevenue: decimal('annual_revenue'),
  revenueGrowthPct: decimal('revenue_growth_pct'),
  grossMarginPct: decimal('gross_margin_pct'),
  monthlyBurn: decimal('monthly_burn'),
  cashInBank: decimal('cash_in_bank'),
  cac: decimal('cac'),
  ltv: decimal('ltv'),
  lastRoundSize: decimal('last_round_size'),
  lastRoundValuation: decimal('last_round_valuation'),

  // Step 4: Market/Product
  tam: decimal('tam'),
  devStage: text('dev_stage'),
  competitionLevel: integer('competition_level'),
  competitiveAdvantages: jsonb('competitive_advantages').default([]),
  patentsCount: integer('patents_count').default(0),

  // Step 5: Strategic Factors
  strategicPartnerships: text('strategic_partnerships').default('none'),
  regulatoryRisk: integer('regulatory_risk').default(3),
  revenueConcentrationPct: decimal('revenue_concentration_pct'),
  internationalRevenuePct: decimal('international_revenue_pct').default('0'),

  // Step 6: ESOP & Cap Table
  esopPoolPct: decimal('esop_pool_pct'),
  timeToLiquidityYears: integer('time_to_liquidity_years').default(4),
  currentCapTable: jsonb('current_cap_table'),
  targetRaise: decimal('target_raise'),
  expectedDilutionPct: decimal('expected_dilution_pct'),

  // Computed results
  valuationLow: decimal('valuation_low'),
  valuationMid: decimal('valuation_mid'),
  valuationHigh: decimal('valuation_high'),
  confidenceScore: integer('confidence_score'),
  methodResults: jsonb('method_results'),
  monteCarloPercentiles: jsonb('monte_carlo_percentiles'),
  damodaranInputs: jsonb('damodaran_inputs'),
  ibcRecoveryRange: jsonb('ibc_recovery_range'),
  esopValuation: jsonb('esop_valuation'),
  investorMatches: jsonb('investor_matches'),
  aiNarrative: text('ai_narrative'),
  
  purpose: text('purpose'), // Added from migration observations
  paidPurpose: text('paid_purpose'), // Added from migration observations

  version: integer('version').default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
}, (table) => {
  return [
    index('idx_valuations_sector').on(table.sector),
    index('idx_valuations_stage').on(table.stage),
    index('idx_valuations_created').on(table.createdAt),
    index('idx_valuations_city').on(table.city),
  ];
});

export const certifiedRequests = pgTable('certified_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  valuationId: uuid('valuation_id').references(() => valuations.id),
  userId: uuid('user_id').references(() => users.id),
  status: text('status').default('requested'),
  paymentId: text('payment_id').unique(),
  razorpayOrderId: text('razorpay_order_id'),
  amount: decimal('amount').default('14999'),
  reportType: text('report_type').default('rule_11ua'),
  purpose: text('purpose'),
  requestedAt: timestamp('requested_at', { withTimezone: true }).defaultNow(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  reportUrl: text('report_url'),
  adminNotes: text('admin_notes'),
}, (table) => {
  return [
    index('idx_certified_status').on(table.status),
  ];
});

export const pageEvents = pgTable('page_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sessionId: text('session_id'),
  event: text('event').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return [
    index('idx_events_session').on(table.sessionId),
    index('idx_events_event').on(table.event),
  ];
});
