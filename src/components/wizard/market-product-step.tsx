'use client'

import { useMemo } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { DEV_STAGES, DEV_STAGE_LABELS, COMPETITIVE_ADVANTAGES, COMPETITIVE_ADVANTAGE_LABELS } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'
import { Info, Shield, ShieldCheck, Target } from 'lucide-react'
import { useAnimatedCounter, staggerContainer, staggerItem } from './wizard-container'

const ADVANTAGE_DESCRIPTIONS: Record<string, string> = {
  network_effects: 'Value increases as more users join — think WhatsApp or LinkedIn',
  proprietary_tech: 'Unique technology that competitors cannot easily replicate',
  brand: 'Strong brand recognition that drives customer loyalty',
  patents_ip: 'Protected intellectual property through patents or trade secrets',
  regulatory: 'Regulatory approvals or licenses that create barriers to entry',
  data_moat: 'Proprietary data assets that improve your product over time',
  switching_costs: 'High cost or effort for customers to switch to competitors',
  economies_of_scale: 'Cost advantages that grow as you scale production',
  first_mover: 'Early market entry advantage with established customer base',
  talent: 'Exceptional team that is difficult to replicate',
  distribution: 'Unique distribution channels or partnerships',
  community: 'Strong user community that drives organic growth',
  platform: 'Platform effects where third parties build on top of your product',
  none: 'No specific competitive advantages identified',
}

function computeMoatScore(advantages: string[] | null, patents: number | null): number {
  const advs = Array.isArray(advantages) ? advantages : []
  const patentCount = Number(patents) || 0
  
  // If 'none' is explicitly selected or no advantages, only patents count
  if (advs.includes('none') || advs.length === 0) {
    return Math.min(20, patentCount * 5)
  }

  // Filter out 'none' just in case of data inconsistency
  const realAdvs = advs.filter(a => a !== 'none')
  if (realAdvs.length === 0) return Math.min(20, patentCount * 5)

  const advScore = Math.min(80, realAdvs.length * 12)
  const patentScore = Math.min(20, patentCount * 5)
  return Math.min(100, advScore + patentScore)
}

function getMoatColor(score: number): string {
  if (score >= 75) return 'oklch(0.65 0.18 160)' // Vibrant Mint
  if (score >= 45) return 'oklch(0.75 0.15 100)' // Luminous Gold
  return 'oklch(0.65 0.22 340)' // Vivid Rose
}

function getMoatMessage(score: number): string {
  if (score >= 75) return 'Fortress-level moat — very defensible'
  if (score >= 50) return 'Strong defenses — hard to compete with'
  if (score >= 25) return 'Building moats — keep stacking advantages'
  if (score > 0) return 'Early moat — consider more defensibility layers'
  return 'No moats yet — what makes you hard to copy?'
}

