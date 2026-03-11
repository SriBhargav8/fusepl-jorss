'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MethodologySection } from '@/components/report/methodology-section'
import { BenchmarksSection } from '@/components/report/benchmarks-section'
import { ComparablesSection } from '@/components/report/comparables-section'
import { ListedComparablesSection } from '@/components/report/listed-comparables-section'
import { DownsideSection } from '@/components/report/downside-section'
import { ESOPSection } from '@/components/report/esop-section'
import { CapTableSection } from '@/components/report/cap-table-section'
import { InvestorSection } from '@/components/report/investor-section'
import { AINarrative } from '@/components/report/ai-narrative'
import { RecommendationsSection } from '@/components/report/recommendations-section'
import { CertifiedCTA } from '@/components/report/certified-cta'
import { PDFDownloadButton } from '@/components/report/pdf-download-button'
import { formatINR } from '@/lib/utils'
import type { ValuationResult, MethodResult, MonteCarloResult, CapTableEntry } from '@/types'

/** DB row type matching Supabase valuations table */
interface ValuationRow {
  id: string
  email: string
  company_name: string
  sector: string
  stage: string
  annual_revenue: number | null
  revenue_growth_pct: number | null
  gross_margin_pct: number | null
  monthly_burn: number | null
  cash_in_bank: number | null
  tam: number | null
  team_size: number | null
  founder_experience: number | null
  domain_expertise: number | null
  previous_exits: boolean | null
  dev_stage: string | null
  competitive_advantages: string | null
  competition_level: number | null
  esop_pool_pct: number | null
  time_to_liquidity_years: number | null
  target_raise: number | null
  current_cap_table: CapTableEntry[] | null
  valuation_low: number
  valuation_mid: number
  valuation_high: number
  confidence_score: number
  method_results: MethodResult[]
  monte_carlo_percentiles: MonteCarloResult | null
  ibc_recovery_range: { low: number; high: number; sector: string } | null
  ai_narrative: string | null
  created_at: string
}

export default function ReportPage() {
  const params = useParams()
  const id = params?.id as string
  const [valuation, setValuation] = useState<ValuationRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return

    // In production, this would fetch from Supabase via an API route.
    // For now, show a placeholder since we don't have server-side data fetching in client component.
    setLoading(false)
    setError(true)
  }, [id])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-20">
          <p className="text-lg text-white animate-pulse">Loading valuation report...</p>
        </div>
      </main>
    )
  }

  if (error || !valuation) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-white mb-4">Report Not Found</h1>
          <p className="text-slate-400">
            This report may not exist or the database is not configured.
            Please ensure Supabase environment variables are set.
          </p>
        </div>
      </main>
    )
  }

  const result: ValuationResult = {
    methods: valuation.method_results ?? [],
    composite_value: valuation.valuation_mid,
    composite_low: valuation.valuation_low,
    composite_high: valuation.valuation_high,
    confidence_score: valuation.confidence_score,
    monte_carlo: valuation.monte_carlo_percentiles,
    ibc_recovery_range: valuation.ibc_recovery_range,
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{valuation.company_name}</h1>
        <p className="text-amber-400 text-xl font-semibold">
          {formatINR(result.composite_low)} — {formatINR(result.composite_high)}
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Composite: {formatINR(result.composite_value)} | Confidence: {result.confidence_score}/100
        </p>
      </div>

      <MethodologySection methods={result.methods} />

      <BenchmarksSection sector={valuation.sector} />

      <ComparablesSection sector={valuation.sector} stage={valuation.stage} />

      <ListedComparablesSection
        sector={valuation.sector}
        revenue={valuation.annual_revenue}
        stage={valuation.stage}
      />

      <DownsideSection sector={valuation.sector} />

      <ESOPSection valuation={valuation} compositeValue={result.composite_value} />

      <CapTableSection valuation={valuation} compositeValue={result.composite_value} />

      <InvestorSection
        sector={valuation.sector}
        stage={valuation.stage}
        targetRaise={valuation.target_raise}
      />

      <AINarrative valuationId={valuation.id} />

      <RecommendationsSection result={result} sector={valuation.sector} stage={valuation.stage} />

      <PDFDownloadButton valuation={valuation} result={result} />

      <CertifiedCTA />
    </main>
  )
}
