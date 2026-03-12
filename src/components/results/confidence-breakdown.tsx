'use client'

import type { ValuationResult } from '@/types'

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
    { label: 'Data Completeness', score: dataCompleteness, max: 30, description: `${applicable.length} of 10 methods applicable` },
    { label: 'Method Agreement', score: methodAgreement, max: 40, description: `CV: ${(cv * 100).toFixed(0)}%` },
    { label: 'Revenue Maturity', score: revenueMature, max: 20, description: hasDCF ? 'Revenue data available' : 'Limited revenue data' },
    { label: 'Data Quality', score: dataQuality, max: 10, description: 'Internal consistency' },
  ]

  return (
    <div className="rounded-xl bg-[oklch(0.10_0.008_260)] border border-[oklch(0.18_0.008_260)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[oklch(0.15_0.008_260)]">
        <h3 className="text-sm font-semibold text-[oklch(0.78_0.14_80)]">Confidence Breakdown</h3>
      </div>
      <div className="p-5 space-y-4">
        {breakdown.map(item => {
          const pct = (item.score / item.max) * 100
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[oklch(0.65_0.005_80)]">{item.label}</span>
                <span className="font-medium text-[oklch(0.85_0.005_80)]">{item.score}/{item.max}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[oklch(0.15_0.008_260)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[oklch(0.78_0.14_80)] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-[oklch(0.40_0.01_260)]">{item.description}</p>
            </div>
          )
        })}
        <div className="border-t border-[oklch(0.18_0.008_260)] pt-3 flex justify-between">
          <span className="text-sm font-medium text-[oklch(0.65_0.005_80)]">Total Confidence</span>
          <span className="text-sm font-bold text-[oklch(0.78_0.14_80)]">{result.confidence_score}/100</span>
        </div>
      </div>
    </div>
  )
}
