'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import type { ValuationResult } from '@/types'
import { formatINR } from '@/lib/utils'

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
    result.confidence_score >= 40 ? 'oklch(0.78 0.14 80)' : 'oklch(0.62 0.18 25)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative rounded-xl border-2 border-[oklch(0.78_0.14_80/0.3)] bg-[oklch(0.10_0.008_260)] overflow-hidden">
        {/* Gold shimmer top edge */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.14_80/0.6)] to-transparent" />

        <div className="p-6 sm:p-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-medium text-[oklch(0.45_0.01_260)] uppercase tracking-[0.15em]"
          >
            Estimated Valuation for
          </motion.p>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-heading text-xl sm:text-2xl text-[oklch(0.93_0.005_80)] mt-1 mb-6"
          >
            {companyName || 'Your Startup'}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-[oklch(0.93_0.005_80)]">
              <AnimatedCounter value={result.composite_low} formatter={formatINR} duration={1200} />
              <span className="text-[oklch(0.45_0.01_260)] mx-2">—</span>
              <AnimatedCounter value={result.composite_high} formatter={formatINR} duration={1500} />
            </p>
            <p className="text-sm text-[oklch(0.50_0.01_260)] mt-2">
              Weighted Composite:{' '}
              <span className="font-semibold text-[oklch(0.78_0.14_80)]">
                <AnimatedCounter value={result.composite_value} formatter={formatINR} duration={1300} />
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex items-center justify-center gap-3 mt-6 pt-5 border-t border-[oklch(0.18_0.008_260)]"
          >
            <span className="text-xs text-[oklch(0.45_0.01_260)] uppercase tracking-wider">Confidence</span>
            <span
              className="text-2xl font-bold"
              style={{ color: confidenceColor }}
            >
              {result.confidence_score}/100
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full border"
              style={{
                color: confidenceColor,
                borderColor: confidenceColor,
                backgroundColor: `color-mix(in oklch, ${confidenceColor} 10%, transparent)`,
              }}
            >
              {confidenceLabel}
            </span>
          </motion.div>

          {result.ibc_recovery_range && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="text-xs text-[oklch(0.40_0.01_260)] border-t border-[oklch(0.15_0.008_260)] pt-4 mt-4"
            >
              Downside scenario: In insolvency, similar {result.ibc_recovery_range.sector} companies
              recovered {result.ibc_recovery_range.low}–{result.ibc_recovery_range.high}% of admitted claims.
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
