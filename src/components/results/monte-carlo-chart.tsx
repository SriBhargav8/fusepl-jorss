'use client'

import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts'
import type { MonteCarloResult } from '@/types'
import { formatINR } from '@/lib/utils'

interface Props {
  monteCarlo: MonteCarloResult
}

export function MonteCarloChart({ monteCarlo }: Props) {
  const { p10, p25, p50, p75, p90 } = monteCarlo
  const step = (p90 - p10) / 40
  const points: { value: number; density: number }[] = []

  for (let i = 0; i <= 40; i++) {
    const v = p10 + step * i
    const dist = Math.abs(v - p50) / (p90 - p10)
    const density = Math.exp(-8 * dist * dist)
    points.push({ value: Math.round(v), density: Math.round(density * 100) })
  }

  const percentileLines = [
    { value: p10, label: 'P10', color: '#ef4444' },
    { value: p25, label: 'P25', color: 'oklch(0.78 0.14 80)' },
    { value: p50, label: 'P50', color: 'oklch(0.65 0.16 155)' },
    { value: p75, label: 'P75', color: 'oklch(0.78 0.14 80)' },
    { value: p90, label: 'P90', color: '#ef4444' },
  ]

  return (
    <div className="rounded-xl bg-[oklch(0.10_0.008_260)] border border-[oklch(0.18_0.008_260)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[oklch(0.15_0.008_260)]">
        <h3 className="text-sm font-semibold text-[oklch(0.78_0.14_80)]">Monte Carlo Simulation</h3>
        <span className="text-[10px] text-[oklch(0.40_0.01_260)]">
          {monteCarlo.iterations_valid.toLocaleString()} / {monteCarlo.iterations_total.toLocaleString()} valid
        </span>
      </div>
      <div className="p-5">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
              <XAxis
                dataKey="value"
                tickFormatter={(v) => formatINR(v)}
                tick={{ fontSize: 10, fill: 'oklch(0.45 0.01 260)' }}
                interval="preserveStartEnd"
                stroke="oklch(0.18 0.008 260)"
              />
              <YAxis hide />
              <Tooltip
                formatter={() => ['Relative likelihood', '']}
                labelFormatter={(v) => formatINR(v as number)}
                contentStyle={{
                  backgroundColor: 'oklch(0.12 0.008 260)',
                  border: '1px solid oklch(0.22 0.008 260)',
                  color: 'oklch(0.85 0.005 80)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="density"
                stroke="oklch(0.78 0.14 80)"
                fill="oklch(0.78 0.14 80)"
                fillOpacity={0.12}
              />
              {percentileLines.map(pl => (
                <ReferenceLine
                  key={pl.label}
                  x={Math.round(pl.value)}
                  stroke={pl.color}
                  strokeDasharray="3 3"
                  label={{ value: pl.label, position: 'top', fontSize: 10, fill: pl.color }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-[10px] mt-3 px-2">
          <span className="text-[oklch(0.40_0.01_260)]">P10: {formatINR(p10)}</span>
          <span className="text-[oklch(0.45_0.01_260)]">P25: {formatINR(p25)}</span>
          <span className="font-semibold text-[oklch(0.78_0.14_80)]">P50: {formatINR(p50)}</span>
          <span className="text-[oklch(0.45_0.01_260)]">P75: {formatINR(p75)}</span>
          <span className="text-[oklch(0.40_0.01_260)]">P90: {formatINR(p90)}</span>
        </div>
      </div>
    </div>
  )
}
