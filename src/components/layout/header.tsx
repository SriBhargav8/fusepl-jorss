'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MobileNav } from './mobile-nav'
import { useModal } from '@/components/providers/modal-provider'

const NAV_LINKS = [
  { href: '/deal-check', label: 'Fundraising' },
  { href: '/cap-table', label: 'Cap Table' },
  { href: '/guides', label: 'Guides' },
  { href: '/guides/startup-india-registration-explained', label: 'Startup India' },
  { href: 'https://profile.firstunicornstartup.com/', label: 'Our Services', isExternal: true },
]

export function Header() {
  const pathname = usePathname()
  const { openLeadModal } = useModal()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[oklch(0.91_0.005_260)] bg-[oklch(0.995_0.001_260)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <Image src="/logo.png" alt="First Unicorn Startup" width={180} height={46} className="h-10 sm:h-12 xl:h-14 w-auto" priority />
        </Link>

        <nav className="hidden xl:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (pathname?.startsWith(link.href + '/') ?? false)
            const isModal = (link as any).isModal
            const isExternal = (link as any).isExternal
            
            if (isModal) {
              return (
                <button
                  key={link.label}
                  onClick={openLeadModal}
                  className="focus-ring cursor-pointer relative px-3.5 py-1.5 text-[13px] font-medium tracking-wide uppercase rounded-lg transition-all duration-200 text-[oklch(0.35_0.02_260)] hover:text-[oklch(0.20_0.02_260)] hover:bg-[oklch(0.96_0.005_260)]"
                >
                  {link.label}
                </button>
              )
            }

            return (
              <Link key={link.href} href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
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
