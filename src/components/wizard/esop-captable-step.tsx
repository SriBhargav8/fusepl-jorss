'use client'

import { useMemo, useState, useRef } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_ESOP_PCT } from '@/lib/constants'
import { Slider } from '@/components/ui/slider'
import { SkipForward, PieChart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAnimatedCounter, staggerContainer, staggerItem } from './wizard-container'

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

function CapTableRing({ percentage, entries }: {
  percentage: number
  entries: { name: string; percentage: number; share_class?: string }[]
}) {
  const animatedPct = useAnimatedCounter(Math.round(percentage))
  const radius = 48
  const cx = 60, cy = 60
  const circumference = 2 * Math.PI * radius
  const hasTriggered100 = useRef(false)
  const [showPulse, setShowPulse] = useState(false)

  if (percentage === 100 && !hasTriggered100.current) {
    hasTriggered100.current = true
    setTimeout(() => setShowPulse(true), 100)
    setTimeout(() => setShowPulse(false), 800)
  } else if (percentage !== 100) {
    hasTriggered100.current = false
  }

  const SHARE_CLASS_COLORS: Record<string, string> = {
    common: 'oklch(0.65 0.16 250)',     // Indigo
    preference: 'oklch(0.65 0.16 155)', // Emerald
    esop: 'oklch(0.62 0.22 330)',       // Pink
    advisory: 'oklch(0.75 0.18 80)',    // Amber
  }

  const color = percentage === 100
    ? 'oklch(0.65 0.16 155)'
    : percentage >= 90 && percentage <= 110
    ? 'oklch(0.72 0.14 80)'
    : percentage > 100
    ? 'oklch(0.62 0.18 25)'
    : 'oklch(0.50 0.01 260)'

  let cumulativeOffset = 0
  const sortedEntries = [...entries].sort((a, b) => b.percentage - a.percentage)
  
  const segments = sortedEntries.filter(e => e.percentage > 0).map((entry, i) => {
    const segPct = Math.min(entry.percentage, 100) / 100
    const segLength = segPct * circumference
    const rotation = (cumulativeOffset / circumference) * 360 - 90
    cumulativeOffset += segLength
    
    // Assign colors precisely — prioritizing share class over position
    const baseColor = entry.share_class && SHARE_CLASS_COLORS[entry.share_class]
      ? SHARE_CLASS_COLORS[entry.share_class]
      : CHART_COLORS[i % CHART_COLORS.length]

    return { ...entry, offset: circumference - segLength, segLength, rotation, color: baseColor, index: i }
  })

  return (
    <div className="glass-card grain relative rounded-xl p-5 flex flex-col items-center overflow-hidden h-full" style={{ background: 'linear-gradient(135deg, oklch(0.98 0.003 260 / 0.8), oklch(0.97 0.003 260 / 0.6))' }}>
      {/* Subtle background icons */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-[0.04] pointer-events-none">
        <PieChart className="w-10 h-10" /><PieChart className="w-10 h-10" /><PieChart className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-2 mb-3 self-start">
        <PieChart className="w-4 h-4 text-[oklch(0.62 0.22 330)]" />
        <span className="font-heading text-sm text-[oklch(0.45 0.01 260)]">Ownership Distribution</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[220px]">
        <div className="relative w-full flex justify-center">
          <svg width="100%" height="auto" viewBox="0 0 120 120" className="max-w-[200px] overflow-visible">
            {/* Decorative outer dashed ring */}
            <circle cx={cx} cy={cy} r={radius + 8} fill="none" stroke="oklch(0.80 0.01 260 / 0.4)" strokeWidth="1" strokeDasharray="4 8" />
            {/* Background circle */}
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="oklch(0.96 0.005 260)" strokeWidth="8" />
            {/* Multi-segment arcs */}
            {segments.map((seg) => (
              <motion.circle
                key={seg.index}
                cx={cx} cy={cy} r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${seg.segLength} ${circumference - seg.segLength}`}
                transform={`rotate(${seg.rotation} ${cx} ${cy})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: seg.index * 0.08 }}
                style={{ filter: percentage === 100 ? `drop-shadow(0 0 8px ${seg.color})` : undefined }}
              />
            ))}
            {/* Single-color fallback when no entries */}
            {segments.length === 0 && percentage > 0 && (
              <motion.circle
                cx={cx} cy={cy} r={radius}
                fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - Math.min(percentage, 120) / 100)}
                transform={`rotate(-90 ${cx} ${cy})`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - Math.min(percentage, 120) / 100) }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-mono text-2xl font-bold tabular-nums ${percentage === 100 ? 'text-gold-gradient' : ''}`} style={percentage !== 100 ? { color } : undefined}>
              {animatedPct}%
            </span>
          </div>
        </div>
      </div>
      {/* Status message */}
      <p className="text-xs font-heading mt-3 text-center" style={{ color }}>
        {percentage === 100 ? 'Perfect — adds up to 100%'
          : percentage > 100 ? `Over-allocated by ${(percentage - 100).toFixed(1)}%`
          : percentage >= 90 ? 'Almost there!'
          : percentage > 0 ? `${(100 - percentage).toFixed(1)}% unallocated`
          : 'Add shareholders below'}
      </p>
      {/* Legend */}
      {segments.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
          {segments.map((seg) => (
            <div key={seg.index} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
              <span className="text-[10px] text-[oklch(0.45 0.01 260)]">{seg.name || 'Unnamed'} ({seg.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ESOPCapTableStep() {
  const { inputs, setField } = useValuationStore()
  const defaultEsop = DEFAULT_ESOP_PCT[inputs.stage] ?? 10

  const capEntries = useMemo(() => {
    const raw = inputs.current_cap_table || []
    const explicit = raw.map(e => ({ 
      name: e.name || 'Unnamed', 
      percentage: e.percentage,
      share_class: e.share_class 
    }))
    
    // Inject ESOP Pool from Strategy if not explicitly in table
    const hasEsopRow = raw.some(r => r.share_class === 'esop')
    const poolPct = inputs.esop_pool_pct ?? 0
    if (!hasEsopRow && poolPct > 0) {
      explicit.push({ 
        name: 'ESOP Pool', 
        percentage: poolPct, 
        share_class: 'esop' 
      })
    }
    return explicit
  }, [inputs.current_cap_table, inputs.esop_pool_pct])

  const capTableTotal = useMemo(() => {
    return capEntries.reduce((s, e) => s + e.percentage, 0)
  }, [capEntries])

  const SHARE_CLASS_COLORS: Record<string, string> = {
    common: 'oklch(0.65 0.16 250)',     // Indigo
    preference: 'oklch(0.65 0.16 155)', // Emerald
    esop: 'oklch(0.62 0.22 330)',       // Pink
    advisory: 'oklch(0.75 0.18 80)',    // Amber
  }

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
      
      {/* Bento Top Row: Distribution & Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-5 flex flex-col h-full">
           <CapTableRing percentage={capTableTotal} entries={capEntries} />
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-7 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Equity Strategy</Label>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Retention Pool & Exit Horizon</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.62_0.22_330/0.1)] text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Dilution Impact</span>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.78_0.005_250)]">ESOP Pool (%)</Label>
                    <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-60">Typical for {inputs.stage.replace(/_/g, ' ')}: {defaultEsop}%</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[oklch(0.62 0.22 330)]">{inputs.esop_pool_pct ?? defaultEsop}%</span>
                </div>
                <Slider
                  value={[inputs.esop_pool_pct ?? defaultEsop]}
                  onValueChange={(v) => setField('esop_pool_pct', Array.isArray(v) ? v[0] : v)}
                  min={0} max={30} step={1}
                />
                <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-1.5">Drag to adjust ESOP percentage</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.78_0.005_250)]">Time to Liquidity</Label>
                    <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-60">Years until projected exit event.</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[oklch(0.62 0.22 330)]">{inputs.time_to_liquidity_years ?? 4} Yrs</span>
                </div>
                <Slider
                  value={[inputs.time_to_liquidity_years ?? 4]}
                  onValueChange={(v) => setField('time_to_liquidity_years', Array.isArray(v) ? v[0] : v)}
                  min={1} max={15} step={1}
                />
                <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-1.5">Drag to set projected exit years</p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.4)] flex items-center gap-2.5">
               <SkipForward className="w-3.5 h-3.5 text-[oklch(0.62 0.22 330)] shrink-0 opacity-60" />
               <p className="text-[10px] text-[oklch(0.45_0.01_260)] opacity-70 italic leading-tight">
                 Feel free to skip. We use stage-based benchmarks to calibrate your per-share value.
               </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Bottom Row: Cap Table Ledger */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Shareholder Ledger</span>
            <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Institutional distribution of ownership.</p>
          </div>
          <button
            onClick={() => {
              const current = inputs.current_cap_table || []
              if (current.length < 10) {
                setField('current_cap_table', [
                  ...current,
                  { name: '', percentage: 0, share_class: 'common' as const },
                ])
              }
            }}
            className="text-[10px] font-bold uppercase bg-white border border-[oklch(0.91_0.005_260)] hover:border-[oklch(0.62_0.22_330/0.4)] px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            + Add Shareholder
          </button>
        </div>

        {inputs.current_cap_table && inputs.current_cap_table.length > 0 ? (
          <div className="space-y-1.5 pt-2">
            <div className="grid grid-cols-12 gap-4 text-[9px] text-[oklch(0.45_0.01_250)] font-bold uppercase tracking-widest px-3 mb-2 opacity-50">
              <span className="col-span-5">Entity / Name</span>
              <span className="col-span-3">Stake %</span>
              <span className="col-span-3">Share Class</span>
              <span className="col-span-1"></span>
            </div>
            {inputs.current_cap_table.map((entry, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-center p-1 rounded-lg hover:bg-[oklch(0.15_0.02_260/0.02)] transition-colors">
                <div className="col-span-5 flex items-center gap-2">
                  <div 
                    className="w-2 h-6 rounded-sm shrink-0" 
                    style={{ background: SHARE_CLASS_COLORS[entry.share_class] || 'oklch(0.50 0.01 260)' }}
                  />
                  <Input
                    value={entry.name}
                    onChange={(e) => {
                      const updated = [...inputs.current_cap_table!]
                      updated[idx] = { ...updated[idx], name: e.target.value }
                      setField('current_cap_table', updated)
                    }}
                    placeholder="E.g. Founders"
                    className="bg-white/50 border-[oklch(0.91 0.005 260/0.6)] text-[oklch(0.15 0.02 260)] text-xs h-8 pl-2.5 rounded-md focus-visible:ring-0"
                  />
                </div>
                <div className="col-span-3">
                  <div className="relative">
                    <Input
                      type="number"
                      value={entry.percentage || ''}
                      onChange={(e) => {
                        const updated = [...inputs.current_cap_table!]
                        updated[idx] = { ...updated[idx], percentage: parseFloat(e.target.value) || 0 }
                        setField('current_cap_table', updated)
                      }}
                      min={0} max={100}
                      className="bg-white/50 border-[oklch(0.91 0.005 260/0.6)] text-[oklch(0.15 0.02 260)] text-xs h-8 pr-6 rounded-md focus-visible:ring-0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[oklch(0.50 0.01 260)]">%</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <select
                    value={entry.share_class}
                    onChange={(e) => {
                      const updated = [...inputs.current_cap_table!]
                      updated[idx] = { ...updated[idx], share_class: e.target.value as any }
                      setField('current_cap_table', updated)
                    }}
                    className="w-full bg-white/50 border-[oklch(0.91 0.005 260/0.6)] text-[oklch(0.15 0.02 260)] text-[10px] font-bold h-8 rounded-md px-2 outline-none"
                  >
                    <option value="common">Common</option>
                    <option value="preference">Preference</option>
                    <option value="advisory">Advisory</option>
                  </select>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => {
                      const updated = inputs.current_cap_table!.filter((_, i) => i !== idx)
                      setField('current_cap_table', updated.length > 0 ? updated : null)
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400/60 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center bg-[oklch(0.15_0.02_260/0.02)] border border-dashed border-[oklch(0.91_0.005_260)] rounded-xl group cursor-pointer"
            onClick={() => {
              setField('current_cap_table', [
                { name: 'Founders', percentage: 100 - (inputs.esop_pool_pct ?? 0), share_class: 'common' },
                { name: 'ESOP Pool', percentage: inputs.esop_pool_pct ?? 0, share_class: 'esop' }
              ])
            }}
          >
             <PieChart className="w-8 h-8 text-[oklch(0.62 0.22 330)] opacity-40 mb-3 group-hover:scale-110 transition-transform" />
             <p className="text-[11px] text-[oklch(0.15 0.02 260)] font-bold">Initialize Cap Table</p>
             <p className="text-[9px] text-[oklch(0.45 0.01 260)] opacity-60 mt-1">Founders + ESOP Pool will be added automatically.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
