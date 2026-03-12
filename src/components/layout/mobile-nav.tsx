'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface NavLink {
  href: string
  label: string
}

interface MobileNavProps {
  links: NavLink[]
  pathname: string | null
}

export function MobileNav({ links, pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-[oklch(0.55_0.01_250)] hover:text-[oklch(0.85_0.005_80)]"
          />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] bg-[oklch(0.08_0.008_260/0.95)] backdrop-blur-xl border-[oklch(0.24_0.018_250)] p-0"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="flex items-center gap-2 p-5 border-b border-[oklch(0.24_0.018_250)]">
            <span className="text-lg">&#x1f984;</span>
            <span className="font-heading text-lg text-gold-gradient">
              First Unicorn Startup
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-4 flex-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname?.startsWith(link.href + '/') ?? false)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`
                    relative rounded-lg px-4 py-3 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-[oklch(0.78_0.14_80/0.08)] text-[oklch(0.72_0.17_162)] border-l-2 border-[oklch(0.72_0.17_162)]'
                        : 'text-[oklch(0.55_0.01_250)] hover:text-[oklch(0.85_0.005_80)] hover:bg-[oklch(0.18_0.018_250)]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA at bottom */}
          <div className="p-4 border-t border-[oklch(0.24_0.018_250)]">
            <Link
              href="/valuation"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full rounded-lg h-10 px-4 text-sm font-semibold bg-[oklch(0.72_0.17_162)] text-[oklch(0.10_0_0)] transition-all hover:bg-[oklch(0.68_0.18_162)]"
            >
              Get Valuation
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
