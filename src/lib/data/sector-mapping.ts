import type { StartupCategory, SectorMapping, DamodaranBenchmark } from '@/types'
import damodaranRaw from '../../../public/data/damodaran/india-benchmarks.json'

const damodaranData = damodaranRaw as Record<string, DamodaranBenchmark>

export const SECTOR_MAPPING: Record<StartupCategory, SectorMapping> = {
  saas: {
    label: 'SaaS / Enterprise Software',
    description: 'B2B software, subscriptions, cloud tools',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['fintech_payments', 'marketplace'],
  },
  fintech_payments: {
    label: 'Fintech — Payments & Lending',
    description: 'Payment gateways, BNPL, digital lending',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['saas', 'ecommerce_general'],
  },
  fintech_insurance: {
    label: 'Fintech — Insurance & Wealth',
    description: 'InsurTech, WealthTech, robo-advisory',
    primary_damodaran: 'Insurance (General)',
    secondary_damodaran: 'Investments & Asset Management',
    adjacent_sectors: ['fintech_payments', 'fintech_banking'],
  },
  fintech_banking: {
    label: 'Fintech — Banking & Neo-Banks',
    description: 'Digital banking, account aggregators',
    primary_damodaran: 'Banks (Regional)',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_payments', 'fintech_insurance'],
  },
  d2c: {
    label: 'D2C / Consumer Brands',
    description: 'Direct brands, FMCG, beauty, fashion',
    primary_damodaran: 'Household Products',
    secondary_damodaran: 'Retail (Special Lines)',
    adjacent_sectors: ['ecommerce_general', 'marketplace'],
  },
  edtech: {
    label: 'EdTech',
    description: 'Online learning, skill platforms, test prep',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['healthtech_services', 'saas'],
  },
  healthtech_products: {
    label: 'HealthTech — Products & Devices',
    description: 'MedTech, diagnostics, health devices',
    primary_damodaran: 'Healthcare Products',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['healthtech_services', 'd2c'],
  },
  healthtech_services: {
    label: 'HealthTech — Services & Platforms',
    description: 'Telemedicine, hospital tech, pharmacy',
    primary_damodaran: 'Healthcare Support Services',
    secondary_damodaran: 'Hospitals/Healthcare Facilities',
    adjacent_sectors: ['edtech', 'healthtech_products'],
  },
  ecommerce_general: {
    label: 'E-commerce — General',
    description: 'Online retail, quick commerce',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['d2c', 'marketplace', 'logistics'],
  },
  ecommerce_grocery: {
    label: 'E-commerce — Grocery & Food',
    description: 'Online grocery, food delivery',
    primary_damodaran: 'Food Wholesalers',
    secondary_damodaran: 'Retail (Grocery and Food)',
    adjacent_sectors: ['ecommerce_general', 'logistics'],
  },
  marketplace: {
    label: 'Marketplace / Platform',
    description: 'Two-sided platforms, aggregators',
    primary_damodaran: 'Information Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['saas', 'ecommerce_general', 'd2c'],
  },
  agritech: {
    label: 'AgriTech',
    description: 'Farm-to-fork, precision agriculture',
    primary_damodaran: 'Farming/Agriculture',
    secondary_damodaran: 'Food Processing',
    adjacent_sectors: ['logistics', 'cleantech'],
  },
  logistics: {
    label: 'Logistics & Supply Chain',
    description: 'Last-mile, warehousing, fleet tech',
    primary_damodaran: 'Transportation',
    secondary_damodaran: 'Trucking',
    adjacent_sectors: ['ecommerce_general', 'agritech'],
  },
  cleantech: {
    label: 'CleanTech / Green Energy',
    description: 'Solar, EV, carbon tech, renewables',
    primary_damodaran: 'Green & Renewable Energy',
    secondary_damodaran: 'Power',
    adjacent_sectors: ['agritech', 'logistics'],
  },
  deeptech: {
    label: 'DeepTech / AI-ML',
    description: 'AI products, robotics, computer vision',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['saas', 'healthtech_products'],
  },
  gaming: {
    label: 'Gaming & Entertainment',
    description: 'Gaming studios, OTT, content',
    primary_damodaran: 'Software (Entertainment)',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['media_advertising', 'edtech'],
  },
  real_estate_tech: {
    label: 'Real Estate Tech',
    description: 'PropTech, construction tech',
    primary_damodaran: 'Real Estate (Operations & Services)',
    secondary_damodaran: 'Real Estate (Development)',
    adjacent_sectors: ['manufacturing', 'b2b_services'],
  },
  auto_mobility: {
    label: 'Auto / Mobility',
    description: 'EV, ride-sharing, fleet management',
    primary_damodaran: 'Auto & Truck',
    secondary_damodaran: 'Auto Parts',
    adjacent_sectors: ['logistics', 'cleantech'],
  },
  manufacturing: {
    label: 'Manufacturing / Industrial',
    description: 'Smart factory, industrial IoT',
    primary_damodaran: 'Machinery',
    secondary_damodaran: 'Engineering/Construction',
    adjacent_sectors: ['deeptech', 'auto_mobility'],
  },
  media_advertising: {
    label: 'Media & Advertising',
    description: 'AdTech, content marketing, publishing',
    primary_damodaran: 'Publishing & Newspapers',
    secondary_damodaran: 'Broadcasting',
    adjacent_sectors: ['gaming', 'saas'],
  },
  telecom: {
    label: 'Telecom & Connectivity',
    description: 'Telecom services, ISP, IoT connectivity',
    primary_damodaran: 'Telecom Services',
    secondary_damodaran: 'Telecom Equipment',
    adjacent_sectors: ['deeptech', 'b2b_services'],
  },
  travel_hospitality: {
    label: 'Travel & Hospitality',
    description: 'Travel booking, hotel tech, tourism',
    primary_damodaran: 'Hotel/Gaming',
    secondary_damodaran: 'Recreation',
    adjacent_sectors: ['marketplace', 'ecommerce_general'],
  },
  social_impact: {
    label: 'Social Impact / Non-Profit Tech',
    description: 'Impact investing, social enterprises',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Environmental & Waste Services',
    adjacent_sectors: ['cleantech', 'edtech'],
  },
  fintech_lending: {
    label: 'Fintech — Lending & BNPL',
    description: 'Digital lending, BNPL, credit platforms',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Banks (Regional)',
    adjacent_sectors: ['fintech_payments', 'fintech_banking'],
  },
  fintech_wealthtech: {
    label: 'Fintech — WealthTech',
    description: 'Robo-advisory, investment platforms, portfolio management',
    primary_damodaran: 'Investments & Asset Management',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_insurance', 'fintech_banking'],
  },
  ecommerce_fashion: {
    label: 'E-Commerce — Fashion & Lifestyle',
    description: 'Online fashion, lifestyle brands, accessories',
    primary_damodaran: 'Retail (Special Lines)',
    secondary_damodaran: 'Apparel',
    adjacent_sectors: ['d2c', 'ecommerce_general'],
  },
  ai_ml: {
    label: 'AI / Machine Learning / GenAI',
    description: 'AI products, LLMs, ML platforms, generative AI',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['deeptech', 'saas'],
  },
  legaltech: {
    label: 'LegalTech / RegTech',
    description: 'Legal automation, compliance tools, contract management',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['b2b_services', 'saas'],
  },
  hrtech: {
    label: 'HRTech / Workforce',
    description: 'HR platforms, payroll, recruitment, workforce management',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['b2b_services', 'saas'],
  },
  foodtech: {
    label: 'FoodTech / Cloud Kitchen',
    description: 'Food delivery, cloud kitchens, food-as-a-service',
    primary_damodaran: 'Restaurant/Dining',
    secondary_damodaran: 'Food Processing',
    adjacent_sectors: ['ecommerce_grocery', 'logistics'],
  },
  spacetech: {
    label: 'SpaceTech / Aerospace',
    description: 'Satellite, launch vehicles, space data',
    primary_damodaran: 'Aerospace/Defense',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['deeptech', 'drone_tech'],
  },
  biotech: {
    label: 'BioTech / Life Sciences',
    description: 'Biotech, pharma R&D, genomics',
    primary_damodaran: 'Drugs (Biotechnology)',
    secondary_damodaran: 'Drugs (Pharmaceutical)',
    adjacent_sectors: ['healthtech_products', 'deeptech'],
  },
  cybersecurity: {
    label: 'Cybersecurity',
    description: 'Security software, threat detection, identity management',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['saas', 'deeptech'],
  },
  web3_blockchain: {
    label: 'Web3 / Blockchain / Crypto',
    description: 'Blockchain, DeFi, NFTs, crypto infrastructure',
    primary_damodaran: 'Software (Internet)',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_payments', 'deeptech'],
  },
  drone_tech: {
    label: 'Drone Tech / UAV',
    description: 'Commercial drones, drone services, UAV platforms',
    primary_damodaran: 'Aerospace/Defense',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['spacetech', 'logistics'],
  },
  retail_tech: {
    label: 'Retail Tech / POS',
    description: 'Point-of-sale, retail analytics, store technology',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Software (System & Application)',
    adjacent_sectors: ['ecommerce_general', 'saas'],
  },
  sportstech: {
    label: 'SportsTech / Fitness',
    description: 'Sports analytics, fitness apps, wearables',
    primary_damodaran: 'Recreation',
    secondary_damodaran: 'Healthcare Products',
    adjacent_sectors: ['healthtech_services', 'gaming'],
  },
  pet_care: {
    label: 'Pet Care & Animal Health',
    description: 'Pet care services, animal health, vet-tech',
    primary_damodaran: 'Healthcare Products',
    secondary_damodaran: 'Business & Consumer Services',
    adjacent_sectors: ['healthtech_services', 'd2c'],
  },
  b2b_services: {
    label: 'B2B Services',
    description: 'Consulting tech, HR tech, legal tech',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['saas', 'fintech_payments'],
  },
  other: {
    label: 'Other',
    description: 'Other industry not listed',
    primary_damodaran: 'Total Market',
    secondary_damodaran: null,
    adjacent_sectors: [],
  },
}

