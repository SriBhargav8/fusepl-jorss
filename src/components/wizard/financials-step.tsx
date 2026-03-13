'use client'

import { useMemo } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatINR } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { Activity, TrendingUp, Wallet, CircleDollarSign } from 'lucide-react'
import { useAnimatedCounter, staggerContainer, staggerItem } from './wizard-container'

// Logarithmic slider for revenue: 0 → 0, 100 → 100 Cr (1 billion)
const REVENUE_MAX = 1_000_000_000 // 100 Cr
function sliderToRevenue(pos: number): number {
  if (pos === 0) return 0
  // Exponential mapping: slider 1-100 → ₹10K to ₹100Cr
  return Math.round(10_000 * Math.pow(REVENUE_MAX / 10_000, pos / 100))
}
function revenueToSlider(revenue: number): number {
  if (revenue <= 0) return 0
  if (revenue >= REVENUE_MAX) return 100
  return Math.round(100 * Math.log(revenue / 10_000) / Math.log(REVENUE_MAX / 10_000))
}

function CurrencyInput({ label, value, onChange, placeholder, help }: {
  label: string; value: number | null; onChange: (v: number | null) => void;
  placeholder?: string; help?: string
}) {
  return (
    <div>
      <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">{label}</Label>
      {help && <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-1">{help}</p>}
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.50 0.01 260)] text-sm font-mono">₹</span>
        <Input
          type="number"
          value={value ?? ''}
          onChange={(e) => { const v = e.target.value; onChange(v === '' ? null : parseFloat(v)) }}
          placeholder={placeholder || '0'}
          className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] pl-7 h-10 focus:border-[oklch(0.62_0.22_330/0.5)] transition-colors"
        />
      </div>
      {value !== null && value > 0 && (
        <p className="text-[10px] text-[oklch(0.62_0.22_330/0.8)] mt-1 font-mono">{formatINR(value)}</p>
      )}
    </div>
  )
}

function computeHealthScore(inputs: {
  annual_revenue: number; revenue_growth_pct: number; gross_margin_pct: number;
  monthly_burn: number; cash_in_bank: number; cac: number | null; ltv: number | null
}): { score: number; label: string } {
  let score = 0
  if (inputs.monthly_burn > 0 && inputs.cash_in_bank > 0) {
    score += Math.min(25, (inputs.cash_in_bank / inputs.monthly_burn) * 1.4)
  } else if (inputs.cash_in_bank > 0) { score += 20 }
  if (inputs.annual_revenue > 0) { score += Math.min(30, Math.max(0, inputs.revenue_growth_pct * 0.3)) }
  score += Math.min(25, inputs.gross_margin_pct * 0.3)
  if (inputs.cac && inputs.ltv && inputs.cac > 0) { score += Math.min(20, (inputs.ltv / inputs.cac) * 5) }
  const rounded = Math.round(Math.min(100, score))
  const label = rounded >= 75 ? 'Strong financials — investors love this' : rounded >= 50 ? 'Healthy foundation — room to grow' : rounded >= 25 ? 'Building momentum — keep pushing' : 'Early stage — focus on your first metrics'
  return { score: rounded, label }
}

function getHealthColor(score: number): string {
  if (score >= 70) return 'oklch(0.65 0.16 155)'
  if (score >= 40) return 'oklch(0.72 0.14 80)'
  return 'oklch(0.62 0.18 25)'
}

