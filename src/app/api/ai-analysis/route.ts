import { NextRequest, NextResponse } from 'next/server'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import type { StartupCategory } from '@/types'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  // Dynamic import to avoid errors when env vars aren't set
  const { createClient } = require('@supabase/supabase-js')
  return createClient(url, key)
}

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  const Anthropic = require('@anthropic-ai/sdk').default
  return new Anthropic({ apiKey })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const anthropic = getAnthropic()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    if (!anthropic) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
    }

    const { valuation_id } = await req.json()
    if (!valuation_id) {
      return NextResponse.json({ error: 'Missing valuation_id' }, { status: 400 })
    }

    // Check cache first
    const { data: existing } = await supabase
      .from('valuations')
      .select('ai_narrative, company_name, sector, stage, annual_revenue, revenue_growth_pct, gross_margin_pct, monthly_burn, cash_in_bank, founder_experience, domain_expertise, previous_exits, dev_stage, competition_level, tam, competitive_advantages, valuation_low, valuation_high, confidence_score, ibc_recovery_range')
      .eq('id', valuation_id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Valuation not found' }, { status: 404 })
    }

    // Return cached if available
    if (existing.ai_narrative) {
      return NextResponse.json({ narrative: existing.ai_narrative })
    }

    // Rate limit: 100 AI calls per day
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const { count: dailyCount } = await supabase
      .from('valuations')
      .select('id', { count: 'exact', head: true })
      .not('ai_narrative', 'is', null)
      .gte('updated_at', todayStart.toISOString())

    if ((dailyCount ?? 0) >= 100) {
      return NextResponse.json({ error: 'Daily AI analysis limit reached. Try again tomorrow.' }, { status: 429 })
    }

    // Get Damodaran benchmark for sector context
    const damodaranBenchmark = getDamodaranBenchmark(existing.sector as StartupCategory)

    // Build prompt
    const runway = existing.monthly_burn > 0
      ? Math.round(existing.cash_in_bank / existing.monthly_burn)
      : 'N/A'

    const recovery = existing.ibc_recovery_range
      ? `${existing.ibc_recovery_range.low}-${existing.ibc_recovery_range.high}%`
      : 'N/A'

    const prompt = `You are a senior Indian VC analyst with 15 years experience evaluating startups across India.
Analyze this startup and provide investment-grade insights:

Company: ${existing.company_name} | Sector: ${existing.sector} | Stage: ${existing.stage}
Revenue: Rs ${existing.annual_revenue}, Growth: ${existing.revenue_growth_pct}%, Gross Margin: ${existing.gross_margin_pct}%
Burn: Rs ${existing.monthly_burn}/month, Runway: ${runway} months
Team: ${existing.founder_experience}/5 experience, ${existing.domain_expertise}/5 domain expertise, Previous exits: ${existing.previous_exits}
Product: ${existing.dev_stage}, Competition: ${existing.competition_level}/5
TAM: Rs ${existing.tam} Cr
Competitive advantages: ${existing.competitive_advantages}
Valuation estimate: Rs ${existing.valuation_low}–${existing.valuation_high} (10-method weighted average, 3 approaches)
Confidence score: ${existing.confidence_score}/100

Damodaran India multiples: ${existing.sector} trades at ${damodaranBenchmark?.ev_revenue.toFixed(1) ?? 'N/A'}x EV/Revenue.
IBC context: Companies in ${existing.sector} recover ${recovery} in insolvency scenarios.

Provide exactly 4 sections (under 300 words total):

1. INVESTMENT THESIS (2-3 sentences): What makes this startup investable? Be specific to their numbers and sector. Reference the Damodaran multiple context.

2. KEY RISKS (bullet points): Top 3 risks an investor would flag. Reference specific numbers (burn rate, competition level, margin). Include downside context from IBC data.

3. VALUATION OPINION: Is the estimated range reasonable? Compare to public market multiples. Note whether the valuation accounts for the stage discount appropriately.

4. FUNDRAISE PLAYBOOK (3 concrete actions): What should the founder do in the next 90 days before approaching investors? Be tactical, not generic.

Use INR. Reference Indian market context. Be direct, not diplomatic.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const narrative = message.content[0].type === 'text' ? message.content[0].text : ''

    // Cache in Supabase
    await supabase
      .from('valuations')
      .update({ ai_narrative: narrative })
      .eq('id', valuation_id)

    return NextResponse.json({ narrative })
  } catch (err) {
    console.error('AI analysis error:', err)
    return NextResponse.json({ error: 'AI analysis unavailable' }, { status: 500 })
  }
}