const FALLBACK_BENCHMARK: DamodaranBenchmark = damodaranData['Total Market'] ?? {
  ev_revenue: 3.0,
  ev_ebitda: 15.0,
  wacc: 0.12,
  beta: 1.0,
  gross_margin: 0.40,
}

export function getSectorLabel(category: StartupCategory): string {
  return SECTOR_MAPPING[category]?.label ?? 'Other'
}

export function getAdjacentSectors(category: StartupCategory): string[] {
  return SECTOR_MAPPING[category]?.adjacent_sectors ?? []
}

export function getDamodaranBenchmark(category: StartupCategory): DamodaranBenchmark {
  const mapping = SECTOR_MAPPING[category]
  if (!mapping) {
    return FALLBACK_BENCHMARK
  }

  const primary = damodaranData[mapping.primary_damodaran]

  if (!primary) {
    return FALLBACK_BENCHMARK
  }

  // If primary has null fields and secondary exists, fill from secondary
  if (mapping.secondary_damodaran) {
    const secondary = damodaranData[mapping.secondary_damodaran]
    if (secondary) {
      return {
        ev_revenue: primary.ev_revenue ?? secondary.ev_revenue,
        ev_ebitda: primary.ev_ebitda ?? secondary.ev_ebitda,
        wacc: primary.wacc ?? secondary.wacc,
        beta: primary.beta ?? secondary.beta,
        gross_margin: primary.gross_margin ?? secondary.gross_margin,
      }
    }
  }

  return primary
}
