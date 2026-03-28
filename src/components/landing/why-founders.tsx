'use client'

import { motion } from 'framer-motion'
import { ThreeDTilt } from '../ui/three-d-tilt'

const POINTS = [
  'Free startup valuation estimate',
  'Founder-friendly funding readiness guidance',
  'Practical clarity before investor conversations',
  'Expert support when you need more than a calculator',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function WhyFounders() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[oklch(0.985_0.002_260)]">
      <div className="section-divider absolute inset-x-0 top-0 opacity-50" />
      
      <div className="max-w-4xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
          className="text-center mb-16"
        >
          <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.3em] mb-5">Benefits</p>
          <h2 className="font-heading text-4xl sm:text-5xl text-[oklch(0.15 0.02 260)] leading-tight tracking-tight">
            Why Founders Use <br className="sm:hidden" />
            <span className="text-gold-gradient italic">First Unicorn</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {POINTS.map((point, i) => (
            <ThreeDTilt key={point} className="h-full">
              <motion.div 
                variants={itemVariants}
                className="glass-card flex items-center gap-4 p-6 rounded-2xl group transition-all duration-300 hover:shadow-xl hover:border-[oklch(0.62_0.22_330/0.3)] h-full"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[oklch(0.62_0.22_330/0.08)] text-[oklch(0.62 0.22 330)] shrink-0 border border-[oklch(0.62_0.22_330/0.1)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-[15px] text-[oklch(0.25 0.02 260)] font-medium leading-snug">
                  {point}
                </span>
              </motion.div>
            </ThreeDTilt>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
