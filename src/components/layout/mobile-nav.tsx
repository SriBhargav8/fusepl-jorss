'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { PILLARS } from '@/lib/pillars'
import { useModal } from '@/components/providers/modal-provider'

interface NavLink {
  href: string
  label: string
  isExternal?: boolean
  icon?: any
}

interface MobileNavProps {
  links: NavLink[]
  pathname: string | null
}

export function MobileNav({ links, pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [learnExpanded, setLearnExpanded] = useState(false)
  const { openLeadModal } = useModal()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-[oklch(0.35_0.02_260)] hover:text-[oklch(0.15_0.02_260)]"
          />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] bg-[oklch(1_0_0/0.97)] backdrop-blur-xl border-[oklch(0.91_0.005_260)] p-0"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 p-5 border-b border-[oklch(0.91_0.005_260)]">
            <Image src="/logo.png" alt="First Unicorn Startup" width={140} height={36} className="h-8 w-auto" />
          </div>

          <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname?.startsWith(link.href + '/') ?? false)
              const isLearn = link.href === '/learn'
              const isModal = (link as any).isModal
              const Icon = link.icon

              if (isModal) {
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      setOpen(false)
                      openLeadModal()
                    }}
                    className="flex items-center gap-3 relative rounded-lg px-4 py-3 text-sm text-left font-medium transition-colors text-[oklch(0.35_0.02_260)] hover:text-[oklch(0.15_0.02_260)] hover:bg-[oklch(0.96_0.005_260)]"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {link.label}
                  </button>
                )
              }

              return (
                <div key={link.href}>
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      target={link.isExternal ? '_blank' : undefined}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center gap-3 relative rounded-lg px-4 py-3 text-sm font-medium transition-colors flex-1
                        ${
                          isActive
                            ? 'bg-[oklch(0.62_0.22_330/0.08)] text-[oklch(0.62_0.22_330)] border-l-2 border-[oklch(0.62_0.22_330)]'
                            : 'text-[oklch(0.35_0.02_260)] hover:text-[oklch(0.15_0.02_260)] hover:bg-[oklch(0.96_0.005_260)]'
                        }
                      `}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {link.label}
                    </Link>
                    {isLearn && (
                      <button
                        onClick={() => setLearnExpanded(!learnExpanded)}
                        className="p-2 rounded-lg text-[oklch(0.45_0.01_260)] hover:text-[oklch(0.15_0.02_260)] hover:bg-[oklch(0.96_0.005_260)] transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${learnExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {isLearn && learnExpanded && (
                    <div className="ml-4 mt-1 mb-2 space-y-0.5">
                      {PILLARS.map((pillar) => (
                        <Link
                          key={pillar.slug}
                          href={`/learn/${pillar.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-[oklch(0.45_0.01_260)] hover:text-[oklch(0.15_0.02_260)] hover:bg-[oklch(0.96_0.005_260)] transition-colors"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: pillar.color }}
                          />
                          {pillar.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="p-4 border-t border-[oklch(0.91_0.005_260)]">
            <Link
              href="/valuation"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full rounded-lg h-10 px-4 text-sm font-semibold bg-[#32373c] text-white transition-all hover:bg-[#1d2024]"
            >
              Try Free Valuation Engine
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
