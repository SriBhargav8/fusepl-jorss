'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MethodResult, ValuationApproach } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

const APPROACH_COLORS: Record<ValuationApproach, string> = {
  income: '#3b82f6',
  market: '#22c55e',
  asset_cost: '#f59e0b',
  vc_startup: '#a855f7',
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
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">Method Contribution by Approach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={approachData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
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
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-slate-400">
          Weighted Composite: {formatINR(compositeValue)}
        </p>
      </CardContent>
    </Card>
  )
}
