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
      result.confidence_score >= 40 ? 'oklch(0.62 0.22 330)' : 'oklch(0.62 0.18 25)'

  const applicableMethods = result.methods.filter(m => m.applicable).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="relative rounded-2xl overflow-hidden">
        {/* Animated border glow */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[oklch(0.62_0.22_330/0.4)] via-[oklch(0.62_0.22_330/0.1)] to-[oklch(0.62_0.22_330/0.2)]" />

        {/* Inner content */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[oklch(0.99_0.002_260)] via-[oklch(0.98_0.005_330/0.4)] to-[oklch(0.97_0.01_330/0.2)] m-px shadow-inner">
          {/* Top shimmer line */}
          <div className="absolute top-0 inset-x-0 h-px">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[oklch(0.62_0.22_330/0.8)] to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
            />
          </div>

          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[oklch(0.62_0.22_330/0.08)] blur-[100px] pointer-events-none" />

          <div className="relative p-8 sm:p-10 text-center">
            {/* Pre-label */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-3"
            >
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[oklch(0.62_0.22_330/0.3)]" />
              <span className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.3em]">
                Estimated Valuation By FUSE-PL
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[oklch(0.62_0.22_330/0.3)]" />
            </motion.div>

            {/* Company name */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-heading text-xl sm:text-3xl lg:text-4xl text-[oklch(0.15 0.02 260)] mb-4 tracking-tight"
            >
              {companyName || 'Your Startup'}
            </motion.h2>

            {/* Main valuation number — dramatic reveal */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative inline-block mb-1 w-full"
            >
              <div className="absolute -inset-4 bg-[oklch(0.62_0.22_330/0.1)] blur-2xl rounded-full" />
              <p className="relative text-[clamp(2.5rem,12vw,4.5rem)] sm:text-6xl lg:text-7xl font-black tracking-tighter text-[oklch(0.15 0.02 260)] leading-none truncate px-1">
                <AnimatedCounter value={result.composite_value} formatter={formatINR} duration={2000} />
              </p>
            </motion.div>

            {/* Range — Now below the main figure */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex justify-center mb-6 px-4"
            >
              <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3.5 py-1.5 rounded-2xl bg-[oklch(0.15_0.02_260/0.03)] border border-[oklch(0.15_0.02_260/0.05)] text-[11px] sm:text-[13px] text-[oklch(0.45 0.01 260)]">
                <span className="opacity-70">Range</span>
                <span className="font-bold text-[oklch(0.20 0.02 260)]">
                  <AnimatedCounter value={result.composite_low} formatter={formatINR} duration={1400} />
                </span>
                <span className="text-[oklch(0.15_0.02_260/0.2)] font-light">—</span>
                <span className="font-bold text-[oklch(0.20 0.02 260)]">
                  <AnimatedCounter value={result.composite_high} formatter={formatINR} duration={1600} />
                </span>
              </div>
            </motion.div>

            {/* Stats row — Upgraded UI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-[oklch(0.15_0.02_260/0.08)] px-2 sm:px-0"
            >
              <div className="group relative p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/40 border border-white/50 shadow-sm transition-all hover:bg-white/60">
                <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center mb-0.5">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[oklch(0.62 0.22 330)]" />
                  </div>
                  <span
                    className="text-sm sm:text-xl font-black tracking-tight"
                    style={{ color: confidenceColor }}
                  >
                    {result.confidence_score}
                  </span>
                  <span className="text-[7px] sm:text-[9px] font-bold text-[oklch(0.40_0.01_260)] uppercase tracking-widest text-center leading-tight">
                    Confidence
                  </span>
                </div>
              </div>

              <div className="group relative p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/40 border border-white/50 shadow-sm transition-all hover:bg-white/60">
                <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center mb-0.5">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[oklch(0.65_0.16_250)]" />
                  </div>
                  <span className="text-sm sm:text-xl font-black tracking-tight text-[oklch(0.15 0.02 260)]">
                    {applicableMethods}
                  </span>
                  <span className="text-[7px] sm:text-[9px] font-bold text-[oklch(0.40_0.01_260)] uppercase tracking-widest text-center leading-tight">
                    Methods
                  </span>
                </div>
              </div>

              <div className="group relative p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/40 border border-white/50 shadow-sm transition-all hover:bg-white/60">
                <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center mb-0.5">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-[oklch(0.65_0.16_155)]" />
                  </div>
                  <span className="text-sm sm:text-xl font-black tracking-tight text-[oklch(0.15 0.02 260)]">
                    {result.monte_carlo ? '10k' : '—'}
                  </span>
                  <span className="text-[7px] sm:text-[9px] font-bold text-[oklch(0.40_0.01_260)] uppercase tracking-widest text-center leading-tight">
                    Sims
                  </span>
                </div>
              </div>
            </motion.div>

            {result.ibc_recovery_range && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="mt-6 pt-5 border-t border-[oklch(0.15_0.02_260/0.04)]"
              >
                <p className="text-xs text-[oklch(0.50 0.01 260)] leading-relaxed max-w-2xl mx-auto">
                  <span className="font-semibold text-[oklch(0.35_0.01_260)]">Recovery Outlook:</span> In insolvency, similar {result.ibc_recovery_range.sector} companies
                  historically recovered <span className="text-[oklch(0.20_0.02_260)] font-bold">{result.ibc_recovery_range.low}–{result.ibc_recovery_range.high}%</span> of claims.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
