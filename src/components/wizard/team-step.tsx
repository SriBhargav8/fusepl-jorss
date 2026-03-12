'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

const KEY_HIRE_OPTIONS = [
  { value: 'cto', label: 'CTO' },
  { value: 'cfo', label: 'CFO' },
  { value: 'sales_lead', label: 'Sales Lead' },
  { value: 'marketing_head', label: 'Marketing Head' },
  { value: 'product_head', label: 'Product Head' },
]

export function TeamStep() {
  const { inputs, setField } = useValuationStore()

  const toggleKeyHire = (hire: string) => {
    const current = inputs.key_hires
    if (current.includes(hire)) {
      setField('key_hires', current.filter(h => h !== hire))
    } else {
      setField('key_hires', [...current, hire])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[oklch(0.93_0.005_80)] mb-1">Team</h2>
        <p className="text-[oklch(0.55_0.01_260)] text-sm">Investors bet on people first. A strong team can add 2-3x to your valuation.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="team_size" className="text-[oklch(0.65_0.005_80)]">Team Size *</Label>
          <p className="text-xs text-[oklch(0.48_0.01_260)] mb-1">Total number of people (founders + employees + contractors)</p>
          <Input
            id="team_size"
            type="number"
            value={inputs.team_size}
            onChange={(e) => setField('team_size', parseInt(e.target.value) || 1)}
            min={1}
            max={500}
            className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1 w-32"
          />
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)]">Founder Experience (1-5): {inputs.founder_experience}</Label>
          <p className="text-xs text-[oklch(0.38_0.01_260)] mb-2">1 = First-time founder, 5 = Serial entrepreneur with deep expertise</p>
          <Slider
            value={[inputs.founder_experience]}
            onValueChange={(v) => setField('founder_experience', Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)]">Domain Expertise (1-5): {inputs.domain_expertise}</Label>
          <p className="text-xs text-[oklch(0.38_0.01_260)] mb-2">1 = New to sector, 5 = Industry veteran (10+ years)</p>
          <Slider
            value={[inputs.domain_expertise]}
            onValueChange={(v) => setField('domain_expertise', Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="previous_exits"
            checked={inputs.previous_exits}
            onCheckedChange={(checked) => setField('previous_exits', !!checked)}
          />
          <div>
            <Label htmlFor="previous_exits" className="text-[oklch(0.65_0.005_80)] cursor-pointer">
              Founders have previous exits
            </Label>
            <p className="text-[10px] text-[oklch(0.48_0.01_260)] ml-6">Previously sold or IPO&apos;d a company — this significantly boosts investor confidence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="technical_cofounder"
            checked={inputs.technical_cofounder}
            onCheckedChange={(checked) => setField('technical_cofounder', !!checked)}
          />
          <div>
            <Label htmlFor="technical_cofounder" className="text-[oklch(0.65_0.005_80)] cursor-pointer">
              Has technical co-founder
            </Label>
            <p className="text-[10px] text-[oklch(0.48_0.01_260)] ml-6">A tech co-founder reduces execution risk, especially for product-led startups</p>
          </div>
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)] mb-1 block">Key Hires</Label>
          <p className="text-xs text-[oklch(0.48_0.01_260)] mb-2">Senior roles that are already filled on your team</p>
          <div className="flex flex-wrap gap-3">
            {KEY_HIRE_OPTIONS.map(option => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                  inputs.key_hires.includes(option.value)
                    ? 'border-[oklch(0.78_0.14_80/0.5)] bg-[oklch(0.78_0.14_80/0.08)] text-[oklch(0.85_0.12_80)]'
                    : 'border-[oklch(0.20_0.008_260)] bg-[oklch(0.08_0.008_260)] text-[oklch(0.50_0.01_260)] hover:border-[oklch(0.30_0.008_260)]'
                }`}
              >
                <Checkbox
                  checked={inputs.key_hires.includes(option.value)}
                  onCheckedChange={() => toggleKeyHire(option.value)}
                  className="hidden"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
