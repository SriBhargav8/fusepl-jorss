'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useValuationStore } from '@/stores/valuation-store'
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
import { ReportSkeleton } from '@/components/skeletons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export default function ReportPage() {
  const params = useParams()
  const id = params?.id as string
  const storeResult = useValuationStore((s) => s.result)
  const storeInputs = useValuationStore((s) => s.inputs)
  const [valuation, setValuation] = useState<ValuationRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [usingLocalFallback, setUsingLocalFallback] = useState(false)

  useEffect(() => {
    if (!id) return

    async function fetchReport() {
      // 1. Try Supabase fetch
      const supabase = getSupabaseClient()
      if (supabase && id !== 'local') {
        try {
          const { data, error: fetchError } = await supabase
            .from('valuations')
            .select('*')
            .eq('id', id)
            .single()

          if (!fetchError && data) {
            setValuation(data as ValuationRow)
            setLoading(false)
            return
          }
        } catch {
          // Fall through to local fallback
        }
      }

      // 2. Fall back to local store data
      if (storeResult && storeInputs.company_name) {
        setUsingLocalFallback(true)
        setValuation({
          id: id,
          email: '',
          company_name: storeInputs.company_name,
          sector: storeInputs.sector,
          stage: storeInputs.stage,
          annual_revenue: storeInputs.annual_revenue,
          revenue_growth_pct: storeInputs.revenue_growth_pct,
          gross_margin_pct: storeInputs.gross_margin_pct,
          monthly_burn: storeInputs.monthly_burn,
          cash_in_bank: storeInputs.cash_in_bank,
          tam: storeInputs.tam,
          team_size: storeInputs.team_size,
          founder_experience: storeInputs.founder_experience,
          domain_expertise: storeInputs.domain_expertise,
          previous_exits: storeInputs.previous_exits,
          dev_stage: storeInputs.dev_stage,
          competitive_advantages: storeInputs.competitive_advantages?.join(', ') ?? null,
          competition_level: storeInputs.competition_level,
          esop_pool_pct: storeInputs.esop_pool_pct,
          time_to_liquidity_years: storeInputs.time_to_liquidity_years,
          target_raise: storeInputs.target_raise,
          current_cap_table: storeInputs.current_cap_table,
          valuation_low: storeResult.composite_low,
          valuation_mid: storeResult.composite_value,
          valuation_high: storeResult.composite_high,
          confidence_score: storeResult.confidence_score,
          method_results: storeResult.methods,
          monte_carlo_percentiles: storeResult.monte_carlo,
          ibc_recovery_range: storeResult.ibc_recovery_range,
          ai_narrative: null,
          created_at: new Date().toISOString(),
        })
        setLoading(false)
        return
      }

      // 3. No data available
      setError(true)
      setLoading(false)
    }

    fetchReport()
  }, [id, storeResult, storeInputs])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ReportSkeleton />
      </main>
    )
  }

  if (error || !valuation) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-20 space-y-4">
          <h1 className="text-2xl font-bold text-white mb-2">Report Not Found</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            This report could not be loaded. It may not exist, or the database may not be configured.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-slate-700 text-slate-300"
            >
              Retry
            </Button>
            <Link href="/valuation">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                Create New Valuation
              </Button>
            </Link>
          </div>
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
      {/* Local fallback disclaimer */}
      {usingLocalFallback && id !== 'local' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-400">
            Showing your last locally computed valuation — this may not correspond to the shared report.
          </p>
        </div>
      )}

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
