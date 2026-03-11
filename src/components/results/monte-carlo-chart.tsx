'use client'

import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    { value: p25, label: 'P25', color: '#f97316' },
    { value: p50, label: 'P50', color: '#22c55e' },
    { value: p75, label: 'P75', color: '#f97316' },
    { value: p90, label: 'P90', color: '#ef4444' },
  ]

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-white">Monte Carlo Simulation</CardTitle>
          <span className="text-xs text-slate-500">
            {monteCarlo.iterations_valid.toLocaleString()} / {monteCarlo.iterations_total.toLocaleString()} valid iterations
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
              <XAxis
                dataKey="value"
                tickFormatter={(v) => formatINR(v)}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                interval="preserveStartEnd"
                stroke="#334155"
              />
              <YAxis hide />
              <Tooltip
                formatter={() => ['Relative likelihood', '']}
                labelFormatter={(v) => formatINR(v as number)}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
              />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.15}
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

        <div className="flex justify-between text-xs text-slate-500 mt-2 px-4">
          <span>P10: {formatINR(p10)}</span>
          <span>P25: {formatINR(p25)}</span>
          <span className="font-medium text-amber-400">P50: {formatINR(p50)}</span>
          <span>P75: {formatINR(p75)}</span>
          <span>P90: {formatINR(p90)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
