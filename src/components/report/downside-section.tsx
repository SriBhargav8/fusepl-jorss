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
    <div className="glass-card grain relative rounded-xl p-6 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Downside Analysis</h3>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">IBC Recovery Data (IBBI)</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.62_0.22_330/0.1)] text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Sovereign Data</span>
      </div>

      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-[oklch(0.62_0.22_330/0.04)] border border-[oklch(0.62_0.22_330/0.1)]">
          <p className="text-xs text-[oklch(0.62_0.22_330)] leading-relaxed font-medium">
            In insolvency scenarios, businesses in this sector historically recovered{' '}
            <strong className="text-[oklch(0.62_0.22_330)] underline decoration-dotted">{recovery.p25}%–{recovery.p75}%</strong>{' '}
            of admitted claims.
          </p>
        </div>
        <div className="flex items-center justify-between text-[9px] text-[oklch(0.45_0.01_260)] font-bold uppercase tracking-widest opacity-60">
          <span>Sample Size: {recovery.sample_size}</span>
          <span>Max Recovery: {recovery.p75}%</span>
        </div>
        <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.3)]">
          Source: IBBI Landmark Cases Dataset. Analysis by Registered IP.
        </p>
      </div>
    </div>
  )
}
