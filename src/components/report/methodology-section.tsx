'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MethodResult, ValuationApproach } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

const METHOD_LABELS: Record<string, string> = {
  dcf: 'Discounted Cash Flow (DCF)',
  pwerm: 'Probability-Weighted Expected Return (PWERM)',
  revenue_multiple: 'Revenue Multiple',
  ebitda_multiple: 'EV/EBITDA Multiple',
  comparable_txn: 'Comparable Transaction',
  nav: 'Net Asset Value (NAV)',
  replacement_cost: 'Replacement Cost',
  scorecard: 'Scorecard Method',
  berkus: 'Berkus Method',
  risk_factor: 'Risk Factor Summation',
}

const METHOD_DESCRIPTIONS: Record<string, string> = {
  dcf: 'Discounted Cash Flow projects revenue for 5 years, applies sector WACC from Damodaran India, and computes terminal value. IVS 105 Income Approach.',
  pwerm: 'Probability Weighted Expected Return weights exit scenarios (IPO, acquisition, flat, down) by likelihood. IVS 105 Income Approach.',
  revenue_multiple: 'Applies sector-specific EV/Revenue multiple from Damodaran India with stage discount. IVS 105 Market Approach.',
  ebitda_multiple: 'Applies EV/EBITDA comparable multiple from Damodaran India with profitability adjustment. IVS 105 Market Approach.',
  comparable_txn: 'Compares to recent Indian startup funding rounds at similar stage and sector. IVS 105 Market Approach.',
  nav: 'Net Asset Value sums tangible and intangible assets. Serves as valuation floor. IVS 105 Asset Approach.',
  replacement_cost: 'Estimates cost to rebuild the startup from scratch — team, technology, customers, IP. IVS 105 Asset Approach.',
  scorecard: 'Bill Payne Scorecard Method weights team, market, product, competition against sector median. VC/startup method.',
  berkus: 'Dave Berkus Method assigns up to Rs 50L per milestone: concept, prototype, team, partnerships, revenue. VC/startup method.',
  risk_factor: 'Risk Factor Summation adjusts sector median by 12 risk factors scored from very low to very high. VC/startup method.',
}

interface Props {
  methods: MethodResult[]
}

export function MethodologySection({ methods }: Props) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Methodology — 3 Approaches x 10 Methods</CardTitle>
        <p className="text-sm text-slate-400">
          Aligned with IBBI Valuation Standards, IVS 105, and Rule 11UA
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {APPROACH_ORDER.map((approach: ValuationApproach) => {
          const approachMethods = methods.filter(m => m.approach === approach)
          if (approachMethods.length === 0) return null

          return (
            <div key={approach}>
              <h3 className="font-semibold mb-2 text-amber-400">{APPROACH_LABELS[approach]}</h3>
              <div className="space-y-3">
                {approachMethods.map(m => (
                  <div key={m.method} className="border-l-2 border-slate-700 pl-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-white">{METHOD_LABELS[m.method] ?? m.method}</span>
                      <span className={`text-sm font-medium ${m.applicable ? 'text-white' : 'text-slate-500'}`}>
                        {m.applicable ? formatINR(m.value) : 'Not applicable'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {METHOD_DESCRIPTIONS[m.method] ?? ''}
                    </p>
                    {m.applicable && m.details && Object.keys(m.details).length > 0 && (
                      <details className="mt-1">
                        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">View inputs & calculations</summary>
                        <pre className="text-xs mt-1 p-2 bg-slate-800 rounded overflow-auto max-h-40 text-slate-300">
                          {JSON.stringify(m.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
