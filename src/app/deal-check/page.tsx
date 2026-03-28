'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SECTOR_GROUPS, CATEGORY_SHORT_LABELS, STAGES, type StartupCategory, type Stage, type DealCheckInput, type DealCheckResult } from '@/types'
import { computeDealCheck } from '@/lib/deal-check'
import { formatINR } from '@/lib/utils'
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Sparkles, Scale, TrendingUp, Users, ArrowRight, Search } from 'lucide-react'

const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idea',
  pre_seed: 'Pre-Seed',
  seed: 'Seed',
  pre_series_a: 'Pre-Series A',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c_plus: 'Series C+',
}

const VERDICT_CONFIG = {
  green: {
    bg: 'bg-[oklch(0.65_0.16_155/0.08)]',
    border: 'border-[oklch(0.65_0.16_155/0.3)]',
    text: 'text-[oklch(0.55_0.16_155)]',
    accent: 'oklch(0.65 0.16 155)',
    Icon: CheckCircle2,
  },
  yellow: {
    bg: 'bg-[oklch(0.72_0.14_80/0.08)]',
    border: 'border-[oklch(0.72_0.14_80/0.3)]',
    text: 'text-[oklch(0.60_0.14_80)]',
    accent: 'oklch(0.72 0.14 80)',
    Icon: AlertTriangle,
  },
  red: {
    bg: 'bg-[oklch(0.62_0.18_25/0.08)]',
    border: 'border-[oklch(0.62_0.18_25/0.3)]',
    text: 'text-[oklch(0.55_0.18_25)]',
    accent: 'oklch(0.62 0.18 25)',
    Icon: XCircle,
  },
  blue: {
    bg: 'bg-[oklch(0.62_0.16_250/0.08)]',
    border: 'border-[oklch(0.62_0.16_250/0.3)]',
    text: 'text-[oklch(0.55_0.16_250)]',
    accent: 'oklch(0.62 0.16 250)',
    Icon: HelpCircle,
  },
}

