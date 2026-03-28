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

  const fmt = (v: number | null, suffix: string, mult = 1) =>
    v != null ? `${(v * mult).toFixed(1)}${suffix}` : 'N/A'

  const rows = [
    { label: 'Unlevered Beta', value: benchmark.beta != null ? benchmark.beta.toFixed(2) : 'N/A' },
    { label: 'WACC (India)', value: fmt(benchmark.wacc, '%', 100) },
    { label: 'EV/Revenue', value: fmt(benchmark.ev_revenue, 'x') },
    { label: 'EV/EBITDA', value: fmt(benchmark.ev_ebitda, 'x') },
    { label: 'Gross Margin', value: fmt(benchmark.gross_margin, '%', 100) },
  ]

  return (
    <div className="glass-card grain relative rounded-xl p-6 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Market Benchmarks</h3>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Damodaran India — {sectorLabel}</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.65_0.14_200/0.1)] text-[9px] font-bold text-[oklch(0.65_0.14_200)] uppercase">Public Data</span>
      </div>

      <div className="flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[oklch(0.91_0.005_260/0.4)]">
              <th className="text-left py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Metric</th>
              <th className="text-right py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label} className="border-b border-[oklch(0.91_0.005_260/0.3)] last:border-0 hover:bg-[oklch(0.15_0.02_260/0.02)] transition-colors">
                <td className="py-2.5 text-xs text-[oklch(0.15_0.02_260)] font-medium">{row.label}</td>
                <td className="py-2.5 text-right font-mono text-sm text-[oklch(0.15_0.02_260)] font-bold">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-[oklch(0.45_0.01_260)] opacity-50 mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.3)] italic">
        Used in DCF (WACC), Multiples, and Volatility modeling.
      </p>
    </div>
  )
}
