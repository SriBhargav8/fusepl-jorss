'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { GuideCard } from '@/components/guides/guide-card'
import { CategoryFilters } from '@/components/guides/guide-filters'

const CATEGORIES = [
  'Startup Valuation',
  'Fundraising Readiness',
  'Cap Table & ESOP',
  'Startup India & Grants'
]

const GUIDES = [
  // Startup Valuation Cluster
  {
    title: 'Startup Valuation Calculator India',
    category: 'Startup Valuation',
    description: 'Use our data-backed engine to estimate your startup valuation using IVS 105 and Rule 11UA frameworks.',
    slug: 'startup-valuation-calculator-india',
    image: '/images/guides/valuation_calculator.png',
    readTime: '6 min'
  },
  {
    title: 'How To Value a Startup Before Fundraising',
    category: 'Startup Valuation',
    description: 'A comprehensive guide on the variables that drive early-stage valuation before you have significant revenue.',
    slug: 'how-to-value-a-startup-before-fundraising',
    image: '/images/guides/value_startup.png',
    readTime: '8 min'
  },
  {
    title: 'Pre-Seed Startup Valuation in India',
    category: 'Startup Valuation',
    description: 'Understanding the unique dynamics of the Indian pre-seed ecosystem and how to set realistic expectations.',
    slug: 'pre-seed-startup-valuation-india',
    image: '/images/guides/pre_seed.png',
    readTime: '5 min'
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
    title: 'Startup India Seed Fund Eligibility',
    category: 'Startup India & Grants',
    description: 'Are you eligible for up to 50 Lakhs? Check the latest government criteria and benchmarks.',
    slug: 'startup-india-seed-fund-eligibility',
    image: '/images/guides/startup_india_eligibility.png',
    readTime: '7 min'
  },
  {
    title: 'Seed Stage Startup Valuation Explained',
    category: 'Startup Valuation',
    description: 'How to approach valuation when you have early traction but are still finding product-market fit.',
    slug: 'seed-stage-startup-valuation-explained',
    image: '/images/guides/seed_stage.png',
    readTime: '12 min'
  },
  {
    title: 'Startup Valuation Methods: DCF, VC Method & Scorecard',
    category: 'Startup Valuation',
    description: 'An objective comparison of major valuation frameworks used by institutional investors globally.',
    slug: 'startup-valuation-methods-dcf-vc-method-scorecard',
    image: '/images/guides/valuation_methods.png',
    readTime: '15 min'
  },
  {
    title: 'How Investors Value Startups in India',
    category: 'Startup Valuation',
    description: 'Inside the mind of Indian VCs and Angel investors: what signals they look for beyond the numbers.',
    slug: 'how-investors-value-startups-india',
    image: '/images/guides/valuation.png',
    readTime: '9 min'
  },
  {
    title: 'Startup Valuation Based on Revenue',
    category: 'Startup Valuation',
    description: 'How to use revenue multiples (ARR/MRR) to calculate valuation for scaling businesses.',
    slug: 'startup-valuation-based-on-revenue',
    image: '/images/guides/revenue_valuation.png',
    readTime: '7 min'
  },
  {
    title: 'Common Startup Valuation Mistakes Founders Make',
    category: 'Startup Valuation',
    description: 'Avoid overvaluation traps, dilution errors, and unrealistic benchmarks that can hurt your round.',
    slug: 'common-startup-valuation-mistakes-founders-make',
    image: '/images/guides/valuation_mistakes.png',
    readTime: '6 min'
  },
  {
    title: 'Startup Valuation for SaaS Businesses',
    category: 'Startup Valuation',
    description: 'Specialized valuation metrics for SaaS: Churn, LTV, CAC, and efficiency multiples.',
    slug: 'startup-valuation-for-saas-businesses',
    image: '/images/guides/saas_valuation.png',
    readTime: '8 min'
  },
  {
    title: 'Startup Valuation for Fundraising Rounds',
    category: 'Startup Valuation',
    description: 'How to adjust your valuation strategy across Bridge, Series A, and beyond.',
    slug: 'startup-valuation-for-fundraising-rounds',
    image: '/images/guides/funding_rounds.png',
    readTime: '9 min'
  },
  {
    title: 'Startup Financial Model for Fundraising',
    category: 'Fundraising Readiness',
    description: 'Build a robust 3-year financial projection that aligns with your pitch deck and investor expectations.',
    slug: 'startup-financial-model-for-fundraising',
    image: '/images/guides/financial_model.png',
    readTime: '12 min'
  },
  {
    title: 'How To Prepare for a Seed Round',
    category: 'Fundraising Readiness',
    description: 'The roadmap from ideation to closing your first significant institutional check.',
    slug: 'how-to-prepare-for-a-seed-round',
    image: '/images/guides/seed_roadmap.png',
    readTime: '15 min'
  },
  {
    title: 'What Investors Want Before Startup Funding Round',
    category: 'Fundraising Readiness',
    description: 'The "Unspoken Rules" of fundraising: Team, Market, Product, and competitive moats.',
    slug: 'what-investors-want-before-startup-funding-round',
    image: '/images/guides/investors_signals.png',
    readTime: '8 min'
  },
  {
    title: 'Startup Due Diligence Preparation Checklist',
    category: 'Fundraising Readiness',
    description: 'Ensure your documentation, legal, and financial records are ready for an investor deep-dive.',
    slug: 'startup-due-diligence-preparation-checklist',
    image: '/images/guides/due_diligence.png',
    readTime: '20 min'
  },
  {
    title: 'Pitch Deck Mistakes That Hurt Fundraising',
    category: 'Fundraising Readiness',
    description: 'Why 99% of pitch decks get rejected and how to make yours stand out in 30 seconds.',
    slug: 'pitch-deck-mistakes-that-hurt-fundraising',
    image: '/images/guides/pitch_deck_mistakes.png',
    readTime: '5 min'
  },
  {
    title: 'Startup Cap Table Explained',
    category: 'Cap Table & ESOP',
    description: 'The bedrock of equity ownership: how to structure and manage your capitalization table.',
    slug: 'startup-cap-table-explained',
    image: '/images/guides/captable.png',
    readTime: '12 min'
  },
  {
    title: 'ESOP for Startups in India',
    category: 'Cap Table & ESOP',
    description: 'How to design employee stock option pools to attract and retain top-tier talent in India.',
    slug: 'esop-for-startups-india',
    image: '/images/guides/esop_india.png',
    readTime: '10 min'
  },
  {
    title: 'Founder Dilution Explained Simply',
    category: 'Cap Table & ESOP',
    description: 'Understand the impact of fundraising on your ownership and how to optimize for the long term.',
    slug: 'founder-dilution-explained-simply',
    image: '/images/guides/founder_dilution.png',
    readTime: '8 min'
  },
  {
    title: 'Co-Founder Equity Split Guide',
    category: 'Cap Table & ESOP',
    description: 'How to have the hard conversations about equity before you launch.',
    slug: 'co-founder-equity-split-guide',
    image: '/images/guides/co_founder_equity.png',
    readTime: '15 min'
  },
  {
    title: 'Startup India Registration Explained',
    category: 'Startup India & Grants',
    description: 'Step-by-step guide to DPIIT recognition and getting your Startup India certificate.',
    slug: 'startup-india-registration-explained',
    image: '/images/guides/startup_india_registration.png',
    readTime: '6 min'
  },
  {
    title: 'How To Apply for Startup India Seed Fund',
    category: 'Startup India & Grants',
    description: 'A practical roadmap for navigating the application portal and incubation process.',
    slug: 'how-to-apply-for-startup-india-seed-fund',
    image: '/images/guides/startupindia.png',
    readTime: '9 min'
  },
  {
    title: 'DPIIT Recognition Benefits for Startups',
    category: 'Startup India & Grants',
    description: 'Tax holidays, IP benefits, and fast-track compliance: why every Indian founder needs recognition.',
    slug: 'dpiit-recognition-benefits-for-startups',
    image: '/images/guides/dpiit_benefit.png',
    readTime: '7 min'
  },
  {
    title: 'MSME vs Startup India Guide',
    category: 'Startup India & Grants',
    description: 'Comparing registration types to maximize benefits for your specific business model.',
    slug: 'msme-vs-startup-india-what-founders-should-know',
    image: '/images/guides/msme_vs_startup.png',
    readTime: '10 min'
  }
]

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGuides = useMemo(() => {
    return GUIDES.filter(guide => {
      const matchesCategory = activeCategory === 'All' || guide.category === activeCategory
      const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           guide.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[oklch(0.995_0.001_260)] pt-12 pb-24">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-[oklch(0.62_0.22_330/0.03)] blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-[oklch(0.55_0.15_250/0.03)] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.62_0.22_330/0.08)] border border-[oklch(0.62_0.22_330/0.15)] text-[oklch(0.62_0.22_330)] mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Educational Resources</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading text-[oklch(0.15_0.02_260)] mb-6 tracking-tight"
          >
            Founder <span className="text-gold-gradient italic">Guides</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[oklch(0.40_0.01_260)] max-w-2xl mx-auto leading-relaxed"
          >
            Practical, data-backed insights to help you master startup valuation, fundraising rounds, and equity structuring in India.
          </motion.p>
        </div>

        {/* Filters & Search */}
        <CategoryFilters 
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Results Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide, index) => (
              <GuideCard 
                key={guide.slug}
                {...guide}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[oklch(0.96_0.005_260)] mb-6">
              <BookOpen className="w-8 h-8 text-[oklch(0.50_0.01_260)]" />
            </div>
            <h3 className="text-xl font-heading text-[oklch(0.15_0.02_260)] mb-2">No guides found</h3>
            <p className="text-[oklch(0.45_0.01_260)]">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-10 md:p-16 rounded-[2.5rem] bg-[#1d2024] relative overflow-hidden group shadow-2xl shadow-black/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.62_0.22_330/0.1)] to-transparent opacity-50" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-heading text-white mb-6 leading-tight">
                Ready to Know Your <br />
                <span className="text-[oklch(0.62_0.22_330)]">Startup Valuation?</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Take the generic guesswork out of fundraising. Use our free engine to get an institutional-grade estimate in 5 minutes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
              <Link
                href="/valuation"
                className="btn-press group inline-flex h-16 items-center justify-center gap-2 rounded-2xl bg-[oklch(0.62_0.22_330)] px-10 text-base font-bold text-white transition-all hover:bg-[oklch(0.55_0.20_330)] hover:shadow-[0_8px_32px_oklch(0.62_0.22_330/0.4)]"
              >
                Try Valuation Engine
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="https://profile.firstunicornstartup.com/"
                className="btn-press inline-flex h-16 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-10 text-base font-bold text-white transition-all hover:bg-white/10"
              >
                Book Strategy Review
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
