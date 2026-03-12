'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { DEV_STAGES, DEV_STAGE_LABELS, COMPETITIVE_ADVANTAGES, COMPETITIVE_ADVANTAGE_LABELS } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'

export function MarketProductStep() {
  const { inputs, setField } = useValuationStore()

  const toggleAdvantage = (adv: string) => {
    const current = inputs.competitive_advantages
    if (current.includes(adv as any)) {
      setField('competitive_advantages', current.filter(a => a !== adv))
    } else {
      setField('competitive_advantages', [...current, adv as any])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[oklch(0.93_0.005_80)] mb-1">Market & Product</h2>
        <p className="text-[oklch(0.55_0.01_260)] text-sm">Big markets = big valuations. Investors want to know the total opportunity and where your product stands.</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="tam" className="text-[oklch(0.65_0.005_80)]">Total Addressable Market (TAM in Cr) *</Label>
          <p className="text-xs text-[oklch(0.48_0.01_260)] mb-1">The total market size if you captured 100% of your target customers. Enter in crores (e.g., 5000 = ₹5,000 Cr)</p>
          <Input
            id="tam"
            type="number"
            value={inputs.tam}
            onChange={(e) => setField('tam', parseInt(e.target.value) || 0)}
            className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1 w-48"
            placeholder="5000"
          />
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)]">Development Stage *</Label>
          <p className="text-xs text-[oklch(0.48_0.01_260)]">Where your product is in its journey — from idea to scaling</p>
          <Select value={inputs.dev_stage} onValueChange={(v) => setField('dev_stage', v as any)}>
            <SelectTrigger className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)]">
              {DEV_STAGES.map(key => (
                <SelectItem key={key} value={key} className="text-[oklch(0.93_0.005_80)] hover:bg-[oklch(0.15_0.008_260)]">
                  {DEV_STAGE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)]">Competition Level (1-5): {inputs.competition_level}</Label>
          <p className="text-xs text-[oklch(0.38_0.01_260)] mb-2">1 = Blue ocean, 5 = Hypercompetitive market</p>
          <Slider
            value={[inputs.competition_level]}
            onValueChange={(v) => setField('competition_level', Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)] mb-1 block">Competitive Advantages</Label>
          <p className="text-xs text-[oklch(0.48_0.01_260)] mb-2">What makes you hard to copy? Select all that apply — each one adds to your moat score.</p>
          <div className="flex flex-wrap gap-2">
            {COMPETITIVE_ADVANTAGES.map(key => (
              <label
                key={key}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                  inputs.competitive_advantages.includes(key)
                    ? 'border-[oklch(0.78_0.14_80/0.5)] bg-[oklch(0.78_0.14_80/0.08)] text-[oklch(0.85_0.12_80)]'
                    : 'border-[oklch(0.20_0.008_260)] bg-[oklch(0.08_0.008_260)] text-[oklch(0.55_0.01_260)] hover:border-[oklch(0.30_0.008_260)]'
                }`}
              >
                <Checkbox
                  checked={inputs.competitive_advantages.includes(key)}
                  onCheckedChange={() => toggleAdvantage(key)}
                  className="hidden"
                />
                {COMPETITIVE_ADVANTAGE_LABELS[key]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="patents_count" className="text-[oklch(0.65_0.005_80)]">Number of Patents</Label>
          <Input
            id="patents_count"
            type="number"
            value={inputs.patents_count}
            onChange={(e) => setField('patents_count', parseInt(e.target.value) || 0)}
            min={0}
            className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1 w-32"
          />
        </div>
      </div>
    </div>
  )
}
