'use client'

import { useRouter } from 'next/navigation'
import { useValuationStore } from '@/stores/valuation-store'
import { WizardContainer } from '@/components/wizard/wizard-container'
import { ValuationReveal } from '@/components/results/valuation-reveal'
import { MethodCards } from '@/components/results/method-cards'
import { MethodContribution } from '@/components/results/method-contribution'
import { MonteCarloChart } from '@/components/results/monte-carlo-chart'
import { ConfidenceBreakdown } from '@/components/results/confidence-breakdown'
import { ShareButtons } from '@/components/results/share-buttons'
import { EmailGate } from '@/components/results/email-gate'
import { PDFDownloadButton } from '@/components/report/pdf-download-button'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import type { StartupCategory } from '@/types'

export default function ValuationPage() {
  const { result, inputs, email, reset } = useValuationStore()
  const router = useRouter()

  const handleUnlocked = (reportId: string) => {
    if (reportId !== 'local') {
      router.push(`/report/${reportId}`)
    }
  }

  const handleStartNew = () => {
    reset()
  }

  // Wizard mode
  if (!result) {
    return (
      <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.08_0.008_260)] py-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(0.78_0.14_80/0.04)] blur-[120px] pointer-events-none" />
        <div className="relative container mx-auto px-4">
          <WizardContainer />
        </div>
      </main>
    )
  }

  // Results mode
  const benchmark = getDamodaranBenchmark(inputs.sector as StartupCategory)

  return (
    <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.08_0.008_260)] py-10">
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[oklch(0.78_0.14_80/0.04)] blur-[140px] pointer-events-none" />

      <div className="relative container mx-auto px-4 max-w-3xl space-y-6">
        {/* Start new valuation button */}
        <div className="flex justify-end">
          <button
            onClick={handleStartNew}
            className="text-[11px] font-medium text-[oklch(0.50_0.01_260)] uppercase tracking-[0.15em] transition-colors hover:text-[oklch(0.78_0.14_80)] flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Valuation
          </button>
        </div>

        <ValuationReveal result={result} companyName={inputs.company_name} />

        <MethodCards
          methods={result.methods}
          monteCarlo={result.monte_carlo}
        />

        {result.monte_carlo && (
          <MonteCarloChart monteCarlo={result.monte_carlo} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MethodContribution
            methods={result.methods}
            compositeValue={result.composite_value}
          />
          <ConfidenceBreakdown result={result} />
        </div>

        <div className="flex justify-center">
          <ShareButtons
            compositeValue={result.composite_value}
            companyName={inputs.company_name}
          />
        </div>

        {/* Email gate — always show if no email captured yet */}
        {!email ? (
          <EmailGate onUnlocked={handleUnlocked} />
        ) : (
          /* Post-email: show PDF download */
          <div className="text-center space-y-4 py-4">
            <PDFDownloadButton
              valuation={{
                company_name: inputs.company_name,
                sector: inputs.sector,
                stage: inputs.stage,
              }}
              result={result}
            />
          </div>
        )}
      </div>
    </main>
  )
}
