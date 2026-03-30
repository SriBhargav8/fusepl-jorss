'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { getLeadMagnet, WHATSAPP_COMMUNITY_LINK } from '@/lib/lead-magnets'

interface Props {
  pillar: string
}

export function MobileCtaBar({ pillar }: Props) {
  const [visible, setVisible] = useState(false)
  const magnet = getLeadMagnet(pillar)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-[oklch(0.995_0.001_260/0.92)] backdrop-blur-xl border-t border-[oklch(0.91_0.005_260)] px-4 py-3 flex items-center gap-3">
      {/* Primary CTA */}
      <Link
        href={magnet.toolHref}
        className="btn-press flex-1 flex items-center justify-center gap-2 h-11 text-[13px] font-semibold tracking-wide rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024]"
      >
        {magnet.toolLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
      </div>
    </div>
  )
}
