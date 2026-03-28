'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useModal } from '@/components/providers/modal-provider'

export function CtaSection() {
  const { openLeadModal } = useModal()

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.98 0.002 260)] via-[oklch(0.97 0.003 260)] to-[oklch(0.98 0.002 260)]" />
      {/* Larger, more directional glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-[oklch(0.62_0.22_330/0.08)] blur-[200px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[oklch(0.55_0.15_250/0.04)] blur-[120px]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(oklch(0.25 0 0 / 0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[11px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-5">Take the next step</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="font-heading text-3xl sm:text-4xl lg:text-[3.25rem] text-[oklch(0.15 0.02 260)] leading-tight tracking-tight">
          Start With <span className="text-gold-gradient italic">Clarity</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-6 text-base sm:text-lg text-[oklch(0.40 0.01 260)] max-w-lg mx-auto leading-relaxed font-medium">
          Get an indicative estimate with our free engine, or book a strategy session with <b>MKW Advisors</b> for a professional deep-dive review.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-4 mt-10">
          <Link href="/valuation" className="btn-press group inline-flex items-center justify-center h-14 px-10 text-base font-bold tracking-wide rounded-2xl bg-[#1d2024] text-white transition-all duration-300 hover:bg-black hover:shadow-[0_8px_32px_oklch(0_0_0/0.25)] hover:scale-[1.02]">
            Try Free Valuation Engine
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <button 
            onClick={openLeadModal}
            className="btn-press cursor-pointer inline-flex items-center justify-center h-14 px-8 text-base font-semibold tracking-wide rounded-2xl border-2 border-[oklch(0.15_0.02_260/0.1)] text-[oklch(0.15 0.02 260)] backdrop-blur-sm transition-all duration-300 hover:border-[oklch(0.62_0.22_330/0.5)] hover:text-[oklch(0.62_0.22_330)] hover:bg-[oklch(0.62_0.22_330/0.05)]"
          >
            Book Valuation Review
          </button>
        </motion.div>

        {/* Bottom proof strip — more visual weight */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-12 inline-flex items-center gap-6 px-6 py-3 rounded-xl border border-[oklch(0.91 0.005 260/0.5)] bg-[oklch(0.97 0.003 260/0.4)] backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="oklch(0.62 0.22 330)" strokeWidth={1.8} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-[11px] text-[oklch(0.45 0.01 260)] uppercase tracking-[0.1em]">IVS 105</span>
          </div>
          <span className="w-px h-4 bg-[oklch(0.91 0.005 260)]" />
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="oklch(0.68 0.14 250)" strokeWidth={1.8} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
            <span className="text-[11px] text-[oklch(0.45 0.01 260)] uppercase tracking-[0.1em]">10 Methods</span>
          </div>
          <span className="w-px h-4 bg-[oklch(0.91 0.005 260)]" />
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="oklch(0.78 0.12 80)" strokeWidth={1.8} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <span className="text-[11px] text-[oklch(0.45 0.01 260)] uppercase tracking-[0.1em]">Damodaran Data</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
