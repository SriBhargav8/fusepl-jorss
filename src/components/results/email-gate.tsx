'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useValuationStore } from '@/stores/valuation-store'
import { EMAIL_REGEX, normalizePhone } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2, Lock, FileDown, BarChart3, Users, Brain, ArrowRight, ChevronRight } from 'lucide-react'

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
  const { inputs, result, setEmail, setUserName, setUserPhone, purpose } = useValuationStore()
  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(false)

  // Enable button once we have basic non-empty strings
  const isButtonReady = nameInput.trim().length > 0 && emailInput.trim().length > 0 && phoneInput.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true) 
    setError('')
    setInputError(null)

    if (nameInput.trim().length < 2) {
      setError('Please enter your full name')
      setInputError('name')
      setLoading(false)
      return
    }
    if (!EMAIL_REGEX.test(emailInput)) {
      setError('Please enter a valid business email (yourname@company.com)')
      setInputError('email')
      setLoading(false)
      return
    }
    if (phoneInput.trim().length < 10) {
      setError('Please enter a 10-digit mobile number')
      setInputError('phone')
      setLoading(false)
      return
    }
    if (!result) {
      setError('Valuation result not found. Please refresh and try again.')
      setLoading(false)
      return
    }

    const normalizedPhone = normalizePhone(phoneInput)

    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          name: nameInput,
          phone: normalizedPhone,
          valuation_inputs: inputs,
          valuation_result: result,
          purpose,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setEmail(emailInput)
        setUserName(nameInput)
        setUserPhone(normalizedPhone)
        setUnlocked(true)
        setTimeout(() => {
          onOpenChange(false)
          onUnlocked(data.report_id)
        }, 1000)
        return
      }
    } catch {
      // API failed
    }

    // Fallback unlock
    setEmail(emailInput)
    setUserName(nameInput)
    setUserPhone(normalizedPhone)
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value)
                    if (inputError === 'name') setInputError(null)
                  }}
                  required
                  autoFocus
                  className={`w-full h-12 sm:h-14 px-4 text-sm sm:text-base rounded-xl bg-[oklch(0.985 0.002 260)] border ${inputError === 'name' ? 'border-[oklch(0.62_0.18_25)]' : 'border-[oklch(0.91 0.005 260)]'} text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none ${inputError === 'name' ? 'focus:border-[oklch(0.62_0.18_25)] focus:shadow-[0_0_0_3px_oklch(0.62_0.18_25/0.1)]' : 'focus:border-[oklch(0.62_0.22_330/0.4)] focus:shadow-[0_0_0_3px_oklch(0.62_0.22_330/0.06)]'} transition-all`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Business Email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value)
                      if (inputError === 'email') setInputError(null)
                    }}
                    required
                    className={`w-full h-12 sm:h-14 px-4 text-sm sm:text-base rounded-xl bg-[oklch(0.985 0.002 260)] border ${inputError === 'email' ? 'border-[oklch(0.62_0.18_25)]' : 'border-[oklch(0.91 0.005 260)]'} text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none ${inputError === 'email' ? 'focus:border-[oklch(0.62_0.18_25)] focus:shadow-[0_0_0_3px_oklch(0.62_0.18_25/0.1)]' : 'focus:border-[oklch(0.62_0.22_330/0.4)] focus:shadow-[0_0_0_3_oklch(0.62_0.22_330/0.06)]'} transition-all`}
                  />
                  <input
                    type="tel"
                    placeholder="10-Digit Mobile"
                    value={phoneInput}
                    onChange={(e) => {
                      setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))
                      if (inputError === 'phone') setInputError(null)
                    }}
                    required
                    className={`w-full h-12 sm:h-14 px-4 text-sm sm:text-base rounded-xl bg-[oklch(0.985 0.002 260)] border ${inputError === 'phone' ? 'border-[oklch(0.62_0.18_25)]' : 'border-[oklch(0.91 0.005 260)]'} text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none ${inputError === 'phone' ? 'focus:border-[oklch(0.62_0.18_25)] focus:shadow-[0_0_0_3px_oklch(0.62_0.18_25/0.1)]' : 'focus:border-[oklch(0.62_0.22_330/0.4)] focus:shadow-[0_0_0_3px_oklch(0.62_0.22_330/0.06)]'} transition-all`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isButtonReady || loading || unlocked}
                className="btn-press group w-full h-14 sm:h-16 flex items-center justify-center gap-3 rounded-2xl bg-[#32373c] text-white text-sm sm:text-base font-bold shadow-[0_8px_32px_oklch(0_0_0/0.2)] hover:bg-[#1d2024] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : unlocked ? (
                  <>
                    <Lock className="w-4 h-4 text-[oklch(0.62_0.22_330)]" />
                    Unlocked! Redirecting...
                  </>
                ) : (
                  <>
                    Unlock Valuation Report
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 py-1 px-3 rounded-lg bg-[oklch(0.62_0.18_25/0.05)] border border-[oklch(0.62_0.18_25/0.1)]"
            >
              <div className="w-1 h-1 rounded-full bg-[oklch(0.62_0.18_25)]" />
              <p className="text-[11px] font-medium text-[oklch(0.62_0.18_25)]">{error}</p>
            </motion.div>
          )}

          <p className="text-[10px] text-[oklch(0.45_0.01_250)] text-center">
            No spam. We only send your valuation report.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
