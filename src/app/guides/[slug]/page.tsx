import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GuideClient } from '@/components/guides/guide-client'

interface PageProps {
  params: Promise<{ slug: string }>
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content/guides/pages')

async function getGuideData(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)
  
  return {
    frontmatter: data,
    content
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuideData(slug)
  if (!guide) return { title: 'Guide Not Found' }

  return {
    title: `${guide.frontmatter.title} | FirstUnicorn Guides`,
    description: guide.frontmatter.excerpt,
    openGraph: {
      title: guide.frontmatter.title,
      description: guide.frontmatter.excerpt,
      type: 'article',
      publishedTime: guide.frontmatter.lastUpdated,
      authors: [guide.frontmatter.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.frontmatter.title,
      description: guide.frontmatter.excerpt,
    }
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  const guide = await getGuideData(slug)

  if (!guide) {
    notFound()
  }

  return <GuideClient guide={guide} />
}
