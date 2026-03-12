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
import { Loader2 } from 'lucide-react'
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
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[11px] font-semibold text-[oklch(0.78_0.14_80)] uppercase tracking-[0.2em] mb-3">
          Step {currentStep} of 6
        </p>
        <h1 className="font-heading text-2xl sm:text-3xl text-[oklch(0.93_0.005_80)]">
          {WIZARD_STEPS[currentStep - 1]}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="relative h-1 bg-[oklch(0.15_0.008_260)] rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[oklch(0.78_0.14_80)] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between mt-4">
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
                className="flex flex-col items-center gap-1.5 transition-colors"
              >
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-medium transition-all
                    ${isActive
                      ? 'bg-[oklch(0.78_0.14_80/0.15)] text-[oklch(0.78_0.14_80)] ring-1 ring-[oklch(0.78_0.14_80/0.4)]'
                      : isCompleted
                      ? 'bg-[oklch(0.65_0.16_155/0.15)] text-[oklch(0.65_0.16_155)]'
                      : isClickable
                      ? 'bg-[oklch(0.15_0.008_260)] text-[oklch(0.45_0.01_260)] cursor-pointer'
                      : 'bg-[oklch(0.12_0.008_260)] text-[oklch(0.30_0.01_260)] cursor-not-allowed'
                    }
                  `}
                >
                  {isCompleted ? '✓' : stepNum}
                </span>
                <span className={`text-[10px] hidden sm:block ${
                  isActive
                    ? 'text-[oklch(0.78_0.14_80)]'
                    : isCompleted
                    ? 'text-[oklch(0.50_0.01_260)]'
                    : 'text-[oklch(0.30_0.01_260)]'
                }`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-[oklch(0.10_0.008_260)] border border-[oklch(0.18_0.008_260)] rounded-xl p-6 md:p-8 mb-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
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
          className="h-10 px-5 text-sm font-medium rounded-lg border border-[oklch(0.20_0.008_260)] text-[oklch(0.55_0.01_260)] transition-all hover:border-[oklch(0.30_0.008_260)] hover:text-[oklch(0.75_0.005_80)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={computing}
          className="h-10 px-7 text-sm font-semibold rounded-lg bg-[oklch(0.78_0.14_80)] text-[oklch(0.10_0_0)] transition-all hover:bg-[oklch(0.82_0.14_80)] hover:shadow-[0_0_24px_oklch(0.78_0.14_80/0.2)] active:scale-[0.98] disabled:opacity-50"
        >
          {computing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Computing 10 methods...
            </span>
          ) : currentStep === 6 ? (
            'Get Valuation'
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  )
}
