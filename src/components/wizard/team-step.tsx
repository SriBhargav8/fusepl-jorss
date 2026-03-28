'use client'

import { useMemo } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { useAnimatedCounter, staggerContainer, staggerItem } from './wizard-container'

const KEY_HIRE_OPTIONS = [
  { value: 'cto', label: 'CTO' },
  { value: 'cfo', label: 'CFO' },
  { value: 'sales_lead', label: 'Sales Lead' },
  { value: 'marketing_head', label: 'Marketing Head' },
  { value: 'product_head', label: 'Product Head' },
]

const EXPERIENCE_LEVELS: Record<number, string> = {
  1: 'First-time founder', 2: 'Some startup experience',
  3: 'Experienced — 3+ years in startups', 4: 'Seasoned — multiple ventures',
  5: 'Serial entrepreneur with deep expertise',
}

const EXPERTISE_LEVELS: Record<number, string> = {
  1: 'New to the sector', 2: 'Basic industry knowledge',
  3: 'Solid domain understanding', 4: 'Domain expert — 7+ years',
  5: 'Industry veteran — 10+ years',
}

function computeTeamScore(inputs: { team_size: number; founder_experience: number; domain_expertise: number; previous_exits: boolean; technical_cofounder: boolean; key_hires: string[] }): number {
  const sizeScore = inputs.team_size >= 5 ? Math.min(20, 10 + Math.min(10, (inputs.team_size - 5) * 0.5)) : Math.max(0, inputs.team_size * 2)
  return Math.round(sizeScore + (inputs.founder_experience / 5) * 25 + (inputs.domain_expertise / 5) * 20 + (inputs.previous_exits ? 15 : 0) + (inputs.technical_cofounder ? 10 : 0) + Math.min(10, inputs.key_hires.length * 2))
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'oklch(0.65 0.18 160)' // Vibrant Mint
  if (score >= 45) return 'oklch(0.75 0.15 100)' // Luminous Gold
  return 'oklch(0.65 0.22 340)' // Vivid Rose
}

function getScoreMessage(score: number): string {
  if (score >= 80) return 'Exceptional founding team!'
  if (score >= 60) return 'Strong team — investors will notice'
  if (score >= 40) return 'Good start — consider adding domain experts'
  if (score >= 20) return 'Building up — key hires can boost this score'
  return 'Early stage — focus on founding team strength'
}

/* ─── SVG Semicircle Gauge ─────────────────────────────────────────── */
function SemicircleGauge({ score, color }: { score: number; color: string }) {
  const animatedScore = useAnimatedCounter(score)
  const cx = 100, cy = 85, r = 65
  const startX = cx - r, startY = cy
  const endX = cx + r, endY = cy
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`

  return (
    <div className="glass-card grain relative rounded-xl p-6 overflow-hidden h-full flex flex-col" 
      style={{ 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))',
        border: '1px solid oklch(0.91 0.005 260 / 0.8)'
      }}
    >
      {/* Dynamic ambient glow based on score */}
      <div className="absolute inset-0 opacity-[0.03] transition-colors duration-500" 
        style={{ background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` }} 
      />
      {/* Subtle Users icons */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-[0.04] pointer-events-none">
        <Users className="w-10 h-10" /><Users className="w-10 h-10" /><Users className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-[oklch(0.62 0.22 330)]" />
        <span className="font-heading text-sm text-[oklch(0.45 0.01 260)]">Team Strength</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[160px]">
        <div className="relative w-full max-w-[280px] aspect-[200/110]">
          <svg width="100%" height="100%" viewBox="0 0 200 110" className="overflow-visible">
            <path d={arcPath} fill="none" stroke="oklch(0.91 0.005 260)" strokeWidth="12" strokeLinecap="round" />
            <motion.path d={arcPath} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" pathLength={1} initial={{ pathLength: 0 }} animate={{ pathLength: score / 100 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
          </svg>
          <div className="absolute top-[42%] left-1/2 -translate-x-1/2 text-center w-full">
            <motion.span 
              className="font-mono text-4xl font-bold tabular-nums leading-none tracking-tight block"
              style={{ 
                color,
                filter: `drop-shadow(0 0 12px ${color}33)`
              }}
            >
              {isNaN(animatedScore) ? 0 : animatedScore}
            </motion.span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45 0.01 260)] opacity-60 mt-1 block">Team Score</span>
          </div>
        </div>
      </div>
      <motion.p 
        key={getScoreMessage(score)} 
        initial={{ opacity: 0, y: 4 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-[10px] font-heading font-medium text-center mt-4 p-1.5 rounded-md bg-[oklch(0.15_0.02_260/0.03)] max-w-[85%] mx-auto leading-tight" 
        style={{ color: `color-mix(in oklch, ${color}, oklch(0.15 0.02 260) 20%)` }}
      >
        {getScoreMessage(score)}
      </motion.p>
    </div>
  )
}

