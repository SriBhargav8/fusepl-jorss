'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false)
  
  // WhatsApp Link Config
  const whatsappNumber = "919667744073"
  const prefillText = encodeURIComponent("Hi FirstUnicorn, I'm exploring your platform and have a question about...")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefillText}`

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {/* WhatsApp Button - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link 
          href={whatsappUrl}
          target="_blank"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-[oklch(0.91_0.005_260)] shadow-[0_8px_20px_rgba(0,0,0,0.08)] text-emerald-600 hover:text-white hover:bg-emerald-500 hover:scale-110 transition-all duration-300 group"
          aria-label="Contact on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          
          {/* Subtle Glow ping */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping group-hover:hidden" />
          
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-[oklch(0.15_0.02_260)] text-[10px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-wider">
            Expert Chat
          </span>
        </Link>
      </div>

      {/* Scroll to Top - Bottom Right */}
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={scrollToTop}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-[oklch(0.91_0.005_260)] shadow-[0_8px_20px_rgba(0,0,0,0.08)] text-[oklch(0.15_0.02_260/0.4)] hover:text-[oklch(0.62_0.22_330)] hover:scale-110 transition-all duration-300 group"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
