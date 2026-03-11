'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'
import type { StartupCategory } from '@/types'

interface Props {
  sector: string
}

export function DownsideSection({ sector }: Props) {
  const recovery = getIBCRecovery(sector as StartupCategory)

  if (!recovery) return null

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Downside Analysis — IBC Recovery Data</CardTitle>
        <p className="text-sm text-slate-400">
          Based on 3,952 corporate debtor outcomes from IBBI data
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-300">
          In insolvency scenarios, companies in this sector historically
          recovered <strong className="text-white">{recovery.p25}–{recovery.p75}%</strong> of admitted claims
          (P25 to P75 range, sample size: {recovery.sample_size}).
        </p>
        <p className="text-sm text-slate-400">
          This is the worst-case scenario. Going-concern valuation (computed above) is typically
          2-5x higher than liquidation value.
        </p>
        <p className="text-xs text-slate-500 border-t border-slate-800 pt-2">
          Source: IBC valuation dataset — 190+ landmark cases analyzed, 3,952 corporate debtor outcomes.
          Built by an IBBI-registered Insolvency Professional.
        </p>
      </CardContent>
    </Card>
  )
}
