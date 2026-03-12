'use client'

import { motion } from 'framer-motion'

const BRANDS = [
  { name: 'YourStory', desc: 'Startup Media' },
  { name: 'Inc42', desc: 'Startup Intelligence' },
  { name: 'Economic Times', desc: 'Startup News' },
  { name: 'Mint', desc: 'Business & Markets' },
  { name: 'TechCrunch', desc: 'Tech & Startups' },
  { name: 'Entrepreneur India', desc: 'Founders & Growth' },
  { name: 'Business Standard', desc: 'Economy & Finance' },
  { name: 'VCCircle', desc: 'PE & VC Deals' },
  { name: 'Moneycontrol', desc: 'Markets & Investing' },
  { name: 'Forbes India', desc: 'Business Leaders' },
]

export function AuthorityBrands() {
  return (
    <section className="relative py-8 px-6 overflow-hidden bg-[oklch(0.11_0.01_260)]">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[oklch(0.11_0.01_260)] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[oklch(0.11_0.01_260)] to-transparent z-10 pointer-events-none" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-[10px] font-semibold text-[oklch(0.55_0.01_260)] uppercase tracking-[0.25em] mb-5"
      >
        As featured in leading startup &amp; business media
      </motion.p>

      {/* Scrolling ticker */}
      <div className="relative">
        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center gap-3 px-5 py-2.5 rounded-xl border border-[oklch(0.25_0.012_260)] bg-[oklch(0.14_0.01_260/0.6)] backdrop-blur-sm shrink-0 transition-colors hover:border-[oklch(0.35_0.01_260)]"
            >
              <span className="text-sm font-semibold text-[oklch(0.85_0.005_80)]">
                {brand.name}
              </span>
              <span className="text-[10px] text-[oklch(0.55_0.01_260)] uppercase tracking-wider">
                {brand.desc}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
