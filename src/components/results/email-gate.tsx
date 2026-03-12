'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useValuationStore } from '@/stores/valuation-store'
import { EMAIL_REGEX } from '@/lib/utils'
import { Loader2, Lock, FileDown, BarChart3, Users, Brain, ArrowRight } from 'lucide-react'

interface Props {
  onUnlocked: (reportId: string) => void
}

const UNLOCKS = [
  { icon: BarChart3, text: 'Full 10-method breakdown', color: 'oklch(0.65 0.16 250)' },
  { icon: FileDown, text: 'PDF report download', color: 'oklch(0.72 0.17 162)' },
  { icon: Users, text: 'Comparable startup matching', color: 'oklch(0.65 0.16 155)' },
  { icon: Brain, text: 'AI investment narrative', color: 'oklch(0.65 0.16 310)' },
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
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <div className="blur-md opacity-30 pointer-events-none p-6 bg-[oklch(0.18_0.018_250)] border border-[oklch(0.26_0.018_250)] rounded-xl space-y-3">
          <div className="h-4 bg-[oklch(0.24_0.018_250)] rounded w-3/4" />
          <div className="h-4 bg-[oklch(0.24_0.018_250)] rounded w-1/2" />
          <div className="h-20 bg-[oklch(0.15_0.008_260)] rounded" />
          <div className="h-4 bg-[oklch(0.24_0.018_250)] rounded w-2/3" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-[oklch(0.08_0.008_260/0.9)] backdrop-blur-sm px-4 py-2 rounded-full border border-[oklch(0.78_0.14_80/0.2)]">
            <Lock className="h-3.5 w-3.5 text-[oklch(0.72_0.17_162)]" />
            <span className="text-xs font-medium text-[oklch(0.70_0.05_80)]">Full report locked</span>
          </div>
        </div>
      </div>

      {/* Gate card */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Animated border */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[oklch(0.78_0.14_80/0.3)] via-[oklch(0.78_0.14_80/0.08)] to-[oklch(0.78_0.14_80/0.15)]" />

        <div className="relative rounded-2xl bg-[oklch(0.09_0.01_80)] m-px p-6 sm:p-8">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[150px] bg-[oklch(0.78_0.14_80/0.04)] blur-[60px] pointer-events-none" />

          <div className="relative">
            <div className="text-center mb-6">
              <h3 className="font-heading text-xl text-[oklch(0.95_0.002_250)] mb-2">
                Unlock Your Full Report
              </h3>
              <p className="text-sm text-[oklch(0.58_0.01_250)]">
                Enter your email to access everything — <span className="text-[oklch(0.72_0.17_162)] font-medium">free during beta</span>.
              </p>
            </div>

            {/* What you unlock */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              {UNLOCKS.map(({ icon: Icon, text, color }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)` }}
                  >
                    <Icon className="w-3 h-3" style={{ color }} />
                  </div>
                  <span className="text-xs text-[oklch(0.62_0.01_250)] leading-relaxed">{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="founder@startup.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="w-full h-12 px-4 text-sm rounded-xl bg-[oklch(0.14_0.015_250)] border border-[oklch(0.26_0.018_250)] text-[oklch(0.85_0.005_80)] placeholder:text-[oklch(0.40_0.01_260)] focus:outline-none focus:border-[oklch(0.78_0.14_80/0.4)] focus:shadow-[0_0_0_3px_oklch(0.78_0.14_80/0.06)] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!isValidEmail || loading}
                className="group h-12 px-6 text-sm font-semibold rounded-xl bg-[oklch(0.72_0.17_162)] text-[oklch(0.10_0_0)] transition-all hover:bg-[oklch(0.68_0.18_162)] hover:shadow-[0_0_24px_oklch(0.78_0.14_80/0.2)] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    Unlock
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <p className="text-xs text-[oklch(0.62_0.18_25)] mt-2">{error}</p>
            )}

            <p className="text-[10px] text-[oklch(0.40_0.01_260)] mt-3 text-center">
              No spam. We only send your valuation report.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
