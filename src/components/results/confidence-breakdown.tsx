'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">What Drove Your Confidence Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {breakdown.map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">{item.label}</span>
              <span className="font-medium text-white">{item.score}/{item.max}</span>
            </div>
            <Progress value={(item.score / item.max) * 100} className="h-2" />
            <p className="text-xs text-slate-500">{item.description}</p>
          </div>
        ))}
        <div className="border-t border-slate-800 pt-3 flex justify-between font-medium">
          <span className="text-slate-300">Total Confidence</span>
          <span className="text-amber-400">{result.confidence_score}/100</span>
        </div>
      </CardContent>
    </Card>
  )
}
