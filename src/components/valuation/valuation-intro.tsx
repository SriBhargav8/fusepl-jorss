'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Calendar,
  Users,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { useModal } from '@/components/providers/modal-provider'

interface ValuationIntroProps {
  onStart: () => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  })
}

export function ValuationIntro({ onStart }: ValuationIntroProps) {
  const { openLeadModal } = useModal()
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        className="text-center mb-20"
      >
        <motion.div custom={0} variants={fadeUp} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[oklch(0.62_0.22_330/0.2)] bg-[oklch(1_0_0/0.6)] backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[oklch(0.62 0.22 330)]" />
            <span className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em]">
              Founder-First Tool
            </span>
          </span>
        </motion.div>

        <motion.h1 custom={1} variants={fadeUp} className="font-heading text-4xl sm:text-6xl text-[oklch(0.15 0.02 260)] leading-tight tracking-tight mb-8">
          Free Startup <br />
          <span className="text-gold-gradient italic">Valuation Calculator</span>
        </motion.h1>

        <motion.p custom={2} variants={fadeUp} className="text-xl text-[oklch(0.40 0.01 260)] max-w-2xl mx-auto leading-relaxed font-medium mb-12">
          Estimate your startup’s valuation before fundraising and understand how investors may view your business.
        </motion.p>

        <motion.div custom={3} variants={fadeUp}>
          <button
            onClick={onStart}
            className="btn-press group inline-flex items-center justify-center h-16 px-12 text-base font-bold tracking-wide rounded-2xl bg-[#1d2024] text-white transition-all duration-300 hover:bg-black hover:shadow-[0_8px_32px_oklch(0_0_0/0.25)] hover:scale-[1.02]"
          >
            Start Valuation
            <ArrowRight className="ml-2.5 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </motion.div>

      {/* Intro Copy & Bullet Points */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="glass-card p-10 rounded-3xl mb-24"
      >
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-heading text-2xl text-[oklch(0.15 0.02 260)] mb-6">
              Practical Estimates <br />
              <span className="text-[oklch(0.62_0.22_330)]">For Founders</span>
            </h2>
            <div className="space-y-4 text-[oklch(0.40 0.01 260)] font-medium leading-relaxed">
              <p>
                Startup valuation is one of the hardest things founders try to answer before fundraising.
              </p>
              <p>
                This free tool helps you get a practical starting estimate based on your business stage, traction, revenue signals, and growth profile.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-bold text-[oklch(0.15 0.02 260)] uppercase tracking-wider mb-6">
              Designed to help founders:
            </p>
            {[
              'Get an early valuation estimate',
              'Prepare for fundraising conversations',
              'Understand valuation logic better',
              'Identify when expert help may be needed'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[oklch(0.75_0.18_162)] shrink-0" />
                <span className="text-[15px] text-[oklch(0.25 0.02 260)] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        <FeatureBlock 
          title="What It Helps You Do"
          items={[
            'Estimate a startup valuation range',
            'Understand the likely valuation stage',
            'Get better clarity before investor calls',
            'Identify if deeper support is needed'
          ]}
          icon={<Lightbulb className="w-5 h-5" />}
          color="oklch(0.62 0.22 330)"
        />
        <FeatureBlock 
          title="Who Should Use This"
          items={[
            'Pre-seed founders',
            'Seed-stage startups',
            'Fundraising teams',
            'Pitch deck preparation'
          ]}
          icon={<Users className="w-5 h-5" />}
          color="oklch(0.68 0.14 250)"
        />
        <FeatureBlock 
          title="Best For"
          items={[
            'Fundraising preparation',
            'Founder planning',
            'Internal valuation discussions',
            'Early-stage investor readiness'
          ]}
          icon={<Target className="w-5 h-5" />}
          color="oklch(0.72 0.16 300)"
        />
      </div>

      {/* Important Note & Expert Review */}
      <div className="grid md:grid-cols-[1fr_0.8fr] gap-8 mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 rounded-3xl border-l-4 border-l-[oklch(0.62_0.22_330)] bg-[oklch(0.62_0.22_330/0.02)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-[oklch(0.62 0.22 330)]" />
            <span className="font-heading text-xl text-[oklch(0.15 0.02 260)]">Important Note</span>
          </div>
          <p className="text-[15px] text-[oklch(0.40 0.01 260)] leading-relaxed font-medium">
            This tool gives you an indicative valuation estimate. It is not a formal valuation report and should not be treated as a final professional opinion for legal, regulatory, or transaction purposes.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 rounded-3xl bg-[#1d2024] text-white"
        >
          <h3 className="font-heading text-xl mb-4">Need More Than a Calculator?</h3>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            If your startup is preparing for a live funding round or facing investor pushback, a professional review from <b>MKW Advisors</b> may help.
          </p>
          <button 
            onClick={openLeadModal}
            className="w-full cursor-pointer flex items-center justify-center gap-2 h-12 rounded-xl bg-[oklch(0.62_0.22_330)] hover:bg-[oklch(0.55_0.20_330)] transition-colors text-white font-bold text-sm"
          >
            <Calendar className="w-4 h-4" />
            Book Valuation Review
          </button>
        </motion.div>
      </div>

      {/* FAQs */}
      <div className="mb-24">
        <h2 className="font-heading text-3xl text-center text-[oklch(0.15 0.02 260)] mb-12">Supporting FAQ</h2>
        <div className="max-w-2xl mx-auto">
          <Accordion className="space-y-4">
            <FaqItem 
              question="How accurate is a startup valuation calculator?"
              answer="It gives an indicative starting point, not a final expert report. It is based on rigorous institutional methods but lacks the subjective nuance of a deep expert review."
            />
            <FaqItem 
              question="Can I use this before a funding round?"
              answer="Yes. It is especially useful before your first serious investor conversations to understand the likely range and logic behind your valuation."
            />
            <FaqItem 
              question="Is this tool only for Indian startups?"
              answer="It is most relevant for founders operating in India or fundraising in the Indian ecosystem, as it uses India-specific benchmarks (e.g., Damodaran India data)."
            />
            <FaqItem 
              question="What if I need a formal valuation?"
              answer="You can request a deeper expert review after using the tool. We provide professional valuation opinions for regulatory compliance and transaction purposes."
            />
          </Accordion>
        </div>
      </div>

      {/* Final CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center py-12 border-t border-[oklch(0.91_0.005_260)]"
      >
        <p className="text-xl text-[oklch(0.15 0.02 260)] font-medium max-w-2xl mx-auto mb-8">
          Try the Free Startup Valuation Engine now and get clarity before your next fundraising conversation.
        </p>
        <button
          onClick={onStart}
          className="btn-press group inline-flex items-center justify-center h-16 px-12 text-base font-bold tracking-wide rounded-2xl bg-[#1d2024] text-white transition-all duration-300 hover:bg-black"
        >
          Try Free Valuation Engine
          <Sparkles className="ml-2.5 w-5 h-5 text-[oklch(0.62 0.22 330)] transition-transform group-hover:scale-110" />
        </button>
      </motion.div>
    </div>
  )
}

function FeatureBlock({ title, items, icon, color }: { title: string; items: string[]; icon: any, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8 rounded-3xl"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 shadow-sm"
        style={{ color, backgroundColor: `color-mix(in oklch, ${color} 10%, white)`, border: `1.5px solid color-mix(in oklch, ${color} 20%, transparent)` }}
      >
        {icon}
      </div>
      <h3 className="font-heading text-lg text-[oklch(0.15 0.02 260)] mb-6">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm text-[oklch(0.40 0.01 260)] font-medium leading-snug">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-gray-300 mt-1.5" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <AccordionItem value={question} className="glass-card px-6 rounded-2xl border border-[oklch(0.91_0.005_260)] overflow-hidden">
      <AccordionTrigger className="text-[15px] font-bold text-[oklch(0.15 0.02 260)] py-5 hover:no-underline">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-[14px] text-[oklch(0.45 0.01 260)] leading-relaxed pb-6">
        {answer}
      </AccordionContent>
    </AccordionItem>
  )
}
