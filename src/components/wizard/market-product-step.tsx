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

function computeMoatScore(advantages: string[], patents: number): number {
  if (advantages.includes('none') || advantages.length === 0) return 0
  const advScore = Math.min(80, advantages.length * 12)
  const patentScore = Math.min(20, patents * 5)
  return Math.min(100, advScore + patentScore)
}

function getMoatColor(score: number): string {
  if (score >= 70) return 'oklch(0.65 0.16 155)'
  if (score >= 35) return 'oklch(0.72 0.14 80)'
  return 'oklch(0.62 0.18 25)'
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
    <div className="glass-card grain relative rounded-xl p-5 overflow-hidden" style={{ borderColor: 'oklch(0.32 0.02 200 / 0.4)', background: 'linear-gradient(135deg, oklch(0.98 0.003 260), oklch(0.97 0.003 260))' }}>
      {/* Subtle Shield icons */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-[0.04] pointer-events-none">
        <Shield className="w-10 h-10" /><Shield className="w-10 h-10" /><Shield className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-[oklch(0.65_0.14_200)]" />
        <span className="font-heading text-sm text-[oklch(0.45 0.01 260)]">Moat Strength</span>
      </div>
      <div className="relative flex flex-col items-center">
        <svg width="140" height="140" viewBox="0 0 140 140" className="overflow-visible">
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
          <ShieldCheck className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      <div className="text-center mt-2">
        <span className={`font-mono text-3xl font-bold tabular-nums ${score >= 70 ? 'text-gold-gradient' : ''}`} style={score < 70 ? { color } : undefined}>
          {animatedScore}%
        </span>
      </div>
      <motion.p key={getMoatMessage(score)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-heading text-center mt-1" style={{ color }}>
        {getMoatMessage(score)}
      </motion.p>
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
    if (current.includes(adv as any)) {
      setField('competitive_advantages', current.filter(a => a !== adv))
    } else {
      setField('competitive_advantages', [...current, adv as any])
    }
  }

  return (
    <motion.div className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.14_200/0.12)] flex items-center justify-center">
            <Target className="w-4 h-4 text-[oklch(0.65_0.14_200)]" />
          </div>
          <h2 className="font-heading text-2xl text-[oklch(0.15 0.02 260)]">Market & Product</h2>
        </div>
        <p className="text-[oklch(0.45 0.01 260)] text-sm">Big markets = big valuations. Investors want to know the total opportunity and where your product stands.</p>
      </motion.div>

      {/* Moat Gauge at TOP */}
      <motion.div variants={staggerItem}>
        <ConcentricShieldRings score={moatScore} color={moatColor} />
      </motion.div>

      {/* Market Sizing */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Market Sizing</span>
        <div>
          <Label htmlFor="tam" className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Total Addressable Market (TAM in Cr) *</Label>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">The total market size if you captured 100% of your target customers</p>
          <Input
            id="tam"
            type="number"
            value={inputs.tam}
            onChange={(e) => setField('tam', parseInt(e.target.value) || 0)}
            className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] mt-1 w-48 h-10"
            placeholder="5000"
          />
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Benchmark: Median SaaS TAM in India ≈ ₹5,000 Cr
          </p>
        </div>

        <div>
          <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Development Stage *</Label>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Where your product is in its journey — from idea to scaling</p>
          <Select value={inputs.dev_stage} onValueChange={(v) => setField('dev_stage', v as any)}>
            <SelectTrigger className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] mt-1 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="bg-[oklch(0.985 0.002 260)] border-[oklch(0.91 0.005 260)]">
              {DEV_STAGES.map(key => (
                <SelectItem key={key} value={key} className="text-[oklch(0.15 0.02 260)] hover:bg-[oklch(0.91 0.005 260)]">
                  {DEV_STAGE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Competition Level: <span className="text-[oklch(0.65_0.14_200)]">{inputs.competition_level}/5</span></Label>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">1 = Blue ocean, 5 = Hypercompetitive market</p>
          <Slider
            value={[inputs.competition_level]}
            onValueChange={(v) => setField('competition_level', Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
          />
        </div>
      </motion.div>

      {/* Competitive Advantages */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Competitive Advantages</span>
            <p className="text-[10px] text-[oklch(0.50 0.01 260)]">What makes you hard to copy? Select all that apply (+12 pts each)</p>
          </div>
          {advantageCount > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[oklch(0.62_0.22_330/0.1)] text-[oklch(0.62 0.22 330)] border border-[oklch(0.62_0.22_330/0.2)]">
              <Shield className="w-3 h-3" />
              {advantageCount} moat{advantageCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {COMPETITIVE_ADVANTAGES.map(key => (
            <div key={key} className="group relative">
              <label
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                  inputs.competitive_advantages.includes(key)
                    ? 'border-[oklch(0.62_0.22_330/0.5)] bg-[oklch(0.62_0.22_330/0.10)] text-[oklch(0.75 0.18 162)] shadow-[0_0_12px_oklch(0.62_0.22_330/0.08)]'
                    : 'border-[oklch(0.91 0.005 260)] bg-[oklch(0.98 0.002 260)] text-[oklch(0.45 0.01 260)] hover:border-[oklch(0.35_0.008_260)] hover:bg-[oklch(0.985 0.002 260)]'
                }`}
              >
                <Checkbox
                  checked={inputs.competitive_advantages.includes(key)}
                  onCheckedChange={() => toggleAdvantage(key)}
                  className="hidden"
                />
                {COMPETITIVE_ADVANTAGE_LABELS[key]}
              </label>
              {ADVANTAGE_DESCRIPTIONS[key] && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-white border border-[oklch(0.91_0.005_260)] text-[10px] text-[oklch(0.35_0.02_260)] whitespace-nowrap max-w-[250px] text-wrap z-50 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  {ADVANTAGE_DESCRIPTIONS[key]}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[oklch(0.91_0.005_260)]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Patents */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Intellectual Property</span>
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Patents</Label>
            <span className="font-mono text-sm font-bold tabular-nums text-[oklch(0.65_0.14_200)]">{inputs.patents_count}</span>
          </div>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">Filed or granted patents (+5 pts each, max 20)</p>
          <Slider
            value={[Math.min(inputs.patents_count, 20)]}
            onValueChange={(v) => setField('patents_count', Array.isArray(v) ? v[0] : v)}
            min={0} max={20} step={1}
          />
          <div className="flex items-center gap-2 mt-2">
            <Input
              type="number"
              value={inputs.patents_count}
              onChange={(e) => setField('patents_count', parseInt(e.target.value) || 0)}
              min={0}
              className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] h-9 w-20 text-sm"
            />
            <span className="text-[9px] text-[oklch(0.50 0.01 260)]">Enter higher values manually</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
