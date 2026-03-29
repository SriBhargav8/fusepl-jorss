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

function CurrencyInput({ label, value, onChange, placeholder }: {
  label: string; value: number | null; onChange: (v: number | null) => void;
  placeholder?: string
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[oklch(0.78_0.005_250)] text-[10px] font-medium uppercase tracking-widest">{label}</Label>
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[oklch(0.50 0.01 260)] text-xs font-mono">₹</span>
        <Input
          type="number"
          value={value ?? ''}
          onChange={(e) => { 
            const v = e.target.value; 
            const parsed = parseFloat(v);
            onChange(v === '' ? null : (isNaN(parsed) ? 0 : parsed)) 
          }}
          placeholder={placeholder || '0'}
          className="bg-[oklch(0.985 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] pl-6 h-8 text-xs focus:ring-1 focus:ring-[oklch(0.62_0.22_330/0.3)] transition-all"
        />
      </div>
    </div>
  )
}

function computeHealthScore(inputs: {
  annual_revenue: number; revenue_growth_pct: number; gross_margin_pct: number;
  monthly_burn: number; cash_in_bank: number; cac: number | null; ltv: number | null
}): { score: number; label: string } {
  let score = 0
  const burn = Number(inputs.monthly_burn) || 0
  const cash = Number(inputs.cash_in_bank) || 0
  const rev = Number(inputs.annual_revenue) || 0
  const growth = Number(inputs.revenue_growth_pct) || 0
  const margin = Number(inputs.gross_margin_pct) || 0
  const cacVal = inputs.cac !== null ? Number(inputs.cac) : null
  const ltvVal = inputs.ltv !== null ? Number(inputs.ltv) : null

  if (burn > 0 && cash > 0) {
    score += Math.min(25, (cash / burn) * 1.4)
  } else if (cash > 0) { score += 20 }
  
  if (rev > 0) { score += Math.min(30, Math.max(0, growth * 0.3)) }
  score += Math.min(25, margin * 0.3)
  
  if (cacVal && ltvVal && cacVal > 0) { score += Math.min(20, (ltvVal / cacVal) * 5) }
  
  const rounded = Math.round(Math.min(100, score)) || 0
  const label = rounded >= 75 ? 'Strong financials — investors love this' : rounded >= 50 ? 'Healthy foundation — room to grow' : rounded >= 25 ? 'Building momentum — keep pushing' : 'Early stage — focus on your first metrics'
  return { score: rounded, label }
}

function getHealthColor(score: number): string {
  if (score >= 75) return 'oklch(0.65 0.18 160)' // Vibrant Mint
  if (score >= 45) return 'oklch(0.75 0.15 100)' // Luminous Gold
  return 'oklch(0.65 0.22 340)' // Vivid Rose
}

