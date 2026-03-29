import Link from 'next/link'
import Image from 'next/image'

const LINKS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Startup Valuation',
    links: [
      { href: '/valuation', label: 'Startup Valuation' },
      { href: '/deal-check', label: 'Investor Deal Check' },
      { href: '/cap-table', label: 'Cap Table' },
      { href: '/esop-calculator', label: 'ESOP Calculator' },
      { href: '/valuatein', label: 'ValuateIN Professional' },
    ],
  },
  {
    heading: 'Fundraising Readiness',
    links: [
      { href: '/learn/fundraising/financial-model-indian-startups', label: 'Financial Model' },
      { href: '/learn/fundraising/pitch-deck-india-startups', label: 'Pitch Deck Guide' },
      { href: '/learn/tools-frameworks/investor-readiness-scorecard', label: 'Investor Readiness' },
      { href: '/learn/investor-intelligence/data-room-checklist-india', label: 'Due Diligence' },
    ],
  },
  {
    heading: 'Cap Table & ESOP',
    links: [
      { href: '/learn/equity/dilution-calculator-seed-to-series-c', label: 'Cap Table Basics' },
      { href: '/learn/equity/esop-taxation-india', label: 'ESOP Explained' },
      { href: '/learn/equity/founder-vesting-india', label: 'Equity & Dilution' },
      { href: '/learn/founder-playbooks/co-founder-separation-india', label: 'Founder Structuring' },
    ],
  },
  {
    heading: 'Startup India',
    links: [
      { href: '/learn/startup-india/dpiit-recognition-guide-india', label: 'DPIIT Recognition' },
      { href: '/learn/startup-india/startup-india-seed-fund-complete-guide', label: 'Seed Fund Scheme' },
      { href: '/learn/startup-india/startup-india-benefits-overview', label: 'Government Grants' },
      { href: '/learn/startup-india/section-80iac-tax-exemption-india', label: 'Tax Exemptions' },
    ],
  },
  {
    heading: 'Partner Services',
    links: [
      { href: 'https://mkwadvisors.com/', label: 'MKW Advisors' },
      { href: 'https://legalsuvidha.com/', label: 'LegalSuvidha' },
      { href: 'https://digicomply.in/', label: 'DigiComply' },
      { href: 'https://growbizonline.in/', label: 'Growbiz Online' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-[oklch(0.91 0.005 260)] bg-[oklch(0.97 0.003 260)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src="/logo.png" alt="First Unicorn Startup" width={180} height={56} className="h-12 w-auto" />
            </Link>
            <div className="mt-2 space-y-2">
              <p className="text-xs text-[oklch(0.25 0.01 260)] font-bold leading-tight">
                India&apos;s most rigorous startup valuation platform.
              </p>
              <p className="text-[12px] italic text-[oklch(0.45 0.01 260)] leading-relaxed">
                Built by an IBBI-Registered Insolvency Professional <br className="hidden sm:block" /> &amp; SFA-Licensed Valuer.
              </p>
            </div>
          </div>
          {LINKS.map((group) => (
            <div key={group.heading}>
              <h4 className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-4">{group.heading}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[oklch(0.45 0.01 260)] transition-colors hover:text-[oklch(0.25 0.01 260)]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-[oklch(0.91 0.005 260)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[oklch(0.50 0.01 260)]">&copy; {new Date().getFullYear()} firstunicornstartup.com. All rights reserved.</p>
          <div className="flex items-center gap-5 text-[11px] text-[oklch(0.50 0.01 260)]">
            <Link href="/contact" className="transition-colors hover:text-[oklch(0.30 0.01 260)] font-bold">Contact Us</Link>
            <Link href="/privacy" className="transition-colors hover:text-[oklch(0.30 0.01 260)]">Privacy</Link>
            <Link href="/refund-policy" className="transition-colors hover:text-[oklch(0.30 0.01 260)]">Refunds</Link>
            <Link href="/terms" className="transition-colors hover:text-[oklch(0.30 0.01 260)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
