'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { MethodResult, ValuationApproach } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'
import { PieChartIcon } from 'lucide-react'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-xl bg-[oklch(0.10_0.008_260)] border border-[oklch(0.18_0.008_260)] overflow-hidden h-full">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[oklch(0.15_0.008_260)]">
          <div className="w-7 h-7 rounded-lg bg-[oklch(0.65_0.16_310/0.1)] flex items-center justify-center">
            <PieChartIcon className="w-3.5 h-3.5 text-[oklch(0.65_0.16_310)]" />
          </div>
          <h3 className="text-sm font-semibold text-[oklch(0.78_0.14_80)]">Method Contribution</h3>
        </div>
        <div className="p-5">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={approachData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  dataKey="value"
                  stroke="oklch(0.09 0.008 260)"
                  strokeWidth={3}
                >
                  {approachData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, props) => {
                    const avgValue = (props as unknown as { payload: { avgValue: number } }).payload?.avgValue ?? 0
                    return [`${value}% weight (${formatINR(avgValue)})`, '']
                  }}
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0.008 260)',
                    border: '1px solid oklch(0.22 0.008 260)',
                    color: 'oklch(0.85 0.005 80)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    padding: '8px 12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {approachData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: d.fill }}
                />
                <span className="text-[10px] text-[oklch(0.55_0.01_260)] truncate">{d.name}</span>
                <span className="text-[10px] font-medium text-[oklch(0.70_0.005_80)] ml-auto tabular-nums">{d.value}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[oklch(0.15_0.008_260)] text-center">
            <span className="text-[10px] text-[oklch(0.40_0.01_260)] uppercase tracking-wider">Composite</span>
            <p className="text-sm font-bold text-[oklch(0.78_0.14_80)] tabular-nums">{formatINR(compositeValue)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
