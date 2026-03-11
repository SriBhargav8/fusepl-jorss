'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDamodaranBenchmark, getSectorLabel } from '@/lib/data/sector-mapping'
import { formatINR } from '@/lib/utils'
import type { StartupCategory } from '@/types'

const ILLIQUIDITY_DISCOUNTS: Record<string, number> = {
  series_c_plus: 0.20,
  series_b: 0.25,
  series_a: 0.30,
  pre_series_a: 0.30,
  seed: 0.35,
  pre_seed: 0.35,
  idea: 0.35,
}

interface Props {
  sector: string
  revenue: number | null
  stage: string
}

export function ListedComparablesSection({ sector, revenue, stage }: Props) {
  const benchmark = getDamodaranBenchmark(sector as StartupCategory)
  const sectorLabel = getSectorLabel(sector as StartupCategory)

  if (!benchmark) return null

  const annualRevenue = Number(revenue) || 0
  const publicEquivalent = annualRevenue * benchmark.ev_revenue
  const discount = ILLIQUIDITY_DISCOUNTS[stage] ?? 0.30
  const adjustedValue = publicEquivalent * (1 - discount)

  const sensitivities = [0.20, 0.30, 0.40].map(d => ({
    discount: d,
    value: publicEquivalent * (1 - d),
  }))

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Listed Company Comparables</CardTitle>
        <p className="text-sm text-slate-400">
          Public market multiples from Damodaran India — {sectorLabel}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {annualRevenue > 0 ? (
          <>
            <p className="text-sm text-slate-300">
              Public companies in <strong className="text-white">{sectorLabel}</strong> trade at{' '}
              <strong className="text-white">{benchmark.ev_revenue.toFixed(1)}x EV/Revenue</strong> (Damodaran India, Jan 2026).
            </p>
            <p className="text-sm text-slate-300">
              At your revenue of <strong className="text-white">{formatINR(annualRevenue)}</strong>, a public-market-equivalent
              valuation would be <strong className="text-white">{formatINR(publicEquivalent)}</strong>.
            </p>
            <p className="text-sm text-slate-300">
              After private company illiquidity discount ({(discount * 100).toFixed(0)}% for {stage.replace(/_/g, ' ')}),
              adjusted valuation: <strong className="text-amber-400">{formatINR(adjustedValue)}</strong>.
            </p>

            <div>
              <p className="text-sm font-medium mb-2 text-white">Sensitivity — Illiquidity Discount:</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-1 text-slate-300">Discount</th>
                    <th className="text-right py-1 text-slate-300">Adjusted Valuation</th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivities.map(s => (
                    <tr key={s.discount} className="border-b border-slate-800 last:border-0">
                      <td className="py-1 text-slate-300">{(s.discount * 100).toFixed(0)}%</td>
                      <td className="py-1 text-right font-medium text-white">{formatINR(s.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">
            Listed comparables are most relevant for revenue-generating startups.
            Your sector ({sectorLabel}) trades at {benchmark.ev_revenue.toFixed(1)}x EV/Revenue in public markets.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
