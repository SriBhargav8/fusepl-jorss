import Link from 'next/link'
import Image from 'next/image'

const LINKS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Startup Valuation',
    links: [
      { href: '/valuation', label: 'Valuation Calculator' },
      { href: '/guides/startup-valuation-methods-dcf-vc-method-scorecard', label: 'Valuation Methods' },
      { href: '/guides/pre-seed-startup-valuation-india', label: 'Pre-seed Valuation' },
      { href: '/guides/seed-stage-startup-valuation-explained', label: 'Seed Valuation' },
    ],
  },
  {
    heading: 'Fundraising Readiness',
    links: [
      { href: '/guides/startup-financial-model-for-fundraising', label: 'Financial Model' },
      { href: '/guides/pitch-deck-mistakes-that-hurt-fundraising', label: 'Pitch Deck Readiness' },
      { href: '/guides/what-investors-want-before-startup-funding-round', label: 'Investor Readiness' },
      { href: '/guides/startup-due-diligence-preparation-checklist', label: 'Due Diligence' },
    ],
  },
  {
    heading: 'Cap Table & ESOP',
    links: [
      { href: '/guides/startup-cap-table-explained', label: 'Cap Table Basics' },
      { href: '/guides/esop-for-startups-india', label: 'ESOP Explained' },
      { href: '/guides/founder-dilution-explained-simply', label: 'Equity Dilution' },
      { href: '/guides/co-founder-equity-split-guide', label: 'Founder Structuring' },
    ],
  },
  {
    heading: 'Startup India',
    links: [
      { href: '/guides/startup-india-registration-explained', label: 'DPIIT Recognition' },
      { href: '/guides/how-to-apply-for-startup-india-seed-fund', label: 'Seed Fund Scheme' },
      { href: '/guides/startup-india-seed-fund-eligibility', label: 'Government Grants' },
      { href: '/guides/dpiit-recognition-benefits-for-startups', label: 'Tax Exemptions' },
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