export default function DealCheckPage() {
  const [input, setInput] = useState<DealCheckInput>({
    sector: 'saas_horizontal',
    stage: 'seed',
    revenue_cr: 0,
    growth_pct: 0,
    raise_cr: 0,
    ask_cr: 0,
  })
  const [result, setResult] = useState<DealCheckResult | null>(null)
  const [sectorSearch, setSectorSearch] = useState('')

  const filteredSectorGroups = useMemo(() => {
    const q = sectorSearch.toLowerCase()
    if (!q) return SECTOR_GROUPS
    return SECTOR_GROUPS
      .map(g => ({
        ...g,
        items: g.items.filter(key =>
          CATEGORY_SHORT_LABELS[key].toLowerCase().includes(q) ||
          g.group.toLowerCase().includes(q)
        ),
      }))
      .filter(g => g.items.length > 0)
  }, [sectorSearch])

  const currentSectorGroup = SECTOR_GROUPS.find(g => g.items.includes(input.sector))?.group

  const handleCheck = () => {
    const r = computeDealCheck(input)
    setResult(r)
  }

  return (
    <main className="grain relative min-h-[calc(100vh-3.5rem)] bg-[oklch(0.985_0.002_260)] py-10">
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[oklch(0.62_0.22_330/0.04)] blur-[140px] pointer-events-none" />

      <div className="relative container mx-auto px-4 max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[oklch(0.62_0.22_330/0.4)]" />
            <span className="text-[10px] font-semibold text-[oklch(0.62_0.22_330)] uppercase tracking-[0.25em]">
              Investor Tool
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[oklch(0.62_0.22_330/0.4)]" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl text-[oklch(0.15_0.02_260)]">
            Deal Check
          </h1>
          <p className="text-sm text-[oklch(0.45_0.01_260)] mt-1.5">
            Quickly validate if a startup&apos;s valuation ask is reasonable.
          </p>
        </div>

        {/* Deal Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card grain relative rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-[oklch(0.62_0.22_330/0.12)] flex items-center justify-center">
              <Scale className="w-3.5 h-3.5 text-[oklch(0.62_0.22_330)]" />
            </div>
            <h2 className="font-heading text-lg text-[oklch(0.15_0.02_260)]">Deal Parameters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Sector</Label>
              <Select
                value={input.sector}
                onValueChange={(v) => setInput({ ...input, sector: v as StartupCategory })}
              >
                <SelectTrigger className="bg-[oklch(0.98_0.002_260)] border-[oklch(0.91_0.005_260)] text-[oklch(0.20_0.02_260)] mt-1 h-10">
                  <SelectValue>
                    {currentSectorGroup && (
                      <span className="text-[oklch(0.45_0.01_260)]">{currentSectorGroup} / </span>
                    )}
                    {CATEGORY_SHORT_LABELS[input.sector]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="bg-[oklch(0.96_0.005_260)] border-[oklch(0.91_0.005_260)] max-h-[320px]">
                  <div className="px-2 pb-2 pt-1 sticky top-0 bg-[oklch(0.96_0.005_260)] z-10">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.50_0.01_260)]" />
                      <input
                        type="text"
                        placeholder="Search 139 sectors..."
                        value={sectorSearch}
                        onChange={(e) => setSectorSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="w-full h-8 pl-8 pr-3 text-xs rounded-md bg-[oklch(0.985_0.002_260)] border border-[oklch(0.91_0.005_260)] text-[oklch(0.20_0.02_260)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.62_0.22_330/0.4)]"
                      />
                    </div>
                  </div>
                  {filteredSectorGroups.map(({ group, items }) => (
                    <SelectGroup key={group}>
                      <SelectLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.62_0.22_330)] px-3 py-1.5 bg-[oklch(0.96_0.005_260)] sticky">
                        {group}
                      </SelectLabel>
                      {items.map(key => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="text-[oklch(0.25_0.02_260)] hover:bg-[oklch(0.91_0.005_260)] focus:bg-[oklch(0.91_0.005_260)] text-xs pl-5"
                        >
                          {CATEGORY_SHORT_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                  {filteredSectorGroups.length === 0 && (
                    <div className="px-3 py-4 text-xs text-[oklch(0.45_0.01_250)] text-center">No sectors match &ldquo;{sectorSearch}&rdquo;</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Stage</Label>
              <Select
                value={input.stage}
                onValueChange={(v) => setInput({ ...input, stage: v as Stage })}
              >
                <SelectTrigger className="bg-[oklch(0.98_0.002_260)] border-[oklch(0.91_0.005_260)] text-[oklch(0.20_0.02_260)] mt-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="bg-[oklch(0.96_0.005_260)] border-[oklch(0.91_0.005_260)]">
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s} className="text-[oklch(0.25_0.02_260)] hover:bg-[oklch(0.91_0.005_260)] text-xs">
                      {STAGE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Annual Revenue (Cr)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.50_0.01_260)] text-sm font-mono">₹</span>
                <Input
                  type="number"
                  value={input.revenue_cr || ''}
                  onChange={(e) => setInput({ ...input, revenue_cr: Number(e.target.value) || 0 })}
                  className="bg-[oklch(0.98_0.002_260)] border-[oklch(0.91_0.005_260)] text-[oklch(0.15_0.02_260)] pl-7 h-10"
                  placeholder="e.g., 10"
                />
              </div>
            </div>
            <div>
              <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Revenue Growth %</Label>
              <Input
                type="number"
                value={input.growth_pct || ''}
                onChange={(e) => setInput({ ...input, growth_pct: Number(e.target.value) || 0 })}
                className="bg-[oklch(0.98_0.002_260)] border-[oklch(0.91_0.005_260)] text-[oklch(0.15_0.02_260)] mt-1 h-10"
                placeholder="e.g., 80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Amount Raising (Cr)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.50_0.01_260)] text-sm font-mono">₹</span>
                <Input
                  type="number"
                  value={input.raise_cr || ''}
                  onChange={(e) => setInput({ ...input, raise_cr: Number(e.target.value) || 0 })}
                  className="bg-[oklch(0.98_0.002_260)] border-[oklch(0.91_0.005_260)] text-[oklch(0.15_0.02_260)] pl-7 h-10"
                  placeholder="e.g., 5"
                />
              </div>
            </div>
            <div>
              <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Valuation Ask (Cr)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.50_0.01_260)] text-sm font-mono">₹</span>
                <Input
                  type="number"
                  value={input.ask_cr || ''}
                  onChange={(e) => setInput({ ...input, ask_cr: Number(e.target.value) || 0 })}
                  className="bg-[oklch(0.98_0.002_260)] border-[oklch(0.91_0.005_260)] text-[oklch(0.15_0.02_260)] pl-7 h-10"
                  placeholder="e.g., 50"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCheck}
            className="btn-press focus-ring w-full inline-flex items-center justify-center gap-2 h-11 text-sm font-semibold rounded-lg bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_0_24px_oklch(0.62_0.22_330/0.25)]"
          >
            <Sparkles className="w-4 h-4" />
            Check Deal
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Verdict */}
              {(() => {
                const v = VERDICT_CONFIG[result.verdict]
                const VIcon = v.Icon
                return (
                  <div className={`rounded-xl border-2 ${v.border} ${v.bg} p-6 text-center space-y-2`}>
                    <VIcon className="w-8 h-8 mx-auto" style={{ color: v.accent }} />
                    <p className={`font-heading text-2xl font-bold ${v.text}`}>{result.label}</p>
                    <p className="text-sm text-[oklch(0.40_0.01_260)]">{result.explanation}</p>
                  </div>
                )
              })()}

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-card rounded-xl p-4 text-center">
                  <p className="text-[10px] font-semibold text-[oklch(0.50_0.01_260)] uppercase tracking-wider">Fair Value</p>
                  <p className="font-heading text-lg font-bold text-[oklch(0.15_0.02_260)] mt-1">{formatINR(result.fairValue)}</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <p className="text-[10px] font-semibold text-[oklch(0.50_0.01_260)] uppercase tracking-wider">Implied Multiple</p>
                  <p className="font-heading text-lg font-bold text-[oklch(0.15_0.02_260)] mt-1">{result.impliedMultiple.toFixed(1)}x</p>
                  <p className="text-[10px] text-[oklch(0.50_0.01_260)]">vs {result.sectorMedianMultiple.toFixed(1)}x median</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <p className="text-[10px] font-semibold text-[oklch(0.50_0.01_260)] uppercase tracking-wider">Dilution</p>
                  <p className="font-heading text-lg font-bold text-[oklch(0.15_0.02_260)] mt-1">{result.dilutionPct.toFixed(1)}%</p>
                </div>
              </div>

              {/* Negotiation Insight */}
              <div className="glass-card grain relative rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[oklch(0.62_0.22_330)]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45_0.01_260)]">Negotiation Insight</span>
                </div>
                <p className="text-sm text-[oklch(0.30_0.02_260)] leading-relaxed">{result.negotiationInsight}</p>
              </div>

              {/* Comparables */}
              {result.comparables.length > 0 && (
                <div className="glass-card grain relative rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-3.5 h-3.5 text-[oklch(0.62_0.22_330)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45_0.01_260)]">Comparable Transactions</span>
                  </div>
                  <div className="space-y-2.5">
                    {result.comparables.map((c) => (
                      <div key={c.name} className="flex justify-between items-center text-sm border-b border-[oklch(0.91_0.005_260)] pb-2.5 last:border-0">
                        <div>
                          <p className="font-medium text-[oklch(0.20_0.02_260)]">{c.name}</p>
                          <p className="text-[10px] text-[oklch(0.50_0.01_260)]">{c.sector} | {c.stage_at_round} | {c.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[oklch(0.62_0.22_330)] tabular-nums">₹{c.valuation_cr.toLocaleString('en-IN')} Cr</p>
                          {c.revenue_cr && c.revenue_cr > 0 && (
                            <p className="text-[10px] text-[oklch(0.50_0.01_260)] tabular-nums">
                              {(c.valuation_cr / c.revenue_cr).toFixed(1)}x revenue
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Tool Links */}
              <div className="mt-8 pt-6 border-t border-[oklch(0.91_0.005_260)] text-center">
                <p className="text-[10px] font-bold text-[oklch(0.62_0.22_330)] uppercase tracking-[0.2em] mb-4">Founders Ecosystem</p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a href="/valuation" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[oklch(0.91_0.005_260)] bg-white text-[12px] font-semibold text-[oklch(0.20_0.02_260)] transition-all hover:border-[oklch(0.62_0.22_330/0.4)] hover:text-[oklch(0.62_0.22_330)]">
                    Valuation Engine <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a href="/cap-table" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[oklch(0.91_0.005_260)] bg-white text-[12px] font-semibold text-[oklch(0.20_0.02_260)] transition-all hover:border-[oklch(0.62_0.22_330/0.4)] hover:text-[oklch(0.62_0.22_330)]">
                    Cap Table Simulator <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
