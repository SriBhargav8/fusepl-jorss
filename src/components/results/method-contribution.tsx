'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { MethodResult, ValuationApproach } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

const APPROACH_COLORS: Record<ValuationApproach, string> = {
  income: 'oklch(0.65 0.16 250)',
  market: 'oklch(0.65 0.16 155)',
  asset_cost: 'oklch(0.78 0.14 80)',
  vc_startup: 'oklch(0.65 0.16 310)',
}

interface Props {
  methods: MethodResult[]
  compositeValue: number
}

export function MethodContribution({ methods, compositeValue }: Props) {
  const applicable = methods.filter(m => m.applicable && m.confidence >= 0.3)
  const totalWeight = applicable.reduce((sum, m) => sum + m.confidence, 0)

  const approachData = APPROACH_ORDER
    .map(approach => {
      const approachMethods = applicable.filter(m => m.approach === approach)
      const weight = approachMethods.reduce((sum, m) => sum + m.confidence, 0)
      const avgValue = approachMethods.length > 0
        ? approachMethods.reduce((sum, m) => sum + m.value * m.confidence, 0) / weight
        : 0
      return {
        name: APPROACH_LABELS[approach],
        value: Math.round((weight / totalWeight) * 100),
        avgValue,
        fill: APPROACH_COLORS[approach],
      }
    })
    .filter(d => d.value > 0)

  return (
    <div className="rounded-xl bg-[oklch(0.10_0.008_260)] border border-[oklch(0.18_0.008_260)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[oklch(0.15_0.008_260)]">
        <h3 className="text-sm font-semibold text-[oklch(0.78_0.14_80)]">Method Contribution</h3>
      </div>
      <div className="p-5">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={approachData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                stroke="oklch(0.08 0.008 260)"
                strokeWidth={2}
                label={({ name, value }: { name?: string; value?: number }) => `${name ?? ''}: ${value ?? 0}%`}
              >
                {approachData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, props) => {
                  const avgValue = (props as unknown as { payload: { avgValue: number } }).payload?.avgValue ?? 0
                  return [`${value}% weight (Avg: ${formatINR(avgValue)})`, '']
                }}
                contentStyle={{
                  backgroundColor: 'oklch(0.12 0.008 260)',
                  border: '1px solid oklch(0.22 0.008 260)',
                  color: 'oklch(0.85 0.005 80)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-[oklch(0.50_0.01_260)]">
          Weighted Composite: <span className="font-semibold text-[oklch(0.78_0.14_80)]">{formatINR(compositeValue)}</span>
        </p>
      </div>
    </div>
  )
}
