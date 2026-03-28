'use client'

import { motion } from 'framer-motion'
import type { ValuationResult } from '@/types'
import { ShieldCheck } from 'lucide-react'

interface Props {
  result: ValuationResult
}

export function ConfidenceBreakdown({ result }: Props) {
  const applicable = result.methods.filter(m => m.applicable && m.confidence >= 0.3)

  const dataCompleteness = Math.min(30, Math.round((applicable.length / 10) * 30))

  const values = applicable.map(m => m.value)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const stddev = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length)
  const cv = mean > 0 ? stddev / mean : 1
  const methodAgreement = cv < 0.2 ? 40 : cv < 0.4 ? 25 : 10

  const hasDCF = applicable.some(m => m.method === 'dcf' && m.confidence >= 0.6)
  const hasRevMultiple = applicable.some(m => m.method === 'revenue_multiple' && m.confidence >= 0.6)
  const revenueMature = hasDCF && hasRevMultiple ? 20 : hasDCF || hasRevMultiple ? 10 : 0

  const computedSubtotal = dataCompleteness + methodAgreement + revenueMature
  const dataQuality = Math.max(0, Math.min(10, result.confidence_score - computedSubtotal))

  const breakdown = [
    { label: 'Data Completeness', score: dataCompleteness, max: 30, description: `${applicable.length}/10 methods`, color: '#6366f1' }, // Indigo
    { label: 'Method Agreement', score: methodAgreement, max: 40, description: `CV ${(cv * 100).toFixed(0)}%`, color: '#22c55e' }, // Green
    { label: 'Revenue Maturity', score: revenueMature, max: 20, description: hasDCF ? 'Revenue available' : 'Limited data', color: '#db2777' }, // Pink
    { label: 'Data Quality', score: dataQuality, max: 10, description: 'Internal consistency', color: '#8b5cf6' }, // Violet
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card grain relative rounded-xl border border-[oklch(0.91_0.005_260/0.8)] overflow-hidden h-full bg-gradient-to-br from-[oklch(0.99_0.002_260)] to-[oklch(0.985_0.002_260)]">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[oklch(0.91_0.005_260/0.5)]">
          <div className="w-7 h-7 rounded-lg bg-[oklch(0.62_0.22_330/0.08)] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[oklch(0.62 0.22 330)]" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Confidence Breakdown</h3>
        </div>
        <div className="p-5 space-y-4">
          {breakdown.map((item, i) => {
            const pct = (item.score / item.max) * 100
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="space-y-1.5"
              >
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[oklch(0.40 0.01 260)]">{item.label}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold tabular-nums" style={{ color: item.color }}>
                      {item.score}
                    </span>
                    <span className="text-[10px] text-[oklch(0.50 0.01 260)]">/ {item.max}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[oklch(0.91_0.005_260)] overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: '0%', opacity: 0 }}
                    animate={{ width: `${Math.max(pct, 5)}%`, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)]">{item.description}</p>
              </motion.div>
            )
          })}

          {/* Total */}
          <div className="border-t border-[oklch(0.91 0.005 260)] pt-4 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[oklch(0.70_0.005_80)]">Total Score</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[oklch(0.62 0.22 330)]">{result.confidence_score}</span>
                <span className="text-xs text-[oklch(0.50 0.01 260)]">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
