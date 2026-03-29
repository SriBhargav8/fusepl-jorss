'use client'

import { motion } from 'framer-motion'
import { METHOD_LABELS } from '@/lib/constants'
import type { MethodResult, MonteCarloResult, ValuationApproach } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'
import { TrendingUp, BarChart3, Landmark, Rocket, Lock } from 'lucide-react'

const APPROACH_ICONS: Record<ValuationApproach, typeof TrendingUp> = {
  income: TrendingUp,
  market: BarChart3,
  asset_cost: Landmark,
  vc_startup: Rocket,
}

const APPROACH_ACCENT: Record<ValuationApproach, string> = {
  income: 'oklch(0.65 0.16 250)',
  market: 'oklch(0.65 0.16 155)',
  asset_cost: 'oklch(0.62 0.22 330)',
  vc_startup: 'oklch(0.65 0.16 310)',
}

function confidenceBar(confidence: number) {
  const pct = Math.round(confidence * 100)
  const color =
    confidence >= 0.7 ? 'bg-[#22c55e]' : // Green
    confidence >= 0.4 ? 'bg-[#f59e0b]' : // Amber
    'bg-[#ef4444]' // Red
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 rounded-full bg-[oklch(0.91_0.005_260)] overflow-hidden shadow-inner">
        <motion.div 
          className={`h-full rounded-full ${color} shadow-sm`} 
          initial={{ width: '0%', opacity: 0 }}
          animate={{ width: `${Math.max(pct, 4)}%`, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[10px] font-bold text-[oklch(0.40_0.01_260)] tabular-nums">{pct}%</span>
    </div>
  )
}

interface Props {
  methods: MethodResult[]
  monteCarlo: MonteCarloResult | null
  unlocked?: boolean
  approachFilter?: ValuationApproach
}

export function MethodCards({ methods, monteCarlo, unlocked, approachFilter }: Props) {
  const grouped = APPROACH_ORDER
    .filter(approach => !approachFilter || approach === approachFilter)
    .map(approach => ({
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
      {grouped.map((group, i) => {
        const Icon = APPROACH_ICONS[group.approach]
        const accent = APPROACH_ACCENT[group.approach]

        return (
          <motion.div
            key={group.approach}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="glass-card grain relative rounded-xl border border-[oklch(0.91_0.005_260/0.8)] overflow-hidden transition-all duration-300 hover:border-[oklch(0.62_0.22_330/0.3)] hover:shadow-[0_4px_24px_oklch(0_0_0/0.08)] bg-gradient-to-br from-[oklch(0.99_0.002_260)] to-[oklch(0.985_0.002_260)]">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[oklch(0.91_0.005_260/0.5)]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in oklch, ${accent} 12%, transparent)` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                  </div>
                  <h3 className="text-sm font-semibold" style={{ color: accent }}>
                    {group.label}
                  </h3>
                </div>
                {unlocked && (
                  <span className="text-xs font-medium text-[oklch(0.45 0.01 260)] tabular-nums">
                    Avg: {formatINR(approachAvg(group.methods))}
                  </span>
                )}
              </div>

              {/* Methods */}
              <div className="divide-y divide-[oklch(0.96 0.005 260)]">
                {group.methods.map(m => (
                  <div
                    key={m.method}
                    className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-[oklch(0.96 0.005 260)]"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-[oklch(0.25 0.02 260)]">
                        {METHOD_LABELS[m.method] ?? m.method}
                      </span>
                      {unlocked ? confidenceBar(m.confidence) : (
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-[oklch(0.55 0.01 260)]" />
                          <span className="text-[10px] text-[oklch(0.55 0.01 260)]">Unlock full analysis</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-sm text-[oklch(0.15 0.02 260)] tabular-nums">
                        {formatINR(m.value)}
                      </span>
                      {m.method === 'dcf' && monteCarlo && (
                        <p className="text-[10px] text-[oklch(0.50 0.01 260)] tabular-nums">
                          MC: {formatINR(monteCarlo.p10)}–{formatINR(monteCarlo.p90)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
