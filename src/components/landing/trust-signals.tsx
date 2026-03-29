'use client'

import { motion } from 'framer-motion'

const SIGNALS = [
  {
    label: 'IBBI Registered',
    text: 'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer.',
    metric: 'Verified',
    color: 'oklch(0.62 0.22 330)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: 'Damodaran Data',
    text: 'Real industry benchmarks from Prof. Aswath Damodaran — updated January 2026.',
    metric: 'Jan 2026',
    color: 'oklch(0.68 0.14 250)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: 'IVS 105 Aligned',
    text: '4 approaches, 10 methods — the same framework used in boardroom-level valuations.',
    metric: '10 methods',
    color: 'oklch(0.72 0.16 300)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
  },
  {
    label: 'Monte Carlo',
    text: '10,000 simulated scenarios showing the full range of what your startup is worth.',
    metric: '10K runs',
    color: 'oklch(0.78 0.12 80)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    label: 'IBC Case Law',
    text: '190+ landmark IBC cases analyzed for grounded downside estimates.',
    metric: '3,952 outcomes',
    color: 'oklch(0.72 0.14 25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: '164 Sectors',
    text: 'Exhaustive Indian startup taxonomy — from Fintech to DeepTech, AgriTech to SpaceTech. Every niche covered with sector-specific benchmarks.',
    metric: '27 verticals',
    color: 'oklch(0.65 0.16 155)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function TrustSignals() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[oklch(0.985_0.002_260)]">
      <div className="section-divider absolute inset-x-0 top-0 opacity-50" />
      
      {/* Background accents */}
      <div className="absolute top-1/4 left-[-10%] w-[600px] h-[600px] rounded-full bg-[oklch(0.62_0.22_330/0.03)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-[oklch(0.75_0.18_162/0.03)] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
          className="text-center mb-20"
        >
          <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.3em] mb-5">Institutional Rigour</p>
          <h2 className="font-heading text-4xl sm:text-[3.5rem] text-[oklch(0.15 0.02 260)] leading-[1.1] tracking-tight">
            Not a Random <span className="text-gold-gradient italic">Number Generator</span>
          </h2>
          <p className="mt-6 text-[clamp(1rem,1.5vw,1.15rem)] text-[oklch(0.40 0.01 260)] max-w-xl mx-auto leading-relaxed font-medium">
            When an investor asks &ldquo;how did you arrive at this valuation?&rdquo; 
            — you&apos;ll have a defensible, multi-method answer.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-100px' }} 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SIGNALS.map((s) => (
            <motion.div 
              key={s.label} 
              variants={cardVariants} 
              className="glass-card group relative p-8 rounded-3xl overflow-hidden"
            >
              {/* Animated hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-[oklch(0.62_0.22_330/0.03)] via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" 
                    style={{ 
                      color: s.color, 
                      backgroundColor: `color-mix(in oklch, ${s.color} 10%, white)`, 
                      border: `1.5px solid color-mix(in oklch, ${s.color} 20%, transparent)` 
                    }}
                  >
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm" 
                    style={{ 
                      color: s.color, 
                      backgroundColor: `color-mix(in oklch, ${s.color} 8%, white)`,
                      borderColor: `color-mix(in oklch, ${s.color} 15%, transparent)`
                    }}
                  >
                    {s.metric}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[oklch(0.15 0.02 260)] uppercase tracking-[0.15em] mb-3">{s.label}</h3>
                <p className="text-[15px] text-[oklch(0.40 0.01 260)] leading-relaxed font-medium">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
