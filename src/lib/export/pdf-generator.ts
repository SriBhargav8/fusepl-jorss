import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ValuationResult } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'

const METHOD_LABELS: Record<string, string> = {
  dcf: 'Discounted Cash Flow (DCF)',
  pwerm: 'Probability-Weighted Expected Return (PWERM)',
  revenue_multiple: 'Revenue Multiple',
  ebitda_multiple: 'EV/EBITDA Multiple',
  comparable_txn: 'Comparable Transaction',
  nav: 'Net Asset Value (NAV)',
  replacement_cost: 'Replacement Cost',
  scorecard: 'Scorecard Method',
  berkus: 'Berkus Method',
  risk_factor: 'Risk Factor Summation',
}

interface PDFData {
  companyName: string
  sector: string
  stage: string
  result: ValuationResult
  benchmark?: { ev_revenue: number; ev_ebitda: number | null; wacc: number; beta: number; gross_margin: number | null } | null
  comparables?: Array<{ name: string; sector: string; stage: string; valuation: string; similarity: number }>
  listedComparables?: { publicEquivalent: number; discount: number; adjustedValue: number }
  ibcRecovery?: { low: number; high: number; median: number; sectorName: string }
  esop?: { poolValue: number; valuePerShare: number; scenarios: Array<{ label: string; value: number }> }
  capTable?: { preRound: Array<{ holder: string; pct: number }>; postRound?: Array<{ holder: string; pct: number }> }
  investorMatches?: Array<{ name: string; type: string; reason: string }>
  recommendations?: string[]
  aiNarrative?: string | null
}

// Brand colors (RGB equivalents of OKLCH gold palette)
const GOLD = [45, 180, 140] as const      // oklch(0.72 0.17 162) approx
const DARK_BG = [18, 18, 22] as const     // oklch(0.08 0.008 260) approx
const GOLD_LIGHT = [210, 178, 90] as const
const TEXT_DARK = [30, 30, 35] as const
const TEXT_MED = [100, 100, 108] as const
const TEXT_LIGHT = [140, 140, 148] as const

function formatINRForPDF(value: number): string {
  if (value === 0) return '₹0'
  const crore = 10_000_000
  if (value >= crore) return `₹${(value / crore).toFixed(1)} Cr`
  return `₹${(value / 100_000).toFixed(0)} L`
}

function checkPageBreak(doc: jsPDF, y: number, needed = 40): number {
  if (y + needed > 270) { doc.addPage(); return 25 }
  return y
}

function addSectionHeader(doc: jsPDF, title: string, y: number): number {
  y = checkPageBreak(doc, y, 30)
  // Gold accent line
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.8)
  doc.line(20, y, 50, y)
  y += 6
  // Section title
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_DARK)
  doc.text(title, 20, y)
  y += 8
  return y
}

function addGoldTable(doc: jsPDF, y: number, head: string[][], body: string[][]): number {
  autoTable(doc, {
    startY: y,
    head,
    body,
    theme: 'striped',
    headStyles: {
      fillColor: [...DARK_BG],
      textColor: [...GOLD],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [...TEXT_DARK],
    },
    alternateRowStyles: {
      fillColor: [248, 246, 240],
    },
    styles: {
      cellPadding: 4,
      lineColor: [225, 220, 210],
      lineWidth: 0.2,
    },
    margin: { left: 20, right: 20 },
  })
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
}

