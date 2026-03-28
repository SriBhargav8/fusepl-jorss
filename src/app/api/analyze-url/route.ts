import { NextRequest, NextResponse } from 'next/server'

// Sector detection keywords — maps to StartupCategory values
const SECTOR_KEYWORDS: Record<string, string[]> = {
  // Fintech
  fintech_payments: ['payment', 'upi', 'wallet', 'razorpay', 'paytm', 'cashfree', 'stripe'],
  fintech_insurance: ['insurance', 'insurtech', 'policy', 'claim', 'underwriting'],
  fintech_banking: ['bank', 'neobank', 'account', 'deposit', 'savings', 'banking'],
  fintech_lending: ['lending', 'bnpl', 'credit', 'loan', 'nbfc', 'microfinance'],
  fintech_wealthtech: ['wealth', 'advisory', 'invest', 'portfolio', 'mutual fund', 'robo-advisor', 'trading'],
  fintech_accounting: ['accounting', 'invoicing', 'gst', 'bookkeeping', 'tally'],
  fintech_credit_scoring: ['credit score', 'underwriting', 'risk analytics', 'bureau'],
  fintech_remittance: ['remittance', 'forex', 'cross-border', 'international transfer'],
  fintech_embedded: ['embedded finance', 'banking as a service', 'baas'],
  fintech_neobroking: ['broking', 'stock trading', 'zerodha', 'demat', 'broker'],
  fintech_regtech: ['regtech', 'kyc', 'aml', 'compliance automation'],
  fintech_open_banking: ['open banking', 'account aggregat', 'aa framework'],
  fintech_microfinance: ['microfinance', 'shg', 'rural credit', 'micro-lending'],
  fintech_collections: ['collection', 'debt recovery', 'npa', 'recovery'],
  // HealthTech
  healthtech_products: ['medical device', 'diagnostic', 'medtech', 'health device'],
  healthtech_services: ['telemedicine', 'hospital', 'doctor', 'healthcare platform'],
  healthtech_mental: ['mental health', 'therapy', 'counseling', 'psycholog', 'mindful'],
  healthtech_fitness: ['fitness', 'wellness', 'gym', 'workout', 'yoga'],
  healthtech_pharma: ['pharmacy', 'medicine delivery', 'drug', 'e-pharmacy'],
  healthtech_genomics: ['genomics', 'genetic testing', 'dna', 'precision medicine'],
  healthtech_hospital_mgmt: ['hospital management', 'hms', 'opd', 'ipd', 'clinic management'],
  healthtech_elderly: ['elderly', 'senior care', 'geriatric', 'old age'],
  healthtech_fertility: ['fertility', 'ivf', 'reproductive', 'pregnancy'],
  healthtech_diagnostics: ['diagnostic lab', 'pathology', 'imaging', 'radiology', 'blood test'],
  // EdTech
  edtech_k12: ['school', 'k-12', 'k12', 'cbse', 'icse', 'student'],
  edtech_higher_ed: ['university', 'college', 'degree', 'mooc', 'higher education'],
  edtech_test_prep: ['test prep', 'jee', 'neet', 'upsc', 'cat prep', 'coaching'],
  edtech_upskilling: ['upskilling', 'reskilling', 'professional course', 'skill development'],
  edtech_language: ['language learning', 'english', 'vernacular', 'translation'],
  edtech_coding: ['coding', 'bootcamp', 'stem', 'programming', 'whitehat'],
  edtech_corporate: ['corporate training', 'lms', 'l&d', 'employee training'],
  edtech_early_childhood: ['preschool', 'early learning', 'montessori', 'nursery'],
  edtech_study_abroad: ['study abroad', 'overseas education', 'visa', 'university admission'],
  // E-Commerce
  ecommerce_general: ['shop', 'store', 'ecommerce', 'buy online', 'cart'],
  ecommerce_grocery: ['grocery', 'quick commerce', 'instant delivery', 'dark store', 'blinkit'],
  ecommerce_fashion: ['fashion', 'apparel', 'clothing', 'accessories', 'jewellery'],
  ecommerce_electronics: ['electronics', 'gadget', 'mobile phone', 'laptop', 'refurbished'],
  ecommerce_luxury: ['luxury', 'premium brand', 'designer', 'authenticated'],
  ecommerce_beauty: ['beauty', 'cosmetic', 'skincare', 'makeup', 'personal care'],
  ecommerce_furniture: ['furniture', 'home decor', 'interior', 'furnishing'],
  ecommerce_b2b: ['b2b marketplace', 'wholesale', 'industrial procurement', 'indiamart'],
  ecommerce_recommerce: ['resale', 'refurbished', 'second hand', 'pre-owned', 'recommerce'],
  // SaaS
  saas_horizontal: ['saas', 'crm', 'erp', 'project management', 'productivity'],
  saas_vertical: ['vertical saas', 'industry specific', 'niche saas'],
  saas_devtools: ['developer tool', 'ci/cd', 'devops', 'api platform', 'sdk'],
  saas_martech: ['marketing automation', 'email marketing', 'seo tool', 'martech'],
  saas_salestech: ['sales enablement', 'revenue intelligence', 'salestech'],
  saas_collaboration: ['collaboration', 'team', 'whiteboard', 'workspace'],
  saas_security: ['cloud security', 'iam', 'compliance saas', 'security saas'],
  saas_analytics: ['analytics', 'business intelligence', 'dashboard', 'data visualization'],
  saas_nocode: ['no-code', 'low-code', 'nocode', 'workflow automation', 'app builder'],
  saas_communication: ['cpaas', 'messaging api', 'notification', 'communication platform'],
  // FoodTech
  foodtech_delivery: ['food delivery', 'swiggy', 'zomato', 'food order'],
  foodtech_cloud_kitchen: ['cloud kitchen', 'ghost kitchen', 'virtual restaurant'],
  foodtech_processing: ['food processing', 'food manufacturing', 'packaged food'],
  foodtech_beverages: ['beverage', 'craft drink', 'juice', 'kombucha', 'coffee'],
  foodtech_nutrition: ['nutrition', 'supplement', 'health food', 'protein', 'superfood'],
  foodtech_restaurant: ['restaurant management', 'table booking', 'kitchen os', 'pos restaurant'],
  // Logistics
  logistics_last_mile: ['last mile', 'courier', 'hyperlocal delivery', 'delhivery'],
  logistics_warehousing: ['warehouse', 'fulfillment', 'inventory management'],
  logistics_cold_chain: ['cold chain', 'cold storage', 'temperature controlled'],
  logistics_freight: ['freight', 'trucking', 'full truck', 'ftl', 'ptl'],
  logistics_reverse: ['reverse logistics', 'returns management', 'reverse supply'],
  logistics_3pl: ['3pl', 'third party logistics', 'supply chain orchestration'],
  // CleanTech
  cleantech_solar: ['solar', 'rooftop solar', 'solar panel', 'photovoltaic'],
  cleantech_ev: ['ev charging', 'battery swapping', 'charging station', 'electric vehicle infra'],
  cleantech_battery: ['battery', 'energy storage', 'solid state', 'lithium'],
  cleantech_waste: ['waste management', 'recycling', 'waste-to-energy', 'sewage'],
  cleantech_carbon: ['carbon credit', 'carbon capture', 'carbon offset', 'climate'],
  cleantech_water: ['water purification', 'wastewater', 'water management', 'desalination'],
  cleantech_hydrogen: ['hydrogen', 'fuel cell', 'electrolyzer', 'green hydrogen'],
  cleantech_biomass: ['biomass', 'biofuel', 'biogas', 'bioenergy', 'pellet'],
  // AI/ML
  ai_conversational: ['chatbot', 'voice assistant', 'conversational ai', 'virtual assistant'],
  ai_computer_vision: ['computer vision', 'image recognition', 'video analytics', 'ocr'],
  ai_genai: ['generative ai', 'llm', 'large language', 'gpt', 'genai', 'copilot'],
  ai_data_analytics: ['ai analytics', 'predictive', 'data platform', 'data science'],
  ai_mlops: ['mlops', 'ml pipeline', 'model deployment', 'experiment tracking'],
  ai_enterprise: ['enterprise ai', 'ai automation', 'decision intelligence'],
  // DeepTech
  deeptech_robotics: ['robot', 'autonomous', 'drone delivery', 'service robot'],
  deeptech_quantum: ['quantum', 'qubit', 'quantum computing', 'quantum algorithm'],
  deeptech_semiconductor: ['semiconductor', 'chip', 'vlsi', 'fabless', 'risc-v'],
  deeptech_iot: ['iot', 'connected device', 'edge computing', 'sensor network'],
  deeptech_ar_vr: ['augmented reality', 'virtual reality', 'mixed reality', 'metaverse', 'xr'],
  deeptech_nanotech: ['nanotechnology', 'nanomaterial', 'nano-medicine'],
  // AgriTech
  agritech_precision: ['precision agriculture', 'farm sensor', 'crop monitoring', 'smart farm'],
  agritech_marketplace: ['farm to fork', 'mandi', 'agri marketplace', 'farm produce'],
  agritech_input: ['seed', 'fertilizer', 'crop advisory', 'agri input'],
  agritech_post_harvest: ['cold storage', 'post harvest', 'grain storage', 'food supply chain'],
  agritech_dairy: ['dairy', 'cattle', 'livestock', 'aquaculture', 'poultry'],
  // PropTech
  proptech_rental: ['rental', 'tenant', 'pg', 'paying guest', 'housing'],
  proptech_construction: ['construction management', 'bim', 'site monitoring', 'concrete'],
  proptech_coworking: ['coworking', 'flexible office', 'managed office', 'shared workspace'],
  proptech_facility: ['facility management', 'building automation', 'maintenance'],
  proptech_commercial: ['commercial real estate', 'office space', 'cre', 'leasing'],
  // Auto
  auto_ev: ['electric vehicle', 'ev manufacturer', 'electric scooter', 'electric bike', 'ola electric'],
  auto_fleet: ['fleet management', 'telematics', 'fleet tracking', 'fleet optimization'],
  auto_ride_hailing: ['ride sharing', 'ride hailing', 'cab', 'ola', 'uber', 'micro-mobility'],
  auto_parts: ['auto parts', 'car service', 'aftermarket', 'vehicle repair'],
  auto_connected: ['connected car', 'adas', 'v2x', 'vehicle intelligence'],
  // Media
  media_ott: ['streaming', 'ott', 'video platform', 'audio stream', 'netflix'],
  media_creator: ['creator', 'influencer', 'fan engagement', 'creator economy'],
  media_adtech: ['programmatic', 'ad network', 'attribution', 'advertising tech'],
  media_news: ['digital news', 'content aggregat', 'media tech', 'journalism'],
  media_podcast: ['podcast', 'audio content', 'vernacular audio'],
  // Gaming
  gaming_mobile: ['mobile game', 'hyper casual', 'game studio'],
  gaming_esports: ['esport', 'tournament', 'competitive gaming'],
  gaming_fantasy: ['fantasy sport', 'dream11', 'prediction', 'skill-based gaming'],
  gaming_casual: ['casual game', 'social gaming', 'puzzle game', 'board game'],
  // Travel
  travel_booking: ['travel booking', 'flight', 'hotel booking', 'ota', 'makemytrip'],
  travel_experiences: ['activity booking', 'tour', 'local experience', 'adventure'],
  travel_homestay: ['homestay', 'vacation rental', 'airbnb', 'staycation'],
  travel_business: ['business travel', 'corporate travel', 'expense management'],
  // Manufacturing
  manufacturing_3d: ['3d printing', 'additive manufacturing', 'rapid prototyping'],
  manufacturing_smart: ['smart factory', 'industry 4.0', 'industrial automation'],
  manufacturing_textile: ['textile', 'garment', 'fabric', 'weaving'],
  manufacturing_chemical: ['chemical', 'specialty chemical', 'formulation'],
  manufacturing_electronics: ['electronics manufacturing', 'pcb', 'ems', 'contract manufacturing'],
  // B2B
  b2b_staffing: ['staffing', 'temp workforce', 'blue collar', 'manpower'],
  b2b_consulting: ['consulting', 'fractional cxo', 'advisory platform'],
  b2b_procurement: ['procurement', 'vendor management', 'sourcing platform'],
  b2b_accounting: ['bookkeeping', 'cfo service', 'accounting platform'],
  b2b_outsourcing: ['bpo', 'outsourcing', 'managed service', 'kpo'],
  // LegalTech
  legaltech_contracts: ['contract management', 'clm', 'e-signature', 'legal doc'],
  legaltech_compliance: ['regulatory compliance', 'audit tool', 'policy management'],
  legaltech_dispute: ['dispute resolution', 'arbitration', 'legal ai', 'court tech'],
  // HRTech
  hrtech_recruitment: ['recruitment', 'ats', 'hiring', 'job platform', 'talent acquisition'],
  hrtech_payroll: ['payroll', 'benefits', 'pf', 'esi', 'compensation'],
  hrtech_engagement: ['employee engagement', 'reward', 'culture platform', 'recognition'],
  hrtech_gig: ['gig economy', 'freelancer', 'gig platform', 'independent contractor'],
  // Cybersecurity
  cybersecurity_identity: ['identity', 'authentication', 'sso', 'iam', 'biometric'],
  cybersecurity_threat: ['threat intelligence', 'siem', 'endpoint security', 'soc'],
  cybersecurity_cloud_sec: ['cloud security', 'casb', 'container security', 'devsecops'],
  // Web3
  web3_defi: ['defi', 'decentralized finance', 'dex', 'yield', 'staking'],
  web3_nft: ['nft', 'digital collectible', 'tokeniz', 'non-fungible'],
  web3_infra: ['blockchain infra', 'node', 'cross-chain', 'layer 2', 'web3 wallet'],
  web3_dao: ['dao', 'governance', 'community treasury', 'decentralized organization'],
  // SpaceTech
  spacetech_satellite: ['satellite', 'small sat', 'satellite imagery', 'earth observation'],
  spacetech_launch: ['launch vehicle', 'rocket', 'propulsion', 'orbital'],
  spacetech_data: ['geospatial', 'space data', 'remote sensing'],
  // BioTech
  biotech_pharma: ['drug discovery', 'novel molecule', 'pharma r&d', 'therapeutic'],
  biotech_genomics: ['genomics', 'gene therapy', 'crispr', 'genetic engineering'],
  biotech_clinical: ['clinical trial', 'patient recruitment', 'cro', 'biomarker'],
  biotech_agri: ['crop biotech', 'bio-pesticide', 'seed innovation', 'bio-fertilizer'],
  // Drone
  drone_commercial: ['drone', 'commercial uav', 'drone service', 'aerial survey'],
  drone_defense: ['defense drone', 'military uav', 'counter-drone', 'defense tech'],
  // Retail
  retail_pos: ['pos', 'point of sale', 'billing software', 'retail management'],
  retail_analytics: ['retail analytics', 'demand forecast', 'shelf intelligence', 'footfall'],
  retail_omnichannel: ['omnichannel', 'o2o', 'unified commerce', 'online to offline'],
  // SportsTech
  sportstech_analytics: ['sports analytics', 'performance tracking', 'team analytics'],
  sportstech_fitness: ['fitness app', 'gym management', 'home fitness', 'cult.fit'],
  sportstech_wearables: ['fitness wearable', 'smart watch', 'performance tracker'],
  // Standalone
  pet_care: ['pet', 'animal', 'veterinary', 'vet', 'dog', 'cat'],
  social_impact: ['social impact', 'ngo', 'non-profit', 'impact invest', 'sustainability'],
  telecom: ['telecom', 'isp', 'broadband', 'connectivity', 'network provider'],
  wedding_tech: ['wedding', 'shaadi', 'matrimony', 'venue booking', 'wedding plan'],
  beauty_tech: ['beauty tech', 'ar try-on', 'salon', 'spa management'],
  govtech: ['government', 'civic tech', 'public sector', 'e-governance'],
  event_tech: ['event management', 'ticketing', 'virtual event', 'conference'],
  home_services: ['home service', 'plumbing', 'cleaning', 'repair', 'urban company'],
  personal_finance: ['budgeting', 'expense tracking', 'financial literacy', 'money management'],
  circular_economy: ['circular economy', 'upcycling', 'sustainable commerce'],
  eldercare: ['elder care', 'senior living', 'assisted living'],
  childcare: ['childcare', 'daycare', 'parenting', 'babysitting'],
  marketplace: ['marketplace', 'aggregator', 'two-sided', 'platform connect'],
  insurance_distribution: ['insurance aggregat', 'policy compar', 'insurance marketplace'],
}

