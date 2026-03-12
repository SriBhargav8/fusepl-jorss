'use client'

import { useState, useMemo } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STARTUP_CATEGORIES, CATEGORY_LABELS, STAGES, STAGE_LABELS, BUSINESS_MODELS, BUSINESS_MODEL_LABELS } from '@/types'
import type { StartupCategory, BusinessModel } from '@/types'
import { Globe, Loader2, Sparkles, Search, Info } from 'lucide-react'
import { toast } from 'sonner'

const SECTOR_ENTRIES: [StartupCategory, string][] = STARTUP_CATEGORIES.map(key => [key, CATEGORY_LABELS[key]])
const BIZ_MODEL_ENTRIES: [BusinessModel, string][] = BUSINESS_MODELS.map(key => [key, BUSINESS_MODEL_LABELS[key]])

export function CompanyStep() {
  const { inputs, setField } = useValuationStore()
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [sectorSearch, setSectorSearch] = useState('')
  const [bizModelSearch, setBizModelSearch] = useState('')

  const filteredSectors = useMemo(() => {
    if (!sectorSearch) return SECTOR_ENTRIES
    const q = sectorSearch.toLowerCase()
    return SECTOR_ENTRIES.filter(([, label]) => label.toLowerCase().includes(q))
  }, [sectorSearch])

  const filteredBizModels = useMemo(() => {
    if (!bizModelSearch) return BIZ_MODEL_ENTRIES
    const q = bizModelSearch.toLowerCase()
    return BIZ_MODEL_ENTRIES.filter(([, label]) => label.toLowerCase().includes(q))
  }, [bizModelSearch])

  const handleAnalyzeUrl = async () => {
    if (!websiteUrl.trim()) return
    setAnalyzing(true)

    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      })

      const data = await res.json()

      if (data.success && data.data) {
        const d = data.data
        if (d.company_name && !inputs.company_name) setField('company_name', d.company_name)
        if (d.sector) setField('sector', d.sector)
        if (d.city) setField('city', d.city)
        if (d.founding_year) setField('founding_year', d.founding_year)
        if (d.team_size) setField('team_size', d.team_size)

        const filled = [d.company_name, d.sector, d.city, d.founding_year, d.team_size].filter(Boolean).length
        toast.success(`Auto-filled ${filled} fields from your website`)
      } else {
        toast.error(data.error || 'Could not analyze website')
      }
    } catch {
      toast.error('Failed to analyze website')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step header with education */}
      <div>
        <h2 className="text-2xl font-bold text-[oklch(0.95_0.002_250)] mb-1">Company Profile</h2>
        <p className="text-[oklch(0.60_0.01_250)] text-sm">Your sector and stage directly determine which valuation methods we use and which comparable companies we match against.</p>
      </div>

      {/* URL Auto-fill */}
      <div className="rounded-xl border border-dashed border-[oklch(0.72_0.17_162/0.25)] bg-[oklch(0.72_0.17_162/0.03)] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[oklch(0.72_0.17_162)]" />
          <span className="text-xs font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-wider">
            Quick Start
          </span>
        </div>
        <p className="text-xs text-[oklch(0.55_0.01_250)] mb-3">
          Paste your startup website and we&apos;ll auto-detect your sector, city, founding year, and more.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.40_0.01_250)]" />
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="yourstarup.com"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeUrl()}
              className="w-full h-10 pl-10 pr-4 text-sm rounded-lg bg-[oklch(0.14_0.015_250)] border border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.17_162/0.4)] transition-colors"
            />
          </div>
          <button
            onClick={handleAnalyzeUrl}
            disabled={!websiteUrl.trim() || analyzing}
            className="h-10 px-4 text-xs font-semibold rounded-lg bg-[oklch(0.72_0.17_162)] text-[oklch(0.10_0_0)] transition-all hover:bg-[oklch(0.68_0.18_162)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Auto-fill'
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="company_name" className="text-[oklch(0.68_0.005_250)] text-xs font-medium">Company Name *</Label>
          <Input
            id="company_name"
            value={inputs.company_name}
            onChange={(e) => setField('company_name', e.target.value)}
            placeholder="e.g., Acme Technologies"
            className="bg-[oklch(0.14_0.015_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] placeholder:text-[oklch(0.45_0.01_250)] mt-1.5 focus:border-[oklch(0.72_0.17_162/0.4)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Searchable Sector Dropdown */}
          <div>
            <Label className="text-[oklch(0.68_0.005_250)] text-xs font-medium">Sector *</Label>
            <p className="text-[10px] text-[oklch(0.48_0.01_250)] mb-0.5">Determines comparable companies and industry multiples</p>
            <Select value={inputs.sector} onValueChange={(v) => setField('sector', v as any)}>
              <SelectTrigger className="bg-[oklch(0.14_0.015_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.18_0.018_250)] border-[oklch(0.26_0.018_250)] max-h-[280px]">
                {/* Search input inside dropdown */}
                <div className="px-2 pb-2 pt-1 sticky top-0 bg-[oklch(0.18_0.018_250)] z-10">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.40_0.01_250)]" />
                    <input
                      type="text"
                      placeholder="Search sectors..."
                      value={sectorSearch}
                      onChange={(e) => setSectorSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="w-full h-8 pl-8 pr-3 text-xs rounded-md bg-[oklch(0.14_0.015_250)] border border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.17_162/0.4)]"
                    />
                  </div>
                </div>
                {filteredSectors.map(([key, label]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="text-[oklch(0.82_0.005_250)] hover:bg-[oklch(0.20_0.015_250)] focus:bg-[oklch(0.20_0.015_250)] text-xs"
                  >
                    {label}
                  </SelectItem>
                ))}
                {filteredSectors.length === 0 && (
                  <div className="px-3 py-2 text-xs text-[oklch(0.45_0.01_250)]">No sectors found</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[oklch(0.68_0.005_250)] text-xs font-medium">Stage *</Label>
            <p className="text-[10px] text-[oklch(0.48_0.01_250)] mb-0.5">Affects risk discount and applicable methods</p>
            <Select value={inputs.stage} onValueChange={(v) => setField('stage', v as any)}>
              <SelectTrigger className="bg-[oklch(0.14_0.015_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.18_0.018_250)] border-[oklch(0.26_0.018_250)]">
                {STAGES.map(key => (
                  <SelectItem key={key} value={key} className="text-[oklch(0.82_0.005_250)] hover:bg-[oklch(0.20_0.015_250)] text-xs">
                    {STAGE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Searchable Business Model Dropdown */}
          <div>
            <Label className="text-[oklch(0.68_0.005_250)] text-xs font-medium">Business Model *</Label>
            <p className="text-[10px] text-[oklch(0.48_0.01_250)] mb-0.5">Drives revenue multiple selection</p>
            <Select value={inputs.business_model} onValueChange={(v) => setField('business_model', v as any)}>
              <SelectTrigger className="bg-[oklch(0.14_0.015_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.18_0.018_250)] border-[oklch(0.26_0.018_250)] max-h-[280px]">
                <div className="px-2 pb-2 pt-1 sticky top-0 bg-[oklch(0.18_0.018_250)] z-10">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.40_0.01_250)]" />
                    <input
                      type="text"
                      placeholder="Search models..."
                      value={bizModelSearch}
                      onChange={(e) => setBizModelSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      className="w-full h-8 pl-8 pr-3 text-xs rounded-md bg-[oklch(0.14_0.015_250)] border border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.72_0.17_162/0.4)]"
                    />
                  </div>
                </div>
                {filteredBizModels.map(([key, label]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="text-[oklch(0.82_0.005_250)] hover:bg-[oklch(0.20_0.015_250)] focus:bg-[oklch(0.20_0.015_250)] text-xs"
                  >
                    {label}
                  </SelectItem>
                ))}
                {filteredBizModels.length === 0 && (
                  <div className="px-3 py-2 text-xs text-[oklch(0.45_0.01_250)]">No models found</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city" className="text-[oklch(0.68_0.005_250)] text-xs font-medium">City</Label>
            <Input
              id="city"
              value={inputs.city}
              onChange={(e) => setField('city', e.target.value)}
              placeholder="e.g., Bangalore"
              className="bg-[oklch(0.14_0.015_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] placeholder:text-[oklch(0.45_0.01_250)] mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="founding_year" className="text-[oklch(0.68_0.005_250)] text-xs font-medium">Founding Year</Label>
          <Input
            id="founding_year"
            type="number"
            value={inputs.founding_year}
            onChange={(e) => setField('founding_year', parseInt(e.target.value) || 2020)}
            min={2000}
            max={new Date().getFullYear()}
            className="bg-[oklch(0.14_0.015_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.88_0.005_250)] mt-1.5 w-40"
          />
        </div>
      </div>
    </div>
  )
}
