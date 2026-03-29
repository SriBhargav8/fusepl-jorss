'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { ThreeDTilt } from '../ui/three-d-tilt'
import { GlassPlaceholder } from '../ui/glass-placeholder'

interface GuideCardProps {
  title: string
  category: string
  description: string
  slug: string
  index: number
  image?: string
  readTime?: string
}

export function GuideCard({ title, category, description, slug, index, image, readTime = '5 min' }: GuideCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <ThreeDTilt className="h-full">
        <Link 
          href={`/guides/${slug}`}
          className="group relative flex flex-col h-full glass-card rounded-3xl border border-[oklch(0.91_0.005_260)] bg-white/50 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_50px_oklch(0_0_0/0.1)] overflow-hidden"
        >
          {/* Thumbnail Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[oklch(0.12_0.02_260)]">
            {image && !imageError ? (
              <Image 
                src={image} 
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <GlassPlaceholder category={category} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            
            {/* Category Tag Overlay */}
            <div className="absolute top-4 left-4 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[oklch(0.15_0.02_260/0.6)] backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider shadow-xl">
                <Tag className="w-3 h-3 text-[oklch(0.62_0.22_330)]" />
                {category}
              </span>
            </div>
          </div>

          <div className="p-8 flex flex-col flex-grow">
            <h3 className="text-xl font-heading text-[oklch(0.15_0.02_260)] leading-tight mb-4 group-hover:text-[oklch(0.62_0.22_330)] transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="text-sm text-[oklch(0.40_0.01_260)] leading-relaxed mb-8 line-clamp-3 font-medium">
              {description}
            </p>

            <div className="mt-auto flex items-center justify-between pt-6 border-t border-[oklch(0.91_0.005_260/0.5)]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[oklch(0.62_0.22_330)]" />
                <span className="text-[11px] font-bold text-[oklch(0.50_0.01_260)] uppercase tracking-wide">
                  {readTime} read
                </span>
              </div>
              <div className="flex items-center gap-2 text-[oklch(0.62_0.22_330)] font-bold text-sm group-hover:translate-x-1 transition-transform">
                Read Guide
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </ThreeDTilt>
    </motion.div>
  )
}
