'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-[81px] left-0 h-[3px] z-[49] transition-[width] duration-75 ease-linear"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, oklch(0.62 0.22 330), oklch(0.75 0.18 162))',
      }}
    />
  )
}
