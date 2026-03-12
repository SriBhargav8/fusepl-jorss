'use client'

import { motion } from 'framer-motion'
import { APPROACH_LABELS } from '@/types'
import type { ValuationApproach } from '@/types'

const APPROACHES: {
  key: ValuationApproach
  methods: string[]
  color: string
  icon: string
}[] = [
  {
    key: 'income',
    methods: ['DCF — What your future cash flows are worth today', 'PWERM — Weighted across best, base & worst case'],
    color: 'oklch(0.68 0.16 250)',
    icon: '📈',
  },
  {
    key: 'market',
    methods: ['Revenue Multiple — What similar startups sell for', 'EV/EBITDA — Profitability-based comparison', 'Comparable Deals — Real acquisition data'],
    color: 'oklch(0.70 0.14 155)',
    icon: '🏪',
  },
  {
    key: 'asset_cost',
    methods: ['Net Asset Value — What you own minus what you owe', 'Replacement Cost — What it would cost to rebuild'],
    color: 'oklch(0.82 0.12 75)',
    icon: '🏗️',
  },
  {
    key: 'vc_startup',
    methods: ['Scorecard — How you stack up vs. funded startups', 'Berkus — Value milestones like product, team, traction', 'Risk Factor — 12 risk dimensions investors evaluate'],
    color: 'oklch(0.68 0.18 300)',
    icon: '🚀',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function MethodShowcase() {
  return (
    <section className="grain relative py-28 px-6 bg-gradient-to-b from-[oklch(0.10_0.008_260)] via-[oklch(0.13_0.012_260)] to-[oklch(0.10_0.008_260)]">
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-[oklch(0.82_0.12_75)] uppercase tracking-[0.2em] mb-4">
            The Rigour Behind the Numbers
          </p>
          <h2 className="font-heading text-3xl sm:text-[2.75rem] text-[oklch(0.97_0.005_80)] leading-tight">
            4 Approaches &times; 10 Methods
          </h2>
          <p className="mt-5 text-base text-[oklch(0.62_0.01_260)] max-w-lg mx-auto leading-relaxed">
            The same valuation framework that institutional investors, IBBI professionals, and Shark Tank panelists rely on — now running for your startup in under 5 minutes.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-2 gap-5"
        >
          {APPROACHES.map((approach) => (
            <motion.div
              key={approach.key}
              variants={cardVariants}
              className="glass-card relative rounded-2xl p-7 overflow-hidden group"
            >
              {/* Colored top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${approach.color}, transparent)` }}
              />

              {/* Glow on hover */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ backgroundColor: `color-mix(in oklch, ${approach.color} 15%, transparent)` }}
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{
                      background: `color-mix(in oklch, ${approach.color} 12%, transparent)`,
                      border: `1px solid color-mix(in oklch, ${approach.color} 25%, transparent)`,
                    }}
                  >
                    {approach.icon}
                  </div>
                  <h3 className="font-heading text-lg text-[oklch(0.95_0.005_80)]">
                    {APPROACH_LABELS[approach.key]}
                  </h3>
                  <span
                    className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full tabular-nums"
                    style={{
                      color: approach.color,
                      backgroundColor: `color-mix(in oklch, ${approach.color} 10%, transparent)`,
                    }}
                  >
                    {approach.methods.length} methods
                  </span>
                </div>
                <ul className="space-y-3">
                  {approach.methods.map((method) => (
                    <li
                      key={method}
                      className="text-sm flex items-start gap-3 text-[oklch(0.68_0.01_260)]"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ backgroundColor: approach.color }}
                      />
                      {method}
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
