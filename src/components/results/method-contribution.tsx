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
  asset_cost: 'oklch(0.62 0.22 330)',
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
      <div className="glass-card grain relative rounded-xl border border-[oklch(0.91_0.005_260/0.8)] overflow-hidden h-full bg-gradient-to-br from-[oklch(0.99_0.002_260)] to-[oklch(0.985_0.002_260)]">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[oklch(0.91_0.005_260/0.5)]">
          <div className="w-7 h-7 rounded-lg bg-[oklch(0.65_0.16_310/0.1)] flex items-center justify-center">
            <PieChartIcon className="w-3.5 h-3.5 text-[oklch(0.65_0.16_310)]" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Method Contribution</h3>
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
                  stroke="oklch(0.98 0.002 260)"
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
                    backgroundColor: 'white',
                    border: '1px solid oklch(0.91 0.005 260)',
                    color: 'oklch(0.25 0.02 260)',
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
                <span className="text-[10px] text-[oklch(0.45 0.01 260)] truncate">{d.name}</span>
                <span className="text-[10px] font-medium text-[oklch(0.70_0.005_80)] ml-auto tabular-nums">{d.value}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[oklch(0.91 0.005 260)] text-center">
            <span className="text-[10px] text-[oklch(0.50 0.01 260)] uppercase tracking-wider">Composite</span>
            <p className="text-sm font-bold text-[oklch(0.62 0.22 330)] tabular-nums">{formatINR(compositeValue)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
