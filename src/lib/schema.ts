import type { ArticleFrontmatter } from './content'

const BASE_URL = 'https://firstunicornstartup.com'

export function generateArticleSchema(frontmatter: ArticleFrontmatter, wordCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    author: {
      '@type': 'Organization',
      name: 'First Unicorn Startup',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'First Unicorn Startup',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    datePublished: frontmatter.publishDate,
    dateModified: frontmatter.updatedDate || frontmatter.publishDate,
    mainEntityOfPage: `${BASE_URL}/learn/${frontmatter.pillar}/${frontmatter.slug}`,
    image: frontmatter.image || `${BASE_URL}/og/learn/${frontmatter.pillar}/${frontmatter.slug}.png`,
    wordCount,
    keywords: frontmatter.keywords ? [
      frontmatter.keywords.primary,
      ...(frontmatter.keywords.secondary || []),
    ].filter(Boolean).join(', ') : '',
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateBreadcrumbSchema(pillarName: string, pillarSlug: string, articleTitle?: string, articleSlug?: string) {
  const items = [
    { name: 'Home', url: BASE_URL },
    { name: 'Learn', url: `${BASE_URL}/learn` },
    { name: pillarName, url: `${BASE_URL}/learn/${pillarSlug}` },
  ]

  if (articleTitle && articleSlug) {
    items.push({ name: articleTitle, url: `${BASE_URL}/learn/${pillarSlug}/${articleSlug}` })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
