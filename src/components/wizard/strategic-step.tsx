'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { PARTNERSHIP_LEVELS } from '@/types'

export function StrategicStep() {
  const { inputs, setField } = useValuationStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Strategic Factors</h2>
        <p className="text-slate-400 text-sm">Partnerships, risk, and market positioning</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-slate-300">Strategic Partnerships</Label>
          <Select value={inputs.strategic_partnerships} onValueChange={(v) => setField('strategic_partnerships', v as any)}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {Object.entries(PARTNERSHIP_LEVELS).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-slate-300">Regulatory Risk (1-5): {inputs.regulatory_risk}</Label>
          <p className="text-xs text-slate-500 mb-2">1 = Minimal regulation, 5 = Heavily regulated industry</p>
          <Slider
            value={[inputs.regulatory_risk]}
            onValueChange={(v) => setField('regulatory_risk', Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-400 mb-3">Revenue Composition (optional)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Revenue Concentration (%)</Label>
              <p className="text-xs text-slate-500 mb-1">% from top 3 customers</p>
              <Input
                type="number"
                value={inputs.revenue_concentration_pct ?? ''}
                onChange={(e) => setField('revenue_concentration_pct', e.target.value === '' ? null : parseFloat(e.target.value))}
                min={0}
                max={100}
                placeholder="e.g., 40"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300">International Revenue (%)</Label>
              <Input
                type="number"
                value={inputs.international_revenue_pct}
                onChange={(e) => setField('international_revenue_pct', parseFloat(e.target.value) || 0)}
                min={0}
                max={100}
                placeholder="0"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-400 mb-3">Fundraising Plans (optional)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Target Raise (₹)</Label>
              <Input
                type="number"
                value={inputs.target_raise ?? ''}
                onChange={(e) => setField('target_raise', e.target.value === '' ? null : parseFloat(e.target.value))}
                placeholder="50000000"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300">Expected Dilution (%)</Label>
              <Input
                type="number"
                value={inputs.expected_dilution_pct ?? ''}
                onChange={(e) => setField('expected_dilution_pct', e.target.value === '' ? null : parseFloat(e.target.value))}
                min={0}
                max={50}
                placeholder="15-25"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
