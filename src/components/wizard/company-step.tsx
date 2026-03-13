'use client'

import { useState, useMemo } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SECTOR_GROUPS, CATEGORY_SHORT_LABELS, CATEGORY_LABELS, STAGES, STAGE_LABELS, BUSINESS_MODELS, BUSINESS_MODEL_LABELS } from '@/types'
import type { StartupCategory, BusinessModel } from '@/types'
import { Globe, Loader2, Search, CheckCircle2, AlertTriangle, X, Zap, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from './wizard-container'

const BIZ_MODEL_ENTRIES: [BusinessModel, string][] = BUSINESS_MODELS.map(key => [key, BUSINESS_MODEL_LABELS[key]])

type PrefillStatus = 'idle' | 'loading' | 'success' | 'partial' | 'error'

/* ─── Segmented Completion Dots ────────────────────────────────────── */
function CompletionDots({ filled, total }: { filled: boolean[]; total: number }) {
  const allFilled = filled.every(Boolean)
  const count = filled.filter(Boolean).length

  return (
    <div className="glass-card grain relative rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-heading text-sm text-[oklch(0.45 0.01 260)]">Profile Completion</span>
        <span
          className={`font-mono text-lg font-bold tabular-nums ${allFilled ? 'text-gold-gradient' : ''}`}
          style={!allFilled ? { color: count >= 3 ? 'oklch(0.62 0.22 330)' : 'oklch(0.50 0.01 260)' } : undefined}
        >
          {count}/{total}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {filled.map((isFilled, i) => (
          <motion.div
            key={i}
            className="flex-1 h-2 rounded-full"
            style={{
              background: isFilled ? 'oklch(0.65 0.16 155)' : 'oklch(0.91 0.005 260)',
              boxShadow: isFilled ? '0 0 8px oklch(0.65 0.16 155 / 0.3)' : 'none',
            }}
            animate={isFilled ? { scale: [0.9, 1] } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          />
        ))}
      </div>
      {allFilled && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-heading text-[oklch(0.65_0.16_155)] mt-2 text-center relative overflow-hidden"
        >
          <span className="relative z-[1]">All fields complete — ready to continue!</span>
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[oklch(0.65_0.16_155/0.15)] to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.p>
      )}
    </div>
  )
}

/* ─── Grouped Sector Dropdown Content ──────────────────────────────── */
function SectorDropdownContent({ search, onSearch }: { search: string; onSearch: (v: string) => void }) {
  const q = search.toLowerCase()
  const filteredGroups = useMemo(() => {
    if (!q) return SECTOR_GROUPS
    return SECTOR_GROUPS
      .map(g => ({
        ...g,
        items: g.items.filter(key =>
          CATEGORY_SHORT_LABELS[key].toLowerCase().includes(q) ||
          g.group.toLowerCase().includes(q)
        ),
      }))
      .filter(g => g.items.length > 0)
  }, [q])

  return (
    <>
      <div className="px-2 pb-2 pt-1 sticky top-0 bg-[oklch(0.96 0.005 260)] z-10">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.50 0.01 260)]" />
          <input
            type="text"
            placeholder="Search 139 sectors..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-md bg-[oklch(0.985 0.002 260)] border border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.62_0.22_330/0.4)]"
          />
        </div>
      </div>
      {filteredGroups.map(({ group, items }) => (
        <SelectGroup key={group}>
          <SelectLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.62 0.22 330)] px-3 py-1.5 bg-[oklch(0.96_0.005_260)] sticky">
            {group}
          </SelectLabel>
          {items.map(key => (
            <SelectItem
              key={key}
              value={key}
              className="text-[oklch(0.25 0.02 260)] hover:bg-[oklch(0.91 0.005 260)] focus:bg-[oklch(0.91 0.005 260)] text-xs pl-5"
            >
              {CATEGORY_SHORT_LABELS[key]}
            </SelectItem>
          ))}
        </SelectGroup>
      ))}
      {filteredGroups.length === 0 && (
        <div className="px-3 py-4 text-xs text-[oklch(0.45_0.01_250)] text-center">No sectors match &ldquo;{search}&rdquo;</div>
      )}
    </>
  )
}

