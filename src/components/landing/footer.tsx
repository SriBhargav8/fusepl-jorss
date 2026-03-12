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
    <footer className="relative border-t border-[oklch(0.24_0.012_260)] bg-[oklch(0.09_0.008_260)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="text-lg" aria-hidden="true">&#x1f984;</span>
              <span className="font-heading text-lg tracking-tight text-gold-gradient">
                First Unicorn Startup
              </span>
            </Link>
            <p className="mt-4 text-sm text-[oklch(0.58_0.01_260)] leading-relaxed max-w-xs">
              India&apos;s most rigorous startup valuation platform. Built by an IBBI-Registered Insolvency Professional &amp; SFA-Licensed Valuer.
            </p>
          </div>

          {/* Link columns */}
          {LINKS.map((group) => (
            <div key={group.heading}>
              <h4 className="text-[10px] font-bold text-[oklch(0.82_0.12_75)] uppercase tracking-[0.2em] mb-4">
                {group.heading}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[oklch(0.58_0.01_260)] transition-colors hover:text-[oklch(0.82_0.005_80)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-[oklch(0.20_0.01_260)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[oklch(0.50_0.01_260)]">
            &copy; {new Date().getFullYear()} firstunicornstartup.com. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[11px] text-[oklch(0.50_0.01_260)]">
            <Link href="/privacy" className="transition-colors hover:text-[oklch(0.70_0.01_260)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[oklch(0.70_0.01_260)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
