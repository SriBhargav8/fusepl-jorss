'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDamodaranBenchmark, getSectorLabel } from '@/lib/data/sector-mapping'
import type { StartupCategory } from '@/types'

interface Props {
  sector: string
}

export function BenchmarksSection({ sector }: Props) {
  const benchmark = getDamodaranBenchmark(sector as StartupCategory)
  const sectorLabel = getSectorLabel(sector as StartupCategory)

  if (!benchmark) return null

  const rows = [
    { label: 'Unlevered Beta', value: benchmark.beta.toFixed(2) },
    { label: 'WACC (India)', value: `${(benchmark.wacc * 100).toFixed(1)}%` },
    { label: 'EV/Revenue', value: `${benchmark.ev_revenue.toFixed(1)}x` },
    { label: 'EV/EBITDA', value: benchmark.ev_ebitda !== null ? `${benchmark.ev_ebitda.toFixed(1)}x` : 'N/A' },
    { label: 'Gross Margin', value: benchmark.gross_margin !== null ? `${(benchmark.gross_margin * 100).toFixed(1)}%` : 'N/A' },
  ]

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Damodaran India Benchmarks</CardTitle>
        <p className="text-sm text-slate-400">
          Source: Damodaran India Industry Data (January 2026) — {sectorLabel}
        </p>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 text-slate-300">Metric</th>
              <th className="text-right py-2 text-slate-300">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label} className="border-b border-slate-800 last:border-0">
                <td className="py-2 text-slate-300">{row.label}</td>
                <td className="py-2 text-right font-medium text-white">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-500 mt-3">
          These benchmarks are used in DCF (WACC), Revenue Multiple, EV/EBITDA Multiple, and ESOP volatility calculations.
        </p>
      </CardContent>
    </Card>
  )
}
