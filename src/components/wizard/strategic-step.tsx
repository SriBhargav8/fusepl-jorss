'use client'

import { useState, useMemo } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { PARTNERSHIP_LEVELS, PARTNERSHIP_LABELS } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ShieldCheck, AlertTriangle, Compass } from 'lucide-react'
import { useAnimatedCounter, staggerContainer, staggerItem } from './wizard-container'

function computeRiskProfile(inputs: {
  regulatory_risk: number
  revenue_concentration_pct: number | null
}): { score: number; label: string; message: string } {
  const regRisk = Number(inputs.regulatory_risk) || 0
  const revConc = Number(inputs.revenue_concentration_pct) || 0
  
  let risk = 0
  risk += (regRisk / 5) * 60
  risk += (revConc / 100) * 40
  
  const score = Math.round(Math.min(100, Math.max(0, risk)))
  if (score <= 25) return { score, label: 'Low Risk', message: 'Low risk profile — investors will love this' }
  if (score <= 50) return { score, label: 'Moderate Risk', message: 'Moderate risk — typical for most startups' }
  if (score <= 75) return { score, label: 'Elevated Risk', message: 'Elevated risk — consider building a compliance moat' }
  return { score, label: 'High Risk', message: 'High regulatory risk — strong compliance strategy needed' }
}

function getRiskColor(score: number): string {
  if (score <= 25) return 'oklch(0.65 0.18 160)' // Vibrant Mint (Stable)
  if (score <= 50) return 'oklch(0.75 0.15 100)' // Luminous Gold (Moderate)
  if (score <= 75) return 'oklch(0.72 0.12 55)' // Muted Orange (Elevated)
  return 'oklch(0.65 0.22 340)' // Vivid Rose (Critical)
}

/* ─── Risk Thermometer Hero Card ──────────────────────────────────── */
function RiskThermometerCard({ score, color, label, message }: { score: number; color: string; label: string; message: string }) {
  const animatedScore = useAnimatedCounter(score)
  const height = 180
  const fillHeight = Math.max(0, Math.min(height, (score / 100) * height))
  const totalHeight = height + 24

  return (
    <div className="glass-card grain relative rounded-xl p-4 overflow-hidden h-full flex flex-col" 
      style={{ 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))',
        border: '1px solid oklch(0.91 0.005 260 / 0.8)'
      }}
    >
      {/* Dynamic ambient glow based on score */}
      <div className="absolute inset-0 opacity-[0.03] transition-colors duration-500" 
        style={{ background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` }} 
      />
      {/* Subtle background icons */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-[0.04] pointer-events-none">
        <AlertTriangle className="w-10 h-10" /><ShieldCheck className="w-10 h-10" /><AlertTriangle className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <AnimatePresence mode="wait">
          {score <= 50 ? (
            <motion.div key="shield" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <ShieldCheck className="w-4 h-4" style={{ color }} />
            </motion.div>
          ) : (
            <motion.div key="alert" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <AlertTriangle className="w-4 h-4" style={{ color }} />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="font-heading text-sm text-[oklch(0.45 0.01 260)]">Risk Profile</span>
      </div>

      <div className="flex items-center gap-8 flex-1">
        {/* Thermometer */}
        <div className="relative shrink-0 flex flex-col items-center justify-center h-full" style={{ width: 44 }}>
          <svg width="44" height={totalHeight} viewBox={`0 0 44 ${totalHeight}`} className="overflow-visible">
            <rect x="12" y="8" width="20" height={height} rx="10" fill="oklch(0.96 0.005 260)" stroke="oklch(0.91 0.005 260 / 0.5)" strokeWidth="1" />
            <defs>
              <linearGradient id="thermo-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="oklch(0.65 0.16 155)" />
                <stop offset="40%" stopColor="oklch(0.75 0.15 100)" />
                <stop offset="70%" stopColor="oklch(0.72 0.12 55)" />
                <stop offset="100%" stopColor="oklch(0.62 0.18 25)" />
              </linearGradient>
              <clipPath id="thermo-clip">
                <motion.rect
                  x="12" width="20" rx="10"
                  initial={{ y: height + 8, height: 0 }}
                  animate={{ y: height + 8 - fillHeight, height: fillHeight }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </clipPath>
            </defs>
            <rect x="12" y="8" width="20" height={height} rx="10" fill="url(#thermo-gradient)" clipPath="url(#thermo-clip)" />
            <circle cx="22" cy={height + 14} r="12" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color}66)` }} />
          </svg>
          <motion.div
            className="absolute left-[38px] flex items-center gap-1"
            initial={{ top: height + 8 }}
            animate={{ top: height + 8 - fillHeight }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-0 h-0"
              style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: `8px solid ${color}` }}
              animate={{ x: [-2, 0, -2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Score + message */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-1 font-medium">↑ Higher = more risk</p>
          <motion.span 
            className="font-mono text-5xl font-bold tabular-nums leading-none tracking-tight block"
            style={{ 
              color,
              filter: `drop-shadow(0 0 12px ${color}33)`
            }}
          >
            {isNaN(animatedScore) ? 0 : animatedScore}
          </motion.span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45 0.01 260)] opacity-60 mt-1 block">Risk Score</span>
          <span
            className="font-heading text-sm font-bold inline-block mt-2 px-2 py-0.5 rounded w-fit"
            style={{ color, background: `color-mix(in oklch, ${color} 12%, transparent)` }}
          >
            {label}
          </span>
          <motion.p key={message} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-heading mt-1.5 leading-tight" style={{ color }}>
            {message}
          </motion.p>
        </div>
      </div>
    </div>
  )
}

