'use client'

import { motion } from 'framer-motion'

const STEPS = [
  { num: '01', title: 'Paste Your Website', desc: 'Drop your startup URL and we auto-detect your sector, team, and key details. Or fill in manually.', time: '30 seconds', color: 'oklch(0.72 0.17 162)' },
  { num: '02', title: 'Answer 6 Simple Questions', desc: 'Company basics, team strength, revenue, market size, strategy, and equity. No jargon.', time: '3-5 minutes', color: 'oklch(0.68 0.14 250)' },
  { num: '03', title: 'Get Your Valuation', desc: '10 methods run simultaneously. Monte Carlo simulates 10,000 scenarios. You get a defensible range.', time: 'Instant', color: 'oklch(0.72 0.16 300)' },
]

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }
const stepVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export function HowItWorks() {
  return (
    <section className="grain relative py-28 px-6">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <p className="text-[11px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.2em] mb-4">How It Works</p>
          <h2 className="font-heading text-3xl sm:text-[2.75rem] text-[oklch(0.97_0.002_250)] leading-tight">From Zero to Valuation in 5 Minutes</h2>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <motion.div key={step.num} variants={stepVariants} className="glass-card relative p-7 rounded-2xl text-center overflow-hidden">
              <div className="absolute top-3 right-4 text-[5rem] font-heading leading-none font-bold opacity-[0.04] select-none pointer-events-none" style={{ color: step.color }}>{step.num}</div>
              {idx < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-[4.5rem] -right-3 z-10 text-[oklch(0.40_0.01_250)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `color-mix(in oklch, ${step.color} 12%, transparent)`, border: `1px solid color-mix(in oklch, ${step.color} 25%, transparent)` }}>
                  <span className="text-lg font-heading font-bold" style={{ color: step.color }}>{step.num}</span>
                </div>
              </div>
              <h3 className="font-heading text-xl text-[oklch(0.95_0.002_250)] mb-3">{step.title}</h3>
              <p className="text-sm text-[oklch(0.65_0.01_250)] leading-relaxed mb-4">{step.desc}</p>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full" style={{ color: step.color, backgroundColor: `color-mix(in oklch, ${step.color} 10%, transparent)` }}>{step.time}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
