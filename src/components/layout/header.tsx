'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MobileNav } from './mobile-nav'
import { PILLARS } from '@/lib/pillars'

const NAV_LINKS = [
  { href: '/learn', label: 'Learn' },
  { href: '/valuation', label: 'Valuation' },
  { href: '/deal-check', label: 'Deal Check' },
  { href: '/cap-table', label: 'Cap Table' },
  { href: '/esop-calculator', label: 'ESOP' },
  { href: '/services', label: 'Pricing' },
  { href: 'https://profile.firstunicornstartup.com/', label: 'Our Services', isExternal: true },
]

export function Header() {
  const pathname = usePathname()
  const [megaOpen, setMegaOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[oklch(0.91_0.005_260)] bg-[oklch(0.995_0.001_260)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <Image src="/logo.png" alt="First Unicorn Startup" width={180} height={46} className="h-10 sm:h-12 xl:h-14 w-auto" priority />
        </Link>

        <nav className="hidden xl:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (pathname?.startsWith(link.href + '/') ?? false)
            const isLearn = link.href === '/learn'
            const isExternal = (link as any).isExternal

            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => isLearn && setMegaOpen(true)}
                onMouseLeave={() => isLearn && setMegaOpen(false)}
              >
                <Link
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`focus-ring relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide uppercase rounded-lg transition-all duration-200
                    ${isActive ? 'text-[oklch(0.62_0.22_330)] bg-[oklch(0.62_0.22_330/0.08)]' : 'text-[oklch(0.35_0.02_260)] hover:text-[oklch(0.20_0.02_260)] hover:bg-[oklch(0.96_0.005_260)]'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isLearn && (
                    <svg className="inline-block ml-1 w-3 h-3 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {isLearn && megaOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="glass-card rounded-2xl border border-[oklch(0.91_0.005_260)] shadow-lg p-5 w-[420px] animate-in fade-in duration-200">
                      <p className="text-[10px] font-bold text-[oklch(0.62_0.22_330)] uppercase tracking-[0.2em] mb-3">
                        Content Pillars
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {PILLARS.map((pillar) => (
                          <Link
                            key={pillar.slug}
                            href={`/learn/${pillar.slug}`}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[oklch(0.40_0.01_260)] hover:text-[oklch(0.15_0.02_260)] hover:bg-[oklch(0.96_0.005_260)] transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pillar.color }} />
                            <span className="truncate">{pillar.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-[oklch(0.91_0.005_260)]">
                        <Link
                          href="/learn"
                          className="flex items-center gap-2 text-[12px] font-semibold text-[oklch(0.62_0.22_330)] hover:text-[oklch(0.75_0.18_162)] transition-colors"
                        >
                          Browse all content
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <div className="ml-4 pl-4 border-l border-[oklch(0.91_0.005_260)]">
            <Link href="/valuation" className="btn-press focus-ring inline-flex items-center justify-center rounded-xl h-9 px-5 text-[13px] font-semibold tracking-wide bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_4px_16px_oklch(0_0_0/0.15)]">
              Try Free Valuation Engine
            </Link>
          </div>
        </nav>

        <div className="xl:hidden">
          <MobileNav links={NAV_LINKS} pathname={pathname} />
        </div>
      </div>
    </header>
  )
}