/* ─── Financial Health Semicircle Gauge (custom SVG — no Recharts) ── */
function HealthSemicircleGauge({ score, color, label }: { score: number; color: string; label: string }) {
  const animatedScore = useAnimatedCounter(score)
  const cx = 100, cy = 85, r = 65
  const startX = cx - r, startY = cy
  const endX = cx + r, endY = cy
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`

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
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-3 opacity-[0.04] pointer-events-none">
        <TrendingUp className="w-10 h-10" /><Activity className="w-10 h-10" /><CircleDollarSign className="w-10 h-10" />
      </div>
      <div className="relative z-[1]">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-[oklch(0.62 0.22 330)]" />
          <span className="font-heading text-sm text-[oklch(0.30 0.01 260)]">Financial Health</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[180px]">
          <div className="relative w-full max-w-[280px] aspect-[200/110]">
            <svg width="100%" height="100%" viewBox="0 0 200 110" className="overflow-visible">
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
            <div className="absolute top-[42%] left-1/2 -translate-x-1/2 text-center w-full">
              <motion.span 
                className="font-mono text-5xl font-bold tabular-nums leading-none tracking-tight block"
                style={{ 
                  color,
                  filter: `drop-shadow(0 0 12px ${color}33)`
                }}
              >
                {isNaN(animatedScore) ? 0 : animatedScore}
              </motion.span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45 0.01 260)] opacity-60 mt-1 block">Health Score</span>
            </div>
          </div>
        </div>
        <motion.p key={label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-heading text-center mt-4 max-w-[85%] mx-auto leading-tight" style={{ color }}>
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
    <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
      
      {/* Bento Top Row: Health & Core Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-4 flex flex-col h-full">
          <HealthSemicircleGauge score={health.score} color={healthColor} label={health.label} />
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-8 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Core Performance</Label>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Annual Recurring Revenue & Trajectory</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.62_0.22_330/0.1)] text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Topline Drive</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[oklch(0.45_0.01_260)]">Annual Revenue (ARR)</span>
                <span className="font-heading text-xl text-[oklch(0.15_0.02_260)] tabular-nums">{formatINR(inputs.annual_revenue)}</span>
              </div>
              <Slider
                value={[revenueToSlider(inputs.annual_revenue)]}
                onValueChange={(v) => setField('annual_revenue', sliderToRevenue((v as number[])[0]))}
                max={100} step={1}
              />
              <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic">Drag to adjust revenue scale</p>
              <div className="flex items-center gap-3 bg-[oklch(0.15_0.02_260/0.02)] p-2 rounded-xl border border-[oklch(0.91_0.005_260/0.5)]">
                <span className="text-xs font-mono text-[oklch(0.45_0.01_260)]">₹</span>
                <Input
                  type="number" value={inputs.annual_revenue || ''}
                  onChange={(e) => setField('annual_revenue', parseFloat(e.target.value) || 0)}
                  className="h-8 border-none bg-transparent text-[oklch(0.15_0.02_260)] font-mono text-sm focus-visible:ring-0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[oklch(0.91_0.005_260/0.4)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Growth Rate</Label>
                  <span className="font-bold text-[oklch(0.62 0.22 330)] text-xs">{inputs.revenue_growth_pct}%</span>
                </div>
                <Slider
                  value={[Math.min(inputs.revenue_growth_pct, 300)]}
                  onValueChange={(v) => setField('revenue_growth_pct', (v as number[])[0])}
                  max={300} step={5}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Gross Margin</Label>
                  <span className="font-bold text-[oklch(0.62 0.22 330)] text-xs">{inputs.gross_margin_pct}%</span>
                </div>
                <Slider
                  value={[inputs.gross_margin_pct]}
                  onValueChange={(v) => setField('gross_margin_pct', (v as number[])[0])}
                  max={100} step={1}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Middle Row: Capital & Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-6 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-[oklch(0.45_0.01_260)]" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Capital & Runway</span>
              </div>
              {runway !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${runway >= 12 ? 'bg-[oklch(0.65_0.16_155/0.1)] text-[oklch(0.65_0.16_155)]' : 'bg-[oklch(0.62_0.18_25/0.1)] text-[oklch(0.62_0.18_25)]'}`}>
                  {runway >= 12 ? 'Stable' : 'Burn Risk'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput label="Monthly OpEx" value={inputs.monthly_burn} onChange={(v) => setField('monthly_burn', v ?? 0)} />
              <CurrencyInput label="Cash Reserves" value={inputs.cash_in_bank} onChange={(v) => setField('cash_in_bank', v ?? 0)} />
            </div>

            {runway !== null && (
              <div className="mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.4)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[oklch(0.45_0.01_260)]">Estimated Runway</span>
                  <span className="font-heading text-sm text-[oklch(0.15_0.02_260)]">{runway} Months</span>
                </div>
                <div className="h-1.5 bg-[oklch(0.91_0.005_260)] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[oklch(0.62_0.18_25)] via-[oklch(0.72_0.14_80)] to-[oklch(0.65_0.16_155)]" 
                    animate={{ width: `${Math.min(100, (runway / 24) * 100)}%` }} 
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-6 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="w-3.5 h-3.5 text-[oklch(0.45_0.01_260)]" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Efficiency Metrics</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.75_0.15_100/0.1)] text-[9px] font-bold text-[oklch(0.75_0.15_100)] uppercase">Val. Multiple Impact</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput label="CAC (Marketing)" value={inputs.cac} onChange={(v) => setField('cac', v)} />
              <CurrencyInput label="LTV (Revenue)" value={inputs.ltv} onChange={(v) => setField('ltv', v)} />
            </div>

            <div className="mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.4)]">
              {inputs.cac && inputs.ltv && inputs.cac > 0 ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[oklch(0.15_0.02_260/0.03)] border border-[oklch(0.91_0.005_260/0.5)]">
                  <span className="text-[10px] font-bold text-[oklch(0.45_0.01_260)] uppercase tracking-wider">LTV:CAC Ratio</span>
                  <span className="font-heading text-lg text-[oklch(0.15_0.02_260)]">{(inputs.ltv / inputs.cac).toFixed(1)}x</span>
                </div>
              ) : (
                <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-60 text-center italic">
                  CAC & LTV help calibrate efficiency premiums.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Previous Funding Section */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Capital History (Optional)</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <CurrencyInput label="Last Round Size" value={inputs.last_round_size} onChange={(v) => setField('last_round_size', v)} />
          <CurrencyInput label="Last Round Valuation" value={inputs.last_round_valuation} onChange={(v) => setField('last_round_valuation', v)} />
        </div>
      </motion.div>
    </motion.div>
  )
}
