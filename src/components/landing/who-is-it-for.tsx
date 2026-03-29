'use client'

import { motion } from 'framer-motion'
import { ThreeDTilt } from '../ui/three-d-tilt'

const GROUPS = [
  'founders preparing for fundraising',
  'early-stage startups seeking valuation clarity',
  'teams building financial and investor readiness',
  'founders needing startup structuring support',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function WhoIsItFor() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[oklch(0.985_0.002_260)]">
      <div className="section-divider absolute inset-x-0 top-0 opacity-50" />
      
      {/* Subtle decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[oklch(0.62_0.22_330/0.02)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] rounded-full bg-[oklch(0.75_0.18_162/0.02)] blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-20"
        >
          <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.3em] mb-5">Target Audience</p>
          <h2 className="font-heading text-4xl sm:text-[3.5rem] text-[oklch(0.15 0.02 260)] leading-tight tracking-tight">
            Who This <span className="text-gold-gradient italic">Is For</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {GROUPS.map((group, i) => (
            <ThreeDTilt key={group} className="h-full">
              <motion.div 
                variants={itemVariants}
                className="glass-card flex items-center gap-6 p-8 rounded-3xl group transition-all duration-500 hover:border-[oklch(0.62_0.22_330/0.4)] hover:shadow-2xl h-full"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-[oklch(0.15_0.02_260/0.05)] text-[oklch(0.62 0.22 330)] shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <span className="text-[17px] sm:text-lg text-[oklch(0.20 0.02 260)] font-semibold leading-tight capitalize">
                  {group}
                </span>
              </motion.div>
            </ThreeDTilt>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
