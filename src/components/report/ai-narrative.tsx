'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  valuationId: string
}

export function AINarrative({ valuationId }: Props) {
  const [narrative, setNarrative] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchNarrative = async () => {
    setLoading(true)
    setError(false)

    // Initial + 3 retries with exponential backoff (spec: 1s, 4s, 16s)
    const delays = [0, 1000, 4000, 16000]
    for (let attempt = 0; attempt < delays.length; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, delays[attempt]))

      try {
        const res = await fetch('/api/ai-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ valuation_id: valuationId }),
        })

        if (res.ok) {
          const data = await res.json()
          setNarrative(data.narrative)
          setLoading(false)
          return
        }
      } catch {
        // Continue to next attempt
      }
    }

    setError(true)
    setLoading(false)
  }

  return (
    <div className="glass-card grain relative rounded-xl p-6 h-full flex flex-col" 
      style={{ 
        borderColor: 'oklch(0.91 0.005 260 / 0.8)', 
        background: 'linear-gradient(135deg, oklch(0.99 0.002 260), oklch(0.985 0.002 260))' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)]">AI Investment Narrative</h3>
          <p className="text-[10px] text-[oklch(0.50 0.01 260)]">Senior VC Analyst Perspective (Claude)</p>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[oklch(0.40_0.20_300/0.1)] text-[9px] font-bold text-[oklch(0.40_0.20_300)] uppercase">Neural Analysis</span>
      </div>
        {!narrative && !loading && !error && (
          <div className="text-center py-6 flex-1 flex flex-col items-center justify-center space-y-4">
            <p className="text-xs text-[oklch(0.45_0.01_260)] max-w-[280px] leading-relaxed">
              Unlock the neural net's perspective on your valuation, risk factors, and market position.
            </p>
            <Button onClick={fetchNarrative} className="bg-[oklch(0.40_0.20_300)] hover:bg-[oklch(0.35_0.18_300)] text-white rounded-full px-6 font-bold shadow-lg shadow-[oklch(0.40_0.20_300/0.2)] h-9 text-xs transition-all hover:scale-105 active:scale-95">
              Inquire Intelligence
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-400 animate-pulse">
              Generating analysis... This takes 5-10 seconds.
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-slate-400 mb-2">
              AI analysis is currently unavailable. Please try again later.
            </p>
            <Button variant="outline" onClick={fetchNarrative} className="border-slate-700 text-slate-300">
              Retry
            </Button>
          </div>
        )}

        {narrative && (
          <div className="prose prose-xs prose-slate max-w-none whitespace-pre-wrap text-[oklch(0.15_0.02_260)] leading-relaxed italic opacity-80 pt-2 h-full flex-1 scroll-smooth overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {narrative}
          </div>
        )}
    </div>
  )
}
