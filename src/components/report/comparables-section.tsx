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
    <div className="glass-card grain relative rounded-xl p-6 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Comparable Startups</h3>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Closest matches by sector & stage</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.62_0.22_330/0.1)] text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Market Value</span>
      </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[oklch(0.91_0.005_260/0.4)]">
                <th className="text-left py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Company</th>
                <th className="text-left py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Stage</th>
                <th className="text-right py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Last Round</th>
                <th className="text-right py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Valuation</th>
                <th className="text-left py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold pl-2">Year</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((c, i) => (
                <tr key={i} className="border-b border-[oklch(0.91_0.005_260/0.3)] last:border-0 hover:bg-[oklch(0.15_0.02_260/0.02)] transition-colors">
                  <td className="py-2.5 font-bold text-[oklch(0.15_0.02_260)] text-xs">{c.name}</td>
                  <td className="py-2.5 text-[oklch(0.45_0.01_260)] text-[10px] uppercase font-medium">{c.stage_at_round.replace(/_/g, ' ')}</td>
                  <td className="py-2.5 text-right text-[oklch(0.45_0.01_260)] font-mono text-[10px]">{formatINR(c.last_round_size_cr * 1_00_00_000)}</td>
                  <td className="py-2.5 text-right font-bold text-[oklch(0.15_0.02_260)] font-mono text-xs">{formatINR(c.valuation_cr * 1_00_00_000)}</td>
                  <td className="py-2.5 text-[oklch(0.45_0.01_260)] text-[10px] pl-2">{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-50 mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.3)] italic">
          Valuations are estimates based on reported rounds and dilutions.
        </p>
    </div>
  )
}
