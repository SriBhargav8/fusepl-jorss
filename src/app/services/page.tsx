'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles, Shield, Phone } from 'lucide-react'
import { EXPERT_CALL_LINK } from '@/lib/lead-magnets'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const TIERS = [
  {
    name: 'Free',
    tagline: 'Self-Serve',
    price: '₹0',
    period: 'forever',
    description: 'Everything you need to understand your startup\'s worth.',
    cta: 'Get Started Free',
    ctaHref: '/valuation',
    ctaStyle: 'border border-[oklch(0.80_0.015_260)] text-[oklch(0.25 0.02 260)] hover:border-[oklch(0.62_0.22_330/0.4)] hover:text-[oklch(0.62_0.22_330)] hover:bg-[oklch(0.62_0.22_330/0.08)]',
    features: [
      'Startup Valuation Engine (10 methods)',
      'Monte Carlo Simulation (10K scenarios)',
      'Cap Table Modeler',
      'ESOP Calculator',
      'Investor Deal Check',
      'Access to all 1,000 content guides',
      'RSS feed & newsletter',
    ],
    accent: 'oklch(0.75 0.18 162)',
  },
  {
    name: 'Pro Report',
    tagline: 'Most Popular',
    price: '₹4,999',
    period: 'per report',
    description: 'A professionally prepared valuation report you can share with investors.',
    cta: 'Get Pro Report',
    ctaHref: '/valuation',
    ctaStyle: 'bg-[#32373c] text-white hover:bg-[#1d2024] hover:shadow-[0_4px_24px_oklch(0_0_0/0.2)]',
    features: [
      'Everything in Free',
      'PDF valuation report (branded)',
      'All 10 methods with detailed breakdown',
      'Comparable company analysis',
      'AI-generated investment narrative',
      'Sensitivity analysis tables',
      'Shareable report link',
      'Email support',
    ],
    accent: 'oklch(0.62 0.22 330)',
    highlighted: true,
  },
  {
    name: 'Advisory',
    tagline: 'For Serious Rounds',
    price: 'Custom',
    period: 'project-based',
    description: 'IBBI-registered valuer + strategy advisory for fundraising, M&A, and compliance.',
    cta: 'Book a Strategy Call',
    ctaHref: EXPERT_CALL_LINK,
    ctaStyle: 'border border-[oklch(0.72_0.16_300/0.3)] text-[oklch(0.72 0.16 300)] hover:bg-[oklch(0.72_0.16_300/0.08)]',
    external: true,
    features: [
      'Everything in Pro Report',
      'Certified valuation (IBBI-registered)',
      'Rule 11UA / FEMA NDI compliant',
      'IVS 105 framework documentation',
      'Fundraising strategy session (60 min)',
      'Investor intro facilitation',
      'Term sheet review & negotiation support',
      'Dedicated WhatsApp support',
      'Delivered by MKW Advisors',
    ],
    accent: 'oklch(0.72 0.16 300)',
  },
]

const TRUST = [
  { label: 'IBBI Registered', detail: 'Insolvency Professional' },
  { label: 'SFA Licensed', detail: 'Registered Valuer' },
  { label: 'IVS 105 Aligned', detail: 'International Standards' },
  { label: '164 Sectors', detail: 'Indian Startup Taxonomy' },
]

const FAQ = [
  {
    q: 'Is the free valuation really free?',
    a: 'Yes. The valuation engine, cap table modeler, ESOP calculator, and all content guides are free forever. We make money from Pro Reports and Advisory services.',
  },
  {
    q: 'What\'s the difference between Free and Pro Report?',
    a: 'Free gives you the valuation number and method breakdown on-screen. Pro Report generates a professionally formatted PDF with detailed analysis, comparables, AI narrative, and sensitivity tables that you can share with investors.',
  },
  {
    q: 'Is the certified valuation legally valid?',
    a: 'Yes. Advisory-tier valuations are prepared by an IBBI-registered insolvency professional and SFA-licensed valuer. They are compliant with Rule 11UA, FEMA NDI Rules, and IVS 105 framework — accepted by tax authorities, RBI, and investors.',
  },
  {
    q: 'How long does an Advisory engagement take?',
    a: 'Typically 5-10 business days from the strategy call to delivery of the certified report. Urgent timelines can be accommodated.',
  },
  {
    q: 'Can I upgrade from Free to Pro later?',
    a: 'Absolutely. Run your free valuation first. If you want the full PDF report, you can upgrade and pay via Razorpay — your valuation data is preserved.',
  },
]

