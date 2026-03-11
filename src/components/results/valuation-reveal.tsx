'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    result.confidence_score >= 70 ? 'text-green-400' :
    result.confidence_score >= 40 ? 'text-amber-400' : 'text-red-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-amber-400/50 bg-slate-900">
        <CardHeader className="text-center pb-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Estimated Valuation for
          </motion.p>
          <CardTitle className="text-xl text-white">{companyName || 'Your Startup'}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p className="text-4xl font-bold tracking-tight text-white">
              <AnimatedCounter value={result.composite_low} formatter={formatINR} duration={1200} />
              {' — '}
              <AnimatedCounter value={result.composite_high} formatter={formatINR} duration={1500} />
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Weighted Composite: <AnimatedCounter value={result.composite_value} formatter={formatINR} duration={1300} />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="text-sm text-slate-400">Confidence Score:</span>
            <span className={`text-2xl font-bold ${confidenceColor}`}>
              {result.confidence_score}/100
            </span>
            <span className={`text-sm ${confidenceColor}`}>({confidenceLabel})</span>
          </motion.div>

          {result.ibc_recovery_range && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="text-xs text-slate-500 border-t border-slate-800 pt-3"
            >
              Downside scenario: In insolvency, similar {result.ibc_recovery_range.sector} companies
              recovered {result.ibc_recovery_range.low}–{result.ibc_recovery_range.high}% of admitted claims.
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
