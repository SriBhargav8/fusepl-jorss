import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

// Re-export shared types and PILLARS for server components
export { PILLARS, getPillar, type PillarSlug } from './pillars'
export type { ArticleFrontmatter, Article } from './content-types'

import type { ArticleFrontmatter, Article } from './content-types'
import { PILLARS } from './pillars'

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content')

export function getAllArticles(): Article[] {
  const articles: Article[] = []

  for (const pillar of PILLARS) {
    const pillarDir = path.join(CONTENT_DIR, pillar.slug)
    if (!fs.existsSync(pillarDir)) continue

    const files = fs.readdirSync(pillarDir).filter((f) => f.endsWith('.mdx'))

    for (const file of files) {
      const raw = fs.readFileSync(path.join(pillarDir, file), 'utf-8')
      const { data, content } = matter(raw)
      const stats = readingTime(content)

      if (!data.slug) data.slug = file.replace(/\.mdx$/, '')
      if (!data.pillar) data.pillar = pillar.slug

      articles.push({
        frontmatter: data as ArticleFrontmatter,
        content,
        readingTime: Math.ceil(stats.minutes),
        wordCount: stats.words,
      })
    }
  }

  // Sort by publish date, newest first
  articles.sort((a, b) =>
    new Date(b.frontmatter.publishDate).getTime() - new Date(a.frontmatter.publishDate).getTime()
  )

  return articles
}

export function getArticlesByPillar(pillarSlug: string): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.pillar === pillarSlug)
}

export function getArticle(pillarSlug: string, articleSlug: string): Article | undefined {
  const pillarDir = path.join(CONTENT_DIR, pillarSlug)
  if (!fs.existsSync(pillarDir)) return undefined

  const files = fs.readdirSync(pillarDir).filter((f) => f.endsWith('.mdx'))

  for (const file of files) {
    const raw = fs.readFileSync(path.join(pillarDir, file), 'utf-8')
    const { data, content } = matter(raw)

    if (!data.slug) data.slug = file.replace(/\.mdx$/, '')
    if (!data.pillar) data.pillar = pillarSlug

    if (data.slug === articleSlug) {
      const stats = readingTime(content)
      return {
        frontmatter: data as ArticleFrontmatter,
        content,
        readingTime: Math.ceil(stats.minutes),
        wordCount: stats.words,
      }
    }
  }

  return undefined
}

export function getRelatedArticles(pillarSlug: string, currentSlug: string, limit = 3): Article[] {
  return getArticlesByPillar(pillarSlug)
    .filter((a) => a.frontmatter.slug !== currentSlug)
    .slice(0, limit)
}

export function getFeaturedArticles(limit = 6): Article[] {
  const all = getAllArticles()
  const featured = all.filter((a) => a.frontmatter.featured)
  if (featured.length >= limit) return featured.slice(0, limit)
  // Fill with recent articles if not enough featured
  const remaining = all.filter((a) => !a.frontmatter.featured)
  return [...featured, ...remaining].slice(0, limit)
}
