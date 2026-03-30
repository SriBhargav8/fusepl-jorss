// Lead magnets mapped to each pillar — what subscribers get
export const LEAD_MAGNETS: Record<string, { title: string; description: string; cta: string; toolHref: string; toolLabel: string; whatsappText: string }> = {
  'valuation-finance': {
    title: 'Free Startup Valuation Toolkit',
    description: 'DCF template, WACC calculator, and Damodaran India data cheat sheet — used by 500+ founders.',
    cta: 'Get the Toolkit',
    toolHref: '/valuation',
    toolLabel: 'Run Your Free Valuation',
    whatsappText: 'Join our Valuation & Finance founders community',
  },
  'fundraising': {
    title: 'Fundraising Readiness Checklist',
    description: 'The exact 47-point checklist VCs use to evaluate startups — score yourself before you pitch.',
    cta: 'Get the Checklist',
    toolHref: '/deal-check',
    toolLabel: 'Run a Deal Check',
    whatsappText: 'Join our Fundraising founders community',
  },
  'founder-playbooks': {
    title: 'Unit Economics Calculator',
    description: 'Plug in your numbers, get LTV/CAC, payback period, and gross margin — with Indian benchmarks built in.',
    cta: 'Get the Calculator',
    toolHref: '/valuation',
    toolLabel: 'Value Your Startup',
    whatsappText: 'Join our Founder Playbooks community',
  },
  'startup-stories': {
    title: 'Indian Startup Case Study Pack',
    description: '10 detailed breakdowns of how Indian unicorns raised, priced, and scaled — with valuation data.',
    cta: 'Get the Case Studies',
    toolHref: '/valuation',
    toolLabel: 'Value Your Startup',
    whatsappText: 'Join our Startup Stories community',
  },
  'equity': {
    title: 'Cap Table Modeling Template',
    description: 'Pre-built cap table with dilution modeling for Seed through Series C — used by 200+ Indian startups.',
    cta: 'Get the Template',
    toolHref: '/cap-table',
    toolLabel: 'Model Your Cap Table',
    whatsappText: 'Join our Equity & ESOP community',
  },
  'investor-intelligence': {
    title: 'India VC Database',
    description: '150+ active Indian VCs with sector focus, check size, and portfolio — updated quarterly.',
    cta: 'Get the Database',
    toolHref: '/deal-check',
    toolLabel: 'Check Your Deal',
    whatsappText: 'Join our Investor Intelligence community',
  },
  'sectors': {
    title: 'Sector Benchmarks Pack',
    description: 'Revenue multiples, growth rates, and valuation benchmarks for 27 Indian startup verticals.',
    cta: 'Get Benchmarks',
    toolHref: '/valuation',
    toolLabel: 'Value Your Startup',
    whatsappText: 'Join our Sector Analysis community',
  },
  'startup-india': {
    title: 'Government Schemes Navigator',
    description: 'Complete guide to 50+ central and state startup schemes with eligibility criteria and application links.',
    cta: 'Get the Guide',
    toolHref: '/valuation',
    toolLabel: 'Value Your Startup',
    whatsappText: 'Join our Startup India community',
  },
  'awards': {
    title: 'Award Application Toolkit',
    description: 'Templates, timelines, and tips for winning top Indian startup awards — from someone who\'s judged them.',
    cta: 'Get the Toolkit',
    toolHref: '/valuation',
    toolLabel: 'Value Your Startup',
    whatsappText: 'Join our Awards community',
  },
  'tools-frameworks': {
    title: 'Founder Decision Framework Pack',
    description: '12 decision frameworks for pricing, hiring, fundraising, and pivoting — printable one-pagers.',
    cta: 'Get the Frameworks',
    toolHref: '/valuation',
    toolLabel: 'Value Your Startup',
    whatsappText: 'Join our Tools & Frameworks community',
  },
}

export function getLeadMagnet(pillar: string) {
  return LEAD_MAGNETS[pillar] || LEAD_MAGNETS['valuation-finance']
}

// WhatsApp community link — update when ready
export const WHATSAPP_COMMUNITY_LINK = 'https://wa.me/919667744073?text=Hi%20FirstUnicorn%2C%20I%27m%20exploring%20your%20platform%20and%20have%20a%20question%20about...'

// Expert call booking link — update when ready
export const EXPERT_CALL_LINK = 'https://wa.me/919667744073?text=Hi%20FirstUnicorn%2C%20I%27m%20exploring%20your%20platform%20and%20have%20a%20question%20about...'
