'use client'

import { Search, X } from 'lucide-react'

interface CategoryFiltersProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CategoryFilters({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange
}: CategoryFiltersProps) {
  return (
    <div className="space-y-8 mb-12">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[oklch(0.50_0.01_260)]" />
        </div>
        <input
          type="text"
          placeholder="Search guides (e.g. 'Seed Valuation', 'Pitch Deck')..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white border border-[oklch(0.91_0.005_260)] text-[oklch(0.15_0.02_260)] placeholder:text-[oklch(0.55_0.01_260)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.22_330/0.2)] focus:border-[oklch(0.62_0.22_330/0.3)] transition-all shadow-sm shadow-black/5"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-4 flex items-center text-[oklch(0.50_0.01_260)] hover:text-[oklch(0.15_0.02_260)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onCategoryChange('All')}
          className={`
            px-5 py-2.5 rounded-full text-sm font-semibold transition-all
            ${activeCategory === 'All' 
              ? 'bg-[#1d2024] text-white shadow-[0_4px_12px_oklch(0_0_0/0.15)]' 
              : 'bg-white border border-[oklch(0.91_0.005_260)] text-[oklch(0.35_0.02_260)] hover:bg-[oklch(0.98_0.002_260)] hover:border-[oklch(0.85_0.01_260)] shadow-sm shadow-black/5'
            }
          `}
        >
          All Guides
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              px-5 py-2.5 rounded-full text-sm font-semibold transition-all
              ${activeCategory === category 
                ? 'bg-[#1d2024] text-white shadow-[0_4px_12px_oklch(0_0_0/0.15)]Scale-[1.02]' 
                : 'bg-white border border-[oklch(0.91_0.005_260)] text-[oklch(0.35_0.02_260)] hover:bg-[oklch(0.98_0.002_260)] hover:border-[oklch(0.85_0.01_260)] shadow-sm shadow-black/5'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
