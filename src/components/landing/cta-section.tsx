'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.10_0.008_260)] via-[oklch(0.14_0.025_75)] to-[oklch(0.10_0.008_260)]" />

      {/* Warm glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[oklch(0.82_0.12_75/0.07)] blur-[180px]" />
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-[oklch(0.55_0.15_270/0.04)] blur-[120px]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.90 0 0 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.90 0 0 / 0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] font-semibold text-[oklch(0.82_0.12_75)] uppercase tracking-[0.2em] mb-5"
        >
          Ready to pitch?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="font-heading text-3xl sm:text-4xl lg:text-[3.25rem] text-[oklch(0.97_0.005_80)] leading-[1.1]"
        >
          Walk Into Any Room With
          <br />
          <span className="text-gold-gradient">Numbers That Command Respect</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-6 text-base sm:text-lg text-[oklch(0.68_0.01_260)] max-w-lg mx-auto leading-relaxed"
        >
          Whether you&apos;re pitching to investors, negotiating a deal, or planning your next round —
          know exactly what your startup is worth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          <Link
            href="/valuation"
            className="btn-press group relative inline-flex items-center justify-center h-14 px-10 text-base font-semibold tracking-wide rounded-2xl transition-all duration-300 bg-gradient-to-r from-[oklch(0.82_0.12_75)] to-[oklch(0.75_0.14_80)] text-[oklch(0.10_0_0)] hover:shadow-[0_0_50px_oklch(0.82_0.12_75/0.35)] hover:scale-[1.02] active:scale-[0.97]"
          >
            Get Your Valuation
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/deal-check"
            className="btn-press inline-flex items-center justify-center h-14 px-8 text-base font-medium tracking-wide rounded-2xl border border-[oklch(0.40_0.01_260)] text-[oklch(0.80_0.005_80)] transition-all duration-300 hover:border-[oklch(0.82_0.12_75/0.4)] hover:text-[oklch(0.92_0.08_75)] hover:bg-[oklch(0.82_0.12_75/0.06)] backdrop-blur-sm"
          >
            Investor Deal Check
          </Link>
        </motion.div>

        {/* Trust micro-strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-5 text-[11px] text-[oklch(0.55_0.01_260)] uppercase tracking-[0.12em]"
        >
          <span>IVS 105 Aligned</span>
          <span className="w-1 h-1 rounded-full bg-[oklch(0.35_0.01_260)]" />
          <span>10 Methods</span>
          <span className="w-1 h-1 rounded-full bg-[oklch(0.35_0.01_260)]" />
          <span>Damodaran Data</span>
        </motion.div>
      </div>
    </section>
  )
}
