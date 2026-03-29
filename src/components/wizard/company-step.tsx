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
      <div className="px-2 pb-2 pt-2 sticky top-0 bg-[oklch(0.96_0.005_260)] z-30 border-b border-[oklch(0.91_0.005_260/0.4)]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.50 0.01 260)]" />
          <input
            type="text"
            placeholder="Search 139 sectors..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full h-9 pl-8 pr-3 text-xs rounded-lg bg-[oklch(0.985 0.002 260)] border border-[oklch(0.91_0.005_260/0.8)] text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.62_0.22_330/0.4)] focus:shadow-[0_0_8px_oklch(0.62_0.22_330/0.1)]"
          />
        </div>
      </div>
      {filteredGroups.map(({ group, items }) => (
        <SelectGroup key={group}>
          <SelectLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.62 0.22 330)] px-3 py-2 bg-[oklch(0.96_0.005_260/0.95)] backdrop-blur-sm sticky top-[44px] z-20">
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
        setPrefillMessage(data.hint || data.error || 'Website unreachable — please fill the fields manually below.')
      } else { setPrefillStatus('error'); setPrefillMessage('Could not extract data — please fill the fields manually below.') }
    } catch { setPrefillStatus('error'); setPrefillMessage('Network error — please fill the fields manually below.') }
    finally { setAnalyzing(false) }
  }

  const clearPrefill = () => { setPrefillStatus('idle'); setPrefillMessage(''); setWebsiteUrl('') }

  // Get the current sector's group name for display
  const currentSectorGroup = SECTOR_GROUPS.find(g => g.items.includes(inputs.sector))?.group

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Integrated Profile Completion & Auto-Detect Header */}
      <motion.div variants={staggerItem} className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[oklch(0.62_0.22_330/0.08)]">
              <Building2 className="w-4 h-4 text-[oklch(0.62_0.22_330)]" />
            </div>
            <h2 className="font-heading text-2xl text-[oklch(0.15_0.02_260)]">Core Identity</h2>
          </div>
          <p className="text-sm text-[oklch(0.45_0.01_260)] leading-relaxed max-w-lg">
            Essential profile metadata used for industry benchmarking and multiple selection.
          </p>
        </div>

        <div className="w-full md:w-64 shrink-0">
          <CompletionDots filled={fieldsFilled} total={5} />
        </div>
      </motion.div>

      {/* Grid Layout for Fields */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Primary Identity */}
        <motion.div variants={staggerItem} className="md:col-span-12 glass-card grain rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-2">
              <Label htmlFor="company_name" className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">
                Company Name <span className="text-[oklch(0.62_0.22_330)]">*</span>
              </Label>
              <Input
                id="company_name"
                value={inputs.company_name}
                onChange={(e) => setField('company_name', e.target.value)}
                placeholder="Registry name"
                className="h-11 bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260)] text-[oklch(0.15_0.02_260)] transition-all focus:ring-1 focus:ring-[oklch(0.62_0.22_330/0.3)] focus:border-[oklch(0.62_0.22_330/0.4)] focus:shadow-[0_0_12px_oklch(0.62_0.22_330/0.05)]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">
                Website Audit <span className="text-[oklch(0.45_0.01_260/0.5)]">(Optional)</span>
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.45_0.01_260)]" />
                  <Input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="Auto-fill via URL"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeUrl()}
                    className="h-11 pl-9 bg-[oklch(0.98_0.002_260)] border-dashed border-[oklch(0.91_0.005_260)] text-[oklch(0.15_0.02_260)] transition-all focus-visible:ring-1 focus-visible:ring-[oklch(0.62_0.22_330/0.3)] focus-visible:border-[oklch(0.62_0.22_330/0.4)]"
                  />
                </div>
                <button
                  onClick={handleAnalyzeUrl}
                  disabled={!websiteUrl.trim() || analyzing}
                  className="h-11 px-4 text-[11px] font-bold rounded-xl bg-[oklch(0.15_0.02_260)] text-white hover:bg-[oklch(0.10_0.02_260)] disabled:opacity-30 transition-all flex items-center gap-2"
                >
                  {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  Run
                </button>
              </div>
              {prefillMessage && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} 
                  className={`text-[10px] font-medium px-2 py-1 rounded ${
                    prefillStatus === 'success' ? 'text-[oklch(0.65_0.16_155)] bg-[oklch(0.65_0.16_155/0.05)]' : 'text-[oklch(0.62_0.18_25)] bg-[oklch(0.62_0.18_25/0.05)]'
                  }`}
                >
                  {prefillMessage}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Industry & Metrics Grid */}
        <motion.div variants={staggerItem} className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sector Selection */}
          <div className="glass-card grain rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
               <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Industry Sector *</Label>
              {autoDetectedFields.has('sector') && (
                <span className="text-[9px] font-bold text-[oklch(0.62_0.22_330)] uppercase">Detected</span>
              )}
            </div>
            <Select value={inputs.sector} onValueChange={(v) => setField('sector', v as StartupCategory)}>
              <SelectTrigger className="w-full h-11 bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260)] transition-all focus:ring-1 focus:ring-[oklch(0.62_0.22_330/0.3)]">
                <SelectValue>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[10px] text-[oklch(0.45_0.01_260)] truncate shrink-0">{currentSectorGroup?.split(' ')[0]} /</span>
                    <span className="truncate">{CATEGORY_SHORT_LABELS[inputs.sector]}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.96_0.005_260)] max-h-[300px] w-[var(--radix-select-trigger-width)]">
                <SectorDropdownContent search={sectorSearch} onSearch={setSectorSearch} />
              </SelectContent>
            </Select>
            <p className="text-[10px] text-[oklch(0.45_0.01_260)] opacity-70 leading-relaxed px-1">
              Mapped against 164 sub-sectors for precision.
            </p>
          </div>

          {/* Development Stage */}
          <div className="glass-card grain rounded-2xl p-6 space-y-4">
             <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Product Stage *</Label>
            <Select value={inputs.stage} onValueChange={(v) => setField('stage', v as any)}>
              <SelectTrigger className="w-full h-11 bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260)] transition-all focus:ring-1 focus:ring-[oklch(0.62_0.22_330/0.3)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.96_0.005_260)] w-[var(--radix-select-trigger-width)]">
                {STAGES.map(key => (
                  <SelectItem key={key} value={key} className="text-xs">{STAGE_LABELS[key]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-[oklch(0.45_0.01_260)] opacity-70 leading-relaxed px-1">
              Calibrates risk premiums and discount rates.
            </p>
          </div>

          {/* Business Architecture */}
          <div className="glass-card grain rounded-2xl p-6 space-y-4">
             <Label className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Revenue Model *</Label>
            <Select value={inputs.business_model} onValueChange={(v) => setField('business_model', v as any)}>
              <SelectTrigger className="w-full h-11 bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260)] transition-all focus:ring-1 focus:ring-[oklch(0.62_0.22_330/0.3)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.96_0.005_260)] max-h-[300px] w-[var(--radix-select-trigger-width)]">
                <div className="px-2 pb-2 sticky top-0 bg-[oklch(0.96_0.005_260)] z-10">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[oklch(0.45_0.01_260)]" />
                    <Input
                      type="text" placeholder="Search..." value={bizModelSearch}
                      onChange={(e) => setBizModelSearch(e.target.value)}
                      className="h-8 pl-8 text-[10px]"
                    />
                  </div>
                </div>
                {filteredBizModels.map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-[oklch(0.45_0.01_260)] opacity-70 leading-relaxed px-1">
              Targets specific valuation multiples.
            </p>
          </div>
        </motion.div>

        {/* Demographics & Metadata */}
        <motion.div variants={staggerItem} className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card grain rounded-2xl p-6 flex items-center justify-between gap-6">
            <div className="space-y-1.5 flex-1">
               <Label htmlFor="city" className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Headquarters City</Label>
              <Input
                id="city" value={inputs.city}
                onChange={(e) => setField('city', e.target.value)}
                placeholder="e.g., Bangalore"
                className="h-10 bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260)] transition-all focus:border-[oklch(0.62_0.22_330/0.3)] focus:shadow-[0_0_8px_oklch(0.62_0.22_330/0.04)]"
              />
            </div>
            <div className="w-px h-10 bg-[oklch(0.91_0.005_260/0.6)]" />
            <div className="space-y-1.5 flex-1">
               <Label htmlFor="founding_year" className="text-[10px] font-medium uppercase tracking-widest text-[oklch(0.45_0.01_260)]">Year Founded</Label>
              <Input
                id="founding_year" type="number" value={inputs.founding_year}
                onChange={(e) => setField('founding_year', parseInt(e.target.value) || 2024)}
                className="h-10 bg-[oklch(0.99_0.001_260)] border-[oklch(0.91_0.005_260)] transition-all focus:border-[oklch(0.62_0.22_330/0.3)] focus:shadow-[0_0_8px_oklch(0.62_0.22_330/0.04)]"
              />
            </div>
          </div>
          
          <div className="bg-[oklch(0.15_0.02_260/0.02)] border border-dashed border-[oklch(0.91_0.005_260)] rounded-2xl p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
               <span className="text-lg">🇮🇳</span>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[11px] font-bold text-[oklch(0.15_0.02_260)] uppercase tracking-wider">India Benchmark v2</h4>
              <p className="text-[10px] text-[oklch(0.45_0.01_260)] leading-tight">
                Operating with Damodaran India Risk Premia & MCA-aligned sector multiples.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
