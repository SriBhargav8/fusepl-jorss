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
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Investor Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            No exact matches in our database for your profile. This is common for niche sectors
            or very early-stage companies. Browse all investors at our advisory service.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Top Investor Matches</CardTitle>
        <p className="text-sm text-slate-400">
          Based on your profile — {sector.replace(/_/g, ' ')}, {stage.replace(/_/g, ' ')} stage
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 text-slate-300">Investor</th>
                <th className="text-left py-2 text-slate-300">Type</th>
                <th className="text-right py-2 text-slate-300">Check Size</th>
                <th className="text-left py-2 text-slate-300">Why Matched</th>
              </tr>
            </thead>
            <tbody>
              {matches.slice(0, 5).map((m, i) => (
                <tr key={i} className="border-b border-slate-800 last:border-0">
                  <td className="py-2 font-medium text-white">{m.investor.name}</td>
                  <td className="py-2 text-slate-300">{m.investor.type.toUpperCase()}</td>
                  <td className="py-2 text-right text-slate-300">
                    {formatINR(m.investor.check_size_min_cr * 1_00_00_000)}–{formatINR(m.investor.check_size_max_cr * 1_00_00_000)}
                  </td>
                  <td className="py-2 text-slate-400">{m.reasons.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Disclaimer: Investor suggestions are based on publicly available investment preferences.
          Introductions are not guaranteed.
        </p>
      </CardContent>
    </Card>
  )
}
