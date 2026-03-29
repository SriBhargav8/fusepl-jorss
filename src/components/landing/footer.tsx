import Link from 'next/link'
import Image from 'next/image'

const LINKS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'Tools',
    links: [
      { href: '/valuation', label: 'Startup Valuation' },
      { href: '/deal-check', label: 'Investor Deal Check' },
      { href: '/cap-table', label: 'Cap Table' },
      { href: '/esop-calculator', label: 'ESOP Calculator' },
      { href: '/valuatein', label: 'ValuateIN Professional' },
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
    <footer className="relative border-t border-[oklch(0.91 0.005 260)] bg-[oklch(0.97 0.003 260)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src="/logo.png" alt="First Unicorn Startup" width={150} height={46} className="h-auto" />
            </Link>
            <p className="mt-4 text-sm text-[oklch(0.45 0.01 260)] leading-relaxed max-w-xs">
              India&apos;s most rigorous startup valuation platform. Built by an IBBI-Registered Insolvency Professional &amp; SFA-Licensed Valuer.
            </p>
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
            <Link href="/privacy" className="transition-colors hover:text-[oklch(0.30 0.01 260)]">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-[oklch(0.30 0.01 260)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
