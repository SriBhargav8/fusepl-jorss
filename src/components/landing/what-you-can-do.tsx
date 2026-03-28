'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ThreeDTilt } from '../ui/three-d-tilt'

const BLOCKS: { title: string; desc: string; icon: ReactNode; color: string }[] = [
  {
    title: 'Free Startup Valuation Engine',
    desc: 'Estimate your startup valuation using practical inputs and get a clearer view before fundraising.',
    color: 'oklch(0.62 0.22 330)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    title: 'Funding Readiness Guidance',
    desc: 'Understand what investors will expect before a pre-seed or seed conversation.',
    color: 'oklch(0.68 0.14 250)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: 'Cap Table and ESOP Clarity',
    desc: 'Learn how equity, dilution, and founder structuring affect your next round.',
    color: 'oklch(0.72 0.16 300)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: 'Startup India and Grant Navigation',
    desc: 'Get clarity on Startup India, seed fund readiness, and startup support pathways.',
    color: 'oklch(0.78 0.12 80)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
  },
]

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }

export function WhatYouCanDo() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[oklch(0.98_0.002_260)]">
      <div className="section-divider absolute inset-x-0 top-0 opacity-50" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-20"
        >
          <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.3em] mb-5">Features</p>
          <h2 className="font-heading text-4xl sm:text-[3.5rem] text-[oklch(0.15 0.02 260)] leading-tight tracking-tight">
            What You Can <span className="text-gold-gradient italic">Do Here</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-100px' }} 
          className="grid sm:grid-cols-2 gap-8"
        >
          {BLOCKS.map((block) => (
            <ThreeDTilt key={block.title} className="h-full">
              <motion.div 
                variants={cardVariants} 
                className="glass-card group relative p-10 rounded-3xl overflow-hidden text-center sm:text-left h-full transition-all duration-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-[oklch(0.62_0.22_330/0.03)] via-transparent to-transparent pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110" 
                      style={{ 
                        color: block.color, 
                        backgroundColor: `color-mix(in oklch, ${block.color} 10%, white)`, 
                        border: `1.5px solid color-mix(in oklch, ${block.color} 20%, transparent)` 
                      }}
                    >
                      {block.icon}
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl text-[oklch(0.15 0.02 260)] mb-4">{block.title}</h3>
                      <p className="text-[16px] text-[oklch(0.40 0.01 260)] leading-relaxed font-medium">
                        {block.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ThreeDTilt>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
