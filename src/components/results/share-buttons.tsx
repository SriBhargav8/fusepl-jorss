'use client'

import { Button } from '@/components/ui/button'
import { formatINR } from '@/lib/utils'

interface Props {
  compositeValue: number
  companyName: string
}

export function ShareButtons({ compositeValue, companyName }: Props) {
  const text = `Just valued ${companyName || 'my startup'} at ${formatINR(compositeValue)} using firstunicornstartup.com — 10 valuation methods across 3 approaches, powered by Damodaran India data. Try it free!`
  const url = 'https://firstunicornstartup.com'

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
  }

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
  }

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={shareLinkedIn} className="border-slate-700 text-slate-300 hover:bg-slate-800">
        Share on LinkedIn
      </Button>
      <Button variant="outline" size="sm" onClick={shareTwitter} className="border-slate-700 text-slate-300 hover:bg-slate-800">
        Share on Twitter
      </Button>
      <Button variant="outline" size="sm" onClick={shareWhatsApp} className="border-slate-700 text-slate-300 hover:bg-slate-800">
        Share on WhatsApp
      </Button>
    </div>
  )
}
