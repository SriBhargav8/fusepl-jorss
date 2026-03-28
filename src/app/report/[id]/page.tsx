'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
import { GatedSection } from '@/components/report/gated-section'
import { PDFDownloadButton } from '@/components/report/pdf-download-button'
import { StickyReportCTA } from '@/components/report/sticky-report-cta'
import { getReportConfig } from '@/lib/report-config'
import { formatINR } from '@/lib/utils'
import { ReportSkeleton } from '@/components/skeletons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { ValuationResult, MethodResult, MonteCarloResult, CapTableEntry, ValuationPurpose } from '@/types'

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
  purpose: ValuationPurpose | null
  paid_purpose: ValuationPurpose | null
  created_at: string
}

import { getValuationById } from '@/app/actions/valuation'

export default function ReportPage() {
  const params = useParams()
  const id = params?.id as string
  const storeResult = useValuationStore((s) => s.result)
  const storeInputs = useValuationStore((s) => s.inputs)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [valuation, setValuation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [usingLocalFallback, setUsingLocalFallback] = useState(false)

  useEffect(() => {
    if (!id) return

    async function fetchReport() {
      // 1. Try DB fetch via Server Action
      if (id !== 'local') {
        try {
          const data = await getValuationById(id)

          if (data) {
            setValuation(data)
            setLoading(false)
            return
          }
        } catch (err) {
          console.error('[Report] Fetch failed:', err)
          // Fall through to local fallback
        }
      }

      // 2. Fall back to local store data
      const storePurpose = useValuationStore.getState().purpose
      if (storeResult && storeInputs.company_name) {
        setUsingLocalFallback(true)
        setValuation({
          id: id,
          email: '',
          company_name: storeInputs.company_name,
          sector: storeInputs.sector,
          stage: storeInputs.stage,
          annual_revenue: storeInputs.annual_revenue?.toString(),
          revenue_growth_pct: storeInputs.revenue_growth_pct?.toString(),
          gross_margin_pct: storeInputs.gross_margin_pct?.toString(),
          monthly_burn: storeInputs.monthly_burn?.toString(),
          cash_in_bank: storeInputs.cash_in_bank?.toString(),
          tam: storeInputs.tam?.toString(),
          team_size: storeInputs.team_size,
          founder_experience: storeInputs.founder_experience,
          domain_expertise: storeInputs.domain_expertise,
          previous_exits: storeInputs.previous_exits,
          dev_stage: storeInputs.dev_stage,
          competitive_advantages: storeInputs.competitive_advantages?.join(', ') ?? null,
          competition_level: storeInputs.competition_level,
          esop_pool_pct: storeInputs.esop_pool_pct?.toString(),
          time_to_liquidity_years: storeInputs.time_to_liquidity_years,
          target_raise: storeInputs.target_raise?.toString(),
          current_cap_table: storeInputs.current_cap_table,
          valuation_low: storeResult.composite_low?.toString(),
          valuation_mid: storeResult.composite_value?.toString(),
          valuation_high: storeResult.composite_high?.toString(),
          confidence_score: storeResult.confidence_score,
          method_results: storeResult.methods,
          monte_carlo_percentiles: storeResult.monte_carlo,
          ibc_recovery_range: storeResult.ibc_recovery_range,
          ai_narrative: null,
          purpose: storePurpose,
          paid_purpose: null,
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
          <h1 className="text-2xl font-bold text-[oklch(0.15_0.02_260)] mb-2">Report Not Found</h1>
          <p className="text-[oklch(0.45_0.01_260)] max-w-md mx-auto">
            This report could not be loaded. It may not exist, or the database may not be configured.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-[oklch(0.80_0.015_260)] text-[oklch(0.35_0.01_260)]"
            >
              Retry
            </Button>
            <Link href="/valuation">
              <Button className="bg-[#32373c] hover:bg-[#1d2024] text-white">
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

  const purpose = valuation.purpose ?? valuation.paidPurpose ?? 'indicative'
  const paidPurpose = valuation.paidPurpose ?? null
  const config = getReportConfig(purpose)

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
        <p className="border-amber-400 text-xl font-semibold">
          {formatINR(Number(result.composite_low))} — {formatINR(Number(result.composite_high))}
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Composite: {formatINR(Number(result.composite_value))} | Confidence: {result.confidence_score}/100
        </p>
      </div>

      <MethodologySection methods={result.methods} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
           <BenchmarksSection sector={valuation.sector} />
        </div>
        <div className="lg:col-span-7">
          <GatedSection purpose={purpose} paidPurpose={paidPurpose}>
            <ComparablesSection sector={valuation.sector} stage={valuation.stage} />
          </GatedSection>
        </div>
      </div>

      {config.showListedComparables && (
        <GatedSection purpose={purpose} paidPurpose={paidPurpose}>
          <ListedComparablesSection
            sector={valuation.sector}
            revenue={valuation.annual_revenue}
            stage={valuation.stage}
          />
        </GatedSection>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          {config.showESOPDetail ? (
            <GatedSection purpose={purpose} paidPurpose={paidPurpose}>
              <ESOPSection valuation={valuation} compositeValue={result.composite_value} />
            </GatedSection>
          ) : (
            <div className="glass-card grain rounded-xl p-8 flex flex-col items-center justify-center text-center h-full bg-slate-50/50">
              <p className="text-sm font-medium text-slate-400 italic">ESOP analysis unavailable for this report type.</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-6">
          <GatedSection purpose={purpose} paidPurpose={paidPurpose}>
            <CapTableSection valuation={valuation} compositeValue={result.composite_value} />
          </GatedSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          {config.showInvestorMatch ? (
            <GatedSection purpose={purpose} paidPurpose={paidPurpose}>
              <InvestorSection
                sector={valuation.sector}
                stage={valuation.stage}
                targetRaise={valuation.target_raise}
              />
            </GatedSection>
          ) : (
             <div className="glass-card grain rounded-xl p-8 flex flex-col items-center justify-center text-center h-full bg-slate-50/50">
                <p className="text-sm font-medium text-slate-400 italic">Investor matching unavailable for this report type.</p>
             </div>
          )}
        </div>
        <div className="lg:col-span-5">
          {config.showIBCDownside ? (
            <GatedSection purpose={purpose} paidPurpose={paidPurpose}>
              <DownsideSection sector={valuation.sector} />
            </GatedSection>
          ) : (
             <div className="glass-card grain rounded-xl p-8 flex flex-col items-center justify-center text-center h-full bg-slate-50/50">
                <p className="text-sm font-medium text-slate-400 italic">Downside analysis unavailable for this report type.</p>
             </div>
          )}
        </div>
      </div>

      {config.showAINarrative && (
        <GatedSection purpose={purpose} paidPurpose={paidPurpose}>
          <AINarrative valuationId={valuation.id} />
        </GatedSection>
      )}

      <GatedSection purpose={purpose} paidPurpose={paidPurpose}>
        <RecommendationsSection result={result} sector={valuation.sector} stage={valuation.stage} />
      </GatedSection>

      <PDFDownloadButton valuation={valuation} result={result} />

      <div id="certified-cta-section">
        <CertifiedCTA valuationId={valuation.id} email={valuation.email || ''} purpose={purpose} />
      </div>

      <StickyReportCTA />
    </main>
  )
}
