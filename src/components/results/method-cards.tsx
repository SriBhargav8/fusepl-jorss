'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { METHOD_LABELS } from '@/lib/constants'
import type { MethodResult, MonteCarloResult } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

function confidenceBadge(confidence: number) {
  if (confidence >= 0.7) return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">High</Badge>
  if (confidence >= 0.4) return <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">Medium</Badge>
  return <Badge className="bg-slate-600/20 text-slate-400 border-slate-600/30">Low</Badge>
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
    <div className="space-y-4">
      {grouped.map((group, i) => (
        <motion.div
          key={group.approach}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white">{group.label}</CardTitle>
                <span className="text-sm font-medium text-slate-400">
                  Avg: {formatINR(approachAvg(group.methods))}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.methods.map(m => (
                <div key={m.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{METHOD_LABELS[m.method] ?? m.method}</span>
                    {confidenceBadge(m.confidence)}
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-white">{formatINR(m.value)}</span>
                    {m.method === 'dcf' && monteCarlo && (
                      <span className="text-xs text-slate-500 ml-2">
                        MC: {formatINR(monteCarlo.p10)}–{formatINR(monteCarlo.p90)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
