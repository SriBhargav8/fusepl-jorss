import { NextRequest, NextResponse } from 'next/server'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import type { StartupCategory, ValuationPurpose, DamodaranBenchmark } from '@/types'
import { db } from '@/db'
import { valuations } from '@/db/schema'
import { eq, gte, and, notIlike, isNotNull } from 'drizzle-orm'
import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  return new Anthropic({ apiKey })
}

const PURPOSE_FRAMING: Record<ValuationPurpose, string> = {
  indicative: 'Quick directional estimate for internal decision-making.',
  fundraising: 'Valuation for fundraising discussions with VCs and angel investors. Frame from investor perspective.',
  esop: 'ESOP fair market value determination under Section 17(2) of Income Tax Act. Frame for compensation committee and board approval.',
  rule_11ua: 'Valuation under Rule 11UA for share premium justification and Section 56(2)(viib) compliance. Cite regulatory requirements.',
  fema: 'Valuation under FEMA NDI Rules for foreign investment pricing. DCF is mandatory method. Reference RBI pricing guidelines.',
  ma: 'Valuation for M&A advisory. Include fairness opinion context, IBC downside, and negotiation range analysis.',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPrompt(existing: any, purpose: ValuationPurpose, damodaranBenchmark: DamodaranBenchmark | null): string {
  const runway = Number(existing.monthlyBurn) > 0
    ? Math.round(Number(existing.cashInBank) / Number(existing.monthlyBurn))
    : 'N/A'

  const recovery = existing.ibcRecoveryRange
    ? `${(existing.ibcRecoveryRange as { low: number; high: number }).low}-${(existing.ibcRecoveryRange as { low: number; high: number }).high}%`
    : 'N/A'

  return `You are a senior Indian startup valuation professional writing a report section.

CONTEXT:
- Company: ${existing.companyName}, ${existing.sector}, ${existing.stage}
- Purpose: ${PURPOSE_FRAMING[purpose]}

DATA (do not recompute — use these exact numbers):
- Revenue: Rs ${existing.annualRevenue}, Growth: ${existing.revenueGrowthPct}%, Gross Margin: ${existing.grossMarginPct}%
- Burn: Rs ${existing.monthlyBurn}/month, Runway: ${runway} months
- Team: ${existing.founderExperience}/5 experience, ${existing.domainExpertise}/5 domain expertise, Previous exits: ${existing.previousExits}
- Product: ${existing.devStage}, Competition: ${existing.competitionLevel}/5
- TAM: Rs ${existing.tam} Cr
- Competitive advantages: ${existing.competitiveAdvantages}
- Valuation range: Rs ${existing.valuationLow}–${existing.valuationHigh}
- Composite value: Rs ${existing.valuationMid}
- Confidence score: ${existing.confidenceScore}/100
- Damodaran India multiples: ${existing.sector} trades at ${damodaranBenchmark ? `${(damodaranBenchmark.ev_revenue as number).toFixed(1)}x EV/Revenue` : 'N/A'}
- IBC context: Companies in ${existing.sector} recover ${recovery} in insolvency scenarios

${existing.methodResults ? `METHOD RESULTS: ${JSON.stringify(existing.methodResults)}` : ''}

WRITE the following sections in professional valuer tone:

1. EXECUTIVE SUMMARY (2-3 paragraphs): Company overview, valuation conclusion, key drivers.

2. METHOD RATIONALE: For each applied method, 2-3 sentences explaining why it was used and what it reveals. Reference IVS 105 methodology standards.

3. RECONCILIATION: Explain the weight assignments across methods. Why was this weighting scheme appropriate for a ${existing.stage}-stage ${existing.sector} company?

4. KEY RISKS (3-5 bullet points): Specific risks an investor would flag. Reference actual numbers.

5. RECOMMENDATIONS (3-5 actionable items): Purpose-specific. Be tactical, not generic.

6. PURPOSE CONTEXT: ${PURPOSE_FRAMING[purpose]}

STYLE: Active voice, cite specific numbers, explain causation. Write for a board presentation audience.
Do NOT use generic phrases like "Based on the inputs provided" or "The calculated value is."
Use INR. Reference Indian market context. Be direct, not diplomatic.`
}

export async function POST(req: NextRequest) {
  try {
    const anthropic = getAnthropic()

    if (!anthropic) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
    }

    const { valuation_id } = await req.json()
    if (!valuation_id) {
      return NextResponse.json({ error: 'Missing valuation_id' }, { status: 400 })
    }

    // Check cache first
    const existingList = await db.select().from(valuations).where(eq(valuations.id, valuation_id)).limit(1)
    const existing = existingList[0]

    if (!existing) {
      return NextResponse.json({ error: 'Valuation not found' }, { status: 404 })
    }

    // Return cached if available
    if (existing.aiNarrative) {
      return NextResponse.json({ narrative: existing.aiNarrative })
    }

    // Rate limit: 100 AI calls per day
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const dailyCalls = await db.select({ count: valuations.id }).from(valuations).where(
      and(
        isNotNull(valuations.aiNarrative),
        gte(valuations.createdAt, todayStart)
      )
    )

    if (dailyCalls.length >= 100) {
      return NextResponse.json({ error: 'Daily AI analysis limit reached. Try again tomorrow.' }, { status: 429 })
    }

    const purpose: ValuationPurpose = (existing.purpose as ValuationPurpose) || (existing.paidPurpose as ValuationPurpose) || 'indicative'
    const damodaranBenchmark = getDamodaranBenchmark(existing.sector as StartupCategory)
    const prompt = buildPrompt(existing, purpose, damodaranBenchmark)

    // Use Sonnet for paid purposes, Haiku for free
    const model = purpose === 'indicative'
      ? 'claude-haiku-4-5-20251001'
      : 'claude-sonnet-4-5-20241022'

    const message = await anthropic.messages.create({
      model,
      max_tokens: purpose === 'indicative' ? 500 : 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const narrative = message.content[0].type === 'text' ? message.content[0].text : ''

    // Cache in DB
    await db.update(valuations).set({ aiNarrative: narrative }).where(eq(valuations.id, valuation_id))

    return NextResponse.json({ narrative })
  } catch (err) {
    console.error('AI analysis error:', err)
    return NextResponse.json({ error: 'AI analysis unavailable' }, { status: 500 })
  }
}
