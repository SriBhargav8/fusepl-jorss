import { Hero } from '@/components/landing/hero'
import { WhyFounders } from '@/components/landing/why-founders'
import { WhatYouCanDo } from '@/components/landing/what-you-can-do'
import { WhoIsItFor } from '@/components/landing/who-is-it-for'
import { PostValuation } from '@/components/landing/post-valuation'
import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <main className="bg-[oklch(0.985 0.002 260)] min-h-screen">
      <Hero />
      <WhyFounders />
      <WhatYouCanDo />
      <WhoIsItFor />
      <PostValuation />
      <CtaSection />
      <Footer />
    </main>
  )
}
