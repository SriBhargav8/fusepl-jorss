import Link from 'next/link'

const LINKS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Tools',
    links: [
      { href: '/valuation', label: 'Startup Valuation' },
      { href: '/deal-check', label: 'Investor Deal Check' },
      { href: '/cap-table', label: 'Cap Table' },
      { href: '/esop-calculator', label: 'ESOP Calculator' },
    ],
  },
  {
    heading: 'Standards We Follow',
    links: [
      { href: '/terms', label: 'IVS 105 Framework' },
      { href: '/terms', label: 'Rule 11UA' },
      { href: '/terms', label: 'FEMA NDI Rules' },
      { href: '/terms', label: 'Damodaran Data' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-[oklch(0.26_0.018_250)] bg-[oklch(0.11_0.012_250)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="text-lg" aria-hidden="true">&#x1f984;</span>
              <span className="font-heading text-lg tracking-tight text-gold-gradient">First Unicorn Startup</span>
            </Link>
            <p className="mt-4 text-sm text-[oklch(0.58_0.01_250)] leading-relaxed max-w-xs">
              India&apos;s most rigorous startup valuation platform. Built by an IBBI-Registered Insolvency Professional &amp; SFA-Licensed Valuer.
            </p>
          </div>
          {LINKS.map((group) => (
            <div key={group.heading}>
              <h4 className="text-[10px] font-bold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.2em] mb-4">{group.heading}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[oklch(0.58_0.01_250)] transition-colors hover:text-[oklch(0.85_0.005_250)]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-[oklch(0.22_0.015_250)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[oklch(0.50_0.01_250)]">&copy; {new Date().getFullYear()} firstunicornstartup.com. All rights reserved.</p>
          <div className="flex items-center gap-5 text-[11px] text-[oklch(0.50_0.01_250)]">
            <Link href="/privacy" className="transition-colors hover:text-[oklch(0.70_0.01_250)]">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-[oklch(0.70_0.01_250)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
