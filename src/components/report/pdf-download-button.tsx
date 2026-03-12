'use client'

import { useState } from 'react'
import { generateValuationPDF } from '@/lib/export/pdf-generator'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import type { ValuationResult, StartupCategory } from '@/types'
import { Loader2, FileDown } from 'lucide-react'

interface Props {
  valuation: {
    company_name: string
    sector: string
    stage: string
    ai_narrative?: string | null
  }
  result: ValuationResult
}

export function PDFDownloadButton({ valuation, result }: Props) {
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)
    try {
      const benchmark = getDamodaranBenchmark(valuation.sector as StartupCategory)
      const doc = await generateValuationPDF({
        companyName: valuation.company_name,
        sector: valuation.sector,
        stage: valuation.stage,
        result,
        benchmark,
        aiNarrative: valuation.ai_narrative,
      })
      doc.save(`${valuation.company_name || 'startup'}-valuation-report.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="inline-flex items-center gap-2 h-11 px-7 text-sm font-semibold rounded-lg bg-[oklch(0.78_0.14_80)] text-[oklch(0.10_0_0)] transition-all hover:bg-[oklch(0.82_0.14_80)] hover:shadow-[0_0_24px_oklch(0.78_0.14_80/0.2)] active:scale-[0.98] disabled:opacity-50"
    >
      {generating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Download PDF Report
        </>
      )}
    </button>
  )
}
