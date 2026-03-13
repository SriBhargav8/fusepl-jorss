'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useValuationStore } from '@/stores/valuation-store'
import { EMAIL_REGEX } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2, Lock, FileDown, BarChart3, Users, Brain, ArrowRight } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUnlocked: (reportId: string) => void
}

const UNLOCKS = [
  { icon: BarChart3, text: 'Full 10-method breakdown', color: 'oklch(0.65 0.16 250)' },
  { icon: FileDown, text: 'PDF report download', color: 'oklch(0.62 0.22 330)' },
  { icon: Users, text: 'Comparable startup matching', color: 'oklch(0.65 0.16 155)' },
  { icon: Brain, text: 'AI investment narrative', color: 'oklch(0.65 0.16 310)' },
]

export function EmailGate({ open, onOpenChange, onUnlocked }: Props) {
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
        onOpenChange(false)
        onUnlocked(data.report_id)
        return
      }
    } catch {
      // Supabase not configured — that's fine for beta
    }

    // Always unlock locally even if API fails
    setEmail(emailInput)
    onOpenChange(false)
    onUnlocked('local')
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-[oklch(0.98_0.002_260)] border-[oklch(0.91_0.005_260)]"
        showCloseButton
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[150px] bg-[oklch(0.62_0.22_330/0.06)] blur-[60px] pointer-events-none" />

        <DialogHeader className="relative">
          <DialogTitle className="font-heading text-xl text-[oklch(0.15 0.02 260)] text-center">
            Unlock Your Full Report
          </DialogTitle>
          <DialogDescription className="text-center text-[oklch(0.45 0.01 260)]">
            Enter your email to access everything — <span className="text-[oklch(0.62 0.22 330)] font-medium">free during beta</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="relative space-y-5">
          {/* What you unlock */}
          <div className="grid grid-cols-2 gap-3">
            {UNLOCKS.map(({ icon: Icon, text, color }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="flex items-start gap-2.5"
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)` }}
                >
                  <Icon className="w-3 h-3" style={{ color }} />
                </div>
                <span className="text-xs text-[oklch(0.45 0.01 260)] leading-relaxed">{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="founder@startup.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              autoFocus
              className="w-full h-12 px-4 text-sm rounded-xl bg-[oklch(0.985 0.002 260)] border border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:border-[oklch(0.62_0.22_330/0.4)] focus:shadow-[0_0_0_3px_oklch(0.62_0.22_330/0.06)] transition-all"
            />
            <button
              type="submit"
              disabled={!isValidEmail || loading}
              className="group w-full h-12 text-sm font-semibold rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_0_24px_oklch(0.62_0.22_330/0.2)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  Unlock Full Report
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="text-xs text-[oklch(0.62_0.18_25)]">{error}</p>
          )}

          <p className="text-[10px] text-[oklch(0.45_0.01_250)] text-center">
            No spam. We only send your valuation report.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
