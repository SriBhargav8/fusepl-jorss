'use client'

import { motion } from 'framer-motion'
import { findComparables } from '@/lib/data/comparable-companies'
import { getListedComparables } from '@/lib/data/listed-comparables'
import { getSectorLabel } from '@/lib/data/sector-mapping'
import { formatINR } from '@/lib/utils'
import { CATEGORY_LABELS, STAGE_LABELS } from '@/types'
import type { StartupCategory, Stage } from '@/types'
import { Building2, TrendingUp, Scale } from 'lucide-react'

interface Props {
  sector: StartupCategory
  stage: Stage
  revenue: number
  compositeValue: number
}

export function ComparablesPreview({ sector, stage, revenue, compositeValue }: Props) {
  const comparables = findComparables(sector, stage, revenue > 0 ? revenue / 1_00_00_000 : null, 5)
  const listedComps = getListedComparables(sector)
  const sectorLabel = CATEGORY_LABELS[sector] || getSectorLabel(sector)

  if (comparables.length === 0 && listedComps.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="relative rounded-2xl overflow-hidden">
        <div className="relative rounded-xl border border-rose-100 overflow-hidden h-full bg-gradient-to-br from-[#FFF1F2] via-[#FFF5F5] to-[#FFF1F2]">
          {/* Subtle noise/texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[oklch(0.62_0.22_330/0.02)] mix-blend-overlay" />
          {/* Header */}
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[oklch(0.91_0.005_260/0.5)] mb-2">
            <div className="w-7 h-7 rounded-lg bg-[oklch(0.62_0.22_330/0.08)] flex items-center justify-center">
              <Scale className="w-3.5 h-3.5 text-[oklch(0.62 0.22 330)]" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Comparable Market</h3>
          </div>
          
          <div className="px-5 pb-5 space-y-4">
            <p className="text-[10px] text-[oklch(0.50 0.01 260)] leading-relaxed italic opacity-70">
              Analysis of {sectorLabel} market comps.
            </p>

          {/* Private Comparable Transactions */}
          {comparables.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-[oklch(0.65_0.16_155)]" />
                <span className="text-xs font-semibold text-[oklch(0.45_0.01_260)] uppercase tracking-wider">
                  Private Startup Transactions
                </span>
              </div>

              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[oklch(0.91 0.005 260)]">
                      <th className="text-left py-2 text-[oklch(0.45 0.01 260)] font-medium">Company</th>
                      <th className="text-left py-2 text-[oklch(0.45 0.01 260)] font-medium">Stage</th>
                      <th className="text-right py-2 text-[oklch(0.45 0.01 260)] font-medium">Valuation</th>
                      <th className="text-right py-2 text-[oklch(0.45 0.01 260)] font-medium hidden sm:table-cell">Revenue</th>
                      <th className="text-right py-2 text-[oklch(0.45 0.01 260)] font-medium hidden sm:table-cell">Multiple</th>
                      <th className="text-center py-2 text-[oklch(0.45 0.01 260)] font-medium">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparables.map((c, i) => {
                      const multiple = c.revenue_cr && c.revenue_cr > 0 ? c.valuation_cr / c.revenue_cr : null
                      return (
                        <tr key={i} className="border-b border-[oklch(0.91 0.005 260)] last:border-0">
                          <td className="py-2.5">
                            <span className="font-medium text-[oklch(0.20 0.02 260)]">{c.name}</span>
                            {c.city && (
                              <span className="text-[oklch(0.45_0.01_250)] ml-1.5 hidden sm:inline">({c.city})</span>
                            )}
                          </td>
                          <td className="py-2.5 text-[oklch(0.65_0.005_250)]">
                            {STAGE_LABELS[c.stage_at_round as Stage] || c.stage_at_round.replace(/_/g, ' ')}
                          </td>
                          <td className="py-2.5 text-right font-medium text-[oklch(0.62 0.22 330)]">
                            {formatINR(c.valuation_cr * 1_00_00_000)}
                          </td>
                          <td className="py-2.5 text-right text-[oklch(0.65_0.005_250)] hidden sm:table-cell">
                            {c.revenue_cr && c.revenue_cr > 0 ? formatINR(c.revenue_cr * 1_00_00_000) : '—'}
                          </td>
                          <td className="py-2.5 text-right text-[oklch(0.65_0.005_250)] hidden sm:table-cell">
                            {multiple ? `${multiple.toFixed(1)}x` : '—'}
                          </td>
                          <td className="py-2.5 text-center text-[oklch(0.45 0.01 260)]">{c.year}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Listed Comparables */}
          {listedComps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-3.5 h-3.5 text-[oklch(0.65_0.16_250)]" />
                <span className="text-xs font-semibold text-[oklch(0.45_0.01_260)] uppercase tracking-wider">
                  Public Market Benchmarks
                </span>
              </div>

              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[oklch(0.91 0.005 260)]">
                      <th className="text-left py-2 text-[oklch(0.45 0.01 260)] font-medium">Company</th>
                      <th className="text-left py-2 text-[oklch(0.45 0.01 260)] font-medium hidden sm:table-cell">Ticker</th>
                      <th className="text-right py-2 text-[oklch(0.45 0.01 260)] font-medium">Market Cap</th>
                      <th className="text-right py-2 text-[oklch(0.45 0.01 260)] font-medium">EV/Revenue</th>
                      <th className="text-right py-2 text-[oklch(0.45 0.01 260)] font-medium hidden sm:table-cell">P/E</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listedComps.slice(0, 4).map((c, i) => (
                      <tr key={i} className="border-b border-[oklch(0.91 0.005 260)] last:border-0">
                        <td className="py-2.5 font-medium text-[oklch(0.20 0.02 260)]">{c.name}</td>
                        <td className="py-2.5 text-[oklch(0.45 0.01 260)] hidden sm:table-cell">{c.ticker}</td>
                        <td className="py-2.5 text-right text-[oklch(0.65_0.005_250)]">
                          {formatINR(c.market_cap_cr * 1_00_00_000)}
                        </td>
                        <td className="py-2.5 text-right font-medium text-[oklch(0.62 0.22 330)]">
                          {c.ev_revenue.toFixed(1)}x
                        </td>
                        <td className="py-2.5 text-right text-[oklch(0.65_0.005_250)] hidden sm:table-cell">
                          {c.pe_ratio ? `${c.pe_ratio.toFixed(1)}x` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Source attribution */}
          <p className="text-[9px] text-[oklch(0.50 0.01 260)] mt-4 pt-3 border-t border-[oklch(0.91_0.005_260/0.3)] italic opacity-60">
            Sources: Indian startup data, NSE/BSE. Dec 2025 Market benchmarks.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
  )
}
