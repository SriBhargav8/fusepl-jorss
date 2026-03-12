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
// Stats — Shark Tank style authority numbers
// ---------------------------------------------------------------------------
const STATS = [
  { end: 10, suffix: '', label: 'Methods', detail: 'Like the Sharks use' },
  { end: 4, suffix: '', label: 'Approaches', detail: 'Income, Market, Asset, VC' },
  { end: 25, suffix: '+', label: 'Sectors', detail: 'Every Indian Industry' },
  { end: 10, suffix: 'K', label: 'Simulations', detail: 'Monte Carlo Power' },
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
        <div className="absolute top-[-35%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[oklch(0.78_0.14_80/0.06)] blur-[140px] animate-[hero-glow_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-[-25%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[oklch(0.55_0.15_250/0.04)] blur-[120px] animate-[hero-glow_14s_ease-in-out_infinite_alternate-reverse]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 48px)',
          }}
        />
      </div>

      {/* ---- Shark silhouette — authority visual ---- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="absolute top-[8%] right-[5%] w-[280px] sm:w-[380px] lg:w-[460px] opacity-[0.04] pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M750 300c0-30-20-80-60-120-40-40-100-70-170-85l-30-80c-5-15-25-15-30 0l-25 65c-30-5-60-8-95-8-150 0-260 70-290 140-10 20-15 45-15 70 0 25 5 48 15 68 30 65 130 130 280 140l20 2c20 2 40 3 60 3 200 0 340-90 340-195zM380 180c-15 0-25-12-25-25s10-25 25-25 25 12 25 25-10 25-25 25zm-80 120l-90 50c-5 3-10-3-8-8l30-90c2-5 8-6 12-3l60 40c4 3 3 9-4 11z"
            fill="oklch(0.78 0.14 80)"
          />
          <path
            d="M500 250c60-15 110 5 140 30s45 55 45 80c0 40-30 80-85 110"
            stroke="oklch(0.78 0.14 80)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      {/* ---- Authority Badge ---- */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[oklch(0.78_0.14_80/0.2)] bg-[oklch(0.78_0.14_80/0.06)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.16_155)] animate-pulse" />
          <span className="text-[11px] font-semibold text-[oklch(0.80_0.12_80)] uppercase tracking-[0.18em]">
            Free During Beta
          </span>
        </span>
      </motion.div>

      {/* ---- Headline — Shark Tank energy ---- */}
      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-heading text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.05] tracking-tight max-w-5xl"
      >
        <span className="text-[oklch(0.93_0.005_80)]">
          What&apos;s Your Startup
        </span>
        <br />
        <span className="text-gold-gradient">
          Really Worth?
        </span>
      </motion.h1>

      {/* ---- Sub-headline — approachable authority ---- */}
      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-7 text-[clamp(0.95rem,1.5vw,1.15rem)] text-[oklch(0.58_0.01_260)] max-w-2xl leading-relaxed"
      >
        The same valuation rigour that Shark Tank investors demand — now available to every Indian founder.
        <span className="text-[oklch(0.78_0.14_80)] font-medium"> 5 minutes. 10 methods. Institutional-grade numbers.</span>
      </motion.p>

      {/* ---- Trust line ---- */}
      <motion.p
        custom={2.5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-3 text-xs text-[oklch(0.46_0.01_260)]"
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
          className="group relative inline-flex items-center justify-center h-13 px-10 text-base font-semibold tracking-wide bg-[oklch(0.78_0.14_80)] text-[oklch(0.10_0_0)] rounded-xl transition-all duration-300 hover:bg-[oklch(0.82_0.14_80)] hover:shadow-[0_0_48px_oklch(0.78_0.14_80/0.3)] active:scale-[0.97]"
        >
          Value My Startup — Free
          <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link
          href="/deal-check"
          className="inline-flex items-center justify-center h-13 px-8 text-base font-medium tracking-wide border border-[oklch(0.78_0.14_80/0.2)] text-[oklch(0.70_0.05_80)] rounded-xl transition-all duration-300 hover:border-[oklch(0.78_0.14_80/0.35)] hover:text-[oklch(0.85_0.10_80)] hover:bg-[oklch(0.78_0.14_80/0.04)]"
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
        className="mt-6 text-[10px] text-[oklch(0.46_0.01_260)]"
      >
        No signup required &bull; Results in under 5 minutes &bull; Powered by Damodaran India data
      </motion.div>

      {/* ---- Stat counters ---- */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-[oklch(0.78_0.14_80/0.08)] rounded-xl overflow-hidden border border-[oklch(0.78_0.14_80/0.08)]"
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
      <span className="text-xs text-[oklch(0.58_0.01_260)] uppercase tracking-[0.15em] font-medium">
        {label}
      </span>
      <span className="text-[10px] text-[oklch(0.46_0.01_260)] mt-0.5">
        {detail}
      </span>
    </div>
  )
}
