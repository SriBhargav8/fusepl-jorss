'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatINR } from '@/lib/utils'

function CurrencyInput({ label, value, onChange, placeholder, help }: {
  label: string; value: number | null; onChange: (v: number | null) => void;
  placeholder?: string; help?: string
}) {
  return (
    <div>
      <Label className="text-[oklch(0.65_0.005_80)]">{label}</Label>
      {help && <p className="text-xs text-[oklch(0.38_0.01_260)] mb-1">{help}</p>}
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.38_0.01_260)] text-sm">₹</span>
        <Input
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? null : parseFloat(v))
          }}
          placeholder={placeholder || '0'}
          className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] pl-7"
        />
      </div>
      {value !== null && value > 0 && (
        <p className="text-xs text-[oklch(0.78_0.14_80/0.7)] mt-1">{formatINR(value)}</p>
      )}
    </div>
  )
}

export function FinancialsStep() {
  const { inputs, setField } = useValuationStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[oklch(0.93_0.005_80)] mb-1">Financials</h2>
        <p className="text-[oklch(0.55_0.01_260)] text-sm">These numbers drive your DCF and market multiple valuations. Pre-revenue? Enter 0 — we still value you using VC methods.</p>
      </div>

      <div className="space-y-4">
        <CurrencyInput
          label="Annual Revenue (ARR) *"
          value={inputs.annual_revenue}
          onChange={(v) => setField('annual_revenue', v ?? 0)}
          help="Enter 0 if pre-revenue"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[oklch(0.65_0.005_80)]">Revenue Growth (%)</Label>
            <p className="text-xs text-[oklch(0.48_0.01_260)]">Year-over-year growth rate. Good SaaS = 100%+, Average = 30-50%</p>
            <Input
              type="number"
              value={inputs.revenue_growth_pct}
              onChange={(e) => setField('revenue_growth_pct', parseFloat(e.target.value) || 0)}
              className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1"
              placeholder="80"
            />
          </div>

          <div>
            <Label className="text-[oklch(0.65_0.005_80)]">Gross Margin (%)</Label>
            <p className="text-xs text-[oklch(0.48_0.01_260)]">Revenue minus direct costs. SaaS = 70-90%, E-commerce = 30-50%</p>
            <Input
              type="number"
              value={inputs.gross_margin_pct}
              onChange={(e) => setField('gross_margin_pct', parseFloat(e.target.value) || 0)}
              min={0}
              max={100}
              className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1"
              placeholder="70"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            label="Monthly Burn Rate"
            value={inputs.monthly_burn}
            onChange={(v) => setField('monthly_burn', v ?? 0)}
          />
          <CurrencyInput
            label="Cash in Bank"
            value={inputs.cash_in_bank}
            onChange={(v) => setField('cash_in_bank', v ?? 0)}
          />
        </div>

        <div className="border-t border-[oklch(0.20_0.008_260)] pt-4">
          <p className="text-sm text-[oklch(0.55_0.01_260)] mb-1">Unit Economics (optional — improves accuracy)</p>
          <p className="text-xs text-[oklch(0.48_0.01_260)] mb-3">CAC = cost to acquire one customer. LTV = total revenue from that customer. Investors love LTV/CAC &gt; 3x.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Customer Acquisition Cost (CAC)"
              value={inputs.cac}
              onChange={(v) => setField('cac', v)}
            />
            <CurrencyInput
              label="Lifetime Value (LTV)"
              value={inputs.ltv}
              onChange={(v) => setField('ltv', v)}
            />
          </div>
        </div>

        <div className="border-t border-[oklch(0.20_0.008_260)] pt-4">
          <p className="text-sm text-[oklch(0.50_0.01_260)] mb-3">Previous Funding (optional)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              label="Last Round Size"
              value={inputs.last_round_size}
              onChange={(v) => setField('last_round_size', v)}
            />
            <CurrencyInput
              label="Last Round Valuation"
              value={inputs.last_round_valuation}
              onChange={(v) => setField('last_round_valuation', v)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
