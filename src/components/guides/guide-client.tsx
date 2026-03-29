'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckCircle2, 
  MessageCircle,
  Clock,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { GlassPlaceholder } from '@/components/ui/glass-placeholder'

interface GuideClientProps {
  guide: {
    frontmatter: any
    content: string
  }
}

export function GuideClient({ guide }: GuideClientProps) {
  const [imageError, setImageError] = useState(false)

  // Extract headings for Table of Contents
  const headings = guide.content.split('\n')
    .filter(line => line.startsWith('## '))
    .map(line => ({
      title: line.replace('## ', '').trim(),
      id: line.replace('## ', '').trim().toLowerCase().replace(/\s+/g, '-')
    }))

  const waLink = `https://wa.me/919667744073?text=Hi%2C%20I%20just%20read%20your%20guide%20on%20${encodeURIComponent(guide.frontmatter.title)}%20and%20had%20a%20question...`

  return (
    <main className="min-h-screen bg-[oklch(0.99_0.005_260)] pt-16 pb-20">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[oklch(0.96_0.02_260)] to-transparent -z-10 opacity-30" />
      
      <div className="max-w-[1240px] mx-auto px-6 relative">
        <nav className="flex items-center gap-2 text-[11px] font-bold text-[oklch(0.50_0.01_260)] uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-[oklch(0.62_0.22_330)] transition-colors">Home</Link>
          <span className="opacity-30">/</span>
          <Link href="/guides" className="hover:text-[oklch(0.62_0.22_330)] transition-colors">Guides</Link>
          <span className="opacity-30">/</span>
          <span className="text-[oklch(0.62_0.22_330)]">{guide.frontmatter.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <article className="relative bg-white p-8 md:pt-10 md:pb-14 md:px-14 rounded-[2.5rem] border border-[oklch(0.91_0.005_260)] shadow-[0_8px_40px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="absolute top-10 left-0 w-1.5 h-20 bg-[oklch(0.62_0.22_330)] rounded-r-full opacity-20" />
            
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-[oklch(0.62_0.22_330/0.05)] border border-[oklch(0.62_0.22_330/0.1)] text-[10px] font-bold text-[oklch(0.62_0.22_330)] uppercase tracking-wider">
                  {guide.frontmatter.category}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  Expert Verified
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-heading text-[oklch(0.15_0.02_260)] leading-tight mb-6">
                {guide.frontmatter.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-[oklch(0.96_0.005_260)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[oklch(0.96_0.005_260)] flex items-center justify-center border border-[oklch(0.91_0.005_260)]">
                    <User className="w-5 h-5 text-[oklch(0.50_0.01_260)]" />
                  </div>
                  <div className="text-xs">
                    <span className="block text-[oklch(0.50_0.01_260)] mb-0.5">Written by</span>
                    <span className="font-bold text-[oklch(0.15_0.02_260)]">{guide.frontmatter.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[oklch(0.98_0.005_260)] flex items-center justify-center border border-[oklch(0.96_0.005_260)]">
                    <Calendar className="w-4 h-4 text-[oklch(0.50_0.01_260)]" />
                  </div>
                  <div className="text-xs">
                    <span className="block text-[oklch(0.50_0.01_260)] mb-0.5">Last updated</span>
                    <span className="font-bold text-[oklch(0.15_0.02_260)] text-emerald-700">{guide.frontmatter.lastUpdated}</span>
                  </div>
                </div>
                <div className="ml-auto hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[oklch(0.98_0.005_260)] border border-[oklch(0.96_0.005_260)]">
                  <Clock className="w-4 h-4 text-[oklch(0.50_0.01_260)]" />
                  <span className="text-xs font-bold text-[oklch(0.15_0.02_260)] uppercase">
                    {guide.frontmatter.readTime || '5 min'} read
                  </span>
                </div>
              </div>
            </header>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 shadow-md bg-[oklch(0.12_0.02_260)] border border-[oklch(0.91_0.005_260)]">
              {guide.frontmatter.image && !imageError ? (
                <Image 
                  src={guide.frontmatter.image} 
                  alt={guide.frontmatter.title}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <GlassPlaceholder category={guide.frontmatter.category} />
              )}
            </div>

            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-headings:text-[oklch(0.15_0.02_260)] prose-p:text-[oklch(0.40_0.01_260)] prose-strong:text-[oklch(0.15_0.02_260)] prose-li:text-[oklch(0.40_0.01_260)]">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{
                  h2: ({node, ...props}) => <h2 id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-[oklch(0.62_0.22_330)] bg-[oklch(0.62_0.22_330/0.03)] p-6 rounded-r-2xl not-italic" {...props} />
                  ),
                }}
              >
                {guide.content}
              </ReactMarkdown>
            </div>
          </article>

          <aside className="space-y-8">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-[oklch(0.91_0.005_260)] shadow-sm">
                <h4 className="text-xs font-bold text-[oklch(0.50_0.01_260)] uppercase tracking-wider mb-6">Table of Contents</h4>
                <nav className="space-y-4">
                  {headings.map((heading) => (
                    <a 
                      key={heading.id}
                      href={`#${heading.id}`}
                      className="group flex items-center gap-3 text-sm font-medium text-[oklch(0.40_0.01_260)] hover:text-[oklch(0.62_0.22_330)] transition-all"
                    >
                      <span className="w-1 h-1 rounded-full bg-[oklch(0.91_0.005_260)] group-hover:bg-[oklch(0.62_0.22_330)] group-hover:scale-150 transition-all" />
                      {heading.title}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="bg-[oklch(0.15_0.02_260)] p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.62_0.22_330/0.2)] to-transparent opacity-50" />
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6 text-[oklch(0.62_0.22_330)]">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-heading text-white mb-4">Have Questions?</h4>
                  <p className="text-white/60 text-sm mb-8 leading-relaxed">
                    Get in touch with us on WhatsApp for expert guidance on your startup journey.
                  </p>
                  <Link 
                    href={waLink}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[oklch(0.62_0.22_330)] text-white font-bold rounded-2xl hover:bg-[oklch(0.55_0.20_330)] transition-all shadow-[0_8px_32px_oklch(0.62_0.22_330/0.4)]"
                  >
                    Quick Chat
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
