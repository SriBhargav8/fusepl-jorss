import type { Metadata } from 'next'
import { StandaloneCapTable } from './cap-table-client'

export const metadata: Metadata = {
  title: 'Cap Table Simulator — Model Dilution for Your Next Round',
  description: 'Free startup cap table calculator for Indian founders. Model pre-money, post-money, dilution, ESOP pool impact. Pre-round vs post-round ESOP comparison.',
}

export default function CapTablePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Cap Table Simulator</h1>
      <p className="text-muted-foreground mb-6">
        Model your next funding round — see how dilution affects founder ownership.
        No login required.
      </p>
      <StandaloneCapTable />
      
      {/* Quick Tool Links */}
      <div className="mt-12 pt-8 border-t border-[oklch(0.91_0.005_260)] text-center">
        <p className="text-[10px] font-bold text-[oklch(0.62_0.22_330)] uppercase tracking-[0.2em] mb-4">Explore More Tools</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <ToolLink href="/valuation" label="Valuation Engine" />
          <ToolLink href="/deal-check" label="Deal Check" />
        </div>
      </div>
    </main>
  )
}

function ToolLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[oklch(0.91_0.005_260)] bg-white text-[13px] font-semibold text-[oklch(0.20_0.02_260)] transition-all hover:bg-[oklch(0.985_0.002_260)] hover:border-[oklch(0.62_0.22_330/0.4)] hover:text-[oklch(0.62_0.22_330)] hover:shadow-sm">
      {label}
      <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
    </a>
  )
}