export async function generateValuationPDF(data: PDFData): Promise<jsPDF> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  let y = 0

  // ===== COVER PAGE =====
  // Dark background
  doc.setFillColor(...DARK_BG)
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.height, 'F')

  // Gold accent bar at top
  doc.setFillColor(...GOLD)
  doc.rect(0, 0, pageWidth, 3, 'F')

  // Brand name
  y = 50
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GOLD)
  doc.text('FIRST UNICORN STARTUP', pageWidth / 2, y, { align: 'center' })
  y += 5
  doc.setFontSize(7)
  doc.setTextColor(130, 130, 138)
  doc.text('India\'s Most Rigorous Startup Valuation Platform', pageWidth / 2, y, { align: 'center' })

  // Decorative line
  y += 15
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.3)
  doc.line(60, y, pageWidth - 60, y)

  // Report title
  y += 20
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Valuation Report', pageWidth / 2, y, { align: 'center' })

  // Company name
  y += 16
  doc.setFontSize(20)
  doc.setTextColor(...GOLD_LIGHT)
  doc.text(data.companyName || 'Unnamed Startup', pageWidth / 2, y, { align: 'center' })

  // Composite value - the hero number
  y += 30
  doc.setFontSize(36)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GOLD)
  doc.text(formatINRForPDF(data.result.composite_value), pageWidth / 2, y, { align: 'center' })
  y += 10
  doc.setFontSize(10)
  doc.setTextColor(180, 180, 188)
  doc.text('Weighted Composite Valuation', pageWidth / 2, y, { align: 'center' })

  // Range
  y += 12
  doc.setFontSize(11)
  doc.setTextColor(150, 150, 158)
  doc.text(
    `Range: ${formatINRForPDF(data.result.composite_low)} — ${formatINRForPDF(data.result.composite_high)}`,
    pageWidth / 2, y, { align: 'center' }
  )

  // Cover page metadata
  y += 30
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 108)
  const metaLines = [
    `Sector: ${data.sector}  |  Stage: ${data.stage}`,
    `Confidence Score: ${data.result.confidence_score}/100  |  Methods Applied: ${data.result.methods.filter(m => m.applicable).length}/10`,
    `Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
  ]
  metaLines.forEach(line => {
    doc.text(line, pageWidth / 2, y, { align: 'center' })
    y += 6
  })

  // Standards badge at bottom of cover
  y = 240
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.3)
  doc.line(60, y, pageWidth - 60, y)
  y += 8
  doc.setFontSize(7)
  doc.setTextColor(...GOLD)
  doc.text('IVS 105 Aligned  •  IBBI Standards  •  Rule 11UA  •  Damodaran Data  •  10,000 Monte Carlo Simulations', pageWidth / 2, y, { align: 'center' })

  // ===== PAGE 2: EXECUTIVE SUMMARY + METHODOLOGY =====
  doc.addPage()
  y = 25

  y = addSectionHeader(doc, 'Executive Summary', y)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_DARK)
  const summaryLines = [
    `This report presents an indicative valuation of ${data.companyName || 'the startup'} using ${data.result.methods.filter(m => m.applicable).length} valuation methods`,
    `across 4 approaches (Income, Market, Asset/Cost, VC/Startup), aligned with IVS 105 and IBBI standards.`,
    ``,
    `Weighted Composite Valuation: ${formatINRForPDF(data.result.composite_value)}`,
    `Valuation Range: ${formatINRForPDF(data.result.composite_low)} — ${formatINRForPDF(data.result.composite_high)}`,
    `Confidence Score: ${data.result.confidence_score}/100`,
  ]
  summaryLines.forEach(line => {
    doc.text(line, 20, y)
    y += 5
  })
  y += 8

  // Methodology table
  y = addSectionHeader(doc, 'Methodology — 4 Approaches × 10 Methods', y)

  const methodRows = APPROACH_ORDER.flatMap(approach => {
    const methods = data.result.methods.filter(m => m.approach === approach && m.applicable)
    return methods.map(m => [
      APPROACH_LABELS[approach],
      METHOD_LABELS[m.method] ?? m.method,
      formatINRForPDF(m.value),
      `${(m.confidence * 100).toFixed(0)}%`,
    ])
  })

  y = addGoldTable(doc, y, [['Approach', 'Method', 'Value', 'Confidence']], methodRows)

  // Method details
  y = addSectionHeader(doc, 'Method Details', y)
  for (const m of data.result.methods) {
    if (!m.applicable) continue
    y = checkPageBreak(doc, y, 25)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...GOLD)
    doc.text(`${METHOD_LABELS[m.method] ?? m.method}`, 20, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TEXT_DARK)
    doc.text(formatINRForPDF(m.value), 160, y)
    y += 5
    if (m.details && Object.keys(m.details).length > 0) {
      doc.setFontSize(8)
      doc.setTextColor(...TEXT_MED)
      for (const [key, val] of Object.entries(m.details)) {
        doc.text(`${key}: ${val}`, 24, y)
        y += 4
      }
    }
    y += 3
  }

  // Monte Carlo
  if (data.result.monte_carlo) {
    doc.addPage()
    y = 25
    y = addSectionHeader(doc, 'Monte Carlo Simulation — 10,000 Scenarios', y)
    doc.setFontSize(9)
    doc.setTextColor(...TEXT_MED)
    doc.text('Probabilistic valuation range using Box-Muller simulation across all applicable methods.', 20, y)
    y += 8

    const mc = data.result.monte_carlo
    y = addGoldTable(doc, y, [['Percentile', 'Value', 'Interpretation']], [
      ['P10', formatINRForPDF(mc.p10), 'Conservative downside scenario'],
      ['P25', formatINRForPDF(mc.p25), 'Below-average outcome'],
      ['P50 (Median)', formatINRForPDF(mc.p50), 'Most likely valuation'],
      ['P75', formatINRForPDF(mc.p75), 'Above-average outcome'],
      ['P90', formatINRForPDF(mc.p90), 'Optimistic upside scenario'],
    ])
  }

  // Damodaran benchmarks
  if (data.benchmark) {
    y = addSectionHeader(doc, 'Damodaran India Benchmarks', y)
    doc.setFontSize(9)
    doc.setTextColor(...TEXT_MED)
    doc.text('Industry-specific financial benchmarks from Prof. Aswath Damodaran (January 2026 dataset).', 20, y)
    y += 8
    y = addGoldTable(doc, y, [['Metric', 'Value']], [
      ['Unlevered Beta', data.benchmark.beta != null ? data.benchmark.beta.toFixed(2) : 'N/A'],
      ['WACC (India)', data.benchmark.wacc != null ? `${(data.benchmark.wacc * 100).toFixed(1)}%` : 'N/A'],
      ['EV/Revenue', data.benchmark.ev_revenue != null ? `${data.benchmark.ev_revenue.toFixed(1)}x` : 'N/A'],
      ['EV/EBITDA', data.benchmark.ev_ebitda != null ? `${data.benchmark.ev_ebitda.toFixed(1)}x` : 'N/A'],
      ['Gross Margin', data.benchmark.gross_margin != null ? `${(data.benchmark.gross_margin * 100).toFixed(1)}%` : 'N/A'],
    ])
  }

  // Comparable startups
  if (data.comparables && data.comparables.length > 0) {
    y = addSectionHeader(doc, 'Comparable Indian Startups', y)
    y = addGoldTable(doc, y,
      [['Company', 'Sector', 'Stage', 'Valuation', 'Match']],
      data.comparables.map(c => [c.name, c.sector, c.stage, c.valuation, `${(c.similarity * 100).toFixed(0)}%`])
    )
  }

  // Listed company comparables
  if (data.listedComparables) {
    y = addSectionHeader(doc, 'Listed Company Comparables', y)
    doc.setFontSize(10)
    doc.setTextColor(...TEXT_DARK)
    doc.text(`Public market equivalent: ${formatINRForPDF(data.listedComparables.publicEquivalent)}`, 20, y)
    y += 6
    doc.text(`Illiquidity discount applied: ${(data.listedComparables.discount * 100).toFixed(0)}%`, 20, y)
    y += 6
    doc.text(`Adjusted value: ${formatINRForPDF(data.listedComparables.adjustedValue)}`, 20, y)
    y += 10
  }

  // IBC recovery
  if (data.ibcRecovery) {
    y = addSectionHeader(doc, 'Downside Analysis — IBC Recovery Data', y)
    doc.setFontSize(9)
    doc.setTextColor(...TEXT_MED)
    doc.text('Based on 190+ IBC landmark cases and 3,952 resolution outcomes.', 20, y)
    y += 7
    doc.setFontSize(10)
    doc.setTextColor(...TEXT_DARK)
    doc.text(`Sector: ${data.ibcRecovery.sectorName}`, 20, y)
    y += 6
    doc.text(`Recovery range: ${data.ibcRecovery.low}% — ${data.ibcRecovery.high}%`, 20, y)
    y += 6
    doc.text(`Median recovery: ${data.ibcRecovery.median}%`, 20, y)
    y += 10
  }

  // ESOP valuation
  if (data.esop) {
    y = addSectionHeader(doc, 'ESOP Valuation (Black-Scholes)', y)
    doc.setFontSize(10)
    doc.setTextColor(...TEXT_DARK)
    doc.text(`ESOP pool value: ${formatINRForPDF(data.esop.poolValue)}`, 20, y)
    y += 6
    doc.text(`Value per share: ${formatINRForPDF(data.esop.valuePerShare)}`, 20, y)
    y += 8
    if (data.esop.scenarios.length > 0) {
      y = addGoldTable(doc, y,
        [['Scenario', 'Value']],
        data.esop.scenarios.map(s => [s.label, formatINRForPDF(s.value)])
      )
    }
  }

  // Cap table
  if (data.capTable) {
    y = addSectionHeader(doc, 'Cap Table', y)
    y = addGoldTable(doc, y,
      [['Holder', 'Ownership %']],
      data.capTable.preRound.map(h => [h.holder, `${h.pct.toFixed(1)}%`])
    )
    if (data.capTable.postRound) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...TEXT_DARK)
      doc.text('Post-Round', 20, y)
      y += 6
      y = addGoldTable(doc, y,
        [['Holder', 'Ownership %']],
        data.capTable.postRound.map(h => [h.holder, `${h.pct.toFixed(1)}%`])
      )
    }
  }

  // Investor matches
  if (data.investorMatches && data.investorMatches.length > 0) {
    y = addSectionHeader(doc, 'Potential Investor Matches', y)
    y = addGoldTable(doc, y,
      [['Investor', 'Type', 'Reason']],
      data.investorMatches.map(i => [i.name, i.type, i.reason])
    )
  }

  // AI Narrative
  if (data.aiNarrative) {
    doc.addPage()
    y = 25
    y = addSectionHeader(doc, 'Investment Analysis', y)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TEXT_DARK)
    const lines = doc.splitTextToSize(data.aiNarrative, 170)
    for (const line of lines) {
      y = checkPageBreak(doc, y, 6)
      doc.text(line, 20, y)
      y += 4.5
    }
    y += 8
  }

  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    y = addSectionHeader(doc, 'Recommendations', y)
    doc.setFontSize(9)
    doc.setTextColor(...TEXT_DARK)
    data.recommendations.forEach(r => {
      y = checkPageBreak(doc, y, 8)
      const wrapped = doc.splitTextToSize(`•  ${r}`, 165)
      wrapped.forEach((line: string) => {
        doc.text(line, 22, y)
        y += 4.5
      })
      y += 2
    })
    y += 5
  }

  // Disclaimers page
  doc.addPage()
  y = 25
  y = addSectionHeader(doc, 'Important Disclaimers', y)
  doc.setFontSize(8)
  doc.setTextColor(...TEXT_LIGHT)
  const disclaimers = [
    'This is an indicative valuation estimate generated by an automated tool.',
    'It is NOT a certified valuation and should NOT be used for legal, tax, or regulatory purposes.',
    'For a legally valid Rule 11UA or FEMA valuation report, visit firstunicornstartup.com.',
    'Valuation is based on self-reported data. Accuracy depends on input quality.',
    'Damodaran India benchmarks are from January 2026 and may not reflect current market conditions.',
    'IBC recovery data is historical and does not predict future outcomes.',
    'Investor matching is based on publicly available data and does not guarantee introductions.',
    'This report is generated by First Unicorn Startup, built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer.',
  ]
  disclaimers.forEach(d => {
    const wrapped = doc.splitTextToSize(`•  ${d}`, 165)
    wrapped.forEach((line: string) => {
      doc.text(line, 22, y)
      y += 4
    })
    y += 1
  })

  // Footer on all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const ph = doc.internal.pageSize.height

    // Gold line above footer
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.2)
    doc.line(20, ph - 16, pageWidth - 20, ph - 16)

    // Footer text
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')

    if (i === 1) {
      // Cover page — minimal footer
      doc.setTextColor(...GOLD)
      doc.text('firstunicornstartup.com', pageWidth / 2, ph - 10, { align: 'center' })
    } else {
      doc.setTextColor(...TEXT_LIGHT)
      doc.text('Indicative estimate — not a certified valuation  |  firstunicornstartup.com', 20, ph - 10)
      doc.text(`${i} / ${pageCount}`, pageWidth - 20, ph - 10, { align: 'right' })
    }
  }

  return doc
}
