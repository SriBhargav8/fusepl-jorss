'use client'

import type { ValuationResult } from '@/types'

interface Props {
  result: ValuationResult
  sector: string
  stage: string
}

export function RecommendationsSection({ result, sector, stage }: Props) {
  const checklist = generateChecklist(result, stage)

  return (
    <div className="glass-card grain relative rounded-xl p-8 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Strategic Roadmap</h2>
          <p className="text-xs text-[oklch(0.50 0.01 260)] opacity-60">Curated Fundraise & Growth Checklist</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[oklch(0.65_0.18_160/0.1)] text-[10px] font-bold text-[oklch(0.65_0.18_160)] uppercase">Ready to Raise</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-[oklch(0.65_0.18_160)]">Pre-Flight Checklist:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <div className="w-5 h-5 rounded border border-[oklch(0.91_0.005_260/0.8)] flex items-center justify-center text-[10px] text-[oklch(0.65_0.18_160)] group-hover:bg-[oklch(0.65_0.18_160/0.05)] transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 italic font-bold">✓</span>
                </div>
                <span className="text-xs text-[oklch(0.15_0.02_260)] font-medium leading-normal opacity-80 group-hover:opacity-100 transition-opacity">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
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
