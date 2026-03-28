'use client'

import { motion } from 'framer-motion'
import { ThreeDTilt } from '../ui/three-d-tilt'

const SERVICES = [
  'valuation review',
  'fundraising readiness',
  'startup financial strategy',
  'founder structuring support',
]

export function PostValuation() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[oklch(0.98_0.002_260)]">
      <div className="section-divider absolute inset-x-0 top-0 opacity-50" />
      
      {/* Radiant glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[oklch(0.62_0.22_330/0.05)] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.3em] mb-6">Expert Scale</p>
            <h2 className="font-heading text-4xl sm:text-[3.5rem] text-[oklch(0.15 0.02 260)] leading-tight tracking-tight mb-8">
              What Happens After <br className="hidden sm:block" />
              the <span className="text-gold-gradient italic">Free Tool</span>
            </h2>
            <p className="text-lg sm:text-xl text-[oklch(0.40 0.01 260)] leading-relaxed font-medium">
              If your situation needs deeper expert review, we can help with:
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } }
            }}
            className="grid gap-4"
          >
            {SERVICES.map((service) => (
              <ThreeDTilt key={service}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.95, y: 10 },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      y: 0, 
                      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
                    }
                  }}
                  className="glass-card flex items-center gap-5 p-6 rounded-2xl group border-[oklch(0.15_0.02_260/0.1)] hover:border-[oklch(0.62_0.22_330/0.35)] transition-all duration-300 hover:shadow-xl"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[oklch(0.62_0.22_330/0.1)] text-[oklch(0.62 0.22 330)] shadow-sm border border-[oklch(0.62_0.22_330/0.1)] shrink-0">
                    <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <span className="text-[17px] text-[oklch(0.20 0.02 260)] font-bold capitalize tracking-tight group-hover:text-[oklch(0.15 0.02 260)] transition-colors">
                    {service}
                  </span>
                </motion.div>
              </ThreeDTilt>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
