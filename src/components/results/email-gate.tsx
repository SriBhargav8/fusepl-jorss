'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useValuationStore } from '@/stores/valuation-store'
import { EMAIL_REGEX } from '@/lib/utils'
import { Loader2, Lock, FileDown, BarChart3, Users, Brain } from 'lucide-react'

interface Props {
  onUnlocked: (reportId: string) => void
}

const UNLOCKS = [
  { icon: BarChart3, text: 'Full methodology breakdown for all 10 methods' },
  { icon: FileDown, text: 'Downloadable PDF report' },
  { icon: Users, text: 'Comparable Indian startups & investor matching' },
  { icon: Brain, text: 'AI-powered investment narrative' },
]

export function EmailGate({ onUnlocked }: Props) {
  const { inputs, result, setEmail, purpose } = useValuationStore()
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidEmail = EMAIL_REGEX.test(emailInput)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail || !result) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          valuation_inputs: inputs,
          valuation_result: result,
          purpose,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setEmail(emailInput)
        onUnlocked(data.report_id)
        return
      }
    } catch {
      // Supabase not configured — that's fine for beta
    }

    // Always unlock locally even if API fails
    setEmail(emailInput)
    onUnlocked('local')
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Blurred preview teaser */}
      <div className="relative mb-5 rounded-lg overflow-hidden">
        <div className="blur-md opacity-40 pointer-events-none p-6 bg-[oklch(0.12_0.008_260)] border border-[oklch(0.20_0.008_260)] rounded-lg space-y-3">
          <div className="h-4 bg-[oklch(0.18_0.008_260)] rounded w-3/4" />
          <div className="h-4 bg-[oklch(0.18_0.008_260)] rounded w-1/2" />
          <div className="h-20 bg-[oklch(0.15_0.008_260)] rounded" />
          <div className="h-4 bg-[oklch(0.18_0.008_260)] rounded w-2/3" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-[oklch(0.08_0.008_260/0.9)] backdrop-blur-sm px-4 py-2 rounded-full border border-[oklch(0.78_0.14_80/0.2)]">
            <Lock className="h-3.5 w-3.5 text-[oklch(0.78_0.14_80)]" />
            <span className="text-xs font-medium text-[oklch(0.70_0.05_80)]">Full report locked</span>
          </div>
        </div>
      </div>

      {/* Gate card */}
      <div className="rounded-lg border-2 border-dashed border-[oklch(0.78_0.14_80/0.25)] bg-[oklch(0.10_0.01_80/0.3)] p-6 sm:p-8">
        <div className="text-center mb-6">
          <h3 className="font-heading text-xl text-[oklch(0.93_0.005_80)] mb-2">
            Unlock Your Full Report
          </h3>
          <p className="text-sm text-[oklch(0.45_0.01_260)]">
            Enter your email to access the complete valuation analysis — free during beta.
          </p>
        </div>

        {/* What you get */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {UNLOCKS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2.5 text-xs text-[oklch(0.55_0.01_260)]">
              <Icon className="w-3.5 h-3.5 text-[oklch(0.78_0.14_80)] mt-0.5 shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="founder@startup.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            className="flex-1 h-11 px-4 text-sm rounded-lg bg-[oklch(0.08_0.008_260)] border border-[oklch(0.20_0.008_260)] text-[oklch(0.85_0.005_80)] placeholder:text-[oklch(0.35_0.01_260)] focus:outline-none focus:border-[oklch(0.78_0.14_80/0.4)] transition-colors"
          />
          <button
            type="submit"
            disabled={!isValidEmail || loading}
            className="h-11 px-6 text-sm font-semibold rounded-lg bg-[oklch(0.78_0.14_80)] text-[oklch(0.10_0_0)] transition-all hover:bg-[oklch(0.82_0.14_80)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Unlocking...
              </span>
            ) : (
              'Unlock Report'
            )}
          </button>
        </form>

        {error && (
          <p className="text-xs text-[oklch(0.62_0.18_25)] mt-2">{error}</p>
        )}

        <p className="text-[10px] text-[oklch(0.35_0.01_260)] mt-3 text-center">
          No spam. We only send your valuation report link.
        </p>
      </div>
    </motion.div>
  )
}
