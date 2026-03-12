'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { PARTNERSHIP_LEVELS, PARTNERSHIP_LABELS } from '@/types'

export function StrategicStep() {
  const { inputs, setField } = useValuationStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[oklch(0.93_0.005_80)] mb-1">Strategic Factors</h2>
        <p className="text-[oklch(0.55_0.01_260)] text-sm">Partnerships reduce risk, regulatory moats protect margins — these factors shape how investors discount your valuation.</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-[oklch(0.65_0.005_80)]">Strategic Partnerships</Label>
          <Select value={inputs.strategic_partnerships} onValueChange={(v) => setField('strategic_partnerships', v as any)}>
            <SelectTrigger className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)]">
              {PARTNERSHIP_LEVELS.map(key => (
                <SelectItem key={key} value={key} className="text-[oklch(0.93_0.005_80)] hover:bg-[oklch(0.15_0.008_260)]">
                  {PARTNERSHIP_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)]">Regulatory Risk (1-5): {inputs.regulatory_risk}</Label>
          <p className="text-xs text-[oklch(0.38_0.01_260)] mb-2">1 = Minimal regulation, 5 = Heavily regulated industry</p>
          <Slider
            value={[inputs.regulatory_risk]}
            onValueChange={(v) => setField('regulatory_risk', Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="border-t border-[oklch(0.20_0.008_260)] pt-4">
          <p className="text-sm text-[oklch(0.50_0.01_260)] mb-3">Revenue Composition (optional)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[oklch(0.65_0.005_80)]">Revenue Concentration (%)</Label>
              <p className="text-xs text-[oklch(0.38_0.01_260)] mb-1">% from top 3 customers</p>
              <Input
                type="number"
                value={inputs.revenue_concentration_pct ?? ''}
                onChange={(e) => setField('revenue_concentration_pct', e.target.value === '' ? null : parseFloat(e.target.value))}
                min={0}
                max={100}
                placeholder="e.g., 40"
                className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1"
              />
            </div>
            <div>
              <Label className="text-[oklch(0.65_0.005_80)]">International Revenue (%)</Label>
              <Input
                type="number"
                value={inputs.international_revenue_pct}
                onChange={(e) => setField('international_revenue_pct', parseFloat(e.target.value) || 0)}
                min={0}
                max={100}
                placeholder="0"
                className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[oklch(0.20_0.008_260)] pt-4">
          <p className="text-sm text-[oklch(0.50_0.01_260)] mb-3">Fundraising Plans (optional)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[oklch(0.65_0.005_80)]">Target Raise (₹)</Label>
              <Input
                type="number"
                value={inputs.target_raise ?? ''}
                onChange={(e) => setField('target_raise', e.target.value === '' ? null : parseFloat(e.target.value))}
                placeholder="50000000"
                className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1"
              />
            </div>
            <div>
              <Label className="text-[oklch(0.65_0.005_80)]">Expected Dilution (%)</Label>
              <Input
                type="number"
                value={inputs.expected_dilution_pct ?? ''}
                onChange={(e) => setField('expected_dilution_pct', e.target.value === '' ? null : parseFloat(e.target.value))}
                min={0}
                max={50}
                placeholder="15-25"
                className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
