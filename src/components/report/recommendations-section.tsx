'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ValuationResult } from '@/types'

interface Props {
  result: ValuationResult
  sector: string
  stage: string
}

export function RecommendationsSection({ result, sector, stage }: Props) {
  const checklist = generateChecklist(result, stage)

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Recommendations & Fundraise Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-amber-400">Before Approaching Investors:</h3>
          <ul className="space-y-2">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-slate-500 mt-0.5">&#9744;</span>
                <span className="text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function generateChecklist(result: ValuationResult, stage: string): string[] {
  const items: string[] = []

  // Always recommend
  items.push('Prepare a 2-page executive summary with key metrics')
  items.push('Build a financial model with 3-5 year projections')

  // Confidence-based
  if (result.confidence_score < 50) {
    items.push('Your confidence score is low — focus on filling data gaps (revenue metrics, unit economics)')
  }

  // Stage-based
  if (['idea', 'pre_seed', 'seed'].includes(stage)) {
    items.push('For early-stage: focus pitch on TAM, team credibility, and traction velocity')
    items.push('Get warm introductions — cold outreach has <5% response rate for early-stage')
  } else {
    items.push('For growth-stage: prepare audited financials and customer cohort analysis')
    items.push('Line up 3+ term sheets for leverage in negotiation')
  }

  // Method-based
  const lowConfMethods = result.methods.filter(m => m.applicable && m.confidence < 0.4)
  if (lowConfMethods.length > 3) {
    items.push('Several methods show low confidence — strengthen revenue and financial data before fundraise')
  }

  items.push('Set up a data room (Notion or Google Drive) with key documents')
  items.push('Practice your pitch with 3 friendly investors before going live')

  return items
}
