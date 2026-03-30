'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Phone, Calculator } from 'lucide-react'
import type { Article } from '@/lib/content-types'
import { getLeadMagnet, WHATSAPP_COMMUNITY_LINK, EXPERT_CALL_LINK } from '@/lib/lead-magnets'
import { ArticleCard } from './article-card'
import { LeadCaptureInline } from './lead-capture-inline'

interface Props {
  pillar: string
  pillarColor: string
  articleSlug: string
  related: Article[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function ConversionFooter({ pillar, pillarColor, articleSlug, related }: Props) {
  const magnet = getLeadMagnet(pillar)

  return (
    <div className="space-y-0">
      {/* Lead capture */}
      <section className="max-w-3xl mx-auto px-6 pt-12">
        <LeadCaptureInline pillar={pillar} articleSlug={articleSlug} variant="footer" />
      </section>

      <div className="section-divider mt-12" />

      {/* Action CTAs — 3 cards */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-6 text-center"
        >
          Your Next Step
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Tool CTA */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link
              href={magnet.toolHref}
              className="glass-card card-hover group block rounded-2xl p-6 h-full"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor: `color-mix(in oklch, ${pillarColor} 12%, transparent)`,
                  border: `1px solid color-mix(in oklch, ${pillarColor} 20%, transparent)`,
                }}
              >
                <Calculator className="w-5 h-5" style={{ color: pillarColor }} />
              </div>
              <h3 className="font-heading text-base text-[oklch(0.15 0.02 260)] mb-2">
                {magnet.toolLabel}
              </h3>
              <p className="text-xs text-[oklch(0.45 0.01 260)] leading-relaxed mb-4">
                10 methods, Monte Carlo simulation, Damodaran India data. Results in under 5 minutes.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[oklch(0.62 0.22 330)] group-hover:gap-2.5 transition-all mt-auto">
                Try Free <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </motion.div>

          {/* Expert Call CTA */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <a
              href={EXPERT_CALL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card card-hover group block rounded-2xl p-6 h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-[oklch(0.72_0.16_300/0.12)] border border-[oklch(0.72_0.16_300/0.20)] flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-[oklch(0.72 0.16 300)]" />
              </div>
              <h3 className="font-heading text-base text-[oklch(0.15 0.02 260)] mb-2">
                Talk to an Expert
              </h3>
              <p className="text-xs text-[oklch(0.45 0.01 260)] leading-relaxed mb-4">
                IBBI-registered valuer. Certified reports for fundraising, M&A, and compliance.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[oklch(0.72 0.16 300)] group-hover:gap-2.5 transition-all mt-auto">
                Chat on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <>
          <div className="section-divider" />
          <section className="max-w-5xl mx-auto px-6 py-12">
            <p className="text-[11px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-6 text-center">
              Keep Reading
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
