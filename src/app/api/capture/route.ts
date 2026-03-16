import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { valuations } from '@/db/schema'
import { gte, and, eq, count } from 'drizzle-orm'
import { sendValuationEmail, sendLeadNotification } from '@/lib/email'
import { formatINR } from '@/lib/utils'
import type { CaptureRequest } from '@/types'
import { EMAIL_REGEX } from '@/lib/utils'
import { saveValuation } from '@/app/actions/valuation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CaptureRequest & { purpose?: string }
    const { email, valuation_inputs: inputs, valuation_result: result, purpose } = body

    // Validate required fields
    if (!email || !inputs.company_name || !inputs.sector || !inputs.stage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const sanitize = (s: string | null | undefined) =>
      s ? s.replace(/<[^>]*>/g, '').trim() : s

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

    // Rate limit check
    const rateLimitResult = await db.select({ value: count() }).from(valuations).where(
      and(
        eq(valuations.ipAddress, ip),
        gte(valuations.createdAt, oneHourAgo)
      )
    )
    
    if (rateLimitResult[0].value >= 10) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 })
    }

    // Save using Server Action
    const { reportId } = await saveValuation({
      email,
      ip_address: ip,
      company_name: sanitize(inputs.company_name),
      sector: inputs.sector,
      stage: inputs.stage,
      annual_revenue: inputs.annual_revenue?.toString(),
      revenue_growth_pct: inputs.revenue_growth_pct?.toString(),
      gross_margin_pct: inputs.gross_margin_pct?.toString(),
      monthly_burn: inputs.monthly_burn?.toString(),
      cash_in_bank: inputs.cash_in_bank?.toString(),
      tam: inputs.tam?.toString(),
      team_size: inputs.team_size,
      founder_experience: inputs.founder_experience,
      domain_expertise: inputs.domain_expertise,
      previous_exits: inputs.previous_exits,
      dev_stage: inputs.dev_stage,
      competitive_advantages: sanitize(inputs.competitive_advantages?.join(', ')),
      competition_level: inputs.competition_level,
      esop_pool_pct: inputs.esop_pool_pct?.toString(),
      time_to_liquidity_years: inputs.time_to_liquidity_years,
      target_raise: inputs.target_raise?.toString(),
      current_cap_table: inputs.current_cap_table,
      valuation_low: result.composite_low?.toString(),
      valuation_mid: result.composite_value?.toString(),
      valuation_high: result.composite_high?.toString(),
      confidence_score: result.confidence_score,
      method_results: result.methods,
      monte_carlo_percentiles: result.monte_carlo,
      ibc_recovery_range: result.ibc_recovery_range,
      purpose: purpose || 'indicative',
    })

    // Send email (non-blocking)
    const applicableMethods = result.methods.filter((m: { applicable: boolean }) => m.applicable).length
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://firstunicornstartup.com'

    sendValuationEmail({
      to: email,
      companyName: inputs.company_name,
      compositeValue: formatINR(result.composite_value),
      compositeRange: `${formatINR(result.composite_low)} — ${formatINR(result.composite_high)}`,
      confidenceScore: result.confidence_score,
      methodCount: applicableMethods,
      reportUrl: reportId !== 'local' ? `${baseUrl}/report/${reportId}` : undefined,
    }).catch(err => console.error('[capture] Email send failed:', err))

    // Send lead notification to business owner
    sendLeadNotification({
      email,
      companyName: inputs.company_name,
      sector: inputs.sector,
      stage: inputs.stage,
      annualRevenue: inputs.annual_revenue,
      compositeValue: formatINR(result.composite_value),
      compositeRange: `${formatINR(result.composite_low)} — ${formatINR(result.composite_high)}`,
      confidenceScore: result.confidence_score,
      purpose: purpose || 'indicative',
    }).catch(err => console.error('[capture] Lead notification failed:', err))

    return NextResponse.json({ report_id: reportId })
  } catch (err) {
    console.error('Capture error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
