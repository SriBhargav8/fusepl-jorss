'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const QUALIFICATIONS: { label: string; value: string; detail: string; icon: ReactNode }[] = [
  {
    label: 'IBBI Registration',
    value: 'Insolvency Professional',
    detail: 'Insolvency and Bankruptcy Board of India — the gold standard for distressed asset valuation and recovery analysis in India.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: 'SFA License',
    value: 'Registered Valuer',
    detail: 'Securities and Facilities Association licensed valuer — authorized to provide formal valuation opinions for regulatory compliance.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: 'IVS 105 Framework',
    value: 'International Standard',
    detail: 'Every valuation follows IVS 105 (Valuation Approaches and Methods) — the same framework used in boardroom-level institutional valuations.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
]

export function FounderAuthority() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[oklch(0.985_0.002_260)]">
      <div className="section-divider absolute inset-x-0 top-0 opacity-50" />
      
      {/* Dynamic background accent */}
      <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[oklch(0.62_0.22_330/0.05)] blur-[140px] pointer-events-none animate-pulse" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-16 lg:gap-24 items-center">
          {/* Narrative Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.3em] mb-6">The Expertise</p>
            <h2 className="font-heading text-4xl sm:text-[3.5rem] text-[oklch(0.15 0.02 260)] leading-[1.1] tracking-tight mb-8">
              Not Another <br />
              <span className="text-gold-gradient italic">AI Number Generator</span>
            </h2>
            <div className="space-y-6 text-[16px] text-[oklch(0.40 0.01 260)] leading-relaxed font-medium">
              <p>
                Most startup valuation tools provide a number with no rigorous methodology behind it. 
                This platform is different — it was built by a practising **IBBI-registered insolvency professional** 
                who has seen valuations challenged in NCLT proceedings, investor due diligence, and M&A negotiations.
              </p>
              <p>
                Every method, every benchmark, and every assumption is documented and defensible. 
                When an investor asks <span className="text-[oklch(0.62 0.22 330)] font-bold italic">&ldquo;how did you arrive at this valuation?&rdquo;</span> 
                — you&apos;ll have a professional, institutional-grade answer.
              </p>
            </div>

            {/* Proof Tags */}
            <div className="mt-10 flex flex-wrap gap-3">
              {['IVS 105 Aligned', 'Rule 11UA Compliant', 'FEMA NDI Ready', 'IBC Case Law'].map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full border border-[oklch(0.62_0.22_330/0.15)] bg-white text-[oklch(0.62 0.22 330)] shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Credential Cards */}
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: '-100px' }} 
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }} 
            className="space-y-5"
          >
            {QUALIFICATIONS.map((q) => (
              <motion.div
                key={q.label}
                variants={{ 
                  hidden: { opacity: 0, scale: 0.95, y: 10 }, 
                  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } 
                }}
                className="glass-card group relative p-6 rounded-3xl"
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[oklch(0.62_0.22_330/0.08)] text-[oklch(0.62 0.22 330)] shrink-0 shadow-sm border border-[oklch(0.62_0.22_330/0.1)]">
                    {q.icon}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em]">{q.label}</span>
                      <span className="text-[11px] font-bold text-[oklch(0.25 0.02 260)]">{q.value}</span>
                    </div>
                    <p className="text-[13px] text-[oklch(0.45 0.01 260)] leading-relaxed font-medium">{q.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
