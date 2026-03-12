'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNav } from './mobile-nav'

const NAV_LINKS = [
  { href: '/valuation', label: 'Valuation' },
  { href: '/deal-check', label: 'Deal Check' },
  { href: '/cap-table', label: 'Cap Table' },
  { href: '/esop-calculator', label: 'ESOP' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[oklch(0.24_0.012_260/0.5)] bg-[oklch(0.13_0.01_260/0.80)] backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <span className="text-lg" aria-hidden="true">&#x1f984;</span>
          <span className="font-heading text-lg tracking-tight text-gold-gradient">
            First Unicorn Startup
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname?.startsWith(link.href + '/') ?? false)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  focus-ring relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide uppercase rounded-lg transition-all duration-200
                  ${isActive
                    ? 'text-[oklch(0.90_0.10_75)] bg-[oklch(0.82_0.12_75/0.08)]'
                    : 'text-[oklch(0.62_0.01_260)] hover:text-[oklch(0.85_0.005_80)] hover:bg-[oklch(0.82_0.12_75/0.05)]'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="ml-4 pl-4 border-l border-[oklch(0.30_0.01_260)]">
            <Link
              href="/valuation"
              className="btn-press focus-ring inline-flex items-center justify-center rounded-xl h-9 px-5 text-[13px] font-semibold tracking-wide bg-gradient-to-r from-[oklch(0.82_0.12_75)] to-[oklch(0.75_0.14_80)] text-[oklch(0.10_0_0)] transition-all hover:shadow-[0_0_24px_oklch(0.82_0.12_75/0.25)]"
            >
              Get Valuation
            </Link>
          </div>
        </nav>

        {/* Mobile navigation trigger */}
        <div className="md:hidden">
          <MobileNav links={NAV_LINKS} pathname={pathname} />
        </div>
      </div>
    </header>
  )
}
