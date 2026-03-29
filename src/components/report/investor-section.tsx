'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { matchInvestors } from '@/lib/matching/investor-match'
import { formatINR } from '@/lib/utils'
import type { StartupCategory, Stage } from '@/types'

interface Props {
  sector: string
  stage: string
  targetRaise: number | null
}

export function InvestorSection({ sector, stage, targetRaise }: Props) {
  // Convert target raise from Rs to Cr for the matching function
  const targetRaiseCr = targetRaise ? targetRaise / 1_00_00_000 : 10

  const matches = matchInvestors({
    sector: sector as StartupCategory,
    stage: stage as Stage,
    city: '', // No city in report context
    target_raise_cr: targetRaiseCr,
  })

  if (matches.length === 0) {
    return (
    <div className="glass-card grain relative rounded-xl p-6 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Investor Matching</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.65_0.14_200/0.1)] text-[9px] font-bold text-[oklch(0.65_0.14_200)] uppercase">Advisory Only</span>
      </div>
      <p className="text-xs text-[oklch(0.45_0.01_260)] leading-relaxed italic opacity-60">
        No exact matches in our database for your specific profile. This is typical for niche sectors or very early stages.
      </p>
    </div>
    )
  }

  return (
    <div className="glass-card grain relative rounded-xl p-6 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Top Investor Matches</h3>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">{sector.replace(/_/g, ' ')} • {stage.replace(/_/g, ' ')}</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.65_0.14_200/0.1)] text-[9px] font-bold text-[oklch(0.65_0.14_200)] uppercase">Strategic Alignment</span>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[oklch(0.91_0.005_260/0.5)]">
              <th className="text-left py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Investor</th>
              <th className="text-left py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Type</th>
              <th className="text-right py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold">Check</th>
              <th className="text-left py-2 text-[oklch(0.45_0.01_260)] uppercase tracking-tighter text-[9px] font-bold pl-3">Context</th>
            </tr>
          </thead>
          <tbody>
            {matches.slice(0, 5).map((m, i) => (
              <tr key={i} className="border-b border-[oklch(0.91_0.005_260/0.3)] last:border-0 hover:bg-[oklch(0.15_0.02_260/0.02)] transition-colors">
                <td className="py-2.5 font-bold text-[oklch(0.15_0.02_260)] text-xs">{m.investor.name}</td>
                <td className="py-2.5 text-[oklch(0.45_0.01_260)] text-[10px] uppercase font-medium">{m.investor.type}</td>
                <td className="py-2.5 text-right font-mono text-[10px] text-[oklch(0.15_0.02_260)]">
                  {formatINR(m.investor.check_size_min_cr * 1_00_00_000).replace(/\.0$/, '')}–{formatINR(m.investor.check_size_max_cr * 1_00_00_000).replace(/\.0$/, '')}
                </td>
                <td className="py-2.5 text-[oklch(0.45_0.01_260)] text-[10px] pl-3 italic opacity-60">{m.reasons.slice(0, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.3)] opacity-50">
        <p className="text-[9px] text-[oklch(0.45_0.01_260)] italic">
          Suggestions based on historical preferences. No guarantee of introduction.
        </p>
      </div>
    </div>
  )
}
