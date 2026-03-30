'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { GuideCard } from '@/components/guides/guide-card'
import { ArticleCard } from '@/components/learn/article-card'
import type { Article } from '@/lib/content-types'

const FEATURED_GUIDES = [
  {
    title: 'Startup Valuation Calculator India',
    category: 'Startup Valuation',
    description: 'Use our data-backed engine to estimate your startup valuation using IVS 105 and Rule 11UA frameworks.',
    slug: 'startup-valuation-calculator-india',
    image: '/images/guides/valuation_calculator.png',
    readTime: '6 min'
  },
  {
    title: 'Founder Funding Readiness Checklist',
    category: 'Fundraising Readiness',
    description: 'A 20-point audit to see if your startup is actually ready to approach institutional investors.',
    slug: 'founder-funding-readiness-checklist',
    image: '/images/guides/fundraising.png',
    readTime: '10 min'
  },
  {
    title: 'Startup Cap Table Explained',
    category: 'Cap Table & ESOP',
    description: 'The bedrock of equity ownership: how to structure and manage your capitalization table.',
    slug: 'startup-cap-table-explained',
    image: '/images/guides/captable.png',
    readTime: '12 min'
  }
]

interface Props {
  articles: Article[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function ResourcesSection({ articles }: Props) {
  return (
    <section className="bg-[oklch(0.985_0.002_260)] py-24 relative overflow-hidden border-t border-[oklch(0.91_0.005_260)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-1/4 top-1/4 w-[500px] h-[500px] rounded-full bg-[oklch(0.62_0.22_330/0.03)] blur-[120px]" />
        <div className="absolute -right-1/4 bottom-1/4 w-[500px] h-[500px] rounded-full bg-[oklch(0.55_0.15_250/0.03)] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.62_0.22_330/0.08)] border border-[oklch(0.62_0.22_330/0.15)] text-[oklch(0.62_0.22_330)] mb-6"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Learn & Execute</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-heading text-[oklch(0.15_0.02_260)] leading-tight tracking-tight mb-4"
            >
              Master Startup Dynamics
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[oklch(0.40_0.01_260)] leading-relaxed"
            >
              Free resources to help founders avoid dilution traps, understand technical frameworks, and win at fundraising.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4 shrink-0"
          >
            <Link
              href="/learn"
              className="btn-press inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-[oklch(0.91_0.005_260)] bg-white text-[13px] font-bold text-[oklch(0.15_0.02_260)] hover:bg-[oklch(0.98_0.002_260)] transition-all shadow-sm"
            >
              All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/guides"
              className="btn-press group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[oklch(0.62_0.22_330)] text-white text-[13px] font-bold transition-all hover:bg-[oklch(0.55_0.20_330)] shadow-[0_4px_16px_oklch(0.62_0.22_330/0.3)]"
            >
              All Guides
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="space-y-16">
          {/* Featured Guides Row */}
          <div>
            <h3 className="text-sm font-bold text-[oklch(0.50_0.01_260)] uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[oklch(0.91_0.005_260)]" />
              Featured Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURED_GUIDES.map((guide, index) => (
                <GuideCard key={guide.slug} {...guide} index={index} />
              ))}
            </div>
          </div>

          {/* Latest Articles Row */}
          <div>
            <h3 className="text-sm font-bold text-[oklch(0.50_0.01_260)] uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[oklch(0.91_0.005_260)]" />
              Latest Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.frontmatter.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
