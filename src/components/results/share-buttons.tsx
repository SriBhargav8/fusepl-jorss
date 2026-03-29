'use client'

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

  const buttons = [
    { label: 'LinkedIn', onClick: shareLinkedIn },
    { label: 'Twitter', onClick: shareTwitter },
    { label: 'WhatsApp', onClick: shareWhatsApp },
  ]

  return (
    <div className="flex gap-2">
      {buttons.map(({ label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="h-9 px-4 text-xs font-medium rounded-lg border border-[oklch(0.91 0.005 260)] text-[oklch(0.45 0.01 260)] transition-all hover:border-[oklch(0.30_0.008_260)] hover:text-[oklch(0.62 0.22 330)] cursor-pointer"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
