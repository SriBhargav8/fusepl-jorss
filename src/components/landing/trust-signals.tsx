'use client'

import { motion } from 'framer-motion'

const SIGNALS = [
  {
    icon: '🏛️',
    label: 'IBBI Registered',
    text: 'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer.',
    metric: 'Verified',
    color: 'oklch(0.72 0.17 162)',
  },
  {
    icon: '📊',
    label: 'Damodaran Data',
    text: 'Real industry benchmarks from Prof. Aswath Damodaran — updated January 2026.',
    metric: 'Jan 2026',
    color: 'oklch(0.68 0.14 250)',
  },
  {
    icon: '📐',
    label: 'IVS 105 Aligned',
    text: '4 approaches, 10 methods — the same framework used in boardroom-level valuations.',
    metric: '10 methods',
    color: 'oklch(0.72 0.16 300)',
  },
  {
    icon: '🎲',
    label: 'Monte Carlo',
    text: '10,000 simulated scenarios showing the full range of what your startup is worth.',
    metric: '10K runs',
    color: 'oklch(0.78 0.12 80)',
  },
  {
    icon: '⚖️',
    label: 'IBC Case Law',
    text: '190+ landmark IBC cases analyzed for grounded downside estimates.',
    metric: '3,952 outcomes',
    color: 'oklch(0.72 0.14 25)',
  },
  {
    icon: '🗂️',
    label: '164 Sectors',
    text: 'Exhaustive Indian startup taxonomy — from Fintech to DeepTech, AgriTech to SpaceTech. Every niche covered with sector-specific benchmarks.',
    metric: '27 verticals',
    color: 'oklch(0.65 0.16 155)',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function TrustSignals() {
  return (
    <section className="grain relative py-28 px-6 bg-gradient-to-b from-[oklch(0.12_0.012_250)] via-[oklch(0.14_0.015_250)] to-[oklch(0.12_0.012_250)]">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <p className="text-[11px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.2em] mb-4">Why founders trust us</p>
          <h2 className="font-heading text-3xl sm:text-[2.75rem] text-[oklch(0.97_0.002_250)] leading-tight">Not a Random Number Generator</h2>
          <p className="mt-5 text-base text-[oklch(0.68_0.01_250)] max-w-lg mx-auto leading-relaxed">
            When an investor asks &ldquo;how did you arrive at this valuation?&rdquo; — you&apos;ll have a real answer.
          </p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map((s) => (
            <motion.div key={s.label} variants={cardVariants} className="glass-card group relative p-6 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">{s.icon}</span>
                <span className="text-xs font-bold text-[oklch(0.88_0.005_250)] uppercase tracking-[0.12em]">{s.label}</span>
                <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: s.color, backgroundColor: `color-mix(in oklch, ${s.color} 12%, transparent)` }}>{s.metric}</span>
              </div>
              <p className="text-sm text-[oklch(0.68_0.01_250)] leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
