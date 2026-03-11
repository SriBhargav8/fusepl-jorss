'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STARTUP_CATEGORIES, STAGES, BUSINESS_MODELS } from '@/types'

export function CompanyStep() {
  const { inputs, setField } = useValuationStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Company Profile</h2>
        <p className="text-slate-400 text-sm">Tell us about your startup</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="company_name" className="text-slate-300">Company Name *</Label>
          <Input
            id="company_name"
            value={inputs.company_name}
            onChange={(e) => setField('company_name', e.target.value)}
            placeholder="e.g., Acme Technologies"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Sector *</Label>
            <Select value={inputs.sector} onValueChange={(v) => setField('sector', v as any)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(STARTUP_CATEGORIES).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300">Stage *</Label>
            <Select value={inputs.stage} onValueChange={(v) => setField('stage', v as any)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(STAGES).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Business Model *</Label>
            <Select value={inputs.business_model} onValueChange={(v) => setField('business_model', v as any)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(BUSINESS_MODELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-slate-700">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city" className="text-slate-300">City *</Label>
            <Input
              id="city"
              value={inputs.city}
              onChange={(e) => setField('city', e.target.value)}
              placeholder="e.g., Bangalore"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="founding_year" className="text-slate-300">Founding Year</Label>
          <Input
            id="founding_year"
            type="number"
            value={inputs.founding_year}
            onChange={(e) => setField('founding_year', parseInt(e.target.value) || 2020)}
            min={2000}
            max={new Date().getFullYear()}
            className="bg-slate-800 border-slate-700 text-white mt-1 w-40"
          />
        </div>
      </div>
    </div>
  )
}
