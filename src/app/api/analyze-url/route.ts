import { NextRequest, NextResponse } from 'next/server'

// Sector detection keywords
const SECTOR_KEYWORDS: Record<string, string[]> = {
  saas: ['saas', 'software', 'cloud', 'platform', 'api', 'dashboard', 'analytics', 'crm', 'erp'],
  fintech_payments: ['payment', 'fintech', 'upi', 'wallet', 'razorpay', 'paytm'],
  fintech_insurance: ['insurance', 'insurtech', 'policy', 'claim', 'underwriting'],
  fintech_banking: ['bank', 'neobank', 'account', 'deposit', 'savings'],
  fintech_lending: ['lending', 'bnpl', 'credit', 'loan', 'nbfc', 'microfinance'],
  fintech_wealthtech: ['wealth', 'advisory', 'invest', 'portfolio', 'mutual fund', 'robo-advisor', 'trading'],
  d2c: ['brand', 'd2c', 'direct', 'consumer', 'beauty', 'skincare'],
  edtech: ['education', 'learning', 'course', 'teach', 'skill', 'edtech', 'tutor', 'academy'],
  healthtech_products: ['health', 'medical', 'device', 'diagnostic', 'medtech'],
  healthtech_services: ['telemedicine', 'hospital', 'pharmacy', 'doctor', 'healthcare', 'wellness'],
  ecommerce_general: ['shop', 'store', 'ecommerce', 'buy', 'sell', 'cart'],
  ecommerce_grocery: ['grocery', 'quick commerce', 'instant delivery', 'dark store'],
  ecommerce_fashion: ['fashion', 'apparel', 'clothing', 'lifestyle', 'accessories', 'jewellery'],
  marketplace: ['marketplace', 'connect', 'match', 'aggregator', 'two-sided'],
  agritech: ['agri', 'farm', 'crop', 'agriculture', 'seed', 'harvest'],
  logistics: ['logistics', 'shipping', 'warehouse', 'fleet', 'supply chain', 'last mile'],
  cleantech: ['solar', 'energy', 'clean', 'ev', 'electric', 'carbon', 'green', 'renewable'],
  deeptech: ['robotics', 'deep tech', 'computer vision', 'quantum', 'semiconductor'],
  ai_ml: ['ai', 'machine learning', 'artificial intelligence', 'nlp', 'genai', 'llm', 'generative'],
  gaming: ['game', 'gaming', 'esport', 'entertainment', 'stream'],
  real_estate_tech: ['property', 'real estate', 'proptech', 'construction', 'home'],
  auto_mobility: ['auto', 'car', 'ride', 'mobility', 'vehicle'],
  manufacturing: ['manufacture', 'factory', 'industrial', 'iot', 'machinery'],
  media_advertising: ['media', 'advertising', 'adtech', 'content', 'publish', 'marketing'],
  telecom: ['telecom', 'connectivity', 'isp', 'broadband', 'network'],
  travel_hospitality: ['travel', 'hotel', 'booking', 'tourism', 'hospitality', 'trip'],
  social_impact: ['social impact', 'ngo', 'non-profit', 'impact', 'sustainability'],
  b2b_services: ['b2b', 'enterprise', 'consulting'],
  legaltech: ['legal', 'law', 'contract', 'compliance', 'regtech', 'regulatory'],
  hrtech: ['hr', 'human resource', 'payroll', 'recruitment', 'hiring', 'talent'],
  foodtech: ['food', 'kitchen', 'meal', 'restaurant', 'chef', 'recipe', 'cloud kitchen'],
  spacetech: ['space', 'satellite', 'aerospace', 'launch', 'orbit'],
  biotech: ['biotech', 'genomics', 'pharma', 'drug discovery', 'life science', 'clinical trial'],
  cybersecurity: ['security', 'cyber', 'threat', 'encryption', 'firewall', 'identity'],
  web3_blockchain: ['blockchain', 'web3', 'crypto', 'defi', 'nft', 'token', 'decentralized'],
  drone_tech: ['drone', 'uav', 'unmanned', 'aerial'],
  retail_tech: ['retail', 'pos', 'point of sale', 'store tech', 'omnichannel'],
  sportstech: ['sport', 'fitness', 'gym', 'athlete', 'wearable', 'training'],
  pet_care: ['pet', 'animal', 'veterinary', 'vet', 'dog', 'cat'],
}

