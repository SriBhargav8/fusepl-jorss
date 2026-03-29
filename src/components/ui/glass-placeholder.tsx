'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface GlassPlaceholderProps {
  category?: string
  className?: string
}

export function GlassPlaceholder({ category = '', className = '' }: GlassPlaceholderProps) {
  // Generate a pseudo-random seed based on category string for consistent aesthetics
  const seed = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#121417] flex items-center justify-center ${className}`}>
      {/* Background Glows */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full opacity-30 blur-[100px]"
          style={{ 
            background: `radial-gradient(circle, oklch(0.62 0.22 330 / 0.4) 0%, transparent 70%)`,
            transform: `rotate(${seed % 360}deg)`
          }}
        />
        <div 
          className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] rounded-full opacity-20 blur-[100px]"
          style={{ 
            background: `radial-gradient(circle, oklch(0.55 0.15 250 / 0.3) 0%, transparent 70%)` 
          }}
        />
      </div>

      {/* Abstract Glass Shards */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, rotate: (seed + i * 45) % 360 }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
              rotate: [(seed + i * 45) % 360, (seed + i * 45 + 10) % 360, (seed + i * 45) % 360]
            }}
            transition={{ 
              duration: 10 + i * 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-32 h-32 md:w-48 md:h-48 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)`,
              left: `${30 + (i * 15 + seed % 20)}%`,
              top: `${30 + (i * 10 + seed % 20)}%`,
              boxShadow: `inset 0 0 20px oklch(0.62 0.22 330 / 0.1)`,
              border: `1px solid oklch(0.62 0.22 330 / 0.2)`
            }}
          />
        ))}

        {/* Central Glowing Core */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative w-16 h-16 md:w-24 md:h-24 rounded-full blur-[40px] bg-gradient-to-br from-[oklch(0.62_0.22_330)] to-[oklch(0.55_0.15_250)] opacity-60"
        />
        
        {/* Subtle Category Icon or Text node (Abstract) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-12 h-12 md:w-20 md:h-20 border-[0.5px] border-white/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 md:w-8 md:h-8 bg-gold-gradient rounded-full shadow-[0_0_30px_oklch(0.62_0.22_330/0.5)]" />
           </div>
        </div>
      </div>

      {/* Finishing Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-150 mix-blend-overlay pointer-events-none" />
    </div>
  )
}
