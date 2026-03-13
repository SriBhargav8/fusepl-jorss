'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useValuationStore } from '@/stores/valuation-store'
import { WizardContainer } from '@/components/wizard/wizard-container'
import { ValuationReveal } from '@/components/results/valuation-reveal'
import { MethodCards } from '@/components/results/method-cards'
import { MethodContribution } from '@/components/results/method-contribution'
import { MonteCarloChart } from '@/components/results/monte-carlo-chart'
import { ConfidenceBreakdown } from '@/components/results/confidence-breakdown'
import { ComparablesPreview } from '@/components/results/comparables-preview'
import { ShareButtons } from '@/components/results/share-buttons'
import { EmailGate } from '@/components/results/email-gate'
import { PDFDownloadButton } from '@/components/report/pdf-download-button'
import { formatINR } from '@/lib/utils'
import { ArrowRight, BarChart3, Lock, Plus, Sparkles } from 'lucide-react'

type PageMode = 'loading' | 'interstitial' | 'wizard' | 'results'

export default function ValuationPage() {
  const { result, inputs, email, reset } = useValuationStore()
  const router = useRouter()
  const [mode, setMode] = useState<PageMode>('loading')
  const [hydrated, setHydrated] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)

  // Wait for Zustand hydration from localStorage
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Determine initial mode after hydration (runs once)
  useEffect(() => {
    if (!hydrated) return
    setMode(result ? 'interstitial' : 'wizard')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  const handleUnlocked = (reportId: string) => {
    if (reportId !== 'local') {
      router.push(`/report/${reportId}`)
    }
  }

  const handleStartNew = () => {
    reset()
    setMode('wizard')
  }

  const handleViewResults = () => {
    setMode('results')
  }

  // Loading state while Zustand hydrates
  if (mode === 'loading') {
    return (
      <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.985 0.002 260)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Sparkles className="w-6 h-6 text-[oklch(0.62 0.22 330)] animate-pulse" />
          <p className="text-xs text-[oklch(0.50_0.01_260)]">Loading...</p>
        </motion.div>
      </main>
    )
  }

  // Interstitial: previous result exists
  if (mode === 'interstitial' && result) {
    return (
      <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.985 0.002 260)] flex items-center justify-center px-6">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(0.62_0.22_330/0.04)] blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md w-full text-center"
        >
          <p className="text-[11px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-4">
            Welcome back
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl text-[oklch(0.15 0.02 260)] mb-2">
            {inputs.company_name || 'Your Startup'}
          </h1>
          <p className="text-sm text-[oklch(0.45 0.01 260)] mb-8">
            You have a previous valuation of{' '}
            <span className="font-semibold text-[oklch(0.62 0.22 330)]">
              {formatINR(result.composite_value)}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleViewResults}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-semibold rounded-lg border border-[oklch(0.62_0.22_330/0.3)] text-[oklch(0.62 0.22 330)] transition-all hover:bg-[oklch(0.62_0.22_330/0.06)] hover:border-[oklch(0.62_0.22_330/0.5)]"
            >
              <BarChart3 className="w-4 h-4" />
              View Previous Results
            </button>
            <button
              onClick={handleStartNew}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-semibold rounded-lg bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_0_24px_oklch(0.62_0.22_330/0.2)] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Start New Valuation
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  // Wizard mode — show wizard only when no result yet
  if (!result) {
    return (
      <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.985 0.002 260)] py-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(0.62_0.22_330/0.04)] blur-[120px] pointer-events-none" />
        <div className="relative container mx-auto px-4">
          <WizardContainer />
        </div>
      </main>
    )
  }

  // Results mode
  return (
    <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.985 0.002 260)] py-10">
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[oklch(0.62_0.22_330/0.04)] blur-[140px] pointer-events-none" />

      <div className="relative container mx-auto px-4 max-w-3xl space-y-6">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Start new valuation button */}
            <div className="flex justify-end">
              <button
                onClick={handleStartNew}
                className="text-[11px] font-medium text-[oklch(0.45 0.01 260)] uppercase tracking-[0.15em] transition-colors hover:text-[oklch(0.62 0.22 330)] flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                New Valuation
              </button>
            </div>

            {/* FREE — visible to all */}
            <ValuationReveal result={result} companyName={inputs.company_name} />

            <MethodCards
              methods={result.methods}
              monteCarlo={result.monte_carlo}
              unlocked={!!email}
            />

            {result.monte_carlo && (
              <MonteCarloChart monteCarlo={result.monte_carlo} />
            )}

            <div className="flex justify-center">
              <ShareButtons
                compositeValue={result.composite_value}
                companyName={inputs.company_name}
              />
            </div>

            {/* GATED — after email capture */}
            {email ? (
              <>
                <MethodCards
                  methods={result.methods}
                  monteCarlo={result.monte_carlo}
                  unlocked
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MethodContribution
                    methods={result.methods}
                    compositeValue={result.composite_value}
                  />
                  <ConfidenceBreakdown result={result} />
                </div>

                <ComparablesPreview
                  sector={inputs.sector}
                  stage={inputs.stage}
                  revenue={inputs.annual_revenue}
                  compositeValue={result.composite_value}
                />

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
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-6"
              >
                <button
                  onClick={() => setGateOpen(true)}
                  className="group inline-flex items-center gap-3 h-14 px-10 text-sm font-semibold rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_0_32px_oklch(0.62_0.22_330/0.25)] active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4 text-[oklch(0.62_0.22_330)]" />
                  Unlock Full Report & PDF
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="text-[11px] text-[oklch(0.45_0.01_250)] mt-3">
                  Confidence breakdown, comparable startups, PDF download — free during beta
                </p>
              </motion.div>
            )}

            {/* Email gate modal */}
            <EmailGate open={gateOpen} onOpenChange={setGateOpen} onUnlocked={handleUnlocked} />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
