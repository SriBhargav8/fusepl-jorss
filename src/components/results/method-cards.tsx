'use client'

import { motion } from 'framer-motion'
import { METHOD_LABELS } from '@/lib/constants'
import type { MethodResult, MonteCarloResult } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

function confidenceDot(confidence: number) {
  const color =
    confidence >= 0.7 ? 'bg-[oklch(0.65_0.16_155)]' :
    confidence >= 0.4 ? 'bg-[oklch(0.78_0.14_80)]' :
    'bg-[oklch(0.40_0.01_260)]'
  const label =
    confidence >= 0.7 ? 'High' :
    confidence >= 0.4 ? 'Medium' : 'Low'
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span className="text-[10px] text-[oklch(0.45_0.01_260)]">{label}</span>
    </span>
  )
}

interface Props {
  methods: MethodResult[]
  monteCarlo: MonteCarloResult | null
}

export function MethodCards({ methods, monteCarlo }: Props) {
  const grouped = APPROACH_ORDER.map(approach => ({
    approach,
    label: APPROACH_LABELS[approach],
    methods: methods.filter(m => m.approach === approach && m.applicable),
  })).filter(g => g.methods.length > 0)

  const approachAvg = (ms: MethodResult[]) => {
    if (ms.length === 0) return 0
    return ms.reduce((sum, m) => sum + m.value, 0) / ms.length
  }

  return (
    <div className="space-y-3">
      {grouped.map((group, i) => (
        <motion.div
          key={group.approach}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <div className="rounded-xl bg-[oklch(0.10_0.008_260)] border border-[oklch(0.18_0.008_260)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[oklch(0.15_0.008_260)]">
              <h3 className="text-sm font-semibold text-[oklch(0.78_0.14_80)]">{group.label}</h3>
              <span className="text-xs font-medium text-[oklch(0.50_0.01_260)]">
                Avg: {formatINR(approachAvg(group.methods))}
              </span>
            </div>
            <div className="divide-y divide-[oklch(0.15_0.008_260)]">
              {group.methods.map(m => (
                <div key={m.method} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[oklch(0.75_0.005_80)]">{METHOD_LABELS[m.method] ?? m.method}</span>
                    {confidenceDot(m.confidence)}
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-sm text-[oklch(0.93_0.005_80)]">{formatINR(m.value)}</span>
                    {m.method === 'dcf' && monteCarlo && (
                      <span className="text-[10px] text-[oklch(0.40_0.01_260)] ml-2">
                        MC: {formatINR(monteCarlo.p10)}–{formatINR(monteCarlo.p90)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
