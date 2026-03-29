'use client'

import { motion } from 'framer-motion'

const CREDENTIALS = [
  { label: 'IBBI Registered', detail: 'Insolvency Professional' },
  { label: 'SFA Licensed', detail: 'Registered Valuer' },
  { label: 'IVS 105', detail: 'Valuation Standards' },
  { label: 'Rule 11UA', detail: 'Income Tax Act' },
  { label: 'FEMA NDI', detail: 'Cross-Border Compliance' },
  { label: 'Damodaran India', detail: 'Jan 2026 Benchmarks' },
  { label: '10 Methods', detail: '4 Approaches' },
  { label: '164 Sectors', detail: 'Indian Startup Taxonomy' },
  { label: 'Monte Carlo', detail: '10,000 Simulations' },
  { label: 'IBC Case Law', detail: '3,952 Outcomes' },
]

export function AuthorityBrands() {
  return (
    <section className="relative py-12 overflow-hidden bg-[oklch(0.985_0.002_260)] border-y border-[oklch(0.15_0.02_260/0.05)]">
      {/* Soft masks for the marquee edges */}
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[oklch(0.985_0.002_260)] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[oklch(0.985_0.002_260)] to-transparent z-10 pointer-events-none" />

      <motion.p 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }}
        className="text-center text-[9px] font-bold text-[oklch(0.55_0.01_260)] uppercase tracking-[0.4em] mb-8"
      >
        Standards, Data Sources &amp; Professional Rigour
      </motion.p>

      <div className="relative">
        <motion.div 
          className="flex gap-8 w-max" 
          animate={{ x: ['0%', '-50%'] }} 
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {[...CREDENTIALS, ...CREDENTIALS].map((b, i) => (
            <div key={`${b.label}-${i}`} className="group flex items-center gap-4 px-6 py-3 rounded-2xl border border-[oklch(0.15_0.02_260/0.08)] bg-white/50 backdrop-blur-sm shrink-0 transition-all duration-300 hover:border-[oklch(0.62_0.22_330/0.3)] hover:shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[oklch(0.15 0.02 260)] tracking-tight">{b.label}</span>
                <span className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-wider opacity-70">{b.detail}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
