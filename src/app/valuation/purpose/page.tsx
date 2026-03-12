'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useValuationStore } from '@/stores/valuation-store'
import {
  VALUATION_PURPOSES,
  PURPOSE_LABELS,
  PURPOSE_PRICES,
  type ValuationPurpose,
} from '@/types'
import { Check, Lock } from 'lucide-react'

const PURPOSE_DESCRIPTIONS: Record<ValuationPurpose, string> = {
  indicative: 'Quick directional estimate using 10 methods. No regulatory validity.',
  fundraising: 'Investor-ready report with comparable analysis and cap table modeling.',
  esop: 'Black-Scholes ESOP valuation with sensitivity analysis for board approval.',
  rule_11ua: 'Income Tax Act compliant valuation for share transfers and Section 56(2)(viib).',
  fema: 'RBI-compliant pricing for foreign investment under FEMA NDI Rules.',
  ma: 'Comprehensive valuation for mergers, acquisitions, and strategic transactions.',
}

const PURPOSE_FEATURES: Record<ValuationPurpose, string[]> = {
  indicative: [
    '10-method composite valuation',
    'Monte Carlo simulation',
    'Confidence scoring',
    'PDF report download',
  ],
  fundraising: [
    'Everything in Indicative',
    'Comparable company analysis',
    'Investor matching',
    'Cap table simulator',
    'AI narrative from VC perspective',
  ],
  esop: [
    'Everything in Indicative',
    'Black-Scholes option pricing',
    'Sensitivity analysis (3 scenarios)',
    'Board-ready ESOP report',
    'AI narrative for compensation committees',
  ],
  rule_11ua: [
    'Everything in Fundraising',
    'Rule 11UA compliance checklist',
    'Section 56(2)(viib) safe harbor analysis',
    'Signed by registered valuer',
    'Valid for RoC filing',
  ],
  fema: [
    'Everything in Fundraising',
    'FEMA NDI Rules compliance',
    'RBI pricing guidelines adherence',
    'DCF as primary method (mandatory)',
    'Signed by registered valuer',
  ],
  ma: [
    'Everything in Fundraising',
    'IBC downside analysis',
    'Deal structure recommendations',
    'Negotiation range with comparables',
    'Signed by registered valuer',
  ],
}

// Free beta: only indicative is available
const FREE_PURPOSES: ValuationPurpose[] = ['indicative']

function formatPrice(paise: number): string {
  if (paise === 0) return 'Free'
  return `Rs ${(paise / 100).toLocaleString('en-IN')}`
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function PurposeSelectorPage() {
  const router = useRouter()
  const { setPurpose } = useValuationStore()

  const handleSelect = (p: ValuationPurpose) => {
    if (!FREE_PURPOSES.includes(p)) return
    setPurpose(p)
  }

  const handleContinue = () => {
    setPurpose('indicative')
    router.push('/valuation')
  }

  return (
    <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.08_0.008_260)] py-16 px-6">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(0.78_0.14_80/0.04)] blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.65_0.16_155/0.1)] border border-[oklch(0.65_0.16_155/0.2)] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.16_155)] animate-pulse" />
            <span className="text-[10px] font-semibold text-[oklch(0.65_0.16_155)] uppercase tracking-wider">Free Beta</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl text-[oklch(0.93_0.005_80)]">
            Valuation Plans
          </h1>
          <p className="mt-4 text-sm text-[oklch(0.45_0.01_260)] max-w-md mx-auto">
            Indicative valuation is <span className="text-[oklch(0.78_0.14_80)] font-medium">free during beta</span>. Premium plans coming soon.
          </p>
        </motion.div>

        {/* Purpose cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        >
          {VALUATION_PURPOSES.map((p) => {
            const isFree = FREE_PURPOSES.includes(p)
            const isSelected = isFree
            const price = PURPOSE_PRICES[p]

            return (
              <motion.button
                key={p}
                variants={cardVariants}
                onClick={() => handleSelect(p)}
                disabled={!isFree}
                className={`
                  relative text-left rounded-lg p-5 transition-all duration-300
                  ${isFree
                    ? 'bg-[oklch(0.14_0.02_80)] border-2 border-[oklch(0.78_0.14_80/0.5)] shadow-[0_0_24px_oklch(0.78_0.14_80/0.08)] cursor-pointer'
                    : 'bg-[oklch(0.10_0.008_260)] border border-[oklch(0.15_0.008_260)] opacity-50 cursor-not-allowed'
                  }
                `}
              >
                {/* Coming Soon badge for paid */}
                {!isFree && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[oklch(0.15_0.008_260)] border border-[oklch(0.20_0.008_260)]">
                    <Lock className="w-2.5 h-2.5 text-[oklch(0.40_0.01_260)]" />
                    <span className="text-[9px] font-medium text-[oklch(0.40_0.01_260)] uppercase tracking-wider">Coming Soon</span>
                  </div>
                )}

                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading text-base text-[oklch(0.93_0.005_80)]">
                      {PURPOSE_LABELS[p]}
                    </h3>
                    <p className={`font-semibold text-lg mt-0.5 ${isFree ? 'text-[oklch(0.78_0.14_80)]' : 'text-[oklch(0.35_0.01_260)]'}`}>
                      {formatPrice(price)}
                    </p>
                  </div>
                  {isSelected && isFree && (
                    <div className="h-6 w-6 rounded-full bg-[oklch(0.78_0.14_80)] flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-[oklch(0.10_0_0)]" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[oklch(0.45_0.01_260)] mb-3 leading-relaxed">
                  {PURPOSE_DESCRIPTIONS[p]}
                </p>

                {/* Features */}
                <ul className="space-y-1.5">
                  {PURPOSE_FEATURES[p].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-[oklch(0.55_0.01_260)]">
                      <span
                        className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${isFree ? 'bg-[oklch(0.78_0.14_80)]' : 'bg-[oklch(0.25_0.01_260)]'}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Continue CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            className="group relative inline-flex items-center justify-center h-12 px-8 text-sm font-semibold tracking-wide bg-[oklch(0.78_0.14_80)] text-[oklch(0.10_0_0)] rounded-lg transition-all duration-300 hover:bg-[oklch(0.82_0.14_80)] hover:shadow-[0_0_40px_oklch(0.78_0.14_80/0.25)] active:scale-[0.97]"
          >
            Start Free Valuation
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="text-[11px] text-[oklch(0.40_0.01_260)] mt-3">
            No signup required. Free during beta.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
