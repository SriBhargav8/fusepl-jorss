'use server'

import { db } from '@/db'
import { valuations, users } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { normalizePhone } from '@/lib/utils'

export async function getValuationById(id: string) {
  if (!id || id === 'local') return null

  try {
    const result = await db.select({
      id: valuations.id,
      company_name: valuations.companyName,
      sector: valuations.sector,
      stage: valuations.stage,
      business_model: valuations.businessModel,
      city: valuations.city,
      founding_year: valuations.foundingYear,
      team_size: valuations.teamSize,
      founder_experience: valuations.founderExperience,
      domain_expertise: valuations.domainExpertise,
      previous_exits: valuations.previousExits,
      dev_stage: valuations.devStage,
      competitive_advantages: valuations.competitiveAdvantages,
      competition_level: valuations.competitionLevel,
      annual_revenue: valuations.annualRevenue,
      revenue_growth_pct: valuations.revenueGrowthPct,
      gross_margin_pct: valuations.grossMarginPct,
      monthly_burn: valuations.monthlyBurn,
      cash_in_bank: valuations.cashInBank,
      tam: valuations.tam,
      esop_pool_pct: valuations.esopPoolPct,
      time_to_liquidity_years: valuations.timeToLiquidityYears,
      current_cap_table: valuations.currentCapTable,
      target_raise: valuations.targetRaise,
      valuation_low: valuations.valuationLow,
      valuation_mid: valuations.valuationMid,
      valuation_high: valuations.valuationHigh,
      confidence_score: valuations.confidenceScore,
      method_results: valuations.methodResults,
      monte_carlo_percentiles: valuations.monteCarloPercentiles,
      ibc_recovery_range: valuations.ibcRecoveryRange,
      ai_narrative: valuations.aiNarrative,
      purpose: valuations.purpose,
      paid_purpose: valuations.paidPurpose,
      created_at: valuations.createdAt,
      userName: users.name,
      userPhone: users.phone,
      userEmail: users.email,
    })
    .from(valuations)
    .leftJoin(users, eq(valuations.userId, users.id))
    .where(eq(valuations.id, id))
    .limit(1)
    
    return result[0] ?? null
  } catch (error) {
    console.error('[Action] getValuationById failed:', error)
    return null
  }
}

export async function saveValuation(data: any) {
  try {
    const normalizedPhone = normalizePhone(data.phone)

    // 1. Upsert user
    const userResult = await db.insert(users)
      .values({ 
        email: data.email,
        name: data.name,
        phone: normalizedPhone
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { 
          name: data.name,
          phone: normalizedPhone
        }
      })
      .returning({ id: users.id })
    
    const userId = userResult[0].id

    // 2. Insert valuation
    const valuationResult = await db.insert(valuations)
      .values({
        userId,
        email: data.email,
        ipAddress: data.ip_address,
        companyName: data.company_name,
        sector: data.sector,
        stage: data.stage,
        annualRevenue: data.annual_revenue,
        revenueGrowthPct: data.revenue_growth_pct,
        grossMarginPct: data.gross_margin_pct,
        monthlyBurn: data.monthly_burn,
        cashInBank: data.cash_in_bank,
        tam: data.tam,
        teamSize: data.team_size,
        founderExperience: data.founder_experience,
        domainExpertise: data.domain_expertise,
        previousExits: data.previous_exits,
        devStage: data.dev_stage,
        competitiveAdvantages: data.competitive_advantages,
        competitionLevel: data.competition_level,
        esopPoolPct: data.esop_pool_pct,
        timeToLiquidityYears: data.time_to_liquidity_years,
        targetRaise: data.target_raise,
        currentCapTable: data.current_cap_table,
        valuationLow: data.valuation_low,
        valuationMid: data.valuation_mid,
        valuationHigh: data.valuation_high,
        confidenceScore: data.confidence_score,
        methodResults: data.method_results,
        monteCarloPercentiles: data.monte_carlo_percentiles,
        ibcRecoveryRange: data.ibc_recovery_range,
        purpose: data.purpose || 'indicative',
      })
      .returning({ id: valuations.id })

    const reportId = valuationResult[0].id
    revalidatePath(`/report/${reportId}`)
    return { reportId }
  } catch (error) {
    console.error('[Action] saveValuation failed:', error)
    throw new Error('Failed to save valuation')
  }
}
export async function getValuationHistory(email: string, phone: string) {
  try {
    const normalizedPhone = normalizePhone(phone)
    const matchedUser = await db.select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.phone, normalizedPhone)))
      .limit(1)

    if (!matchedUser.length) {
      return { success: false, error: 'No matching records found. Please check your details.' }
    }

    const records = await db.select({
      id: valuations.id,
      companyName: valuations.companyName,
      createdAt: valuations.createdAt,
      valuationMid: valuations.valuationMid,
      sector: valuations.sector,
      stage: valuations.stage,
    })
    .from(valuations)
    .where(eq(valuations.userId, matchedUser[0].id))
    .orderBy(desc(valuations.createdAt))

    return { success: true, records }
  } catch (error) {
    console.error('[Action] getValuationHistory failed:', error)
    return { success: false, error: 'Failed to retrieve history.' }
  }
}
