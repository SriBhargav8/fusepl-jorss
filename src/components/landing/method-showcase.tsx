'use client'

import { motion } from 'framer-motion'
import { APPROACH_LABELS } from '@/types'
import type { ValuationApproach } from '@/types'

const APPROACHES: { key: ValuationApproach; methods: string[]; color: string; icon: string }[] = [
  { key: 'income', methods: ['DCF — Future cash flows worth today', 'PWERM — Weighted best/base/worst case'], color: 'oklch(0.72 0.17 162)', icon: '📈' },
  { key: 'market', methods: ['Revenue Multiple — What similar startups sell for', 'EV/EBITDA — Profitability comparison', 'Comparable Deals — Real acquisition data'], color: 'oklch(0.68 0.14 250)', icon: '🏪' },
  { key: 'asset_cost', methods: ['Net Asset Value — Own minus owe', 'Replacement Cost — Cost to rebuild'], color: 'oklch(0.78 0.12 80)', icon: '🏗️' },
  { key: 'vc_startup', methods: ['Scorecard — Stack up vs. funded startups', 'Berkus — Milestone-based value', 'Risk Factor — 12 investor dimensions'], color: 'oklch(0.72 0.16 300)', icon: '🚀' },
]

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }

export function MethodShowcase() {
  return (
    <section className="grain relative py-28 px-6 bg-gradient-to-b from-[oklch(0.12_0.012_250)] via-[oklch(0.15_0.018_250)] to-[oklch(0.12_0.012_250)]">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <p className="text-[11px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.2em] mb-4">The Rigour Behind the Numbers</p>
          <h2 className="font-heading text-3xl sm:text-[2.75rem] text-[oklch(0.97_0.002_250)] leading-tight">4 Approaches &times; 10 Methods</h2>
          <p className="mt-5 text-base text-[oklch(0.65_0.01_250)] max-w-lg mx-auto leading-relaxed">The same framework that institutional investors and IBBI professionals rely on.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} className="grid sm:grid-cols-2 gap-5">
          {APPROACHES.map((a) => (
            <motion.div key={a.key} variants={cardVariants} className="glass-card relative rounded-2xl p-7 overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${a.color}, transparent)` }} />
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ backgroundColor: `color-mix(in oklch, ${a.color} 15%, transparent)` }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `color-mix(in oklch, ${a.color} 12%, transparent)`, border: `1px solid color-mix(in oklch, ${a.color} 25%, transparent)` }}>{a.icon}</div>
                  <h3 className="font-heading text-lg text-[oklch(0.95_0.002_250)]">{APPROACH_LABELS[a.key]}</h3>
                  <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: a.color, backgroundColor: `color-mix(in oklch, ${a.color} 10%, transparent)` }}>{a.methods.length} methods</span>
                </div>
                <ul className="space-y-3">
                  {a.methods.map((m) => (
                    <li key={m} className="text-sm flex items-start gap-3 text-[oklch(0.68_0.01_250)]">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: a.color }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