/* ─── Financial Health Semicircle Gauge (custom SVG — no Recharts) ── */
function HealthSemicircleGauge({ score, color, label }: { score: number; color: string; label: string }) {
  const animatedScore = useAnimatedCounter(score)
  const cx = 100, cy = 85, r = 65
  const startX = cx - r, startY = cy
  const endX = cx + r, endY = cy
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`

  return (
    <div className="glass-card grain relative rounded-xl p-5 overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.98 0.003 260 / 0.9), oklch(0.97 0.003 260 / 0.7)), linear-gradient(180deg, oklch(0.72 0.12 155 / 0.04), transparent)' }}>
      {/* Grid-line background for dashboard feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(oklch(0.78 0.14 75 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.14 75 / 0.5) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
      {/* Subtle background icons */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-3 opacity-[0.04] pointer-events-none">
        <TrendingUp className="w-10 h-10" /><Activity className="w-10 h-10" /><CircleDollarSign className="w-10 h-10" />
      </div>
      <div className="relative z-[1]">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-[oklch(0.62 0.22 330)]" />
          <span className="font-heading text-sm text-[oklch(0.30 0.01 260)]">Financial Health</span>
        </div>
        <div className="relative flex flex-col items-center">
          <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
            <path d={arcPath} fill="none" stroke="oklch(0.91 0.005 260)" strokeWidth="12" strokeLinecap="round" />
            <motion.path
              d={arcPath} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
              pathLength={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: score / 100 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
          </svg>
          <div className="absolute top-[36px] left-1/2 -translate-x-1/2 text-center">
            <span className={`font-mono text-4xl font-bold tabular-nums leading-none ${score >= 70 ? 'text-gold-gradient' : ''}`} style={score < 70 ? { color } : undefined}>
              {animatedScore}
            </span>
            <span className="text-xs block mt-0.5 text-[oklch(0.45 0.01 260)]">/ 100</span>
          </div>
        </div>
        <motion.p key={label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-heading text-center mt-1" style={{ color }}>
          {label}
        </motion.p>
      </div>
    </div>
  )
}

export function FinancialsStep() {
  const { inputs, setField } = useValuationStore()
  const runway = inputs.monthly_burn > 0 && inputs.cash_in_bank > 0 ? Math.round(inputs.cash_in_bank / inputs.monthly_burn) : null
  const health = useMemo(() => computeHealthScore(inputs), [inputs.annual_revenue, inputs.revenue_growth_pct, inputs.gross_margin_pct, inputs.monthly_burn, inputs.cash_in_bank, inputs.cac, inputs.ltv])
  const healthColor = getHealthColor(health.score)

  return (
    <motion.div className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.62_0.22_330/0.15)] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[oklch(0.62 0.22 330)]" />
          </div>
          <h2 className="font-heading text-2xl text-[oklch(0.15 0.02 260)]">Financials</h2>
        </div>
        <p className="text-[oklch(0.45 0.01 260)] text-sm">These numbers drive your DCF and market multiple valuations. Pre-revenue? Enter 0 — we still value you using VC methods.</p>
      </motion.div>

      {/* Health Score — Hero at TOP */}
      <motion.div variants={staggerItem}>
        <HealthSemicircleGauge score={health.score} color={healthColor} label={health.label} />
      </motion.div>

      {/* Revenue Section */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-[oklch(0.45 0.01 260)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Revenue & Growth</span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Annual Revenue (ARR) *</Label>
            <span className="font-mono text-sm font-bold tabular-nums text-[oklch(0.62 0.22 330)]">{formatINR(inputs.annual_revenue)}</span>
          </div>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">Enter 0 if pre-revenue — VC methods will be used</p>
          <Slider
            value={[revenueToSlider(inputs.annual_revenue)]}
            onValueChange={(v) => setField('annual_revenue', sliderToRevenue(Array.isArray(v) ? v[0] : v))}
            min={0}
            max={100}
            step={1}
          />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[oklch(0.50 0.01 260)] text-sm font-mono">₹</span>
            <Input
              type="number"
              value={inputs.annual_revenue || ''}
              onChange={(e) => setField('annual_revenue', parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] h-9 w-36 text-sm focus:border-[oklch(0.62_0.22_330/0.5)]"
            />
            <span className="text-[9px] text-[oklch(0.50 0.01 260)] font-mono">per year</span>
          </div>
        </div>

        {inputs.annual_revenue === 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-[oklch(0.62_0.22_330/0.08)] border border-[oklch(0.62_0.22_330/0.2)] text-[oklch(0.62 0.22 330)]">
            Pre-revenue startups can still have strong valuations through VC methods like Scorecard and Berkus
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Revenue Growth (%)</Label>
            <span className="font-mono text-sm font-bold tabular-nums text-[oklch(0.62 0.22 330)]">{inputs.revenue_growth_pct}%</span>
          </div>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">YoY growth. Good SaaS = 100%+, Average = 30-50%</p>
          <Slider
            value={[Math.min(inputs.revenue_growth_pct, 300)]}
            onValueChange={(v) => setField('revenue_growth_pct', Array.isArray(v) ? v[0] : v)}
            min={0}
            max={300}
            step={5}
          />
          <div className="flex items-center gap-2 mt-2">
            <Input type="number" value={inputs.revenue_growth_pct} onChange={(e) => setField('revenue_growth_pct', parseFloat(e.target.value) || 0)} className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] h-9 w-24 text-sm focus:border-[oklch(0.62_0.22_330/0.5)]" placeholder="80" />
            <span className="text-[9px] text-[oklch(0.50 0.01 260)] font-mono">% per year</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Gross Margin (%)</Label>
            <span className="font-mono text-sm font-bold tabular-nums text-[oklch(0.62 0.22 330)]">{inputs.gross_margin_pct}%</span>
          </div>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-2">SaaS = 70-90%, E-commerce = 30-50%</p>
          <Slider
            value={[inputs.gross_margin_pct]}
            onValueChange={(v) => setField('gross_margin_pct', Array.isArray(v) ? v[0] : v)}
            min={0}
            max={100}
            step={1}
          />
          <div className="flex items-center gap-2 mt-2">
            <Input type="number" value={inputs.gross_margin_pct} onChange={(e) => setField('gross_margin_pct', parseFloat(e.target.value) || 0)} min={0} max={100} className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] h-9 w-24 text-sm focus:border-[oklch(0.62_0.22_330/0.5)]" placeholder="70" />
            <span className="text-[9px] text-[oklch(0.50 0.01 260)] font-mono">%</span>
          </div>
        </div>
      </motion.div>

      {/* Burn & Runway Section */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-3.5 h-3.5 text-[oklch(0.45 0.01 260)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Cash & Runway</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput label="Monthly Burn Rate" value={inputs.monthly_burn} onChange={(v) => setField('monthly_burn', v ?? 0)} help="Total monthly expenses" />
          <CurrencyInput label="Cash in Bank" value={inputs.cash_in_bank} onChange={(v) => setField('cash_in_bank', v ?? 0)} help="Current bank balance" />
        </div>

        {/* Visual runway bar */}
        {runway !== null && (
          <div className="rounded-lg bg-[oklch(0.97_0.003_260)] border border-[oklch(0.91_0.005_260)] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Runway</span>
              <span className={`font-mono text-xl font-bold tabular-nums ${runway >= 18 ? 'text-[oklch(0.65_0.16_155)]' : runway >= 6 ? 'text-[oklch(0.72_0.14_80)]' : 'text-[oklch(0.62_0.18_25)]'}`}>{runway}<span className="text-xs ml-0.5">mo</span></span>
            </div>
            <div className="h-3 bg-[oklch(0.93_0.005_260)] rounded-full overflow-hidden relative">
              <div className="absolute inset-0 flex">
                <div className="w-1/4 bg-[oklch(0.62_0.18_25/0.1)]" />
                <div className="w-1/4 bg-[oklch(0.72_0.14_80/0.08)]" />
                <div className="flex-1 bg-[oklch(0.65_0.16_155/0.06)]" />
              </div>
              {[6, 12, 18].map(m => <div key={m} className="absolute top-0 bottom-0 w-px bg-[oklch(0.40_0.01_250/0.4)]" style={{ left: `${(m / 24) * 100}%` }} />)}
              <motion.div className="h-full rounded-full relative z-10" style={{ background: runway >= 18 ? 'oklch(0.65 0.16 155)' : runway >= 6 ? 'oklch(0.72 0.14 80)' : 'oklch(0.62 0.18 25)' }} animate={{ width: `${Math.min(100, (runway / 24) * 100)}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
              <motion.div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-20 border-2 border-[oklch(0.985 0.002 260)]" style={{ background: runway >= 18 ? 'oklch(0.65 0.16 155)' : runway >= 6 ? 'oklch(0.72 0.14 80)' : 'oklch(0.62 0.18 25)', boxShadow: `0 0 10px ${runway >= 18 ? 'oklch(0.65 0.16 155 / 0.5)' : runway >= 6 ? 'oklch(0.72 0.14 80 / 0.5)' : 'oklch(0.62 0.18 25 / 0.5)'}` }} animate={{ left: `calc(${Math.min(100, (runway / 24) * 100)}% - 7px)`, scale: [1, 1.15, 1] }} transition={{ left: { duration: 0.5 }, scale: { duration: 2, repeat: Infinity } }} />
            </div>
            <div className="flex justify-between mt-1.5">
              {['0', '6m', '12m', '18m', '24m+'].map(l => <span key={l} className="text-[8px] font-mono text-[oklch(0.50 0.01 260)]">{l}</span>)}
            </div>
            <p className="text-[10px] font-heading mt-1" style={{ color: runway >= 18 ? 'oklch(0.65 0.16 155)' : runway >= 6 ? 'oklch(0.72 0.14 80)' : 'oklch(0.62 0.18 25)' }}>
              {runway >= 18 ? 'Comfortable runway — investors love this' : runway >= 6 ? 'Start planning next raise soon' : 'Urgent: fundraise now'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Unit Economics */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Unit Economics (optional)</span>
        <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Investors love LTV/CAC &gt; 3x. Improves valuation accuracy.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput label="Customer Acquisition Cost (CAC)" value={inputs.cac} onChange={(v) => setField('cac', v)} />
          <CurrencyInput label="Lifetime Value (LTV)" value={inputs.ltv} onChange={(v) => setField('ltv', v)} />
        </div>
        {inputs.cac && inputs.ltv && inputs.cac > 0 && (
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs ${inputs.ltv / inputs.cac >= 3 ? 'bg-[oklch(0.62_0.22_330/0.10)] text-[oklch(0.62 0.22 330)] border border-[oklch(0.62_0.22_330/0.2)]' : inputs.ltv / inputs.cac >= 1 ? 'bg-[oklch(0.72_0.14_80/0.10)] text-[oklch(0.72_0.14_80)] border border-[oklch(0.72_0.14_80/0.2)]' : 'bg-[oklch(0.62_0.18_25/0.10)] text-[oklch(0.62_0.18_25)] border border-[oklch(0.62_0.18_25/0.2)]'}`}>
            <span className="font-mono font-bold text-base">{(inputs.ltv / inputs.cac).toFixed(1)}x</span>
            <span className="text-[oklch(0.45 0.01 260)]">{inputs.ltv / inputs.cac >= 3 ? '— Excellent unit economics' : inputs.ltv / inputs.cac >= 1 ? '— Needs improvement (target 3x+)' : '— Losing money per customer'}</span>
          </div>
        )}
      </motion.div>

      {/* Previous Funding */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Previous Funding (optional)</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput label="Last Round Size" value={inputs.last_round_size} onChange={(v) => setField('last_round_size', v)} />
          <CurrencyInput label="Last Round Valuation" value={inputs.last_round_valuation} onChange={(v) => setField('last_round_valuation', v)} />
        </div>
      </motion.div>
    </motion.div>
  )
}
