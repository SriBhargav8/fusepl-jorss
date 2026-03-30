'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PILLARS } from '@/lib/pillars'
import type { Article } from '@/lib/content-types'
import { ArticleCard } from '@/components/learn/article-card'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const STATS = [
  { value: '1,000', label: 'Guides', detail: 'In progress' },
  { value: '10', label: 'Pillars', detail: 'Every founder topic' },
  { value: '7', label: 'Layers', detail: 'Per article' },
  { value: '3-10K', label: 'Words', detail: 'Deep, not shallow' },
] as const

export function LearnPageClient({ articles }: { articles: Article[] }) {
  const [activePillar, setActivePillar] = useState<string | null>(null)

  const filtered = activePillar
    ? articles.filter((a) => a.frontmatter.pillar === activePillar)
    : articles

  return (
    <main className="bg-[oklch(0.985 0.002 260)] min-h-screen">
      {/* Hero */}
      <section className="grain relative isolate w-full flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(1 0 0)] via-[oklch(0.985 0.002 260)] to-[oklch(0.98 0.002 260)]" />
          <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[oklch(0.62_0.22_330/0.07)] blur-[180px] animate-[hero-glow_12s_ease-in-out_infinite_alternate]" />
          <div className="absolute bottom-[-20%] right-[-8%] w-[600px] h-[600px] rounded-full bg-[oklch(0.75_0.18_162/0.06)] blur-[140px] animate-[hero-glow_16s_ease-in-out_infinite_alternate-reverse]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(oklch(0.25 0 0 / 0.3) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[oklch(0.62_0.22_330/0.25)] bg-[oklch(0.62_0.22_330/0.08)]">
            <span className="w-2 h-2 rounded-full bg-[oklch(0.62 0.22 330)] animate-pulse" />
            <span className="text-[11px] font-semibold text-[oklch(0.75 0.18 162)] uppercase tracking-[0.2em]">
              Media + Tools + Intelligence
            </span>
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-heading text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] tracking-tight max-w-4xl"
        >
          <span className="text-[oklch(0.15 0.02 260)]">The Founder&apos;s </span>
          <span className="text-gold-gradient">Edge</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-7 text-[clamp(1rem,1.5vw,1.15rem)] text-[oklch(0.35 0.01 260)] max-w-2xl leading-relaxed"
        >
          1,000 data-backed guides on valuation, fundraising, and building startups that last.
          <span className="text-[oklch(0.75 0.18 162)] font-medium">
            {' '}
            By India&apos;s most rigorous startup platform.
          </span>
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card flex flex-col items-center gap-1.5 py-5 px-5 rounded-2xl">
              <span className="text-2xl sm:text-3xl font-heading tabular-nums text-gold-gradient">
                {stat.value}
              </span>
              <span className="text-xs text-[oklch(0.25 0.02 260)] uppercase tracking-[0.15em] font-medium">
                {stat.label}
              </span>
              <span className="text-[10px] text-[oklch(0.45 0.01 260)]">{stat.detail}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Pillar Navigation */}
      <section className="border-b border-[oklch(0.91 0.005 260)] bg-[oklch(0.98 0.002 260)] pb-2 pt-1 border-t border-[oklch(0.91_0.005_260)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-2.5 py-4">
            <button
              onClick={() => setActivePillar(null)}
              className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                !activePillar
                  ? 'bg-[oklch(0.62_0.22_330/0.12)] text-[oklch(0.62 0.22 330)] border border-[oklch(0.62_0.22_330/0.25)]'
                  : 'text-[oklch(0.45 0.01 260)] hover:text-[oklch(0.25 0.02 260)] hover:bg-[oklch(0.96 0.005 260)] border border-transparent'
              }`}
            >
              All
            </button>
            {PILLARS.map((pillar) => (
              <button
                key={pillar.slug}
                onClick={() => setActivePillar(activePillar === pillar.slug ? null : pillar.slug)}
                className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                  activePillar === pillar.slug
                    ? 'border'
                    : 'text-[oklch(0.45 0.01 260)] hover:text-[oklch(0.25 0.02 260)] hover:bg-[oklch(0.96 0.005 260)] border border-transparent'
                }`}
                style={
                  activePillar === pillar.slug
                    ? {
                        color: pillar.color,
                        backgroundColor: `color-mix(in oklch, ${pillar.color} 10%, transparent)`,
                        borderColor: `color-mix(in oklch, ${pillar.color} 25%, transparent)`,
                      }
                    : undefined
                }
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pillar.color }} />
                {pillar.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          <div>
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((article) => (
                  <ArticleCard key={article.frontmatter.slug} article={article} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-12 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[oklch(0.62_0.22_330/0.1)] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="oklch(0.62 0.22 330)" strokeWidth={1.5} className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl text-[oklch(0.15 0.02 260)] mb-3">
                  Content is Being Crafted
                </h2>
                <p className="text-sm text-[oklch(0.45 0.01 260)] max-w-md mx-auto leading-relaxed mb-8">
                  We&apos;re building 1,000 data-backed guides across 10 pillars. First articles dropping soon. Meanwhile, try our free tools.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/valuation" className="btn-press inline-flex items-center justify-center h-11 px-6 text-sm font-semibold tracking-wide rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024]">
                    Free Valuation Engine
                  </Link>
                  <Link href="/deal-check" className="btn-press inline-flex items-center justify-center h-11 px-6 text-sm font-medium tracking-wide rounded-xl border border-[oklch(0.80 0.015 260)] text-[oklch(0.25 0.02 260)] transition-all hover:border-[oklch(0.62_0.22_330/0.4)] hover:text-[oklch(0.62 0.22 330)]">
                    Deal Check
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="sticky top-[100px] space-y-6">
              <div className="glass-card rounded-2xl p-5">
                <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-4">
                  Content Pillars
                </p>
                <ul className="space-y-2.5">
                  {PILLARS.map((pillar) => {
                    const count = articles.filter((a) => a.frontmatter.pillar === pillar.slug).length
                    return (
                      <li key={pillar.slug}>
                        <Link
                          href={`/learn/${pillar.slug}`}
                          className="flex items-center gap-2.5 text-[13px] text-[oklch(0.40 0.01 260)] hover:text-[oklch(0.20 0.02 260)] transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pillar.color }} />
                          <span className="flex-1 truncate">{pillar.name}</span>
                          <span className="text-[10px] font-bold text-[oklch(0.50 0.01 260)]">
                            {count > 0 ? count : `${pillar.pieces}`}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="glass-card rounded-2xl p-5 border-[oklch(0.62_0.22_330/0.15)]">
                <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-2">
                  The Founder&apos;s Edge
                </p>
                <p className="text-sm text-[oklch(0.45 0.01 260)] leading-relaxed mb-4">
                  Weekly valuation insights, founder playbooks, and funding intelligence.
                </p>
                <Link
                  href="/valuation"
                  className="btn-press block w-full text-center h-10 leading-10 text-sm font-semibold tracking-wide rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024]"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