export function CompanyStep() {
  const { inputs, setField } = useValuationStore()
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [prefillStatus, setPrefillStatus] = useState<PrefillStatus>('idle')
  const [prefillMessage, setPrefillMessage] = useState('')
  const [sectorSearch, setSectorSearch] = useState('')
  const [bizModelSearch, setBizModelSearch] = useState('')
  const [autoDetectedFields, setAutoDetectedFields] = useState<Set<string>>(new Set())
  const [flashFields, setFlashFields] = useState(false)

  const fieldsFilled = [
    !!inputs.company_name.trim(),
    inputs.sector !== 'saas_horizontal',
    inputs.stage !== 'seed',
    inputs.business_model !== 'saas_subscription',
    !!inputs.city,
  ]

  const filteredBizModels = useMemo(() => {
    if (!bizModelSearch) return BIZ_MODEL_ENTRIES
    const q = bizModelSearch.toLowerCase()
    return BIZ_MODEL_ENTRIES.filter(([, label]) => label.toLowerCase().includes(q))
  }, [bizModelSearch])

  const handleAnalyzeUrl = async () => {
    const raw = websiteUrl.trim()
    if (!raw) return
    setAnalyzing(true)
    setPrefillStatus('loading')
    setPrefillMessage('')
    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        const d = data.data
        const fields: string[] = []
        const detected = new Set<string>()
        if (d.company_name && !inputs.company_name) { setField('company_name', d.company_name); fields.push('company name') }
        if (d.sector) { setField('sector', d.sector); fields.push('sector'); detected.add('sector') }
        if (d.city) { setField('city', d.city); fields.push('city') }
        if (d.founding_year) { setField('founding_year', d.founding_year); fields.push('founded year') }
        if (d.team_size) { setField('team_size', d.team_size); fields.push('team size') }
        setAutoDetectedFields(detected)
        if (fields.length > 0) {
          setFlashFields(true)
          setTimeout(() => setFlashFields(false), 1000)
          const isPartial = data.partial || fields.length < 3
          setPrefillStatus(isPartial ? 'partial' : 'success')
          const msg = `Detected: ${fields.join(', ')}`
          setPrefillMessage(data.note ? `${msg}. ${data.note}` : msg)
          toast.success(`Auto-filled ${fields.length} field${fields.length > 1 ? 's' : ''}`)
        } else if (data.note) { setPrefillStatus('partial'); setPrefillMessage(data.note) }
        else { setPrefillStatus('partial'); setPrefillMessage('No fields detected — please fill manually below.') }
      } else if (!res.ok) {
        setPrefillStatus('error')
        setPrefillMessage(data.hint || data.note || 'Website unreachable — please fill the fields manually below.')
      } else { setPrefillStatus('error'); setPrefillMessage('Could not extract data — please fill the fields manually below.') }
    } catch { setPrefillStatus('error'); setPrefillMessage('Network error — please fill the fields manually below.') }
    finally { setAnalyzing(false) }
  }

  const clearPrefill = () => { setPrefillStatus('idle'); setPrefillMessage(''); setWebsiteUrl('') }

  // Get the current sector's group name for display
  const currentSectorGroup = SECTOR_GROUPS.find(g => g.items.includes(inputs.sector))?.group

  return (
    <motion.div
      className="space-y-5"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.62_0.22_330/0.12)] flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[oklch(0.62 0.22 330)]" />
          </div>
          <h2 className="font-heading text-2xl text-[oklch(0.15 0.02 260)]">Company Profile</h2>
        </div>
        <p className="text-[oklch(0.45 0.01 260)] text-sm">Your sector and stage directly determine which valuation methods we use and which comparable companies we match against.</p>
      </motion.div>

      {/* Completion meter at TOP */}
      <motion.div variants={staggerItem}>
        <CompletionDots filled={fieldsFilled} total={5} />
      </motion.div>

      {/* Company Name + Website Auto-fill */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-4">
        <div>
          <Label htmlFor="company_name" className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Company Name *</Label>
          <Input
            id="company_name"
            value={inputs.company_name}
            onChange={(e) => setField('company_name', e.target.value)}
            placeholder="e.g., Acme Technologies"
            className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.15 0.02 260)] placeholder:text-[oklch(0.50 0.01 260)] mt-1.5 focus:border-[oklch(0.62_0.22_330/0.5)] h-11 text-base"
          />

          {/* Website prefill */}
          <div className="mt-2.5">
            {prefillStatus === 'idle' || prefillStatus === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.50 0.01 260)]" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="Paste website URL to auto-fill fields"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeUrl()}
                    className="w-full h-9 pl-8 pr-3 text-xs rounded-lg bg-[oklch(0.98_0.002_260)] border border-dashed border-[oklch(0.91 0.005 260)] text-[oklch(0.20_0.02_260)] placeholder:text-[oklch(0.50_0.01_260)] focus:outline-none focus:border-[oklch(0.62_0.22_330/0.4)] transition-colors"
                  />
                </div>
                <button
                  onClick={handleAnalyzeUrl}
                  disabled={!websiteUrl.trim() || analyzing}
                  className="h-9 px-4 text-[11px] font-semibold rounded-lg bg-[oklch(0.62_0.22_330/0.12)] border border-[oklch(0.62_0.22_330/0.25)] text-[oklch(0.62 0.22 330)] transition-all hover:bg-[oklch(0.62_0.22_330/0.18)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                >
                  {analyzing ? <><Loader2 className="w-3 h-3 animate-spin" />Detecting...</> : <><Zap className="w-3 h-3" />Auto-Detect</>}
                </button>
              </div>
            ) : (
              <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs ${
                prefillStatus === 'success' ? 'bg-[oklch(0.65_0.16_155/0.08)] border border-[oklch(0.65_0.16_155/0.2)]'
                : prefillStatus === 'partial' ? 'bg-[oklch(0.72_0.15_85/0.08)] border border-[oklch(0.72_0.15_85/0.2)]'
                : 'bg-[oklch(0.62_0.18_25/0.08)] border border-[oklch(0.62_0.18_25/0.2)]'
              }`}>
                {prefillStatus === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 text-[oklch(0.65_0.16_155)] shrink-0" />
                : <AlertTriangle className="w-4 h-4 mt-0.5 text-[oklch(0.72_0.15_85)] shrink-0" />}
                <span className={`flex-1 ${prefillStatus === 'success' ? 'text-[oklch(0.65_0.16_155)]' : prefillStatus === 'partial' ? 'text-[oklch(0.72_0.15_85)]' : 'text-[oklch(0.62_0.18_25)]'}`}>{prefillMessage}</span>
                <button onClick={clearPrefill} className="text-[oklch(0.50 0.01 260)] hover:text-[oklch(0.30 0.01 260)] transition-colors shrink-0" title="Try another URL"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Sector & Stage — Glass card section */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Grouped Sector Dropdown */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Sector *</Label>
              {autoDetectedFields.has('sector') && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-[oklch(0.62_0.22_330/0.12)] text-[oklch(0.62 0.22 330)] border border-[oklch(0.62_0.22_330/0.25)]">
                  <Zap className="w-2.5 h-2.5" />Auto
                </span>
              )}
            </div>
            <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-1">Determines comparable companies & industry multiples</p>
            <Select value={inputs.sector} onValueChange={(v) => setField('sector', v as StartupCategory)}>
              <SelectTrigger className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] h-10">
                <SelectValue>
                  {currentSectorGroup && (
                    <span className="text-[oklch(0.45 0.01 260)]">{currentSectorGroup} / </span>
                  )}
                  {CATEGORY_SHORT_LABELS[inputs.sector]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="bg-[oklch(0.96 0.005 260)] border-[oklch(0.91 0.005 260)] max-h-[320px]">
                <SectorDropdownContent search={sectorSearch} onSearch={setSectorSearch} />
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Stage *</Label>
            <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-1">Affects risk discount & applicable methods</p>
            <Select value={inputs.stage} onValueChange={(v) => setField('stage', v as any)}>
              <SelectTrigger className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.96 0.005 260)] border-[oklch(0.91 0.005 260)]">
                {STAGES.map(key => (
                  <SelectItem key={key} value={key} className="text-[oklch(0.25 0.02 260)] hover:bg-[oklch(0.91 0.005 260)] text-xs">
                    {STAGE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Business Model *</Label>
            <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-1">Drives revenue multiple selection</p>
            <Select value={inputs.business_model} onValueChange={(v) => setField('business_model', v as any)}>
              <SelectTrigger className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="bg-[oklch(0.96 0.005 260)] border-[oklch(0.91 0.005 260)] max-h-[280px]">
                <div className="px-2 pb-2 pt-1 sticky top-0 bg-[oklch(0.96 0.005 260)] z-10">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.50 0.01 260)]" />
                    <input
                      type="text" placeholder="Search models..." value={bizModelSearch}
                      onChange={(e) => setBizModelSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}
                      className="w-full h-8 pl-8 pr-3 text-xs rounded-md bg-[oklch(0.985 0.002 260)] border border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.62_0.22_330/0.4)]"
                    />
                  </div>
                </div>
                {filteredBizModels.map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-[oklch(0.25 0.02 260)] hover:bg-[oklch(0.91 0.005 260)] focus:bg-[oklch(0.91 0.005 260)] text-xs">{label}</SelectItem>
                ))}
                {filteredBizModels.length === 0 && <div className="px-3 py-2 text-xs text-[oklch(0.45_0.01_250)]">No models found</div>}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city" className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Headquarters City</Label>
            <p className="text-[10px] text-[oklch(0.50 0.01 260)] mb-1">Primary office location</p>
            <Input
              id="city" value={inputs.city}
              onChange={(e) => setField('city', e.target.value)}
              placeholder="e.g., Bangalore"
              className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.50 0.01 260)] h-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="founding_year" className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Year of Incorporation</Label>
          <Input
            id="founding_year" type="number" value={inputs.founding_year}
            onChange={(e) => setField('founding_year', parseInt(e.target.value) || 2020)}
            min={2000} max={new Date().getFullYear()}
            className="bg-[oklch(0.98 0.002 260)] border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] mt-1 w-40 h-10"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
