'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="flex flex-col" aria-label="Table of contents">
      <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-2 pb-2 border-b border-[oklch(0.91_0.005_260)]">
        On This Page
      </p>
      {headings.map((h, i) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className={`block transition-all duration-200 ${
            h.level === 2
              ? `text-[13px] font-semibold leading-snug ${i > 0 ? 'mt-4' : 'mt-2'}`
              : h.level === 3
              ? 'text-[12px] leading-relaxed pl-3 mt-2 border-l-2 border-[oklch(0.91_0.005_260)]'
              : 'text-[11px] leading-relaxed pl-6 mt-1.5 border-l-2 border-[oklch(0.91_0.005_260)]'
          } ${
            activeId === h.id
              ? 'text-[oklch(0.62 0.22 330)] border-[oklch(0.62_0.22_330)]'
              : h.level === 2
              ? 'text-[oklch(0.30 0.02 260)] hover:text-[oklch(0.62 0.22 330)]'
              : 'text-[oklch(0.50 0.01 260)] hover:text-[oklch(0.62 0.22 330)] hover:border-[oklch(0.62_0.22_330/0.4)]'
          }`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  )
}
