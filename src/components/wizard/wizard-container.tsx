'use client'

import { useState } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { calculateValuation } from '@/lib/valuation'
import { WIZARD_STEPS } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { CompanyStep } from './company-step'
import { TeamStep } from './team-step'
import { FinancialsStep } from './financials-step'
import { MarketProductStep } from './market-product-step'
import { StrategicStep } from './strategic-step'
import { ESOPCapTableStep } from './esop-captable-step'
import { toast } from 'sonner'
import { Loader2, ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react'
import type { WizardInputs } from '@/types'

function validateStep(step: number, inputs: WizardInputs): string | null {
  switch (step) {
    case 1:
      if (!inputs.company_name.trim()) return 'Company name is required'
      return null
    case 2:
      if (inputs.team_size < 1) return 'Team size must be at least 1'
      return null
    case 3:
      if (inputs.annual_revenue < 0) return 'Revenue cannot be negative'
      if (inputs.gross_margin_pct < 0 || inputs.gross_margin_pct > 100) return 'Gross margin must be 0-100%'
      if (inputs.revenue_growth_pct < -100 || inputs.revenue_growth_pct > 1000) return 'Revenue growth must be -100% to 1000%'
      return null
    case 4:
      if (inputs.tam <= 0) return 'TAM must be greater than 0'
      return null
    case 5:
      return null
    case 6:
      if (inputs.esop_pool_pct !== null && (inputs.esop_pool_pct < 0 || inputs.esop_pool_pct > 30)) {
        return 'ESOP pool must be 0-30%'
      }
      return null
    default:
      return null
  }
}

const STEP_COMPONENTS = [
  CompanyStep,
  TeamStep,
  FinancialsStep,
  MarketProductStep,
  StrategicStep,
  ESOPCapTableStep,
]

export function WizardContainer() {
  const { currentStep, highestCompletedStep, inputs, nextStep, prevStep, goToStep, completeStep, setResult } =
    useValuationStore()
  const [direction, setDirection] = useState(1)
  const [computing, setComputing] = useState(false)

  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const progress = ((currentStep - 1) / 5) * 100

  const handleNext = () => {
    const error = validateStep(currentStep, inputs)
    if (error) {
      toast.error(error)
      return
    }
    completeStep(currentStep)
    if (currentStep === 6) {
      setComputing(true)
      setTimeout(() => {
        const result = calculateValuation(inputs)
        setResult(result)
        setComputing(false)
        toast.success('Valuation complete!')
      }, 100)
    } else {
      setDirection(1)
      nextStep()
    }
  }

  const handlePrev = () => {
    setDirection(-1)
    prevStep()
  }

  const handleStepClick = (step: number) => {
    if (step <= highestCompletedStep + 1) {
      setDirection(step > currentStep ? 1 : -1)
      goToStep(step)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header with step info */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[oklch(0.72_0.17_162/0.4)]" />
          <span className="text-[10px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.25em]">
            Step {currentStep} of 6
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[oklch(0.72_0.17_162/0.4)]" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl text-[oklch(0.95_0.002_250)]">
          {WIZARD_STEPS[currentStep - 1]}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="relative h-1 bg-[oklch(0.13_0.008_260)] rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, oklch(0.72 0.17 162), oklch(0.82 0.14 80))',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Glow effect at tip */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-3 rounded-full blur-md bg-[oklch(0.72_0.17_162/0.4)]"
            animate={{ left: `calc(${progress}% - 16px)` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-5">
          {WIZARD_STEPS.map((label, i) => {
            const stepNum = i + 1
            const isActive = stepNum === currentStep
            const isCompleted = stepNum <= highestCompletedStep
            const isClickable = stepNum <= highestCompletedStep + 1
            return (
              <button
                key={label}
                onClick={() => handleStepClick(stepNum)}
                disabled={!isClickable}
                className="flex flex-col items-center gap-2 transition-all group"
              >
                <motion.span
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-semibold transition-all duration-300
                    ${isActive
                      ? 'bg-[oklch(0.72_0.17_162)] text-[oklch(0.10_0_0)] shadow-[0_0_16px_oklch(0.72_0.17_162/0.3)]'
                      : isCompleted
                      ? 'bg-[oklch(0.65_0.16_155/0.15)] text-[oklch(0.65_0.16_155)] ring-1 ring-[oklch(0.65_0.16_155/0.3)]'
                      : isClickable
                      ? 'bg-[oklch(0.20_0.015_250)] text-[oklch(0.55_0.01_250)] group-hover:bg-[oklch(0.24_0.018_250)]'
                      : 'bg-[oklch(0.18_0.018_250)] text-[oklch(0.28_0.01_260)] cursor-not-allowed'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </motion.span>
                <span className={`text-[9px] hidden sm:block uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-[oklch(0.72_0.17_162)]'
                    : isCompleted
                    ? 'text-[oklch(0.55_0.01_250)]'
                    : 'text-[oklch(0.28_0.01_260)]'
                }`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="relative bg-[oklch(0.16_0.015_250)] border border-[oklch(0.24_0.018_250)] rounded-2xl p-6 md:p-8 mb-6 overflow-hidden">
        {/* Subtle top border accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.17_162/0.2)] to-transparent" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="btn-press focus-ring group inline-flex items-center gap-1.5 h-11 px-5 text-sm font-medium rounded-lg border border-[oklch(0.26_0.018_250)] text-[oklch(0.60_0.01_250)] transition-all hover:border-[oklch(0.30_0.008_260)] hover:text-[oklch(0.72_0.17_162)] hover:bg-[oklch(0.72_0.17_162/0.04)] disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={computing}
          className="btn-press focus-ring group inline-flex items-center gap-2 h-11 px-8 text-sm font-semibold rounded-lg bg-[oklch(0.72_0.17_162)] text-[oklch(0.10_0_0)] transition-all hover:bg-[oklch(0.68_0.18_162)] hover:shadow-[0_0_24px_oklch(0.72_0.17_162/0.25)] disabled:opacity-50"
        >
          {computing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Computing 10 methods...
            </>
          ) : currentStep === 6 ? (
            <>
              <Sparkles className="h-4 w-4" />
              Get Valuation
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