/* ─── Concentric Shield Rings ──────────────────────────────────────── */
function ConcentricShieldRings({ score, color }: { score: number; color: string }) {
  const animatedScore = useAnimatedCounter(score)
  const cx = 70, cy = 70
  const rings = [
    { r: 55, threshold: 33 },
    { r: 40, threshold: 66 },
    { r: 25, threshold: 90 },
  ]

  return (
    <div className="glass-card grain relative rounded-xl p-4 overflow-hidden h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      {/* Dynamic ambient glow based on score */}
      <div className="absolute inset-0 opacity-[0.03] transition-colors duration-500" 
        style={{ background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` }} 
      />
      {/* Subtle Shield icons */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-[0.04] pointer-events-none">
        <Shield className="w-10 h-10" /><Shield className="w-10 h-10" /><Shield className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-[oklch(0.65_0.14_200)]" />
        <span className="font-heading text-sm text-[oklch(0.45 0.01 260)]">Moat Strength</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[180px]">
        <div className="relative w-full max-w-[220px] aspect-square">
          <svg width="100%" height="100%" viewBox="0 0 140 140" className="overflow-visible">
            {rings.map(({ r, threshold }, i) => {
              const circumference = 2 * Math.PI * r
              const active = score >= threshold
              const fillPct = active ? 1 : score >= threshold - 33 ? (score - (threshold - 33)) / 33 : 0

              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.91 0.005 260)" strokeWidth={i === 0 ? 5 : i === 1 ? 6 : 7} />
                  <motion.circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={active ? color : `color-mix(in oklch, ${color} 50%, oklch(0.80 0.01 260))`}
                    strokeWidth={i === 0 ? 5 : i === 1 ? 6 : 7}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - fillPct) }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15, delay: i * 0.1 }}
                    style={active ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
                  />
                </g>
              )
            })}
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <ShieldCheck className="w-8 h-8" style={{ color }} />
          </div>
        </div>
      </div>
        <div className="text-center mt-4">
          <motion.span 
            className={`font-mono text-4xl font-bold tabular-nums block leading-none`} 
            style={{ 
              color,
              filter: `drop-shadow(0 0 12px ${color}33)`
            }}
          >
            {isNaN(animatedScore) ? 0 : animatedScore}%
          </motion.span>
          <span className="text-[9px] font-medium uppercase tracking-widest text-[oklch(0.45 0.01 260)] opacity-60">Moat Strength</span>
        </div>
      <motion.p key={getMoatMessage(score)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-heading text-center mt-1" style={{ color }}>
        {getMoatMessage(score)}
      </motion.p>
    </div>
  )
}

/* ─── IP Assets Card ───────────────────────────────────────────────── */
function IPAssetsCard({ count, onValueChange }: { count: number, onValueChange: (v: number) => void }) {
  const animatedCount = useAnimatedCounter(count)

  return (
    <div className="glass-card grain relative rounded-xl p-5 space-y-4 h-full flex flex-col"
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[oklch(0.45_0.01_260)]" />
           <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">IP Assets</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.75_0.15_100/0.1)] text-[9px] font-bold text-[oklch(0.75_0.15_100)] uppercase">Exit Value</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 py-4">
         <motion.span 
           className="text-5xl font-mono font-bold tabular-nums text-[oklch(0.15_0.02_260)] leading-none"
           style={{ filter: 'drop-shadow(0 0 12px oklch(0.15 0.02 260 / 0.1))' }}
         >
           {isNaN(animatedCount) ? 0 : animatedCount}
         </motion.span>
         <span className="text-[9px] font-bold uppercase text-[oklch(0.45_0.01_260)] tracking-widest mt-2 border-t border-[oklch(0.91_0.005_260/0.3)] pt-2 w-24 text-center">
           Patents Filed
         </span>
      </div>

      <div className="space-y-3 mt-auto">
         <div className="px-1">
          <Slider
            value={[Math.min(count, 20)]}
            onValueChange={(v) => onValueChange((v as number[])[0])}
            min={0} max={20} step={1}
          />
         </div>
        <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-2">Drag to adjust patent count</p>
        <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-60 italic text-center">
          Institutional protection against copycats.
        </p>
      </div>
    </div>
  )
}

export function MarketProductStep() {
  const { inputs, setField } = useValuationStore()
  const moatScore = useMemo(
    () => computeMoatScore(inputs.competitive_advantages, inputs.patents_count),
    [inputs.competitive_advantages, inputs.patents_count],
  )

  const moatColor = getMoatColor(moatScore)
  const advantageCount = inputs.competitive_advantages.filter(a => a !== 'none').length

  const toggleAdvantage = (adv: string) => {
    const current = inputs.competitive_advantages
    
    if (adv === 'none') {
      // If choosing 'none', clear everything else
      setField('competitive_advantages', ['none'])
      return
    }

    // If choosing a real advantage, ensure 'none' is removed
    const withoutNone = current.filter(a => a !== 'none')
    
    if (withoutNone.includes(adv as any)) {
      const next = withoutNone.filter(a => a !== adv)
      // If we unchecked the last real advantage, default back to 'none'? 
      // User preference: let's leave it empty so they see 0% and "No moats yet"
      setField('competitive_advantages', next)
    } else {
      setField('competitive_advantages', [...withoutNone, adv as any])
    }
  }

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
      
      {/* Bento Top Row: Moat & Market Opportunity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-5 flex flex-col h-full">
          <ConcentricShieldRings score={moatScore} color={moatColor} />
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-7 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                 <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Market Opportunity</Label>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Total Addressable Market & Maturity</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.65_0.14_200/0.1)] text-[9px] font-bold text-[oklch(0.65_0.14_200)] uppercase">TAM Impact</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                   <span className="text-[10px] font-medium text-[oklch(0.45_0.01_260)] block mb-1">TAM (Cr)</span>
                  <div className="flex items-center gap-2 bg-[oklch(0.15_0.02_260/0.02)] p-2 rounded-lg border border-[oklch(0.91_0.005_260/0.5)]">
                    <span className="text-sm font-mono text-[oklch(0.45_0.01_260)]">₹</span>
                    <Input
                      type="number" value={inputs.tam || ''}
                      onChange={(e) => setField('tam', parseInt(e.target.value) || 0)}
                      className="h-7 border-none bg-transparent text-[oklch(0.15_0.02_260)] font-mono text-lg font-bold focus-visible:ring-0 px-0"
                      placeholder="5000"
                    />
                    <span className="text-[10px] font-bold text-[oklch(0.45_0.01_260)] ml-auto">CR</span>
                  </div>
                </div>
                <div className="flex-1">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)] block mb-1">Stage</Label>
                   <Select value={inputs.dev_stage} onValueChange={(v) => setField('dev_stage', v as any)}>
                    <SelectTrigger className="bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260/0.6)] text-[oklch(0.15 0.02 260)] h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEV_STAGES.map(key => (
                        <SelectItem key={key} value={key} className="text-xs">{DEV_STAGE_LABELS[key]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[oklch(0.91_0.005_260/0.4)] mt-auto">
               <div className="flex items-center justify-between mb-3">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Competition Level</Label>
                 <span className="text-xs font-bold text-[oklch(0.65_0.14_200)]">{inputs.competition_level}/5</span>
               </div>
               <div className="px-1">
                <Slider
                  value={[inputs.competition_level]}
                  onValueChange={(v) => setField('competition_level', (v as number[])[0])}
                  min={1} max={5} step={1}
                />
               </div>
               <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-2">Drag to set competitive intensity</p>
               <p className="text-[9px] text-[oklch(0.45_0.01_260)] mt-2 italic opacity-60">High competition requires stronger differentiation (moats).</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Middle Row: Defensibility & IP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-8 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[oklch(0.45_0.01_260)]" />
                 <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Competitive Advantages</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.62_0.22_330/0.1)] text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Defensibility</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMPETITIVE_ADVANTAGES.map(key => (
                <div key={key} className="group relative">
                  <label
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all text-[10px] font-bold uppercase tracking-tight ${
                      inputs.competitive_advantages.includes(key)
                        ? 'border-[oklch(0.65_0.14_200/0.4)] bg-[oklch(0.65_0.14_200/0.06)] text-[oklch(0.15_0.02_260)] shadow-[0_4px_12px_oklch(0.65_0.14_200/0.04)]'
                        : 'border-[oklch(0.91_0.005_260/0.5)] bg-white/50 text-[oklch(0.45_0.01_260)] hover:border-[oklch(0.65_0.14_200/0.2)]'
                    }`}
                  >
                    <Checkbox
                      checked={inputs.competitive_advantages.includes(key)}
                      onCheckedChange={() => toggleAdvantage(key)}
                      className="hidden"
                    />
                    {COMPETITIVE_ADVANTAGE_LABELS[key]}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.4)]">
               <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-70 text-center">
                 Moats act as multipliers on exit valuations (typically +0.5x to +2.0x).
               </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-4 flex flex-col h-full">
          <IPAssetsCard count={inputs.patents_count} onValueChange={(v: number) => setField('patents_count', v)} />
        </motion.div>
      </div>
    </motion.div>
  )
}
