'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { generateValuationPDF } from '@/lib/export/pdf-generator'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import type { ValuationResult, StartupCategory } from '@/types'

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
    <div className="text-center">
      <Button
        size="lg"
        onClick={handleDownload}
        disabled={generating}
        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
      >
        {generating ? 'Generating PDF...' : 'Download PDF Report'}
      </Button>
    </div>
  )
}
