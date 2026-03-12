'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
import { formatINR } from '@/lib/utils'
import { BarChart3, Plus } from 'lucide-react'

export default function ValuationPage() {
  const { result, inputs, email, reset } = useValuationStore()
  const router = useRouter()
  const [showResults, setShowResults] = useState(false)

  const handleUnlocked = (reportId: string) => {
    if (reportId !== 'local') {
      router.push(`/report/${reportId}`)
    }
  }

  const handleStartNew = () => {
    reset()
    setShowResults(false)
  }

  // Has a previous result but user hasn't chosen to view it yet
  if (result && !showResults) {
    return (
      <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.08_0.008_260)] flex items-center justify-center px-6">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(0.78_0.14_80/0.04)] blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md w-full text-center"
        >
          <p className="text-[11px] font-semibold text-[oklch(0.78_0.14_80)] uppercase tracking-[0.2em] mb-4">
            Welcome back
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl text-[oklch(0.93_0.005_80)] mb-2">
            {inputs.company_name || 'Your Startup'}
          </h1>
          <p className="text-sm text-[oklch(0.50_0.01_260)] mb-8">
            You have a previous valuation of{' '}
            <span className="font-semibold text-[oklch(0.78_0.14_80)]">
              {formatINR(result.composite_value)}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowResults(true)}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-semibold rounded-lg border border-[oklch(0.78_0.14_80/0.3)] text-[oklch(0.78_0.14_80)] transition-all hover:bg-[oklch(0.78_0.14_80/0.06)] hover:border-[oklch(0.78_0.14_80/0.5)]"
            >
              <BarChart3 className="w-4 h-4" />
              View Previous Results
            </button>
            <button
              onClick={handleStartNew}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-semibold rounded-lg bg-[oklch(0.78_0.14_80)] text-[oklch(0.10_0_0)] transition-all hover:bg-[oklch(0.82_0.14_80)] hover:shadow-[0_0_24px_oklch(0.78_0.14_80/0.2)] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Start New Valuation
            </button>
          </div>
        </motion.div>
      </main>
    )
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
            <Plus className="w-3.5 h-3.5" />
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
