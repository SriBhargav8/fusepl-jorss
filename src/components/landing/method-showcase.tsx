'use client'

import { motion } from 'framer-motion'
import { APPROACH_LABELS } from '@/types'
import type { ValuationApproach } from '@/types'

const APPROACHES: {
  key: ValuationApproach
  methods: string[]
  color: string
  borderColor: string
}[] = [
  {
    key: 'income',
    methods: ['DCF — What your future cash flows are worth today', 'PWERM — Weighted across best, base & worst case'],
    color: 'oklch(0.62 0.18 250)',
    borderColor: 'oklch(0.62 0.18 250 / 0.4)',
  },
  {
    key: 'market',
    methods: ['Revenue Multiple — What similar startups sell for', 'EV/EBITDA — Profitability-based comparison', 'Comparable Deals — Real acquisition data'],
    color: 'oklch(0.65 0.16 155)',
    borderColor: 'oklch(0.65 0.16 155 / 0.4)',
  },
  {
    key: 'asset_cost',
    methods: ['Net Asset Value — What you own minus what you owe', 'Replacement Cost — What it would cost to rebuild'],
    color: 'oklch(0.78 0.14 80)',
    borderColor: 'oklch(0.78 0.14 80 / 0.4)',
  },
  {
    key: 'vc_startup',
    methods: ['Scorecard — How you stack up vs. funded startups', 'Berkus — Value milestones like product, team, traction', 'Risk Factor — 12 risk dimensions investors evaluate'],
    color: 'oklch(0.62 0.20 300)',
    borderColor: 'oklch(0.62 0.20 300 / 0.4)',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function MethodShowcase() {
  return (
    <section className="grain relative py-24 px-6">
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-[oklch(0.78_0.14_80)] uppercase tracking-[0.2em] mb-4">
            The Rigour Behind the Numbers
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl text-[oklch(0.93_0.005_80)]">
            4 Approaches &times; 10 Methods
          </h2>
          <p className="mt-4 text-sm text-[oklch(0.45_0.01_260)] max-w-lg mx-auto leading-relaxed">
            The same valuation framework that institutional investors, IBBI professionals, and Shark Tank panelists rely on — now running for your startup in under 5 minutes.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {APPROACHES.map((approach) => (
            <motion.div
              key={approach.key}
              variants={cardVariants}
              className="relative rounded-lg bg-[oklch(0.12_0.008_260)] border border-[oklch(0.20_0.008_260)] p-6 transition-all duration-300 hover:border-[oklch(0.25_0.008_260)]"
              style={{
                borderLeftWidth: '2px',
                borderLeftColor: approach.borderColor,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: approach.color }}
                />
                <h3 className="font-heading text-base text-[oklch(0.93_0.005_80)]">
                  {APPROACH_LABELS[approach.key]}
                </h3>
                <span className="ml-auto text-[10px] text-[oklch(0.40_0.01_260)] tabular-nums">
                  {approach.methods.length} methods
                </span>
              </div>
              <ul className="space-y-2.5">
                {approach.methods.map((method) => (
                  <li
                    key={method}
                    className="text-sm flex items-center gap-3 text-[oklch(0.55_0.01_260)]"
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0 opacity-50"
                      style={{ backgroundColor: approach.color }}
                    />
                    {method}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
