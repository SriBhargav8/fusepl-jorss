'use server'

import { db } from '@/db'
import { valuations, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getValuationById(id: string) {
  if (!id || id === 'local') return null

  try {
    const result = await db.select({
      id: valuations.id,
      companyName: valuations.companyName,
      sector: valuations.sector,
      stage: valuations.stage,
      businessModel: valuations.businessModel,
      city: valuations.city,
      foundingYear: valuations.foundingYear,
      teamSize: valuations.teamSize,
      founderExperience: valuations.founderExperience,
      domainExpertise: valuations.domainExpertise,
      previousExits: valuations.previousExits,
      devStage: valuations.devStage,
      competitiveAdvantages: valuations.competitiveAdvantages,
      competitionLevel: valuations.competitionLevel,
      annualRevenue: valuations.annualRevenue,
      revenueGrowthPct: valuations.revenueGrowthPct,
      grossMarginPct: valuations.grossMarginPct,
      monthlyBurn: valuations.monthlyBurn,
      cashInBank: valuations.cashInBank,
      tam: valuations.tam,
      esopPoolPct: valuations.esopPoolPct,
      timeToLiquidityYears: valuations.timeToLiquidityYears,
      currentCapTable: valuations.currentCapTable,
      targetRaise: valuations.targetRaise,
      valuationLow: valuations.valuationLow,
      valuationMid: valuations.valuationMid,
      valuationHigh: valuations.valuationHigh,
      confidenceScore: valuations.confidenceScore,
      methodResults: valuations.methodResults,
      monteCarloPercentiles: valuations.monteCarloPercentiles,
      ibcRecoveryRange: valuations.ibcRecoveryRange,
      aiNarrative: valuations.aiNarrative,
      purpose: valuations.purpose,
      paidPurpose: valuations.paidPurpose,
      createdAt: valuations.createdAt,
    })
    .from(valuations)
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
    // 1. Upsert user
    const userResult = await db.insert(users)
      .values({ 
        email: data.email,
        name: data.name,
        phone: data.phone
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { 
          name: data.name,
          phone: data.phone
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
