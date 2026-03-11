'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card className="border-2 border-amber-400/50 bg-slate-900">
      <CardHeader className="text-center pb-2">
        <p className="text-sm text-slate-400">Estimated Valuation for</p>
        <CardTitle className="text-xl text-white">{companyName || 'Your Startup'}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div>
          <p className="text-4xl font-bold tracking-tight text-white">
            {formatINR(result.composite_low)} — {formatINR(result.composite_high)}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Weighted Composite: {formatINR(result.composite_value)}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-slate-400">Confidence Score:</span>
          <span className={`text-2xl font-bold ${confidenceColor}`}>
            {result.confidence_score}/100
          </span>
          <span className={`text-sm ${confidenceColor}`}>({confidenceLabel})</span>
        </div>

        {result.ibc_recovery_range && (
          <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">
            Downside scenario: In insolvency, similar {result.ibc_recovery_range.sector} companies
            recovered {result.ibc_recovery_range.low}–{result.ibc_recovery_range.high}% of admitted claims.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