// Well-known Indian startup domain → sector mappings
const KNOWN_DOMAINS: Record<string, string> = {
  'razorpay.com': 'fintech_payments', 'paytm.com': 'fintech_payments', 'cashfree.com': 'fintech_payments',
  'zerodha.com': 'fintech_neobroking', 'groww.in': 'fintech_neobroking', 'upstox.com': 'fintech_neobroking',
  'cred.club': 'fintech_payments', 'bharatpe.com': 'fintech_payments', 'phonepe.com': 'fintech_payments',
  'zomato.com': 'foodtech_delivery', 'swiggy.com': 'foodtech_delivery', 'blinkit.com': 'ecommerce_grocery',
  'flipkart.com': 'ecommerce_general', 'meesho.com': 'ecommerce_general', 'myntra.com': 'ecommerce_fashion',
  'nykaa.com': 'ecommerce_beauty', 'purplle.com': 'ecommerce_beauty', 'mamaearth.in': 'ecommerce_beauty',
  'freshworks.com': 'saas_horizontal', 'zoho.com': 'saas_horizontal', 'browserstack.com': 'saas_devtools',
  'postman.com': 'saas_devtools', 'darwinbox.com': 'hrtech_recruitment', 'leadsquared.com': 'saas_horizontal',
  'byju.com': 'edtech_k12', 'byjus.com': 'edtech_k12', 'unacademy.com': 'edtech_test_prep',
  'physicswallah.in': 'edtech_test_prep', 'upgrad.com': 'edtech_upskilling', 'scaler.com': 'edtech_coding',
  'ola.com': 'auto_ev', 'olaelectric.com': 'auto_ev', 'ather.in': 'auto_ev',
  'delhivery.com': 'logistics_last_mile', 'dunzo.com': 'logistics_last_mile',
  'urbancompany.com': 'marketplace', 'zetwerk.com': 'marketplace',
  'dream11.com': 'gaming_mobile', 'mpl.live': 'gaming_mobile',
  'practo.com': 'healthtech_services', 'pharmeasy.in': 'healthtech_pharma',
  'oyo.com': 'travel_booking', 'oyorooms.com': 'travel_booking', 'makemytrip.com': 'travel_booking',
  'lenskart.com': 'ecommerce_beauty', 'sharechat.com': 'social_impact',
}

