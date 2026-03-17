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
import { EmailGate } from '@/components/results/email-gate'
import { PDFDownloadButton } from '@/components/report/pdf-download-button'
import { formatINR } from '@/lib/utils'
import { ArrowRight, BarChart3, Lock, Plus, Sparkles } from 'lucide-react'

type PageMode = 'loading' | 'interstitial' | 'wizard' | 'results'

export default function ValuationPage() {
  const { result, inputs, email, userName, userPhone, reset } = useValuationStore()
  const router = useRouter()
  const [mode, setMode] = useState<PageMode>('loading')
  const [hydrated, setHydrated] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [showFloatingButtons, setShowFloatingButtons] = useState(false)

  // Wait for Zustand hydration from localStorage
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Scroll listener for floating buttons
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButtons(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine initial mode after hydration (runs once)
  useEffect(() => {
    if (!hydrated) return
    setMode(result ? 'interstitial' : 'wizard')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  const handleUnlocked = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMode('results')
    setGateOpen(false)
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
      <main className="grain relative min-h-[calc(100dvh-5rem)] bg-[oklch(0.985 0.002 260)] flex items-center justify-center overflow-x-hidden">
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
      <main className="grain relative min-h-[calc(100dvh-5rem)] bg-[oklch(0.985 0.002 260)] flex items-center justify-center px-6 overflow-x-hidden">
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
      <main className="grain relative min-h-[calc(100dvh-5rem)] bg-[oklch(0.985 0.002 260)] py-6 md:py-10 overflow-x-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(0.62_0.22_330/0.04)] blur-[120px] pointer-events-none" />
        <div className="relative container mx-auto px-4">
          <WizardContainer />
        </div>
      </main>
    )
  }

  // Results mode
  return (
    <main className="grain relative min-h-[calc(100dvh-5rem)] bg-[oklch(0.985 0.002 260)] pt-4 pb-20 md:pt-8 md:pb-24 overflow-x-hidden">
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[oklch(0.62_0.22_330/0.04)] blur-[140px] pointer-events-none" />

      <div className="relative container mx-auto px-4 max-w-6xl space-y-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >            {/* Top Section: Hero Valuation (Full Width) */}
            <div className="w-full">
              <ValuationReveal result={result} companyName={inputs.company_name} />
            </div>

            {/* Methodology Section: 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MethodCards
                methods={result.methods}
                monteCarlo={result.monte_carlo}
                unlocked={!!email}
                approachFilter="income"
              />
              <MethodCards
                methods={result.methods}
                monteCarlo={result.monte_carlo}
                unlocked={!!email}
                approachFilter="asset_cost"
              />
              <MethodCards
                methods={result.methods}
                monteCarlo={result.monte_carlo}
                unlocked={!!email}
                approachFilter="market"
              />
              <MethodCards
                methods={result.methods}
                monteCarlo={result.monte_carlo}
                unlocked={!!email}
                approachFilter="vc_startup"
              />
            </div>

            <div className="w-full">
              {result.monte_carlo && (
                <MonteCarloChart monteCarlo={result.monte_carlo} />
              )}
            </div>

            {/* GATED — after email capture */}
            {email ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  <MethodContribution
                    methods={result.methods}
                    compositeValue={result.composite_value}
                  />
                  <ConfidenceBreakdown result={result} />
                </div>

                <div className="w-full">
                  <ComparablesPreview
                    sector={inputs.sector}
                    stage={inputs.stage}
                    revenue={inputs.annual_revenue}
                    compositeValue={result.composite_value}
                  />
                </div>

                {/* Floating Sticky PDF Button + New Valuation */}
                <AnimatePresence>
                  {showFloatingButtons ? (
                    <motion.div
                      key="floating-nav-unlocked"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 drop-shadow-2xl"
                    >
                      <div className="pointer-events-auto cursor-pointer">
                        <PDFDownloadButton
                          valuation={{
                            id: 'local',
                            companyName: inputs.company_name,
                            sector: inputs.sector,
                            stage: inputs.stage,
                            annualRevenue: inputs.annual_revenue,
                            userName: userName,
                            userPhone: userPhone,
                            userEmail: email,
                          }}
                          result={result}
                        />
                      </div>
                      <button
                        onClick={handleStartNew}
                        className="text-[10px] font-bold text-[oklch(0.40_0.01_260)] uppercase tracking-[0.2em] [text-shadow:0_1px_4px_rgba(255,255,255,1),0_1px_1px_rgba(0,0,0,0.1)] hover:text-[oklch(0.62_0.22_330)] transition-all active:scale-[0.98] pointer-events-auto cursor-pointer"
                      >
                        + Start New Valuation
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-6 pb-20"
              >
                <AnimatePresence mode="wait">
                  {!showFloatingButtons && (
                    <motion.div
                      key="static-unlock-nav"
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <button
                        onClick={() => setGateOpen(true)}
                        className="group inline-flex items-center gap-3 h-14 px-10 text-sm font-semibold rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_0_32px_oklch(0.62_0.22_330/0.25)] active:scale-[0.98] cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-[oklch(0.62_0.22_330)]" />
                        Unlock Full Report & PDF
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>

                      <button
                        onClick={handleStartNew}
                        className="text-[11px] font-bold text-[oklch(0.40_0.01_260)] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        + Start Fresh Valuation
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Sticky UNLOCK Button */}
                <AnimatePresence>
                  {showFloatingButtons ? (
                    <motion.div
                      key="floating-nav-locked"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"
                    >
                      <button
                        onClick={() => setGateOpen(true)}
                        className="group inline-flex items-center gap-3 h-12 px-8 text-xs font-bold rounded-full bg-[#32373c] text-white transition-all hover:bg-[#1d2024] shadow-2xl hover:shadow-[0_0_32px_oklch(0.62_0.22_330/0.4)] active:scale-[0.98] pointer-events-auto cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-[oklch(0.62_0.22_330)]" />
                        Unlock Full Report
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                      <button
                        onClick={handleStartNew}
                        className="text-[10px] font-bold text-[oklch(0.40_0.01_260)] uppercase tracking-[0.2em] [text-shadow:0_1px_4px_rgba(255,255,255,1),0_1px_1px_rgba(0,0,0,0.1)] hover:text-[oklch(0.62_0.22_330)] transition-all active:scale-[0.98] pointer-events-auto cursor-pointer"
                      >
                        + Start New Valuation
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
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
