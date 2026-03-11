'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { calculateValuation } from '@/lib/valuation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CompanyStep } from './company-step'
import { TeamStep } from './team-step'
import { FinancialsStep } from './financials-step'
import { MarketProductStep } from './market-product-step'
import { StrategicStep } from './strategic-step'
import { ESOPCapTableStep } from './esop-captable-step'
import { toast } from 'sonner'
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

const STEP_LABELS = [
  'Company Profile',
  'Team',
  'Financials',
  'Market & Product',
  'Strategic Factors',
  'ESOP & Cap Table',
]

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
      // Run valuation
      const result = calculateValuation(inputs)
      setResult(result)
      toast.success('Valuation complete!')
    } else {
      nextStep()
    }
  }

  const handleStepClick = (step: number) => {
    if (step <= highestCompletedStep + 1) {
      goToStep(step)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-slate-800" />
        <div className="flex justify-between mt-3">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1
            const isActive = stepNum === currentStep
            const isCompleted = stepNum <= highestCompletedStep
            const isClickable = stepNum <= highestCompletedStep + 1
            return (
              <button
                key={label}
                onClick={() => handleStepClick(stepNum)}
                disabled={!isClickable}
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-amber-400'
                    : isCompleted
                    ? 'text-emerald-400 cursor-pointer'
                    : isClickable
                    ? 'text-slate-400 cursor-pointer hover:text-slate-300'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mb-1 ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/50'
                    : isCompleted
                    ? 'bg-emerald-400/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : stepNum}
                </span>
                <span className="block">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mb-6">
        <StepComponent />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8"
        >
          {currentStep === 6 ? 'Get Valuation' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
