'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useModal } from '@/components/providers/modal-provider'

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
  const { openLeadModal } = useModal()
  return (
    <section className="relative isolate w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden bg-[oklch(0.99_0.001_260)]">
      {/* Premium Minimal Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden [perspective:2000px]">
        {/* 3D Glass Shards */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <DataShard i={0} className="top-[15%] left-[10%] w-32 h-32" color="gold" />
          <DataShard i={1} className="top-[25%] right-[15%] w-40 h-40" color="blue" />
          <DataShard i={2} className="bottom-[20%] left-[20%] w-28 h-28" color="blue" />
          <DataShard i={3} className="bottom-[15%] right-[10%] w-36 h-36" color="gold" />
          <DataShard i={4} className="top-[45%] left-[5%] w-24 h-24 hidden xl:block" color="gold" />
          <DataShard i={5} className="bottom-[45%] right-[5%] w-24 h-24 hidden xl:block" color="blue" />
        </div>

        {/* Crisp Analytical Grid */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{ 
            backgroundImage: `radial-gradient(oklch(0.15 0.02 260) 0.75px, transparent 0.75px)`,
            backgroundSize: '32px 32px'
          }} 
        />
        
        {/* Soft Modern Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-[oklch(0.62_0.22_330/0.05)] blur-[120px]" />
          <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] rounded-full bg-[oklch(0.75_0.18_162/0.04)] blur-[100px]" />
        </div>

        {/* Fine-line structure */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '128px 128px'
          }} 
        />
      </div>
      
      {/* Noise overlay refined */}
      <div className="absolute inset-0 -z-10 grain opacity-[0.015] pointer-events-none" />

      {/* Hero Content */}
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[oklch(0.62_0.22_330/0.2)] bg-[oklch(1_0_0/0.6)] backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[oklch(0.62 0.22 330)] animate-pulse" />
            <span className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em]">
              Institutional-Grade Valuation
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="font-heading text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.1] tracking-tight max-w-5xl px-4"
        >
          <span className="text-[oklch(0.15 0.02 260)]">Know Your Startup’s </span>
          <br className="hidden sm:block" />
          <span className="text-gold-gradient italic px-1">Valuation</span>
          <span className="text-[oklch(0.15 0.02 260)]"> Before You Raise</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="mt-8 text-[clamp(0.95rem,1.5vw,1.15rem)] text-[oklch(0.35 0.01 260)] max-w-2xl leading-snug font-medium"
        >
          Use our free startup valuation engine to estimate your startup’s valuation, understand how investors may think about your business, and take the next step with more confidence.
        </motion.p>

        {/* Professional Trust Badge */}
        <motion.div custom={2.5} variants={fadeUp} initial="hidden" animate="visible" className="mt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-[oklch(0.91_0.005_260)] bg-white shadow-xl ring-1 ring-[oklch(0.15_0.02_260/0.15)]">
            <div className="w-8 h-8 rounded-full bg-[oklch(0.62_0.22_330/0.08)] flex items-center justify-center border border-[oklch(0.62_0.22_330/0.15)]">
              <svg className="w-4 h-4 text-[oklch(0.62 0.22 330)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.742c0 5.83 3.92 10.79 9.313 12.233a12.008 12.008 0 009.311-12.233c0-1.305-.208-2.56-.596-3.742a11.959 11.959 0 01-8.403-3.742z" />
              </svg>
            </div>
            <span className="text-xs font-heading font-medium text-[oklch(0.15 0.02 260)]">
              Built for startup founders who want <span className="text-[oklch(0.62 0.22 330)] font-semibold uppercase tracking-wider text-[10px]">clarity</span> on valuation, fundraising readiness, <span className="text-[oklch(0.62 0.22 330)] font-semibold uppercase tracking-wider text-[10px]">cap table decisions</span>, and <span className="text-[oklch(0.62 0.22 330)] font-semibold uppercase tracking-wider text-[10px]">growth strategy</span>
            </span>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row justify-center gap-4 mt-12 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link href="/valuation"
            className="btn-press group inline-flex items-center justify-center h-14 sm:h-16 px-8 sm:px-12 text-sm sm:text-base font-bold tracking-wide rounded-2xl bg-[#1d2024] text-white transition-all duration-300 hover:bg-black hover:shadow-[0_8px_32px_oklch(0_0_0/0.25)] hover:scale-[1.02] w-full sm:w-auto"
          >
            Try Free Valuation Engine
            <svg className="ml-2.5 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <button 
            onClick={openLeadModal}
            className="btn-press cursor-pointer inline-flex items-center justify-center h-14 sm:h-16 px-8 sm:px-10 text-sm sm:text-base font-semibold tracking-wide rounded-2xl border-2 border-[oklch(0.15_0.02_260/0.1)] text-[oklch(0.15 0.02 260)] backdrop-blur-sm transition-all duration-300 hover:border-[oklch(0.62_0.22_330/0.5)] hover:text-[oklch(0.62_0.22_330)] hover:bg-[oklch(0.62_0.22_330/0.05)] w-full sm:w-auto"
          >
            Book Valuation Review
          </button>
        </motion.div>

        {/* Secondary Trust Labels */}
        <motion.div custom={3.5} variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-2 sm:gap-y-3 mt-8 px-4"
        >
          <span className="text-[9px] sm:text-[10px] font-bold text-[oklch(0.45 0.01 260)] uppercase tracking-[0.15em]">No signup required</span>
          <span className="text-[9px] sm:text-[10px] font-bold text-[oklch(0.45 0.01 260)] uppercase tracking-[0.15em]">Results in 5 mins</span>
          <span className="text-[9px] sm:text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.15em]">Damodaran Data</span>
        </motion.div>

        {/* Stats Section with Floating Animation */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
          className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <StatItem {...stat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
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

function DataShard({ i, className, color }: { i: number; className: string; color: 'gold' | 'blue' }) {
  const colorStyles = color === 'gold' 
    ? 'border-[oklch(0.62_0.22_330/0.2)] bg-[oklch(1_0_0/0.4)] shadow-[0_0_20px_oklch(0.62_0.22_330/0.1)]' 
    : 'border-[oklch(0.75_0.18_162/0.2)] bg-[oklch(1_0_0/0.4)] shadow-[0_0_20px_oklch(0.75_0.18_162/0.1)]'
    
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateX: 0, rotateY: 0 }}
      animate={{ 
        opacity: [0.3, 0.45, 0.3],
        scale: 1,
        y: [0, -20, 0],
        rotateX: [15, -15, 15],
        rotateY: [-15, 15, -15]
      }}
      transition={{ 
        duration: 8 + i * 2, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: i * 0.5
      }}
      className={`absolute rounded-2xl border backdrop-blur-sm ${colorStyles} ${className} flex items-center justify-center p-4 [transform-style:preserve-3d]`}
    >
      <div className="w-full h-full rounded-xl border border-white/40 bg-white/10 flex items-center justify-center [transform:translateZ(20px)]">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={color === 'gold' ? 'oklch(0.62 0.22 330)' : 'oklch(0.75 0.18 162)'} 
          strokeWidth={1.5} 
          className="w-1/2 h-1/2 opacity-70"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      </div>
      {/* 3D Depth Accents */}
      <div className="absolute inset-0 rounded-2xl border-r-2 border-b-2 border-black/5 [transform:translateZ(-10px)]" />
    </motion.div>
  )
}
