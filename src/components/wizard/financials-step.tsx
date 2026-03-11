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
      <Label className="text-slate-300">{label}</Label>
      {help && <p className="text-xs text-slate-500 mb-1">{help}</p>}
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
        <Input
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? null : parseFloat(v))
          }}
          placeholder={placeholder || '0'}
          className="bg-slate-800 border-slate-700 text-white pl-7"
        />
      </div>
      {value !== null && value > 0 && (
        <p className="text-xs text-amber-400/70 mt-1">{formatINR(value)}</p>
      )}
    </div>
  )
}

export function FinancialsStep() {
  const { inputs, setField } = useValuationStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Financials</h2>
        <p className="text-slate-400 text-sm">Revenue, costs, and unit economics</p>
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
            <Label className="text-slate-300">Revenue Growth (%)</Label>
            <Input
              type="number"
              value={inputs.revenue_growth_pct}
              onChange={(e) => setField('revenue_growth_pct', parseFloat(e.target.value) || 0)}
              className="bg-slate-800 border-slate-700 text-white mt-1"
              placeholder="80"
            />
          </div>

          <div>
            <Label className="text-slate-300">Gross Margin (%)</Label>
            <Input
              type="number"
              value={inputs.gross_margin_pct}
              onChange={(e) => setField('gross_margin_pct', parseFloat(e.target.value) || 0)}
              min={0}
              max={100}
              className="bg-slate-800 border-slate-700 text-white mt-1"
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

        <div className="border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-400 mb-3">Unit Economics (optional — improves accuracy)</p>
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

        <div className="border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-400 mb-3">Previous Funding (optional)</p>
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
