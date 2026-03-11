'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useValuationStore } from '@/stores/valuation-store'

interface Props {
  onUnlocked: (reportId: string) => void
}

const UNLOCKS = [
  'Full methodology breakdown for all 10 methods across 3 approaches',
  'Damodaran India benchmarks used',
  'Comparable Indian startups',
  'AI-powered insights from a VC perspective',
  'ESOP valuation (Black-Scholes)',
  'Cap Table Simulator',
  'Investor Match suggestions',
  'IBC downside analysis',
  'Downloadable PDF report',
]

export function EmailGate({ onUnlocked }: Props) {
  const { inputs, result, setEmail } = useValuationStore()
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail || !result) return

    setLoading(true)
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          valuation_inputs: inputs,
          valuation_result: result,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const data = await res.json()
      setEmail(emailInput)
      onUnlocked(data.report_id)
    } catch {
      setEmail(emailInput)
      onUnlocked('local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-dashed border-amber-400/30 bg-slate-900">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg text-white">Unlock Your Full Valuation Report</CardTitle>
        <p className="text-sm text-slate-400">Enter your email to access:</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 mb-4">
          {UNLOCKS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-green-400 mt-0.5">&#10003;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="founder@startup.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            className="bg-slate-800 border-slate-700 text-white"
          />
          <Button type="submit" disabled={!isValidEmail || loading} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
            {loading ? 'Unlocking...' : 'Unlock Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
