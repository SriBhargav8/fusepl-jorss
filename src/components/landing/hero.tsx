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
  { end: 10, suffix: '', label: 'Methods', detail: 'Like the Sharks use' },
  { end: 4, suffix: '', label: 'Approaches', detail: 'Income, Market, Asset, VC' },
  { end: 25, suffix: '+', label: 'Sectors', detail: 'Every Indian Industry' },
  { end: 10, suffix: 'K', label: 'Simulations', detail: 'Monte Carlo Power' },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  return (
    <section className="grain relative isolate w-full min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
      {/* ---- Rich gradient background ---- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.14_0.015_260)] via-[oklch(0.12_0.01_260)] to-[oklch(0.10_0.008_260)]" />
        {/* Primary warm glow */}
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[oklch(0.82_0.12_75/0.08)] blur-[160px] animate-[hero-glow_10s_ease-in-out_infinite_alternate]" />
        {/* Cool accent glow */}
        <div className="absolute bottom-[-20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[oklch(0.55_0.18_270/0.06)] blur-[140px] animate-[hero-glow_14s_ease-in-out_infinite_alternate-reverse]" />
        {/* Subtle top-left accent */}
        <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[oklch(0.60_0.12_155/0.04)] blur-[120px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(0.90 0 0 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.90 0 0 / 0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ---- Authority Badge ---- */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[oklch(0.82_0.12_75/0.25)] bg-[oklch(0.82_0.12_75/0.06)] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_155)] animate-pulse" />
          <span className="text-[11px] font-semibold text-[oklch(0.88_0.08_75)] uppercase tracking-[0.2em]">
            Free During Beta
          </span>
        </span>
      </motion.div>

      {/* ---- Headline ---- */}
      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-heading text-[clamp(2.8rem,7vw,6rem)] leading-[1.02] tracking-tight max-w-5xl"
      >
        <span className="text-[oklch(0.97_0.005_80)]">
          What&apos;s Your Startup
        </span>
        <br />
        <span className="text-gold-gradient">
          Really Worth?
        </span>
      </motion.h1>

      {/* ---- Sub-headline ---- */}
      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-7 text-[clamp(1rem,1.6vw,1.2rem)] text-[oklch(0.72_0.01_260)] max-w-2xl leading-relaxed"
      >
        The same valuation rigour that Shark Tank investors demand — now available to every Indian founder.
        <span className="text-[oklch(0.88_0.10_75)] font-medium"> 5 minutes. 10 methods. Institutional-grade numbers.</span>
      </motion.p>

      {/* ---- Trust line ---- */}
      <motion.p
        custom={2.5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-3 text-xs text-[oklch(0.58_0.01_260)]"
      >
        Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer
      </motion.p>

      {/* ---- CTAs ---- */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-4 mt-10"
      >
        <Link
          href="/valuation"
          className="btn-press group relative inline-flex items-center justify-center h-14 px-10 text-base font-semibold tracking-wide rounded-2xl transition-all duration-300 bg-gradient-to-r from-[oklch(0.82_0.12_75)] to-[oklch(0.75_0.14_80)] text-[oklch(0.10_0_0)] hover:shadow-[0_0_50px_oklch(0.82_0.12_75/0.35)] hover:scale-[1.02] active:scale-[0.97]"
        >
          Value My Startup — Free
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

      {/* ---- Social proof micro-strip ---- */}
      <motion.div
        custom={3.5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6 text-[11px] text-[oklch(0.55_0.01_260)] flex items-center gap-3"
      >
        <span>No signup required</span>
        <span className="w-1 h-1 rounded-full bg-[oklch(0.40_0.01_260)]" />
        <span>Results in under 5 minutes</span>
        <span className="w-1 h-1 rounded-full bg-[oklch(0.40_0.01_260)]" />
        <span>Powered by Damodaran India data</span>
      </motion.div>

      {/* ---- Stat counters ---- */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
      >
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </motion.div>
    </section>
  )
}

function StatItem({ end, suffix, label, detail }: (typeof STATS)[number]) {
  const { value, ref } = useCounter(end)

  return (
    <div className="glass-card flex flex-col items-center gap-1.5 py-6 px-5 rounded-2xl">
      <span
        ref={ref}
        className="text-3xl sm:text-4xl font-heading tabular-nums text-gold-gradient"
      >
        {value.toLocaleString()}
        {suffix}
      </span>
      <span className="text-xs text-[oklch(0.75_0.005_80)] uppercase tracking-[0.15em] font-medium">
        {label}
      </span>
      <span className="text-[10px] text-[oklch(0.55_0.01_260)]">
        {detail}
      </span>
    </div>
  )
}
