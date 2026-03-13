'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
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

/* ─── useAnimatedCounter ────────────────────────────────────────────── */
export function useAnimatedCounter(target: number, duration = 600) {
  const [value, setValue] = useState(target)
  const prevTarget = useRef(target)

  useEffect(() => {
    if (target === prevTarget.current) return
    const from = prevTarget.current
    prevTarget.current = target
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // easeOutQuart
      setValue(Math.round(from + (target - from) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}

/* ─── Stagger variants ──────────────────────────────────────────────── */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/* ─── Celebration Particles ─────────────────────────────────────────── */
function CelebrationParticles({ active }: { active: boolean }) {
  if (!active) return null
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * 360 + (Math.random() * 20 - 10)
    const distance = 50 + Math.random() * 40
    const size = 4 + Math.random() * 4
    const hue = Math.random() > 0.5 ? 330 + Math.random() * 20 : 155 + Math.random() * 20
    const rad = (angle * Math.PI) / 180
    return (
      <motion.div
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size,
          height: size,
          background: `oklch(0.68 0.20 ${hue})`,
          left: '50%',
          top: '50%',
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
        animate={{
          x: Math.cos(rad) * distance,
          y: Math.sin(rad) * distance,
          opacity: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          delay: i * 0.03,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    )
  })

  return (
    <>
      {/* Radial gradient flash */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'radial-gradient(circle at center, oklch(0.62 0.22 330 / 0.3), transparent 70%)',
        }}
      />
      {particles}
    </>
  )
}

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

const STEP_SUBTITLES = [
  "Let's start with the basics",
  "Tell us about your people",
  "Show us the numbers",
  "How big is the opportunity?",
  "Almost there — just 2 more steps!",
  "Final step — you're at the finish line!",
]

export function WizardContainer() {
  const { currentStep, highestCompletedStep, inputs, nextStep, prevStep, goToStep, completeStep, setResult } =
    useValuationStore()
  const [direction, setDirection] = useState(1)
  const [computing, setComputing] = useState(false)
  const [celebratingStep, setCelebratingStep] = useState<number | null>(null)

  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const progress = ((currentStep - 1) / 5) * 100
  const completionPct = Math.round(((currentStep - 1) / 6) * 100)

  const triggerCelebration = useCallback((step: number) => {
    setCelebratingStep(step)
    setTimeout(() => setCelebratingStep(null), 800)
  }, [])

  const handleNext = () => {
    const error = validateStep(currentStep, inputs)
    if (error) {
      toast.error(error)
      return
    }
    completeStep(currentStep)
    triggerCelebration(currentStep)
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
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[oklch(0.62_0.22_330/0.4)]" />
          <span className="text-[10px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.25em]">
            Step {currentStep} of 6 — {completionPct}% complete
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[oklch(0.62_0.22_330/0.4)]" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl text-[oklch(0.15 0.02 260)]">
          {WIZARD_STEPS[currentStep - 1]}
        </h1>
        <p className="text-xs text-[oklch(0.45 0.02 260)] mt-1.5">
          {STEP_SUBTITLES[currentStep - 1]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="relative h-1 bg-[oklch(0.97 0.003 260)] rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, oklch(0.62 0.22 330), oklch(0.75 0.18 162))',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Glow effect at tip */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-3 rounded-full blur-md bg-[oklch(0.62_0.22_330/0.4)]"
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
            const isCelebrating = celebratingStep === stepNum
            return (
              <button
                key={label}
                onClick={() => handleStepClick(stepNum)}
                disabled={!isClickable}
                className="flex flex-col items-center gap-2 transition-all group relative"
              >
                <motion.span
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  animate={isCelebrating ? {
                    scale: [1, 1.35, 1],
                    boxShadow: [
                      '0 0 0px oklch(0.65 0.16 155 / 0)',
                      '0 0 20px oklch(0.65 0.16 155 / 0.5)',
                      '0 0 0px oklch(0.65 0.16 155 / 0)',
                    ],
                  } : {}}
                  transition={isCelebrating ? { duration: 0.5, ease: 'easeOut' } : undefined}
                  className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-semibold transition-all duration-300
                    ${isActive
                      ? 'bg-[#32373c] text-white shadow-[0_0_16px_oklch(0.62_0.22_330/0.3)]'
                      : isCompleted
                      ? 'bg-[oklch(0.65_0.16_155/0.15)] text-[oklch(0.65_0.16_155)] ring-1 ring-[oklch(0.65_0.16_155/0.3)]'
                      : isClickable
                      ? 'bg-[oklch(0.96 0.005 260)] text-[oklch(0.45 0.02 260)] group-hover:bg-[oklch(0.95 0.005 260)]'
                      : 'bg-[oklch(0.93_0.005_260)] text-[oklch(0.65 0.01 260)] cursor-not-allowed'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </motion.span>
                {/* Celebration particles on step indicator */}
                <CelebrationParticles active={isCelebrating} />
                <span className={`text-[9px] hidden sm:block uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-[oklch(0.62 0.22 330)]'
                    : isCompleted
                    ? 'text-[oklch(0.45 0.02 260)]'
                    : 'text-[oklch(0.80 0.01 260)]'
                }`}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="relative bg-gradient-to-b from-[oklch(1 0 0)] to-[oklch(0.98 0.002 260)] border border-[oklch(0.91 0.005 260)] rounded-2xl p-6 md:p-8 mb-6 shadow-[0_4px_24px_oklch(0_0_0/0.06),inset_0_1px_0_oklch(1_0_0/0.5)]">
        {/* Top border accent — warm gold */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.62_0.22_330/0.35)] to-transparent" />
        {/* Bottom edge */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.62_0.22_330/0.08)] to-transparent" />

        {/* Ambient glow orb — warm */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none -z-0"
          style={{
            background: 'radial-gradient(oklch(0.78 0.14 75 / 0.03), oklch(0.50 0.10 260 / 0.02), transparent)',
            filter: 'blur(100px)',
          }}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[1]"
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
          className="btn-press focus-ring group inline-flex items-center gap-1.5 h-11 px-5 text-sm font-medium rounded-lg border border-[oklch(0.91 0.005 260)] text-[oklch(0.45 0.02 260)] transition-all hover:border-[oklch(0.62_0.22_330/0.3)] hover:text-[oklch(0.62 0.22 330)] hover:bg-[oklch(0.62_0.22_330/0.05)] disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={computing}
          className="btn-press focus-ring group inline-flex items-center gap-2 h-11 px-8 text-sm font-semibold rounded-lg bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_0_24px_oklch(0.62_0.22_330/0.25)] disabled:opacity-50"
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
