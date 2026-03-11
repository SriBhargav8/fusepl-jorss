import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { CaptureRequest } from '@/types'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body: CaptureRequest = await req.json()
    const { email, valuation_inputs: inputs, valuation_result: result } = body

    // Validate required fields
    if (!email || !inputs.company_name || !inputs.sector || !inputs.stage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Sanitize text fields (strip HTML tags)
    const sanitize = (s: string | null | undefined) =>
      s ? s.replace(/<[^>]*>/g, '').trim() : s

    // Rate limit: 10 per IP per hour
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('valuations')
      .select('id', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', oneHourAgo)

    if ((count ?? 0) >= 10) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 })
    }

    // Upsert user
    const { data: user } = await supabase
      .from('users')
      .upsert({ email }, { onConflict: 'email' })
      .select('id')
      .single()

    // Insert valuation with all wizard inputs + results
    const { data: valuation, error } = await supabase
      .from('valuations')
      .insert({
        user_id: user?.id,
        ip_address: ip,
        email,
        company_name: sanitize(inputs.company_name),
        sector: inputs.sector,
        stage: inputs.stage,
        annual_revenue: inputs.annual_revenue,
        revenue_growth_pct: inputs.revenue_growth_pct,
        gross_margin_pct: inputs.gross_margin_pct,
        monthly_burn: inputs.monthly_burn,
        cash_in_bank: inputs.cash_in_bank,
        tam: inputs.tam,
        team_size: inputs.team_size,
        founder_experience: inputs.founder_experience,
        domain_expertise: inputs.domain_expertise,
        previous_exits: inputs.previous_exits,
        dev_stage: inputs.dev_stage,
        competitive_advantages: sanitize(inputs.competitive_advantages?.join(', ')),
        competition_level: inputs.competition_level,
        esop_pool_pct: inputs.esop_pool_pct,
        time_to_liquidity_years: inputs.time_to_liquidity_years,
        target_raise: inputs.target_raise,
        current_cap_table: inputs.current_cap_table,
        valuation_low: result.composite_low,
        valuation_mid: result.composite_value,
        valuation_high: result.composite_high,
        confidence_score: result.confidence_score,
        method_results: result.methods,
        monte_carlo_percentiles: result.monte_carlo,
        ibc_recovery_range: result.ibc_recovery_range,
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ report_id: valuation!.id })
  } catch (err) {
    console.error('Capture error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