export default function ServicesPage() {
  return (
    <main className="bg-[oklch(0.985 0.002 260)] min-h-screen">
      {/* Hero */}
      <section className="grain relative isolate w-full text-center px-6 py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(1 0 0)] via-[oklch(0.985 0.002 260)] to-[oklch(0.98 0.002 260)]" />
          <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[oklch(0.62_0.22_330/0.06)] blur-[160px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(oklch(0.25 0 0 / 0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <motion.p custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-[11px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-5">
          Pricing & Services
        </motion.p>
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible" className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.08] tracking-tight max-w-3xl mx-auto">
          <span className="text-[oklch(0.15 0.02 260)]">From Free Tool to</span>
          <br />
          <span className="text-gold-gradient">Certified Valuation</span>
        </motion.h1>
        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-base text-[oklch(0.40 0.01 260)] max-w-xl mx-auto leading-relaxed">
          Start free. Upgrade when you need a report investors will take seriously. Get expert help when the stakes are high.
        </motion.p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden ${tier.highlighted ? 'ring-2 ring-[oklch(0.62_0.22_330/0.3)] shadow-lg' : 'glass-card'}`}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)` }} />

              {tier.highlighted && (
                <div className="bg-[oklch(0.62_0.22_330/0.08)] text-center py-2">
                  <span className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: tier.accent }}>{tier.tagline}</p>
                <h3 className="font-heading text-2xl text-[oklch(0.15 0.02 260)] mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="font-heading text-3xl text-[oklch(0.15 0.02 260)]">{tier.price}</span>
                  <span className="text-xs text-[oklch(0.50 0.01 260)]">/{tier.period}</span>
                </div>
                <p className="text-sm text-[oklch(0.45 0.01 260)] leading-relaxed mb-6">{tier.description}</p>

                {tier.external ? (
                  <a
                    href={tier.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn-press group w-full h-12 text-sm font-semibold tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <Link
                    href={tier.ctaHref}
                    className={`btn-press group w-full h-12 text-sm font-semibold tracking-wide rounded-xl flex items-center justify-center gap-2 transition-all ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}

                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[oklch(0.40 0.01 260)]">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: tier.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ValuateIN Platform Banner */}
      <section className="max-w-5xl mx-auto px-6 pb-10 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden bg-[#32373c] p-8 md:p-10"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, oklch(0.62 0.22 330), transparent)' }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-[oklch(0.62_0.22_330/0.08)] blur-[100px] pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-2">Professional Platform</p>
              <h3 className="font-heading text-2xl text-white mb-2">ValuateIN — For Practitioners</h3>
              <p className="text-sm text-[oklch(0.70 0.01 260)] leading-relaxed max-w-lg">
                CA / RV firms, VC funds, and family offices doing repeat statutory work need more than a per-report tool.
                ValuateIN gives you unlimited engagements, 20 assignment types (Rule 11UA, FEMA, ESOP, IBC, Ind AS),
                full WACC build-up, .docx client reports, and an AI narrative — all in one platform.
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {['Unlimited valuations', '20 assignment types', '.docx report download', 'AI narrative generation', 'Rule 11UA · FEMA · ESOP · IBC'].map(f => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-[oklch(0.65 0.01 260)]">
                    <Check className="w-3.5 h-3.5 text-[oklch(0.62 0.22 330)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 text-center">
              <div className="text-3xl font-heading text-white mb-0.5">₹4,999<span className="text-base text-[oklch(0.55 0.01 260)]">/mo</span></div>
              <p className="text-[11px] text-[oklch(0.50 0.01 260)] mb-4">Professional · Unlimited</p>
              <span
                className="inline-flex items-center justify-center gap-2 h-11 px-7 text-sm font-semibold rounded-xl bg-[oklch(0.62_0.22_330/0.5)] text-white cursor-not-allowed"
              >
                ValuateIN (Coming Soon)
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[oklch(0.91_0.005_260)] bg-[oklch(0.97 0.003 260)] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6">
          {TRUST.map((t) => (
            <div key={t.label} className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[oklch(0.62 0.22 330)]" />
              <span className="text-sm font-semibold text-[oklch(0.20 0.02 260)]">{t.label}</span>
              <span className="text-[10px] text-[oklch(0.50 0.01 260)] uppercase tracking-wider">{t.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[11px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-4">FAQ</p>
          <h2 className="font-heading text-3xl text-[oklch(0.15 0.02 260)]">Common Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="font-heading text-base text-[oklch(0.15 0.02 260)] mb-2">{item.q}</h3>
              <p className="text-sm text-[oklch(0.45 0.01 260)] leading-relaxed">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.98 0.002 260)] to-[oklch(0.97 0.003 260)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(0.62_0.22_330/0.06)] blur-[150px]" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl text-[oklch(0.15 0.02 260)] mb-4">
            Not Sure Which Tier?
          </h2>
          <p className="text-base text-[oklch(0.40 0.01 260)] mb-8 leading-relaxed">
            Start with the free valuation. If you need a report for investors, upgrade to Pro. If you&apos;re raising a serious round, talk to our team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/valuation" className="btn-press group inline-flex items-center justify-center h-14 px-10 text-base font-semibold tracking-wide rounded-2xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_4px_24px_oklch(0_0_0/0.2)]">
              Start Free Valuation
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href={EXPERT_CALL_LINK} target="_blank" rel="noopener noreferrer" className="btn-press inline-flex items-center justify-center h-14 px-8 text-base font-medium tracking-wide rounded-2xl border border-[oklch(0.80 0.015 260)] text-[oklch(0.25 0.02 260)] transition-all hover:border-[oklch(0.72_0.16_300/0.4)] hover:text-[oklch(0.72 0.16 300)]">
              <Phone className="mr-2 w-4 h-4" />
              Book Strategy Call
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
