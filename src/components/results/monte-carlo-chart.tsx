'use client'

import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts'
import type { MonteCarloResult } from '@/types'
import { formatINR } from '@/lib/utils'
import { Activity } from 'lucide-react'

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
    { value: p10, label: 'P10', color: 'oklch(0.62 0.18 25)' },
    { value: p25, label: 'P25', color: 'oklch(0.65 0.14 60)' },
    { value: p50, label: 'P50', color: 'oklch(0.65 0.16 155)' },
    { value: p75, label: 'P75', color: 'oklch(0.65 0.14 60)' },
    { value: p90, label: 'P90', color: 'oklch(0.62 0.18 25)' },
  ]

  const percentiles = [
    { label: 'P10', value: p10, color: 'text-[oklch(0.55_0.10_25)]' },
    { label: 'P25', value: p25, color: 'text-[oklch(0.45 0.01 260)]' },
    { label: 'P50', value: p50, color: 'text-[oklch(0.62 0.22 330)] font-semibold' },
    { label: 'P75', value: p75, color: 'text-[oklch(0.45 0.01 260)]' },
    { label: 'P90', value: p90, color: 'text-[oklch(0.55_0.10_25)]' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card grain relative rounded-xl border border-[oklch(0.91_0.005_260/0.8)] overflow-hidden h-full bg-gradient-to-br from-[oklch(0.99_0.002_260)] to-[oklch(0.985_0.002_260)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[oklch(0.91_0.005_260/0.5)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[oklch(0.65_0.16_155/0.1)] flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-[oklch(0.65_0.16_155)]" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Monte Carlo Simulation</h3>
          </div>
          <span className="text-[9px] font-bold text-[oklch(0.50_0.01_260)] uppercase tracking-tighter tabular-nums opacity-60">
            {monteCarlo.iterations_valid.toLocaleString()} Valid
          </span>
        </div>
        <div className="p-5">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points} margin={{ top: 15, right: 20, bottom: 5, left: 20 }}>
                <defs>
                  <linearGradient id="mcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.22 330)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="oklch(0.62 0.22 330)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="value"
                  tickFormatter={(v) => formatINR(v)}
                  tick={{ fontSize: 10, fill: 'oklch(0.40 0.01 260)' }}
                  interval="preserveStartEnd"
                  stroke="oklch(0.15 0.008 260)"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={() => ['Relative likelihood', '']}
                  labelFormatter={(v) => formatINR(v as number)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid oklch(0.91 0.005 260)',
                    color: 'oklch(0.25 0.02 260)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    padding: '8px 12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="oklch(0.62 0.22 330)"
                  strokeWidth={2}
                  fill="url(#mcGradient)"
                />
                {percentileLines.map(pl => (
                  <ReferenceLine
                    key={pl.label}
                    x={Math.round(pl.value)}
                    stroke={pl.color}
                    strokeDasharray="4 4"
                    strokeOpacity={0.6}
                    label={{ value: pl.label, position: 'top', fontSize: 9, fill: pl.color }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Percentile pills */}
          <div className="flex justify-between mt-4 px-1">
            {percentiles.map(p => (
              <div key={p.label} className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] text-[oklch(0.50 0.01 260)] uppercase tracking-wider">{p.label}</span>
                <span className={`text-[11px] tabular-nums ${p.color}`}>{formatINR(p.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