export function TeamStep() {
  const { inputs, setField } = useValuationStore()
  const teamScore = useMemo(() => computeTeamScore(inputs), [inputs.team_size, inputs.founder_experience, inputs.domain_expertise, inputs.previous_exits, inputs.technical_cofounder, inputs.key_hires])
  const scoreColor = getScoreColor(teamScore)

  const toggleKeyHire = (hire: string) => {
    const current = inputs.key_hires
    setField('key_hires', current.includes(hire) ? current.filter(h => h !== hire) : [...current, hire])
  }

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Bento Top Row: Gauge & Core Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-5 flex flex-col h-full">
          <SemicircleGauge score={teamScore} color={scoreColor} />
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-7 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="team_size" className="text-[oklch(0.78_0.005_250)] text-[10px] font-medium uppercase tracking-widest">Team Size *</Label>
                <span className="px-2 py-0.5 rounded-full bg-[oklch(0.65_0.16_155/0.1)] text-[9px] font-bold text-[oklch(0.65_0.16_155)] uppercase">+Scale Mul.</span>
              </div>
              <div className="flex items-center gap-4">
                <Input id="team_size" type="number" value={inputs.team_size} onChange={(e) => setField('team_size', parseInt(e.target.value) || 1)} min={1} max={500} className="bg-[oklch(0.99_0.001_260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] w-24 h-9 text-sm" />
                <p className="text-[10px] text-[oklch(0.50 0.01 260)] leading-tight">Founders + employees + contractors.<br/>Institutional benchmark for stage.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                   <Label className="text-[oklch(0.78_0.005_250)] text-[10px] font-medium uppercase tracking-widest">Founder Experience</Label>
                  <span className="font-mono text-xs font-bold text-[oklch(0.62 0.22 330)]">{inputs.founder_experience}/5</span>
                </div>
                <p className="text-[9px] text-[oklch(0.62_0.22_330/0.8)] font-semibold mb-2">{EXPERIENCE_LEVELS[inputs.founder_experience]}</p>
                 <Slider value={[inputs.founder_experience]} onValueChange={(v) => setField('founder_experience', Array.isArray(v) ? v[0] : v)} min={1} max={5} step={1} />
                 <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-1.5">Drag to rate experience</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                   <Label className="text-[oklch(0.78_0.005_250)] text-[10px] font-medium uppercase tracking-widest">Domain Expertise</Label>
                  <span className="font-mono text-xs font-bold text-[oklch(0.62 0.22 330)]">{inputs.domain_expertise}/5</span>
                </div>
                <p className="text-[9px] text-[oklch(0.62_0.22_330/0.8)] font-semibold mb-2">{EXPERTISE_LEVELS[inputs.domain_expertise]}</p>
                 <Slider value={[inputs.domain_expertise]} onValueChange={(v) => setField('domain_expertise', Array.isArray(v) ? v[0] : v)} min={1} max={5} step={1} />
                 <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-40 italic mt-1.5">Drag to rate expertise</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Bottom Row: Signals & Hires */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={staggerItem} className="lg:col-span-5 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-4 h-full">
            <div className="flex items-center justify-between mb-1">
               <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[oklch(0.45 0.01 260)]">Strategic Signals</span>
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.75_0.15_100/0.1)] text-[9px] font-bold text-[oklch(0.75_0.15_100)] uppercase">Risk Offset</span>
            </div>
            
            <div className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${inputs.previous_exits ? 'bg-[oklch(0.62_0.22_330/0.04)] border-[oklch(0.62_0.22_330/0.2)]' : 'bg-white/40 border-transparent hover:border-[oklch(0.91_0.005_260)]'}`}>
              <Checkbox id="previous_exits" checked={inputs.previous_exits} onCheckedChange={(checked) => setField('previous_exits', !!checked)} />
              <div>
                 <Label htmlFor="previous_exits" className="text-[oklch(0.15_0.02_260)] cursor-pointer text-xs font-medium">Previous Exits</Label>
                <p className="text-[9px] text-[oklch(0.50 0.01 260)] leading-tight">+15 pts — Validation of capital efficiency.</p>
              </div>
            </div>

            <div className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${inputs.technical_cofounder ? 'bg-[oklch(0.62_0.22_330/0.04)] border-[oklch(0.62_0.22_330/0.2)]' : 'bg-white/40 border-transparent hover:border-[oklch(0.91_0.005_260)]'}`}>
              <Checkbox id="technical_cofounder" checked={inputs.technical_cofounder} onCheckedChange={(checked) => setField('technical_cofounder', !!checked)} />
              <div>
                 <Label htmlFor="technical_cofounder" className="text-[oklch(0.15_0.02_260)] cursor-pointer text-xs font-medium">Tech Co-Founder</Label>
                <p className="text-[9px] text-[oklch(0.50 0.01 260)] leading-tight">+10 pts — Reduced execution & dev risk.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-7 flex flex-col h-full">
          <div className="glass-card grain relative rounded-xl p-5 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                 <Label className="text-[oklch(0.78_0.005_250)] text-[10px] font-medium uppercase tracking-widest">Key Hires Pool</Label>
                <p className="text-[10px] text-[oklch(0.50 0.01 260)] mt-0.5">Validation of organizational maturity.</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full bg-[oklch(0.62_0.22_330/0.1)] text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Execution</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {KEY_HIRE_OPTIONS.map(option => (
                <label 
                  key={option.value} 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-[10px] font-bold uppercase tracking-wider ${
                    inputs.key_hires.includes(option.value) 
                      ? 'border-[oklch(0.62_0.22_330/0.4)] bg-[oklch(0.62_0.22_330/0.06)] text-[oklch(0.62_0.22_330)] shadow-[0_4px_12px_oklch(0.62_0.22_330/0.04)]' 
                      : 'border-[oklch(0.91 0.005 260)] bg-white/50 text-[oklch(0.45 0.01 260)] hover:border-[oklch(0.62_0.22_330/0.2)]'
                  }`}
                >
                  <Checkbox checked={inputs.key_hires.includes(option.value)} onCheckedChange={() => toggleKeyHire(option.value)} className="hidden" />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-auto pt-4 border-t border-[oklch(0.91_0.005_260/0.4)]">
               <p className="text-[9px] text-[oklch(0.45_0.01_260)] opacity-70 italic text-center">
                 Each hire adds 2 pts to organic valuation premiums.
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
