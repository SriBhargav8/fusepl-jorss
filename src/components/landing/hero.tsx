'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
const STATS = [
  { end: 10, suffix: '', label: 'Methods', detail: 'IVS 105 Aligned' },
  { end: 4, suffix: '', label: 'Approaches', detail: 'Income, Market, Asset, VC' },
  { end: 25, suffix: '+', label: 'Sectors', detail: 'Damodaran India Data' },
  { end: 10, suffix: 'K', label: 'Simulations', detail: 'Monte Carlo Engine' },
] as const

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Hero() {
  return (
    <section className="grain relative isolate w-full min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
      {/* ---- Gradient mesh background ---- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[oklch(0.08_0.008_260)]" />
        {/* Primary warm glow */}
        <div className="absolute top-[-35%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[oklch(0.78_0.14_80/0.06)] blur-[140px] animate-[hero-glow_10s_ease-in-out_infinite_alternate]" />
        {/* Secondary cool glow for depth */}
        <div className="absolute bottom-[-25%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[oklch(0.55_0.15_250/0.04)] blur-[120px] animate-[hero-glow_14s_ease-in-out_infinite_alternate-reverse]" />
        {/* Fine diagonal lines for texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 48px)',
          }}
        />
      </div>

      {/* ---- Badge ---- */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[oklch(0.78_0.14_80/0.2)] bg-[oklch(0.78_0.14_80/0.06)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.14_80)] animate-pulse" />
          <span className="text-[11px] font-semibold text-[oklch(0.80_0.12_80)] uppercase tracking-[0.18em]">
            Built by an IBBI-Registered Valuer
          </span>
        </span>
      </motion.div>

      {/* ---- Headline ---- */}
      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-heading text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] tracking-tight max-w-5xl"
      >
        <span className="text-gold-gradient">
          India&apos;s Most Rigorous
        </span>
        <br />
        <span className="text-[oklch(0.93_0.005_80)]">
          Startup Valuation
        </span>
      </motion.h1>

      {/* ---- Sub-headline ---- */}
      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-7 text-[clamp(0.95rem,1.5vw,1.15rem)] text-[oklch(0.50_0.01_260)] max-w-2xl leading-relaxed font-light"
      >
        4 approaches. 10 valuation methods. 10,000 Monte Carlo simulations.
        Powered by Damodaran India benchmarks. Aligned with IVS 105, Rule 11UA, and FEMA NDI Rules.
      </motion.p>

      {/* ---- CTAs ---- */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-4 mt-11"
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

      {/* ---- Stat counters ---- */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[oklch(0.78_0.14_80/0.08)] rounded-xl overflow-hidden border border-[oklch(0.78_0.14_80/0.08)]"
      >
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </motion.div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Stat counter sub-component
// ---------------------------------------------------------------------------
function StatItem({ end, suffix, label, detail }: (typeof STATS)[number]) {
  const { value, ref } = useCounter(end)

  return (
    <div className="flex flex-col items-center gap-1 py-6 px-5 bg-[oklch(0.08_0.008_260)]">
      <span
        ref={ref}
        className="text-3xl sm:text-4xl font-heading tabular-nums text-gold-gradient"
      >
        {value.toLocaleString()}
        {suffix}
      </span>
      <span className="text-xs text-[oklch(0.55_0.01_260)] uppercase tracking-[0.15em] font-medium">
        {label}
      </span>
      <span className="text-[10px] text-[oklch(0.40_0.01_260)] mt-0.5">
        {detail}
      </span>
    </div>
  )
}
