'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCounter(end: number, duration = 2000) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setValue(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return { value, ref }
}

const STATS = [
  { end: 10, suffix: '', label: 'Methods', detail: 'Institutional-grade' },
  { end: 4, suffix: '', label: 'Approaches', detail: 'Income, Market, Asset, VC' },
  { end: 164, suffix: '', label: 'Sectors', detail: 'Every Indian industry' },
  { end: 10, suffix: 'K', label: 'Simulations', detail: 'Monte Carlo powered' },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  return (
    <section className="grain relative isolate w-full min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(1 0 0)] via-[oklch(0.985 0.002 260)] to-[oklch(0.98 0.002 260)]" />
        {/* Teal glow */}
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[oklch(0.62_0.22_330/0.07)] blur-[180px] animate-[hero-glow_12s_ease-in-out_infinite_alternate]" />
        {/* Teal accent */}
        <div className="absolute bottom-[-20%] right-[-8%] w-[600px] h-[600px] rounded-full bg-[oklch(0.75_0.18_162/0.06)] blur-[140px] animate-[hero-glow_16s_ease-in-out_infinite_alternate-reverse]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(oklch(0.25 0 0 / 0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Badge */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[oklch(0.62_0.22_330/0.25)] bg-[oklch(0.62_0.22_330/0.08)]">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.62 0.22 330)] animate-pulse" />
          <span className="text-[11px] font-semibold text-[oklch(0.75 0.18 162)] uppercase tracking-[0.2em]">
            Free During Beta
          </span>
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
        className="font-heading text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] tracking-tight max-w-4xl"
      >
        <span className="text-[oklch(0.15 0.02 260)]">What&apos;s Your Startup</span>
        <br />
        <span className="text-gold-gradient">Really Worth?</span>
      </motion.h1>

      {/* Subhead */}
      <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="mt-7 text-[clamp(1rem,1.5vw,1.15rem)] text-[oklch(0.35 0.01 260)] max-w-2xl leading-relaxed"
      >
        India&apos;s most rigorous startup valuation engine. 164 sectors, 10 institutional methods, Damodaran benchmarks.
        <span className="text-[oklch(0.75 0.18 162)] font-medium"> Get your number in 5 minutes.</span>
      </motion.p>

      {/* Credential strip — elevated */}
      <motion.div custom={2.5} variants={fadeUp} initial="hidden" animate="visible"
        className="mt-4 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl border border-[oklch(0.62_0.22_330/0.12)] bg-[oklch(0.62_0.22_330/0.04)]"
      >
        <div className="w-6 h-6 rounded-md bg-[oklch(0.62_0.22_330/0.15)] flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-[oklch(0.62 0.22 330)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span className="text-xs text-[oklch(0.40 0.01 260)]">
          Built by an <span className="font-semibold text-[oklch(0.75 0.18 162)]">IBBI-Registered Insolvency Professional</span> &amp; <span className="font-semibold text-[oklch(0.75 0.18 162)]">SFA-Licensed Valuer</span>
        </span>
      </motion.div>

      {/* CTAs */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
        className="flex flex-wrap justify-center gap-4 mt-10"
      >
        <Link href="/valuation"
          className="btn-press group inline-flex items-center justify-center h-14 px-10 text-base font-semibold tracking-wide rounded-2xl bg-[#32373c] text-white transition-all duration-300 hover:bg-[#1d2024] hover:shadow-[0_4px_24px_oklch(0_0_0/0.2)] hover:scale-[1.02]"
        >
          Value My Startup — Free
          <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link href="/deal-check"
          className="btn-press inline-flex items-center justify-center h-14 px-8 text-base font-medium tracking-wide rounded-2xl border border-[oklch(0.80 0.015 260)] text-[oklch(0.25 0.02 260)] transition-all duration-300 hover:border-[oklch(0.62_0.22_330/0.4)] hover:text-[oklch(0.62_0.22_330)] hover:bg-[oklch(0.62_0.22_330/0.08)]"
        >
          Investor Deal Check
        </Link>
      </motion.div>

      {/* Micro-strip */}
      <motion.div custom={3.5} variants={fadeUp} initial="hidden" animate="visible"
        className="mt-6 flex items-center gap-3 text-[11px] text-[oklch(0.45 0.01 260)]"
      >
        <span>No signup required</span>
        <span className="w-1 h-1 rounded-full bg-[oklch(0.80 0.01 260)]" />
        <span>Results in under 5 minutes</span>
        <span className="w-1 h-1 rounded-full bg-[oklch(0.80 0.01 260)]" />
        <span>Powered by Damodaran India data</span>
      </motion.div>

      {/* Stats */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
      >
        {STATS.map((stat) => <StatItem key={stat.label} {...stat} />)}
      </motion.div>
    </section>
  )
}

function StatItem({ end, suffix, label, detail }: (typeof STATS)[number]) {
  const { value, ref } = useCounter(end)
  return (
    <div className="glass-card flex flex-col items-center gap-1.5 py-6 px-5 rounded-2xl">
      <span ref={ref} className="text-3xl sm:text-4xl font-heading tabular-nums text-gold-gradient">
        {value.toLocaleString()}{suffix}
      </span>
      <span className="text-xs text-[oklch(0.25 0.02 260)] uppercase tracking-[0.15em] font-medium">{label}</span>
      <span className="text-[10px] text-[oklch(0.45 0.01 260)]">{detail}</span>
    </div>
  )
}
