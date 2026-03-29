'use client'

import { useState } from 'react'
import { generateValuationPDF } from '@/lib/export/pdf-generator'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { findComparables } from '@/lib/data/comparable-companies'
import { getListedComparables } from '@/lib/data/listed-comparables'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'
import { CATEGORY_LABELS } from '@/types'
import type { ValuationResult, StartupCategory, Stage } from '@/types'
import { Loader2, FileDown } from 'lucide-react'

interface Props {
  valuation: {
    id?: string
    companyName: string
    sector: string
    stage: string
    annualRevenue?: number | string | null
    aiNarrative?: string | null
    userName?: string | null
    userPhone?: string | null
    userEmail?: string | null
    recommendations?: string[]
    current_cap_table?: any // From DB type
  }
  result: ValuationResult
}

export function PDFDownloadButton({ valuation, result }: Props) {
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)
    try {
      const benchmark = getDamodaranBenchmark(valuation.sector as StartupCategory)
      
      // Fetch data for all report sections
      const comparables = findComparables(
        valuation.sector as StartupCategory,
        valuation.stage as Stage,
        valuation.annualRevenue ? Number(valuation.annualRevenue) / 100_00_000 : null,
        5
      ).map(c => ({
        name: c.name,
        sector: CATEGORY_LABELS[c.sector] || c.sector,
        stage: c.stage_at_round,
        valuation: `${(c.valuation_cr).toFixed(1)} Cr`,
        similarity: 0.95 // Default similarity for PDF
      }))

      const listedComps = getListedComparables(valuation.sector as StartupCategory)
      const ibcData = getIBCRecovery(valuation.sector as StartupCategory)

      const doc = await generateValuationPDF({
        companyName: valuation.companyName,
        sector: valuation.sector,
        stage: valuation.stage,
        result,
        benchmark,
        comparables,
        listedComparables: listedComps.length > 0 ? {
          publicEquivalent: listedComps[0].market_cap_cr * 100_00_000,
          discount: 0.25,
          adjustedValue: listedComps[0].market_cap_cr * 0.75 * 100_00_000,
        } : undefined,
        ibcRecovery: ibcData ? {
          low: ibcData.avg_low,
          high: ibcData.avg_high,
          median: (ibcData.avg_low + ibcData.avg_high) / 2,
          sectorName: valuation.sector
        } : undefined,
        capTable: valuation.current_cap_table ? {
          preRound: valuation.current_cap_table.map((h: any) => ({
            holder: h.name,
            pct: Number(h.percentage)
          }))
        } : undefined,
        recommendations: valuation.recommendations,
        aiNarrative: valuation.aiNarrative,
        userName: valuation.userName,
        userPhone: valuation.userPhone,
        userEmail: valuation.userEmail,
        reportId: valuation.id,
      })
      doc.save(`${valuation.companyName || 'startup'}-valuation-report.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="inline-flex items-center gap-2 h-11 px-7 text-sm font-semibold rounded-lg bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_0_24px_oklch(0.62_0.22_330/0.2)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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
