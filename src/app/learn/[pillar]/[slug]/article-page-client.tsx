'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Article } from '@/lib/content-types'
import { ReadingProgress } from '@/components/learn/reading-progress'
import { TableOfContents } from '@/components/learn/table-of-contents'
import { ContentEmailPopup } from '@/components/learn/content-email-popup'
import { ConversionFooter } from '@/components/learn/conversion-footer'
import { MobileCtaBar } from '@/components/learn/mobile-cta-bar'

interface Props {
  title: string
  excerpt: string
  pillarName: string
  pillarSlug: string
  pillarColor: string
  publishDate: string
  readingTime: number
  wordCount: number
  headings: { id: string; text: string; level: number }[]
  related: Article[]
  children: ReactNode
}

export function ArticlePageClient({
  title,
  excerpt,
  pillarName,
  pillarSlug,
  pillarColor,
  publishDate,
  readingTime,
  wordCount,
  headings,
  related,
  children,
}: Props) {
  const formattedDate = new Date(publishDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <main className="bg-[oklch(0.985 0.002 260)] min-h-screen">
      <ReadingProgress />

      {/* Article Header */}
      <header className="grain relative px-6 pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(1 0 0)] to-[oklch(0.985 0.002 260)]" />
          <div
            className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
            style={{ backgroundColor: `color-mix(in oklch, ${pillarColor} 6%, transparent)` }}
          />
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[11px] text-[oklch(0.50 0.01 260)] mb-8"
          >
            <Link href="/learn" className="hover:text-[oklch(0.25 0.02 260)] transition-colors">
              Learn
            </Link>
            <span>/</span>
            <Link
              href={`/learn/${pillarSlug}`}
              className="hover:text-[oklch(0.25 0.02 260)] transition-colors"
              style={{ color: pillarColor }}
            >
              {pillarName}
            </Link>
          </motion.nav>

          {/* Pillar badge */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full mb-5"
              style={{
                color: pillarColor,
                backgroundColor: `color-mix(in oklch, ${pillarColor} 10%, transparent)`,
                border: `1px solid color-mix(in oklch, ${pillarColor} 20%, transparent)`,
              }}
            >
              {pillarName}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[clamp(2rem,4vw,3rem)] leading-[1.15] tracking-tight text-[oklch(0.15 0.02 260)] mb-5"
          >
            {title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base text-[oklch(0.40 0.01 260)] leading-relaxed mb-6 max-w-2xl"
          >
            {excerpt}
          </motion.p>

          {/* Meta strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 text-[11px] text-[oklch(0.50 0.01 260)]"
          >
            <span>{formattedDate}</span>
            <span className="w-1 h-1 rounded-full bg-[oklch(0.80 0.01 260)]" />
            <span>{readingTime} min read</span>
            <span className="w-1 h-1 rounded-full bg-[oklch(0.80 0.01 260)]" />
            <span>{wordCount.toLocaleString()} words</span>
            <span className="w-1 h-1 rounded-full bg-[oklch(0.80 0.01 260)]" />
            <span className="inline-flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="oklch(0.62 0.22 330)"
                strokeWidth={1.8}
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="font-semibold text-[oklch(0.62 0.22 330)]">
                IBBI-Registered Valuer
              </span>
            </span>
          </motion.div>
        </div>
      </header>

      <div className="section-divider" />

      {/* Article Body + Sidebar */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_320px] gap-12">
        {/* Body */}
        <article className="max-w-3xl min-w-0">{children}</article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-8">
            {/* TOC */}
            {headings.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* Tool CTA */}
            <div
              className="glass-card rounded-2xl p-5"
              style={{
                borderColor: `color-mix(in oklch, ${pillarColor} 15%, oklch(0.91 0.005 260))`,
              }}
            >
              <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-2">
                Try It Yourself
              </p>
              <p className="text-xs text-[oklch(0.45 0.01 260)] leading-relaxed mb-4">
                Run a free valuation with 10 methods, Monte Carlo simulation, and Damodaran India data.
              </p>
              <Link
                href="/valuation"
                className="btn-press block w-full text-center h-9 leading-9 text-[13px] font-semibold tracking-wide rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024]"
              >
                Free Valuation
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Conversion Footer — lead capture + CTAs + related articles */}
      <ConversionFooter
        pillar={pillarSlug}
        pillarColor={pillarColor}
        articleSlug={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
        related={related}
      />

      {/* Exit-intent / scroll-triggered email popup */}
      <ContentEmailPopup pillar={pillarSlug} articleSlug={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} />

      {/* Sticky mobile bottom CTA */}
      <MobileCtaBar pillar={pillarSlug} />
    </main>
  )
}