function detectSector(text: string): string {
  const lower = text.toLowerCase()
  let bestSector = 'other'
  let bestScore = 0

  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    let score = 0
    for (const kw of keywords) {
      if (lower.includes(kw)) score++
    }
    if (score > bestScore) {
      bestScore = score
      bestSector = sector
    }
  }

  return bestSector
}

function extractTeamSize(text: string): number | null {
  // Look for team size mentions
  const patterns = [
    /(\d+)\s*\+?\s*(?:team|employees|people|members|engineers)/i,
    /team\s*(?:of|size)?\s*(\d+)/i,
  ]
  for (const p of patterns) {
    const match = text.match(p)
    if (match) {
      const n = parseInt(match[1])
      if (n > 0 && n < 10000) return n
    }
  }
  return null
}

function extractCity(text: string): string {
  const indianCities = [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai',
    'kolkata', 'pune', 'ahmedabad', 'jaipur', 'gurugram', 'gurgaon',
    'noida', 'lucknow', 'chandigarh', 'indore', 'kochi', 'coimbatore',
    'nagpur', 'visakhapatnam', 'bhubaneswar', 'thiruvananthapuram',
  ]
  const lower = text.toLowerCase()
  for (const city of indianCities) {
    if (lower.includes(city)) {
      return city.charAt(0).toUpperCase() + city.slice(1)
    }
  }
  return ''
}

function extractFoundingYear(text: string): number | null {
  const patterns = [
    /(?:founded|established|started|since|est\.?)\s*(?:in\s*)?(\d{4})/i,
    /(\d{4})\s*-\s*(?:present|now)/i,
    /©\s*(\d{4})/,
  ]
  for (const p of patterns) {
    const match = text.match(p)
    if (match) {
      const year = parseInt(match[1])
      if (year >= 2000 && year <= new Date().getFullYear()) return year
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    // Validate URL format
    try {
      new URL(normalizedUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Fetch the webpage
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    let html: string
    try {
      const response = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FirstUnicornBot/1.0)',
          Accept: 'text/html',
        },
      })
      html = await response.text()
    } catch {
      return NextResponse.json({ error: 'Could not fetch website' }, { status: 422 })
    } finally {
      clearTimeout(timeout)
    }

    // Extract text content (strip HTML)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 10000) // Limit analysis to first 10K chars

    // Extract metadata
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i)
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)/i)

    const title = titleMatch?.[1]?.trim() || ''
    const description = descriptionMatch?.[1]?.trim() || ''
    const ogTitle = ogTitleMatch?.[1]?.trim() || ''

    const allText = `${title} ${description} ${ogTitle} ${textContent}`

    // Detect fields
    const sector = detectSector(allText)
    const teamSize = extractTeamSize(allText)
    const city = extractCity(allText)
    const foundingYear = extractFoundingYear(allText)

    // Extract company name from title or og:title
    let companyName = ogTitle || title
    // Remove common suffixes
    companyName = companyName
      .replace(/\s*[-|–—]\s*.*/g, '')
      .replace(/\s*\(.*?\)/g, '')
      .trim()

    return NextResponse.json({
      success: true,
      data: {
        company_name: companyName || null,
        sector: sector !== 'other' ? sector : null,
        city: city || null,
        founding_year: foundingYear,
        team_size: teamSize,
        description: description.slice(0, 200) || null,
      },
    })
  } catch (err) {
    console.error('Analyze URL error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
