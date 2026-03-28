'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function StickyReportCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show very early (50px)
      const scrolled = window.scrollY > 50
      setIsVisible(scrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToCertified = () => {
    const element = document.getElementById('certified-cta-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: 100, x: '-50%', opacity: 0 }}
          className="fixed bottom-12 left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-xs"
        >
          <button
            onClick={scrollToCertified}
            className="w-full h-12 bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full flex items-center justify-center gap-2 group transition-all hover:bg-slate-800 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-white text-sm font-semibold tracking-tight">
              Unlock Full Report & PDF
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
