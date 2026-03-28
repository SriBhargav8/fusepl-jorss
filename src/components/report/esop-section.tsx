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
    <div className="glass-card grain relative rounded-xl p-6 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">ESOP Valuation</h3>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Black-Scholes Modeling</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.75_0.15_100/0.1)] text-[9px] font-bold text-[oklch(0.75_0.15_100)] uppercase">Equity Value</span>
      </div>
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-[oklch(0.15_0.02_260/0.03)] border border-[oklch(0.91_0.005_260/0.5)]">
          <p className="text-xs text-[oklch(0.15_0.02_260)] leading-relaxed">
            Each ESOP share (at ₹10) is valued at{' '}
            <strong className="text-[oklch(0.15_0.02_260)]">{formatINR(result.value_per_share)}</strong>, a{' '}
            <strong className="text-[oklch(0.15_0.02_260)]">{result.return_multiple.toFixed(1)}x</strong> return over{' '}
            {timeToLiquidity} years.
          </p>
          <div className="mt-2 flex items-center justify-between pt-2 border-t border-[oklch(0.91_0.005_260/0.3)]">
            <span className="text-[10px] font-bold uppercase text-[oklch(0.45_0.01_260)]">Total Pool Value ({esopPct}%):</span>
            <span className="text-sm font-mono font-bold text-[oklch(0.75_0.15_100)]">{formatINR(result.total_pool_value)}</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)] mb-2">Sensitivity Matrix:</p>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-[oklch(0.91_0.005_260/0.5)]">
                <th className="text-left py-1.5 text-[oklch(0.45_0.01_260)] font-bold uppercase">Scenario</th>
                <th className="text-right py-1.5 text-[oklch(0.45_0.01_260)] font-bold uppercase">Vol.</th>
                <th className="text-right py-1.5 text-[oklch(0.45_0.01_260)] font-bold uppercase">Time</th>
                <th className="text-right py-1.5 text-[oklch(0.45_0.01_260)] font-bold uppercase">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[oklch(0.91_0.005_260/0.3)] last:border-0">
                <td className="py-1.5 text-[oklch(0.45_0.01_260)] font-medium italic">Conservative</td>
                <td className="py-1.5 text-right font-mono">{(result.sensitivity.conservative.volatility * 100).toFixed(0)}%</td>
                <td className="py-1.5 text-right font-mono">{result.sensitivity.conservative.time}y</td>
                <td className="py-1.5 text-right font-bold text-[oklch(0.15_0.02_260)]">{formatINR(result.sensitivity.conservative.value)}</td>
              </tr>
              <tr className="border-b border-[oklch(0.91_0.005_260/0.3)] last:border-0 bg-[oklch(0.15_0.02_260/0.01)]">
                <td className="py-1.5 text-[oklch(0.15_0.02_260)] font-bold italic">Base Case</td>
                <td className="py-1.5 text-right font-mono">{(result.sensitivity.base.volatility * 100).toFixed(0)}%</td>
                <td className="py-1.5 text-right font-mono">{result.sensitivity.base.time}y</td>
                <td className="py-1.5 text-right font-bold text-[oklch(0.15_0.02_260)]">{formatINR(result.sensitivity.base.value)}</td>
              </tr>
              <tr className="last:border-0">
                <td className="py-1.5 text-[oklch(0.45_0.01_260)] font-medium italic">Optimistic</td>
                <td className="py-1.5 text-right font-mono">{(result.sensitivity.optimistic.volatility * 100).toFixed(0)}%</td>
                <td className="py-1.5 text-right font-mono">{result.sensitivity.optimistic.time}y</td>
                <td className="py-1.5 text-right font-bold text-[oklch(0.15_0.02_260)]">{formatINR(result.sensitivity.optimistic.value)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.3)]">
          Indicative Black-Scholes modeling. Actual value depends on exit timing and dilution.
        </p>
      </div>
    </div>
  )
}
