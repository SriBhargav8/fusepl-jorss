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
  let risk = 0
  risk += (inputs.regulatory_risk / 5) * 60
  if (inputs.revenue_concentration_pct !== null) {
    risk += (inputs.revenue_concentration_pct / 100) * 40
  }
  const score = Math.round(Math.min(100, risk))
  if (score <= 25) return { score, label: 'Low Risk', message: 'Low risk profile — investors will love this' }
  if (score <= 50) return { score, label: 'Moderate Risk', message: 'Moderate risk — typical for most startups' }
  if (score <= 75) return { score, label: 'Elevated Risk', message: 'Elevated risk — consider building a compliance moat' }
  return { score, label: 'High Risk', message: 'High regulatory risk — strong compliance strategy needed' }
}

function getRiskColor(score: number): string {
  if (score <= 25) return 'oklch(0.65 0.16 155)'
  if (score <= 50) return 'oklch(0.72 0.14 80)'
  if (score <= 75) return 'oklch(0.72 0.12 55)'
  return 'oklch(0.62 0.18 25)'
}

/* ─── Risk Thermometer Hero Card ──────────────────────────────────── */
function RiskThermometerCard({ score, color, label, message }: { score: number; color: string; label: string; message: string }) {
  const animatedScore = useAnimatedCounter(score)
  const height = 120
  const fillHeight = (score / 100) * height

  return (
    <div className="glass-card grain relative rounded-xl p-5 overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.98 0.003 260), oklch(0.97 0.003 260))' }}>
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

      <div className="flex items-center gap-6">
        {/* Thermometer */}
        <div className="relative shrink-0" style={{ height: height + 20, width: 36 }}>
          <svg width="36" height={height + 20} viewBox={`0 0 36 ${height + 20}`} className="overflow-visible">
            <rect x="10" y="8" width="16" height={height} rx="8" fill="oklch(0.96 0.005 260)" />
            <defs>
              <linearGradient id="thermo-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="oklch(0.65 0.16 155)" />
                <stop offset="50%" stopColor="oklch(0.72 0.14 80)" />
                <stop offset="100%" stopColor="oklch(0.62 0.18 25)" />
              </linearGradient>
              <clipPath id="thermo-clip">
                <motion.rect
                  x="10" width="16" rx="8"
                  initial={{ y: height + 8, height: 0 }}
                  animate={{ y: height + 8 - fillHeight, height: fillHeight }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </clipPath>
            </defs>
            <rect x="10" y="8" width="16" height={height} rx="8" fill="url(#thermo-gradient)" clipPath="url(#thermo-clip)" />
            <circle cx="18" cy={height + 12} r="8" fill={color} />
          </svg>
          <motion.div
            className="absolute left-[34px] flex items-center gap-1"
            initial={{ top: height + 8 }}
            animate={{ top: height + 8 - fillHeight }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-0 h-0"
              style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: `6px solid ${color}` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Score + message */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-1">↑ Higher = more risk</p>
          <span className={`font-mono text-4xl font-bold tabular-nums leading-none ${score <= 25 ? 'text-gold-gradient' : ''}`} style={score > 25 ? { color } : undefined}>
            {animatedScore}
          </span>
          <span className="text-xs block mt-0.5 text-[oklch(0.50 0.01 260)]">/ 100</span>
          <span
            className="font-heading text-sm font-bold inline-block mt-2 px-2 py-0.5 rounded"
            style={{ color, background: `color-mix(in oklch, ${color} 12%, transparent)` }}
          >
            {label}
          </span>
          <motion.p key={message} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-heading mt-1.5" style={{ color }}>
            {message}
          </motion.p>
        </div>
      </div>
    </div>
  )
}

export function StrategicStep() {
  const { inputs, setField } = useValuationStore()
  const [revenueOpen, setRevenueOpen] = useState(
    (inputs.revenue_concentration_pct !== null && inputs.revenue_concentration_pct > 0) || inputs.international_revenue_pct > 0
  )
  const [fundraiseOpen, setFundraiseOpen] = useState(
    inputs.target_raise !== null || inputs.expected_dilution_pct !== null
  )

  const riskProfile = useMemo(
    () => computeRiskProfile(inputs),
    [inputs.regulatory_risk, inputs.revenue_concentration_pct],
  )

  const riskColor = getRiskColor(riskProfile.score)

  return (
    <motion.div className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.72_0.12_55/0.12)] flex items-center justify-center">
            <Compass className="w-4 h-4 text-[oklch(0.72_0.12_55)]" />
          </div>
          <h2 className="font-heading text-2xl text-[oklch(0.15 0.02 260)]">Strategic Factors</h2>
        </div>
        <p className="text-[oklch(0.45 0.01 260)] text-sm">Partnerships reduce risk, regulatory moats protect margins — these factors shape how investors discount your valuation.</p>
      </motion.div>

      {/* Risk Thermometer at TOP */}
      <motion.div variants={staggerItem}>
        <RiskThermometerCard score={riskProfile.score} color={riskColor} label={riskProfile.label} message={riskProfile.message} />
      </motion.div>

      {/* Core Strategic Inputs */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Strategic Position</span>
        <div>
          <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Strategic Partnerships</Label>
          <Select value={inputs.strategic_partnerships} onValueChange={(v) => setField('strategic_partnerships', v as any)}>
            <SelectTrigger className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] mt-1 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="bg-[oklch(0.985 0.002 260)] border-[oklch(0.91 0.005 260)]">
              {PARTNERSHIP_LEVELS.map(key => (
                <SelectItem key={key} value={key} className="text-[oklch(0.15 0.02 260)] hover:bg-[oklch(0.91 0.005 260)]">
                  {PARTNERSHIP_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Regulatory Risk: <span className="text-[oklch(0.72_0.12_55)]">{inputs.regulatory_risk}/5</span></Label>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">1 = Minimal regulation, 5 = Heavily regulated industry</p>
          <Slider
            value={[inputs.regulatory_risk]}
            onValueChange={(v) => setField('regulatory_risk', Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
          />
        </div>
      </motion.div>

      {/* Revenue Composition (Collapsible) */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5">
        <button
          onClick={() => setRevenueOpen(!revenueOpen)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Revenue Composition</span>
            <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Optional — helps refine risk assessment</p>
          </div>
          <motion.div animate={{ rotate: revenueOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-[oklch(0.45_0.01_250)]" />
          </motion.div>
        </button>
        {revenueOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Revenue Concentration (%)</Label>
                  <span className="font-mono text-sm font-bold tabular-nums text-[oklch(0.72_0.12_55)]">{inputs.revenue_concentration_pct ?? 0}%</span>
                </div>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">% from top 3 customers. Lower is better.</p>
                <Slider
                  value={[inputs.revenue_concentration_pct ?? 0]}
                  onValueChange={(v) => setField('revenue_concentration_pct', Array.isArray(v) ? v[0] : v)}
                  min={0} max={100} step={5}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">International Revenue (%)</Label>
                  <span className="font-mono text-sm font-bold tabular-nums text-[oklch(0.72_0.12_55)]">{inputs.international_revenue_pct}%</span>
                </div>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">Revenue from outside India</p>
                <Slider
                  value={[inputs.international_revenue_pct]}
                  onValueChange={(v) => setField('international_revenue_pct', Array.isArray(v) ? v[0] : v)}
                  min={0} max={100} step={5}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Fundraising Plans (Collapsible) */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5">
        <button
          onClick={() => setFundraiseOpen(!fundraiseOpen)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Fundraising Plans</span>
            <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Optional — target raise and expected dilution</p>
          </div>
          <motion.div animate={{ rotate: fundraiseOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-[oklch(0.45_0.01_250)]" />
          </motion.div>
        </button>
        {fundraiseOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <div className="space-y-4">
              <div>
                <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Target Raise (₹)</Label>
                <Input
                  type="number"
                  value={inputs.target_raise ?? ''}
                  onChange={(e) => setField('target_raise', e.target.value === '' ? null : parseFloat(e.target.value))}
                  placeholder="50000000"
                  className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] mt-1 h-10"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Expected Dilution (%)</Label>
                  <span className="font-mono text-sm font-bold tabular-nums text-[oklch(0.72_0.12_55)]">{inputs.expected_dilution_pct ?? 0}%</span>
                </div>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">Typical: 15-25% per round</p>
                <Slider
                  value={[inputs.expected_dilution_pct ?? 0]}
                  onValueChange={(v) => setField('expected_dilution_pct', Array.isArray(v) ? v[0] : v)}
                  min={0} max={50} step={1}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
