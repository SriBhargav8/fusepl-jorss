'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    <header className="sticky top-0 z-50 w-full border-b border-[oklch(0.91_0.005_260)] bg-[oklch(0.995_0.001_260)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <Image src="/logo.png" alt="First Unicorn Startup" width={140} height={36} className="h-8 w-auto" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (pathname?.startsWith(link.href + '/') ?? false)
            return (
              <Link key={link.href} href={link.href}
                className={`focus-ring relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide uppercase rounded-lg transition-all duration-200
                  ${isActive ? 'text-[oklch(0.62_0.22_330)] bg-[oklch(0.62_0.22_330/0.08)]' : 'text-[oklch(0.35_0.02_260)] hover:text-[oklch(0.20_0.02_260)] hover:bg-[oklch(0.96_0.005_260)]'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="ml-4 pl-4 border-l border-[oklch(0.91_0.005_260)]">
            <Link href="/valuation" className="btn-press focus-ring inline-flex items-center justify-center rounded-xl h-9 px-5 text-[13px] font-semibold tracking-wide bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_4px_16px_oklch(0_0_0/0.15)]">
              Get Valuation
            </Link>
          </div>
        </nav>

        <div className="md:hidden">
          <MobileNav links={NAV_LINKS} pathname={pathname} />
        </div>
      </div>
    </header>
  )
}
