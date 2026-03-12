'use client'

import { motion } from 'framer-motion'

const SIGNALS = [
  {
    icon: '🏛️',
    label: 'IBBI Registered',
    text: 'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer — the same credentials Shark Tank investors look for.',
    metric: 'Verified',
    color: 'oklch(0.72 0.14 155)',
  },
  {
    icon: '📊',
    label: 'Damodaran Data',
    text: 'Real industry benchmarks from Prof. Aswath Damodaran — the name every serious investor trusts for valuation data.',
    metric: 'Jan 2026',
    color: 'oklch(0.68 0.16 250)',
  },
  {
    icon: '📐',
    label: 'IVS 105 Aligned',
    text: '4 approaches, 10 methods — the same framework used in boardroom-level valuations and regulatory filings.',
    metric: '10 methods',
    color: 'oklch(0.82 0.12 75)',
  },
  {
    icon: '🎲',
    label: 'Monte Carlo',
    text: 'Your valuation isn\'t one number — it\'s 10,000 simulated scenarios showing the full range of what you\'re worth.',
    metric: '10K scenarios',
    color: 'oklch(0.68 0.18 300)',
  },
  {
    icon: '⚖️',
    label: 'IBC Case Law',
    text: '190+ landmark IBC cases analyzed so your downside estimates are grounded in real legal outcomes, not guesswork.',
    metric: '3,952 outcomes',
    color: 'oklch(0.70 0.16 25)',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
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

export function TrustSignals() {
  return (
    <section className="grain relative py-28 px-6 bg-gradient-to-b from-[oklch(0.10_0.008_260)] via-[oklch(0.12_0.01_260)] to-[oklch(0.10_0.008_260)]">
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
            Why founders trust us
          </p>
          <h2 className="font-heading text-3xl sm:text-[2.75rem] text-[oklch(0.97_0.005_80)] leading-tight">
            Not a Random Number Generator
          </h2>
          <p className="mt-5 text-base text-[oklch(0.65_0.01_260)] max-w-lg mx-auto leading-relaxed">
            When a Shark asks &ldquo;how did you arrive at this valuation?&rdquo; — you&apos;ll have a real answer.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SIGNALS.map((signal) => (
            <motion.div
              key={signal.label}
              variants={cardVariants}
              className="glass-card group relative p-6 rounded-2xl overflow-hidden"
            >
              {/* Colored top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${signal.color}, transparent)` }}
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">{signal.icon}</span>
                <span className="text-xs font-bold text-[oklch(0.85_0.005_80)] uppercase tracking-[0.12em]">
                  {signal.label}
                </span>
                <span
                  className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full tabular-nums"
                  style={{
                    color: signal.color,
                    backgroundColor: `color-mix(in oklch, ${signal.color} 10%, transparent)`,
                  }}
                >
                  {signal.metric}
                </span>
              </div>
              <p className="text-sm text-[oklch(0.68_0.01_260)] leading-relaxed">
                {signal.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
