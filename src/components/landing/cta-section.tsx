'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Dark-to-gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0.008_260)] via-[oklch(0.10_0.02_80)] to-[oklch(0.08_0.008_260)]" />

      {/* Central gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[oklch(0.78_0.14_80/0.06)] blur-[160px]" />

      {/* Fine diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 48px)',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] font-semibold text-[oklch(0.78_0.14_80)] uppercase tracking-[0.2em] mb-5"
        >
          Start now
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[oklch(0.93_0.005_80)] leading-[1.1]"
        >
          Know Your Startup&apos;s
          <br />
          <span className="text-gold-gradient">True Worth</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-5 text-sm sm:text-base text-[oklch(0.50_0.01_260)] max-w-lg mx-auto leading-relaxed"
        >
          Institutional-grade valuation in under 5 minutes.
          Defensible numbers powered by Damodaran India data.
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
            className="group relative inline-flex items-center justify-center h-12 px-8 text-sm font-semibold tracking-wide bg-[oklch(0.78_0.14_80)] text-[oklch(0.10_0_0)] rounded-lg transition-all duration-300 hover:bg-[oklch(0.82_0.14_80)] hover:shadow-[0_0_40px_oklch(0.78_0.14_80/0.25)] active:scale-[0.97]"
          >
            Get Your Valuation
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/deal-check"
            className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium tracking-wide border border-[oklch(0.78_0.14_80/0.2)] text-[oklch(0.70_0.05_80)] rounded-lg transition-all duration-300 hover:border-[oklch(0.78_0.14_80/0.35)] hover:text-[oklch(0.85_0.10_80)] hover:bg-[oklch(0.78_0.14_80/0.04)]"
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
          className="mt-10 flex items-center justify-center gap-6 text-[10px] text-[oklch(0.40_0.01_260)] uppercase tracking-[0.15em]"
        >
          <span>IVS 105 Aligned</span>
          <span className="w-px h-3 bg-[oklch(0.20_0.008_260)]" />
          <span>10 Methods</span>
          <span className="w-px h-3 bg-[oklch(0.20_0.008_260)]" />
          <span>Damodaran Data</span>
        </motion.div>
      </div>
    </section>
  )
}
