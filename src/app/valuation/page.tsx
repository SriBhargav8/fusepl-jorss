'use client'

import { useRouter } from 'next/navigation'
import { useValuationStore } from '@/stores/valuation-store'
import { WizardContainer } from '@/components/wizard/wizard-container'
import { ValuationReveal } from '@/components/results/valuation-reveal'
import { MethodCards } from '@/components/results/method-cards'
import { MethodContribution } from '@/components/results/method-contribution'
import { MonteCarloChart } from '@/components/results/monte-carlo-chart'
import { ConfidenceBreakdown } from '@/components/results/confidence-breakdown'
import { ShareButtons } from '@/components/results/share-buttons'
import { EmailGate } from '@/components/results/email-gate'

export default function ValuationPage() {
  const { result, inputs, email } = useValuationStore()
  const router = useRouter()

  const handleUnlocked = (reportId: string) => {
    if (reportId !== 'local') {
      router.push(`/report/${reportId}`)
    }
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <WizardContainer />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <ValuationReveal result={result} companyName={inputs.company_name} />

        <MethodCards
          methods={result.methods}
          monteCarlo={result.monte_carlo}
        />

        {result.monte_carlo && (
          <MonteCarloChart monteCarlo={result.monte_carlo} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MethodContribution
            methods={result.methods}
            compositeValue={result.composite_value}
          />
          <ConfidenceBreakdown result={result} />
        </div>

        <div className="flex justify-center">
          <ShareButtons
            compositeValue={result.composite_value}
            companyName={inputs.company_name}
          />
        </div>

        {!email && (
          <EmailGate onUnlocked={handleUnlocked} />
        )}
      </div>
    </main>
  )
}
