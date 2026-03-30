import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getAllArticles, getArticle, getRelatedArticles, getPillar } from '@/lib/content'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/schema'
import { ArticlePageClient } from './article-page-client'

export function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({
    pillar: a.frontmatter.pillar,
    slug: a.frontmatter.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ pillar: string; slug: string }> }): Promise<Metadata> {
  const { pillar: pillarSlug, slug } = await params
  const article = getArticle(pillarSlug, slug)
  if (!article) return {}

  return {
    title: article.frontmatter.title || 'Article',
    description: article.frontmatter.excerpt || '',
    keywords: article.frontmatter.keywords ? [
      article.frontmatter.keywords.primary,
      ...(article.frontmatter.keywords.secondary || []),
    ].filter(Boolean) : [],
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.excerpt,
      type: 'article',
      publishedTime: article.frontmatter.publishDate,
      modifiedTime: article.frontmatter.updatedDate || article.frontmatter.publishDate,
      authors: ['First Unicorn Startup'],
      url: `https://firstunicornstartup.com/learn/${pillarSlug}/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.frontmatter.title,
      description: article.frontmatter.excerpt,
    },
    other: { robots: 'max-image-preview:large' },
    alternates: {
      canonical: `https://firstunicornstartup.com/learn/${pillarSlug}/${slug}`,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ pillar: string; slug: string }> }) {
  const { pillar: pillarSlug, slug } = await params
  const article = getArticle(pillarSlug, slug)
  if (!article) notFound()

  const pillar = getPillar(pillarSlug)
  if (!pillar) notFound()

  const related = getRelatedArticles(pillarSlug, slug, 3)

  // Extract headings for TOC (H2, H3, H4)
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: { id: string; text: string; level: number }[] = []
  let match
  while ((match = headingRegex.exec(article.content)) !== null) {
    const text = match[2].replace(/[*_`]/g, '')
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const level = match[1].length // 2, 3, or 4
    headings.push({ id, text, level })
  }

  // Schema
  const articleSchema = generateArticleSchema(article.frontmatter, article.wordCount)
  const breadcrumbSchema = generateBreadcrumbSchema(
    pillar.name,
    pillar.slug,
    article.frontmatter.title,
    article.frontmatter.slug,
  )

  // Custom MDX components
  const components = {
    h1: ({ children }: React.ComponentProps<'h1'>) => (
      // Skip H1 — page title is rendered in the header
      <h2 className="font-heading text-[clamp(1.5rem,3vw,2rem)] text-[oklch(0.15 0.02 260)] mt-12 mb-4 scroll-mt-20">
        {children}
      </h2>
    ),
    h2: ({ children, ...props }: React.ComponentProps<'h2'>) => {
      const text = String(children).replace(/[*_`]/g, '')
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      return (
        <h2 id={id} className="font-heading text-[clamp(1.5rem,3vw,2rem)] text-[oklch(0.15 0.02 260)] mt-12 mb-4 scroll-mt-20" {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }: React.ComponentProps<'h3'>) => {
      const text = String(children).replace(/[*_`]/g, '')
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      return (
        <h3 id={id} className="font-sans font-bold text-[1.15rem] text-[oklch(0.20 0.02 260)] mt-8 mb-3 scroll-mt-20" {...props}>
          {children}
        </h3>
      )
    },
    h4: ({ children, ...props }: React.ComponentProps<'h4'>) => {
      const text = String(children).replace(/[*_`]/g, '')
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      return (
        <h4 id={id} className="font-sans font-semibold text-base text-[oklch(0.22 0.02 260)] mt-6 mb-2 scroll-mt-20" {...props}>
          {children}
        </h4>
      )
    },
    p: ({ children, ...props }: React.ComponentProps<'p'>) => (
      <p className="text-[17px] leading-[1.75] text-[oklch(0.30 0.02 260)] mb-5" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: React.ComponentProps<'ul'>) => (
      <ul className="text-[17px] leading-[1.75] text-[oklch(0.30 0.02 260)] mb-5 pl-6 list-disc space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: React.ComponentProps<'ol'>) => (
      <ol className="text-[17px] leading-[1.75] text-[oklch(0.30 0.02 260)] mb-5 pl-6 list-decimal space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: React.ComponentProps<'li'>) => (
      <li className="text-[oklch(0.30 0.02 260)]" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }: React.ComponentProps<'blockquote'>) => (
      <blockquote
        className="border-l-[3px] border-[oklch(0.62 0.22 330)] bg-[oklch(0.62_0.22_330/0.04)] px-6 py-4 rounded-r-xl my-6 text-[16px] text-[oklch(0.35 0.02 260)] italic"
        {...props}
      >
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }: React.ComponentProps<'table'>) => (
      <div className="overflow-x-auto my-6 rounded-xl border border-[oklch(0.91 0.005 260)]">
        <table className="w-full text-sm border-collapse" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.ComponentProps<'thead'>) => (
      <thead className="bg-[oklch(0.97 0.003 260)]" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: React.ComponentProps<'tbody'>) => (
      <tbody {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }: React.ComponentProps<'tr'>) => (
      <tr className="hover:bg-[oklch(0.98 0.002 260)] transition-colors" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }: React.ComponentProps<'th'>) => (
      <th
        className="text-left px-4 py-3 text-[11px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.12em] border-b-2 border-[oklch(0.91 0.005 260)] bg-[oklch(0.97 0.003 260)] whitespace-nowrap"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.ComponentProps<'td'>) => (
      <td className="px-4 py-3 text-[oklch(0.35 0.02 260)] border-b border-[oklch(0.95 0.003 260)]" {...props}>
        {children}
      </td>
    ),
    a: ({ children, href, ...props }: React.ComponentProps<'a'>) => (
      <a
        href={href}
        className="text-[oklch(0.62 0.22 330)] underline underline-offset-2 decoration-[oklch(0.62_0.22_330/0.3)] hover:decoration-[oklch(0.62_0.22_330)] transition-colors"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children, ...props }: React.ComponentProps<'strong'>) => (
      <strong className="font-semibold text-[oklch(0.15 0.02 260)]" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: React.ComponentProps<'em'>) => (
      <em className="italic text-[oklch(0.35 0.02 260)]" {...props}>
        {children}
      </em>
    ),
    code: ({ children, ...props }: React.ComponentProps<'code'>) => (
      <code className="px-1.5 py-0.5 rounded-md bg-[oklch(0.96 0.005 260)] text-[oklch(0.40 0.02 260)] text-[15px] font-mono" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }: React.ComponentProps<'pre'>) => (
      <pre className="overflow-x-auto my-6 p-5 rounded-xl bg-[oklch(0.14 0.02 260)] text-[oklch(0.90 0.01 260)] text-[14px] leading-relaxed font-mono border border-[oklch(0.25 0.02 260)]" {...props}>
        {children}
      </pre>
    ),
    hr: () => <div className="section-divider my-10" />,
    del: ({ children, ...props }: React.ComponentProps<'del'>) => (
      <del className="text-[oklch(0.50 0.01 260)] line-through" {...props}>
        {children}
      </del>
    ),
  }

  return (
    <>
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ArticlePageClient
        title={article.frontmatter.title}
        excerpt={article.frontmatter.excerpt}
        pillarName={pillar.name}
        pillarSlug={pillar.slug}
        pillarColor={pillar.color}
        publishDate={article.frontmatter.publishDate}
        readingTime={article.readingTime}
        wordCount={article.wordCount}
        headings={headings}
        related={related}
      >
        <MDXRemote source={article.content} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </ArticlePageClient>
    </>
  )
}
