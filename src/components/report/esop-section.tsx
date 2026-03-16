'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateESOPValue } from '@/lib/calculators/esop-valuation'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { formatINR } from '@/lib/utils'
import { clamp } from '@/lib/utils'
import type { StartupCategory } from '@/types'

interface Props {
  valuation: {
    sector: string
    esopPoolPct: number | null
    timeToLiquidityYears: number | null
  }
  compositeValue: number
}

export function ESOPSection({ valuation, compositeValue }: Props) {
  const benchmark = getDamodaranBenchmark(valuation.sector as StartupCategory)
  if (!benchmark) return null

  const esopPct = Number(valuation.esopPoolPct) ?? 10
  const timeToLiquidity = Number(valuation.timeToLiquidityYears) ?? 4
  const totalShares = 10_000_000 // Assume 1 Cr shares for per-share calc
  const volatility = clamp(benchmark.beta * 0.55, 0.40, 0.80)

  const result = calculateESOPValue({
    valuation: compositeValue,
    total_shares: totalShares,
    esop_pool_pct: esopPct,
    exercise_price: 10,
    time_to_liquidity: timeToLiquidity,
    volatility,
    risk_free_rate: 0.072,
  })

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">ESOP Valuation Estimate</CardTitle>
        <p className="text-sm text-slate-400">
          Black-Scholes model adapted for startup ESOPs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300">
          Each ESOP share (exercise price Rs 10) is estimated at{' '}
          <strong className="text-white">{formatINR(result.value_per_share)}</strong>, representing a{' '}
          <strong className="text-white">{result.return_multiple.toFixed(1)}x</strong> potential return over{' '}
          {timeToLiquidity} years.
        </p>
        <p className="text-sm text-slate-300">
          Total ESOP pool value ({esopPct}% of equity):{' '}
          <strong className="text-amber-400">{formatINR(result.total_pool_value)}</strong>
        </p>

        <div>
          <p className="text-sm font-medium mb-2 text-white">Sensitivity Analysis:</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-1 text-slate-300">Scenario</th>
                <th className="text-right py-1 text-slate-300">Volatility</th>
                <th className="text-right py-1 text-slate-300">Time</th>
                <th className="text-right py-1 text-slate-300">Value/Share</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="py-1 text-slate-300">Conservative</td>
                <td className="py-1 text-right text-slate-300">{(result.sensitivity.conservative.volatility * 100).toFixed(0)}%</td>
                <td className="py-1 text-right text-slate-300">{result.sensitivity.conservative.time}y</td>
                <td className="py-1 text-right font-medium text-white">{formatINR(result.sensitivity.conservative.value)}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-1 text-slate-300">Base Case</td>
                <td className="py-1 text-right text-slate-300">{(result.sensitivity.base.volatility * 100).toFixed(0)}%</td>
                <td className="py-1 text-right text-slate-300">{result.sensitivity.base.time}y</td>
                <td className="py-1 text-right font-medium text-white">{formatINR(result.sensitivity.base.value)}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-300">Optimistic</td>
                <td className="py-1 text-right text-slate-300">{(result.sensitivity.optimistic.volatility * 100).toFixed(0)}%</td>
                <td className="py-1 text-right text-slate-300">{result.sensitivity.optimistic.time}y</td>
                <td className="py-1 text-right font-medium text-white">{formatINR(result.sensitivity.optimistic.value)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500 border-t border-slate-800 pt-2">
          Disclaimer: This is an indicative estimate using Black-Scholes. Actual ESOP value depends
          on exit timing, dilution, and liquidity preferences.
        </p>
      </CardContent>
    </Card>
  )
}
