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
  userName?: string | null
  userPhone?: string | null
  userEmail?: string | null
  reportId?: string | null
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

// Brand colors (RGB equivalents — magenta #D558C8 to teal #24D292)
const GOLD = [213, 88, 200] as const      // #D558C8 magenta
const DARK_BG = [50, 55, 60] as const     // #32373c brand dark gray
const GOLD_LIGHT = [36, 210, 146] as const // #24D292 teal
const TEXT_DARK = [30, 30, 35] as const
const TEXT_MED = [100, 100, 108] as const
const TEXT_LIGHT = [140, 140, 148] as const

function formatINRForPDF(value: number): string {
  if (value === 0) return 'Rs. 0'
  const crore = 10_000_000
  if (value >= crore) return `Rs. ${(value / crore).toFixed(1)} Cr`
  return `Rs. ${(value / 100_000).toFixed(0)} L`
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
  // Dark background foundation
  doc.setFillColor(...DARK_BG)
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.height, 'F')

  // Ambient Glow Effect (Spotlight behind valuation)
  const centerX = pageWidth / 2
  const centerY = 160
  for (let i = 0; i < 30; i++) {
    const opacity = 0.05 * (1 - i / 30)
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2])
    doc.setGState(new (doc as any).GState({ opacity }))
    doc.circle(centerX, centerY, 20 + i * 3, 'F')
  }
  doc.setGState(new (doc as any).GState({ opacity: 1 }))

  // Elegant Inner Frame (Double Gold Lines)
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.1)
  doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.height - 10)
  doc.setLineWidth(0.3)
  doc.rect(7, 7, pageWidth - 14, doc.internal.pageSize.height - 14)

  // Brand name (Logo area)
  y = 45
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GOLD)
  // To ensure perfect centering with charSpace, we manually nudge it or use native centering if available
  doc.text('FIRST UNICORN', pageWidth / 2, y, { align: 'center', charSpace: 3 })
  
  y += 6
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 160, 168)
  doc.text('STARTUP EVOLVERS • PROTOCOL V1.4', pageWidth / 2, y, { align: 'center', charSpace: 2 })

  // Decorative Horizontal Divider
  y += 18
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.5)
  doc.line(centerX - 30, y, centerX + 30, y)

  // Certificate Label
  y += 28
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bolditalic')
  doc.setTextColor(...GOLD_LIGHT)
  doc.text('C O N F I D E N T I A L   V A L U A T I O N', pageWidth / 2, y, { align: 'center' })

  // Company Name - THE HERO
  y += 20
  const companyName = data.companyName?.toUpperCase() || 'UNNAMED STARTUP'
  // Auto-shrink font if name is very long
  let nameFontSize = 36
  if (companyName.length > 20) nameFontSize = 28
  if (companyName.length > 30) nameFontSize = 22
  
  doc.setFontSize(nameFontSize)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(companyName, pageWidth / 2, y, { align: 'center' })

  // Record ID Badge
  if (data.reportId) {
    y += 14
    const recordId = `CERTIFICATE NO. ${data.reportId.split('-')[0].toUpperCase()}`
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(140, 140, 148)
    doc.text(recordId, pageWidth / 2, y, { align: 'center', charSpace: 1 })
  }

  // Composite value number (The Core Figure)
  y += 38
  doc.setFontSize(54)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GOLD)
  doc.text(formatINRForPDF(data.result.composite_value), pageWidth / 2, y, { align: 'center' })
  
  y += 12
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('ESTIMATED ENTERPRISE VALUE', pageWidth / 2, y, { align: 'center', charSpace: 1.5 })

  // Range text
  y += 14
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 188)
  doc.text(
    `${formatINRForPDF(data.result.composite_low)} — ${formatINRForPDF(data.result.composite_high)}`,
    pageWidth / 2, y, { align: 'center' }
  )

  // Standards badge at bottom of cover (Fixed position)
  const badgeY = 245
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.3)
  doc.line(60, badgeY - 5, pageWidth - 60, badgeY - 5)
  doc.setFontSize(7)
  doc.setTextColor(...GOLD)
  doc.text('IVS 105 Aligned  •  IBBI Standards  •  Rule 11UA  •  Damodaran Data  •  10,000 Monte Carlo Simulations', pageWidth / 2, badgeY + 2, { align: 'center' })

  // Cover page metadata (Anchored above the badge to prevent overlap)
  y = badgeY - 50 // Start metadata 50mm above the badge
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 108)
  
  if (data.reportId) {
    doc.text(`Record ID: ${data.reportId.split('-')[0].toUpperCase()}`, pageWidth / 2, y, { align: 'center' })
    y += 6
  }

  const userMeta = [
    data.userName && `Generated By: ${data.userName}`,
    (data.userEmail || data.userPhone) && `Contact: ${[data.userEmail, data.userPhone].filter(Boolean).join(' | ')}`,
  ].filter(Boolean)

  userMeta.forEach(line => {
    doc.text(line as string, pageWidth / 2, y, { align: 'center' })
    y += 6
  })

  y += 4
  const metaLines = [
    `Sector: ${data.sector}  |  Stage: ${data.stage.replace(/_/g, ' ')}`,
    `Confidence Score: ${data.result.confidence_score}/100  |  Methods Applied: ${data.result.methods.filter(m => m.applicable).length}/10`,
    `Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
  ]
  metaLines.forEach(line => {
    doc.text(line, pageWidth / 2, y, { align: 'center' })
    y += 6
  })

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

  // Method details (filtered to safe keys only — protects proprietary internals)
  const SAFE_DETAIL_KEYS = new Set([
    'revenue', 'multiple_used', 'comparable_count', 'stage',
    'sector', 'team_score', 'market_score', 'iterations',
    'p10', 'p25', 'p50', 'p75', 'p90',
  ])

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
      const safeEntries = Object.entries(m.details).filter(([key]) => SAFE_DETAIL_KEYS.has(key))
      for (const [key, val] of safeEntries) {
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
