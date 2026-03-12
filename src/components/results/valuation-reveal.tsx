'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import type { ValuationResult } from '@/types'
import { formatINR } from '@/lib/utils'
import { Shield, TrendingUp, Target } from 'lucide-react'

interface Props {
  result: ValuationResult
  companyName: string
}

export function ValuationReveal({ result, companyName }: Props) {
  const confidenceLabel =
    result.confidence_score >= 70 ? 'High' :
    result.confidence_score >= 40 ? 'Medium' : 'Low'

  const confidenceColor =
    result.confidence_score >= 70 ? 'oklch(0.65 0.16 155)' :
    result.confidence_score >= 40 ? 'oklch(0.72 0.17 162)' : 'oklch(0.62 0.18 25)'

  const applicableMethods = result.methods.filter(m => m.applicable).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="relative rounded-2xl overflow-hidden">
        {/* Animated border glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[oklch(0.72_0.17_162/0.4)] via-[oklch(0.72_0.17_162/0.1)] to-[oklch(0.72_0.17_162/0.2)]" />

        {/* Inner content */}
        <div className="relative rounded-2xl bg-[oklch(0.09_0.008_260)] m-px">
          {/* Top shimmer line */}
          <div className="absolute top-0 inset-x-0 h-px">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[oklch(0.72_0.17_162/0.8)] to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
            />
          </div>

          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[oklch(0.72_0.17_162/0.05)] blur-[80px] pointer-events-none" />

          <div className="relative p-8 sm:p-10 text-center">
            {/* Pre-label */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-2"
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[oklch(0.72_0.17_162/0.4)]" />
              <span className="text-[10px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.25em]">
                Estimated Valuation
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[oklch(0.72_0.17_162/0.4)]" />
            </motion.div>

            {/* Company name */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-heading text-xl sm:text-2xl text-[oklch(0.95_0.002_250)] mb-8"
            >
              {companyName || 'Your Startup'}
            </motion.h2>

            {/* Main valuation number — dramatic reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              className="mb-3"
            >
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[oklch(0.95_0.002_250)]">
                <AnimatedCounter value={result.composite_value} formatter={formatINR} duration={1800} />
              </p>
            </motion.div>

            {/* Range */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-sm text-[oklch(0.60_0.01_250)] mb-8"
            >
              Range:{' '}
              <span className="text-[oklch(0.68_0.005_250)]">
                <AnimatedCounter value={result.composite_low} formatter={formatINR} duration={1400} />
              </span>
              <span className="mx-1.5">—</span>
              <span className="text-[oklch(0.68_0.005_250)]">
                <AnimatedCounter value={result.composite_high} formatter={formatINR} duration={1600} />
              </span>
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-[oklch(0.20_0.015_250)]"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.72_0.17_162/0.08)] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[oklch(0.72_0.17_162)]" />
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: confidenceColor }}
                >
                  {result.confidence_score}
                </span>
                <span className="text-[10px] text-[oklch(0.55_0.01_250)] uppercase tracking-wider">
                  Confidence ({confidenceLabel})
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.16_250/0.08)] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[oklch(0.65_0.16_250)]" />
                </div>
                <span className="text-lg font-bold text-[oklch(0.88_0.005_250)]">
                  {applicableMethods}
                </span>
                <span className="text-[10px] text-[oklch(0.55_0.01_250)] uppercase tracking-wider">
                  Methods Used
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.16_155/0.08)] flex items-center justify-center">
                  <Target className="w-4 h-4 text-[oklch(0.65_0.16_155)]" />
                </div>
                <span className="text-lg font-bold text-[oklch(0.88_0.005_250)]">
                  {result.monte_carlo ? '10K' : '—'}
                </span>
                <span className="text-[10px] text-[oklch(0.55_0.01_250)] uppercase tracking-wider">
                  Simulations
                </span>
              </div>
            </motion.div>

            {result.ibc_recovery_range && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.4 }}
                className="text-xs text-[oklch(0.52_0.01_250)] border-t border-[oklch(0.13_0.008_260)] pt-4 mt-6"
              >
                Downside: In insolvency, similar {result.ibc_recovery_range.sector} companies
                recovered {result.ibc_recovery_range.low}–{result.ibc_recovery_range.high}% of claims.
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