export function StrategicStep() {
  const { inputs, setField } = useValuationStore()
  const riskProfile = useMemo(
    () => computeRiskProfile(inputs),
    [inputs],
  )
  const riskColor = getRiskColor(riskProfile.score)

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
      
      {/* Bento Top Row: Risk & Corporate Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-4 flex flex-col h-full">
          <RiskThermometerCard score={riskProfile.score} color={riskColor} label={riskProfile.label} message={riskProfile.message} />
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-8 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Corporate Strategy</Label>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Strategic Reach & Regulatory Moats</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.72_0.12_55/0.1)] text-[9px] font-bold text-[oklch(0.72_0.12_55)] uppercase">Multiplier Shift</span>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Partnership Maturity</Label>
              <Select value={inputs.strategic_partnerships} onValueChange={(v) => setField('strategic_partnerships', v as any)}>
                <SelectTrigger className="bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260/0.6)] text-[oklch(0.15 0.02 260)] h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PARTNERSHIP_LEVELS.map(key => (
                    <SelectItem key={key} value={key} className="text-xs">{PARTNERSHIP_LABELS[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t border-[oklch(0.91_0.005_260/0.4)]">
               <div className="flex items-center justify-between mb-2">
                 <div className="space-y-0.5">
                   <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Regulatory Complexity</Label>
                   <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-60">High complexity often yields higher barriers to entry.</p>
                 </div>
                 <span className="text-xs font-bold text-[oklch(0.72_0.12_55)]">{inputs.regulatory_risk}/5</span>
               </div>
               <Slider
                 value={[inputs.regulatory_risk]}
                 onValueChange={(v) => setField('regulatory_risk', (v as number[])[0])}
                 min={1} max={5} step={1}
               />
               <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-1.5">Drag to set complexity level</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Middle Row: Composition & Fundraising */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-7 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[oklch(0.45_0.01_260)]" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Revenue Composition</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.62_0.22_330/0.1)] text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Risk Modeling</span>
            </div>

            <div className="space-y-6 pt-1">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Concentration</Label>
                    <p className="text-[9px] text-[oklch(0.50 0.01 260)] opacity-60">Revenue from top 3 customers</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[oklch(0.72_0.12_55)]">{inputs.revenue_concentration_pct ?? 0}%</span>
                </div>
                <div className="px-1">
                  <Slider
                    value={[inputs.revenue_concentration_pct ?? 0]}
                    onValueChange={(v) => setField('revenue_concentration_pct', (v as number[])[0])}
                    min={0} max={100} step={5}
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">International Revenue</Label>
                    <p className="text-[9px] text-[oklch(0.50 0.01 260)] opacity-60">Geographic footprint & reach</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[oklch(0.72_0.12_55)]">{inputs.international_revenue_pct}%</span>
                </div>
                <div className="px-1">
                  <Slider
                    value={[inputs.international_revenue_pct]}
                    onValueChange={(v) => setField('international_revenue_pct', (v as number[])[0])}
                    min={0} max={100} step={5}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.4)]">
               <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-70 text-center">
                 Lower concentration and higher geographic spread command valuation premiums.
               </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-5 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[oklch(0.45_0.01_260)]" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Funding Strategy</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.75_0.15_100/0.1)] text-[9px] font-bold text-[oklch(0.75_0.15_100)] uppercase">Capital Req.</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Target Raise</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[oklch(0.50 0.01 260)]">₹</span>
                  <Input
                    type="number"
                    value={inputs.target_raise ?? ''}
                    onChange={(e) => setField('target_raise', e.target.value === '' ? null : parseFloat(e.target.value))}
                    placeholder="0"
                    className="bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260/0.6)] text-[oklch(0.15_0.02_260)] h-8 pl-6 rounded-lg font-mono text-xs focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Expect. Dilution</Label>
                  <span className="font-mono text-[10px] font-bold text-[oklch(0.72_0.12_55)]">{inputs.expected_dilution_pct ?? 0}%</span>
                </div>
                <Slider
                  value={[inputs.expected_dilution_pct ?? 0]}
                  onValueChange={(v) => setField('expected_dilution_pct', (v as number[])[0])}
                  min={0} max={50} step={1}
                />
              </div>
            </div>
            
            <div className="mt-auto pt-3 border-t border-[oklch(0.91_0.005_260/0.4)]">
               <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-60 italic text-center uppercase tracking-widest font-bold">
                 Strategy Conf: High
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
