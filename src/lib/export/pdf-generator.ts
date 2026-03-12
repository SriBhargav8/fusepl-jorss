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

function formatINRForPDF(value: number): string {
  if (value === 0) return 'Rs 0'
  const crore = 10_000_000
  if (value >= crore) return `Rs ${(value / crore).toFixed(1)} Cr`
  return `Rs ${(value / 100_000).toFixed(0)} L`
}

function addSectionHeader(doc: jsPDF, title: string, y: number): number {
  if (y > 250) { doc.addPage(); y = 20 }
  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text(title, 20, y)
  return y + 8
}

export async function generateValuationPDF(data: PDFData): Promise<jsPDF> {
  const doc = new jsPDF()
  let y = 20

  // 1. Cover page
  doc.setFontSize(22)
  doc.text('Startup Valuation Report', 20, y)
  y += 12
  doc.setFontSize(16)
  doc.text(data.companyName || 'Unnamed Startup', 20, y)
  y += 10
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, y)
  doc.text(`Sector: ${data.sector} | Stage: ${data.stage}`, 20, y + 5)
  doc.text('Powered by firstunicornstartup.com', 20, y + 10)
  doc.setTextColor(0)
  y += 25

  // 2. Executive summary
  y = addSectionHeader(doc, 'Executive Summary', y)
  doc.setFontSize(10)
  doc.text(`Valuation Range: ${formatINRForPDF(data.result.composite_low)} — ${formatINRForPDF(data.result.composite_high)}`, 20, y)
  y += 6
  doc.text(`Weighted Composite: ${formatINRForPDF(data.result.composite_value)}`, 20, y)
  y += 6
  doc.text(`Confidence Score: ${data.result.confidence_score}/100`, 20, y)
  y += 12

  // 3. Methodology overview
  y = addSectionHeader(doc, 'Methodology — 3 Approaches x 10 Methods', y)

  const methodRows = APPROACH_ORDER.flatMap(approach => {
    const methods = data.result.methods.filter(m => m.approach === approach && m.applicable)
    return methods.map(m => [
      APPROACH_LABELS[approach],
      METHOD_LABELS[m.method] ?? m.method,
      formatINRForPDF(m.value),
      `${(m.confidence * 100).toFixed(0)}%`,
    ])
  })

  autoTable(doc, {
    startY: y,
    head: [['Approach', 'Method', 'Value', 'Confidence']],
    body: methodRows,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20 },
  })
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

  // 4. Individual method breakdowns
  y = addSectionHeader(doc, 'Method Details', y)
  doc.setFontSize(9)
  for (const m of data.result.methods) {
    if (!m.applicable) continue
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFontSize(10)
    doc.setTextColor(37, 99, 235)
    doc.text(`${METHOD_LABELS[m.method] ?? m.method}: ${formatINRForPDF(m.value)}`, 20, y)
    doc.setTextColor(0)
    y += 5
    if (m.details && Object.keys(m.details).length > 0) {
      doc.setFontSize(8)
      for (const [key, val] of Object.entries(m.details)) {
        doc.text(`  ${key}: ${val}`, 22, y)
        y += 4
      }
    }
    y += 3
  }

  // 5. Monte Carlo
  if (data.result.monte_carlo) {
    doc.addPage()
    y = 20
    y = addSectionHeader(doc, 'Monte Carlo Simulation (10,000 Iterations)', y)

    const mc = data.result.monte_carlo
    autoTable(doc, {
      startY: y,
      head: [['Percentile', 'Value']],
      body: [
        ['P10 (Downside)', formatINRForPDF(mc.p10)],
        ['P25', formatINRForPDF(mc.p25)],
        ['P50 (Median)', formatINRForPDF(mc.p50)],
        ['P75', formatINRForPDF(mc.p75)],
        ['P90 (Upside)', formatINRForPDF(mc.p90)],
      ],
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  }

  // 6. Damodaran India benchmarks
  if (data.benchmark) {
    y = addSectionHeader(doc, 'Damodaran India Benchmarks', y)
    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: [
        ['Unlevered Beta', data.benchmark.beta != null ? data.benchmark.beta.toFixed(2) : 'N/A'],
        ['WACC (India)', data.benchmark.wacc != null ? `${(data.benchmark.wacc * 100).toFixed(1)}%` : 'N/A'],
        ['EV/Revenue', data.benchmark.ev_revenue != null ? `${data.benchmark.ev_revenue.toFixed(1)}x` : 'N/A'],
        ['EV/EBITDA', data.benchmark.ev_ebitda != null ? `${data.benchmark.ev_ebitda.toFixed(1)}x` : 'N/A'],
        ['Gross Margin', data.benchmark.gross_margin != null ? `${(data.benchmark.gross_margin * 100).toFixed(1)}%` : 'N/A'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  }

  // 7. Comparable Indian startups
  if (data.comparables && data.comparables.length > 0) {
    y = addSectionHeader(doc, 'Top 5 Comparable Indian Startups', y)
    autoTable(doc, {
      startY: y,
      head: [['Company', 'Sector', 'Stage', 'Valuation', 'Similarity']],
      body: data.comparables.map(c => [c.name, c.sector, c.stage, c.valuation, `${(c.similarity * 100).toFixed(0)}%`]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  }

  // 8. Listed company comparables
  if (data.listedComparables) {
    y = addSectionHeader(doc, 'Listed Company Comparables', y)
    doc.setFontSize(10)
    doc.text(`Public market equivalent: ${formatINRForPDF(data.listedComparables.publicEquivalent)}`, 20, y)
    y += 6
    doc.text(`Illiquidity discount: ${(data.listedComparables.discount * 100).toFixed(0)}%`, 20, y)
    y += 6
    doc.text(`Adjusted value: ${formatINRForPDF(data.listedComparables.adjustedValue)}`, 20, y)
    y += 10
  }

  // 9. IBC downside analysis
  if (data.ibcRecovery) {
    y = addSectionHeader(doc, 'Downside Analysis (IBC Recovery)', y)
    doc.setFontSize(10)
    doc.text(`Sector: ${data.ibcRecovery.sectorName}`, 20, y)
    y += 6
    doc.text(`Recovery range: ${data.ibcRecovery.low}% — ${data.ibcRecovery.high}%`, 20, y)
    y += 6
    doc.text(`Median recovery: ${data.ibcRecovery.median}%`, 20, y)
    y += 10
  }

  // 10. ESOP valuation
  if (data.esop) {
    y = addSectionHeader(doc, 'ESOP Valuation (Black-Scholes)', y)
    doc.setFontSize(10)
    doc.text(`ESOP pool value: ${formatINRForPDF(data.esop.poolValue)}`, 20, y)
    y += 6
    doc.text(`Value per share: ${formatINRForPDF(data.esop.valuePerShare)}`, 20, y)
    y += 6
    if (data.esop.scenarios.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Scenario', 'Value']],
        body: data.esop.scenarios.map(s => [s.label, formatINRForPDF(s.value)]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20 },
      })
      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
    }
  }

  // 11. Cap table
  if (data.capTable) {
    y = addSectionHeader(doc, 'Cap Table', y)
    autoTable(doc, {
      startY: y,
      head: [['Holder', 'Ownership %']],
      body: data.capTable.preRound.map(h => [h.holder, `${h.pct.toFixed(1)}%`]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    if (data.capTable.postRound) {
      doc.setFontSize(11)
      doc.text('Post-Round', 20, y)
      y += 4
      autoTable(doc, {
        startY: y,
        head: [['Holder', 'Ownership %']],
        body: data.capTable.postRound.map(h => [h.holder, `${h.pct.toFixed(1)}%`]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20 },
      })
      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
    }
  }

  // 12. Investor matches
  if (data.investorMatches && data.investorMatches.length > 0) {
    y = addSectionHeader(doc, 'Top 5 Investor Matches', y)
    autoTable(doc, {
      startY: y,
      head: [['Investor', 'Type', 'Reason']],
      body: data.investorMatches.map(i => [i.name, i.type, i.reason]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  }

  // 13. AI Narrative
  if (data.aiNarrative) {
    doc.addPage()
    y = 20
    y = addSectionHeader(doc, 'AI-Powered Investment Analysis', y)
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(data.aiNarrative, 170)
    doc.text(lines, 20, y)
    y += lines.length * 4.5 + 10
  }

  // 14. Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    y = addSectionHeader(doc, 'Recommendations', y)
    doc.setFontSize(9)
    data.recommendations.forEach(r => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(`- ${r}`, 22, y)
      y += 5
    })
    y += 5
  }

  // 15. Disclaimers
  doc.addPage()
  y = 20
  y = addSectionHeader(doc, 'Disclaimers', y)
  doc.setFontSize(8)
  doc.setTextColor(100)
  const disclaimers = [
    'This is an indicative valuation estimate generated by an automated tool.',
    'It is NOT a certified valuation and should NOT be used for legal, tax, or regulatory purposes.',
    'For a legally valid Rule 11UA or FEMA valuation report, visit firstunicornstartup.com.',
    'Valuation is based on self-reported data. Accuracy depends on input quality.',
    'Damodaran India benchmarks are from January 2026 and may not reflect current market conditions.',
    'IBC recovery data is historical and does not predict future outcomes.',
    'Investor matching is based on publicly available data and does not guarantee introductions.',
  ]
  disclaimers.forEach(d => {
    doc.text(`- ${d}`, 20, y)
    y += 5
  })

  // 16. Footer on all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text(
      'Indicative estimate — not a certified valuation. firstunicornstartup.com',
      doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10)
  }

  return doc
}
