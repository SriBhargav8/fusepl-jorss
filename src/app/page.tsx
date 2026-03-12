import { Hero } from '@/components/landing/hero'
import { AuthorityBrands } from '@/components/landing/authority-brands'
import { TrustSignals } from '@/components/landing/trust-signals'
import { HowItWorks } from '@/components/landing/how-it-works'
import { MethodShowcase } from '@/components/landing/method-showcase'
import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <main className="bg-[oklch(0.08_0.008_260)] min-h-screen">
      <Hero />
      <AuthorityBrands />
      <TrustSignals />
      <HowItWorks />
      <MethodShowcase />
      <CtaSection />
      <Footer />
    </main>
  )
}