function detectSector(text: string, hostname?: string): string {
  // Check known domains first
  if (hostname) {
    const domain = hostname.replace(/^www\./, '')
    if (KNOWN_DOMAINS[domain]) return KNOWN_DOMAINS[domain]
  }

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
    'surat', 'vadodara', 'mysore', 'mangalore', 'patna', 'ranchi',
    'bhopal', 'dehradun', 'agra', 'varanasi', 'jodhpur', 'udaipur',
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
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('[analyze-url] JSON parse failed:', e);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Validate URL format and presence of a dot in hostname
    let urlObj: URL;
    try {
      urlObj = new URL(normalizedUrl);
      if (!urlObj.hostname.includes('.')) {
        throw new Error('No TLD');
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format. Please provide a full domain (e.g., example.com).' }, { status: 400 });
    }

    // Try to extract from URL itself first
    const urlText = `${urlObj.hostname} ${urlObj.pathname}`.replace(/[/\-_.]/g, ' ');

    // Attempt to fetch the webpage — fail gracefully
    let html = '';
    let fetchSucceeded = false;
    let finalUrl = normalizedUrl;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        redirect: 'follow',
      });

      clearTimeout(timeout);

      if (response.ok) {
        finalUrl = response.url;
        // Check content type
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          // Read chunk by chunk or limit size to avoid memory issues
          html = await response.text();
          if (html.length > 500000) { // 500KB limit for safety
            html = html.slice(0, 500000);
          }
          fetchSucceeded = true;
        } else {
          console.log(`[analyze-url] Non-HTML content: ${contentType}`);
        }
      } else {
        console.log(`[analyze-url] Fetch failed with status: ${response.status}`);
      }
    } catch (fetchErr: any) {
      console.error(`[analyze-url] Fetch attempt failed for ${normalizedUrl}:`, fetchErr.message || fetchErr);
      // Fail gracefully — we'll use URL text fallback
    }

    // Extract text content (strip HTML)
    let textContent = '';
    let title = '';
    let description = '';
    let ogTitle = '';

    if (fetchSucceeded && html) {
      try {
        // Safe regex extraction
        title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
        description = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i)?.[1]?.trim() || '';
        ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)/i)?.[1]?.trim() || '';
        
        // Clean text content safely
        textContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 5000); // 5KB of text is plenty for sector detection
      } catch (parseErr) {
        console.error('[analyze-url] HTML parse error:', parseErr);
      }
    }

    // Combine all available text
    const allText = `${urlText} ${title} ${ogTitle} ${description} ${textContent}`;

    // Detect fields
    const sector = detectSector(allText, new URL(finalUrl).hostname);
    const teamSize = fetchSucceeded ? extractTeamSize(allText) : null;
    const city = extractCity(allText);
    const foundingYear = fetchSucceeded ? extractFoundingYear(allText) : null;

    // Extract company name
    let companyName = ogTitle || title;
    if (companyName) {
      companyName = companyName
        .replace(/\s*[-|–—]\s*.*/g, '')
        .replace(/\s*\(.*?\)/g, '')
        .trim();
    }

    // Fallback: derive company name from domain
    if (!companyName) {
      try {
        const domainParts = new URL(finalUrl).hostname.replace(/^www\./, '').split('.');
        if (domainParts.length > 0) {
          const raw = domainParts[0];
          companyName = raw.charAt(0).toUpperCase() + raw.slice(1);
        }
      } catch {
        companyName = 'New Startup';
      }
    }

    const hasHighQualityData = !!(ogTitle || title);
    const hasAnyData = hasHighQualityData || (sector && sector !== 'other') || city;

    // Only return success if we actually reached the site OR if we got high-quality metadata from the URL (rare)
    if (!fetchSucceeded && !hasHighQualityData) {
      return NextResponse.json({ 
        error: 'Website unreachable. Please fill manually.',
        hint: 'We could not reach the website to extract data. You can still fill the form below.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      partial: !fetchSucceeded,
      data: {
        company_name: companyName || null,
        sector: sector !== 'other' ? sector : null,
        city: city || null,
        founding_year: foundingYear,
        team_size: teamSize,
        description: description.slice(0, 200) || null,
      },
      ...((!fetchSucceeded && hasAnyData) ? { note: 'Website was unreachable, but we detected some fields from the URL.' } : {}),
      ...(!hasAnyData ? { note: 'Could not detect fields. Please fill manually.' } : {}),
    });
  } catch (err: any) {
    console.error('[analyze-url] Critical failure:', err);
    return NextResponse.json({ error: 'Server error during analysis' }, { status: 500 });
  }
}
