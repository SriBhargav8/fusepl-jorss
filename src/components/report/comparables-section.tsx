'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { findComparables } from '@/lib/data/comparable-companies'
import { formatINR } from '@/lib/utils'
import type { StartupCategory, Stage } from '@/types'

interface Props {
  sector: string
  stage: string
}

export function ComparablesSection({ sector, stage }: Props) {
  const comparables = findComparables(sector as StartupCategory, stage as Stage, null, 5)

  if (comparables.length === 0) return null

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Comparable Indian Startups</CardTitle>
        <p className="text-sm text-slate-400">
          5 closest matches by sector and stage from our funding database
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 text-slate-300">Company</th>
                <th className="text-left py-2 text-slate-300">Stage</th>
                <th className="text-right py-2 text-slate-300">Last Round</th>
                <th className="text-right py-2 text-slate-300">Valuation</th>
                <th className="text-left py-2 text-slate-300">Year</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((c, i) => (
                <tr key={i} className="border-b border-slate-800 last:border-0">
                  <td className="py-2 font-medium text-white">{c.name}</td>
                  <td className="py-2 text-slate-300">{c.stage_at_round.replace(/_/g, ' ')}</td>
                  <td className="py-2 text-right text-slate-300">{formatINR(c.last_round_size_cr * 1_00_00_000)}</td>
                  <td className="py-2 text-right text-white">{formatINR(c.valuation_cr * 1_00_00_000)}</td>
                  <td className="py-2 text-slate-300">{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Source: Publicly available Indian startup funding data. Valuations are estimates based on reported rounds.
        </p>
      </CardContent>
    </Card>
  )
}
