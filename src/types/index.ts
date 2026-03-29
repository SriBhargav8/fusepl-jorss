// ============================================================
// Enumerations
// ============================================================

export const STARTUP_CATEGORIES = [
  // Fintech (14)
  'fintech_payments', 'fintech_insurance', 'fintech_banking', 'fintech_lending',
  'fintech_wealthtech', 'fintech_accounting', 'fintech_credit_scoring', 'fintech_remittance',
  'fintech_embedded', 'fintech_neobroking', 'fintech_regtech', 'fintech_open_banking',
  'fintech_microfinance', 'fintech_collections',
  // HealthTech (10)
  'healthtech_products', 'healthtech_services', 'healthtech_mental', 'healthtech_fitness',
  'healthtech_pharma', 'healthtech_genomics', 'healthtech_hospital_mgmt', 'healthtech_elderly',
  'healthtech_fertility', 'healthtech_diagnostics',
  // EdTech (9)
  'edtech_k12', 'edtech_higher_ed', 'edtech_test_prep', 'edtech_upskilling',
  'edtech_language', 'edtech_coding', 'edtech_corporate', 'edtech_early_childhood',
  'edtech_study_abroad',
  // E-Commerce (9)
  'ecommerce_general', 'ecommerce_grocery', 'ecommerce_fashion', 'ecommerce_electronics',
  'ecommerce_luxury', 'ecommerce_beauty', 'ecommerce_furniture', 'ecommerce_b2b',
  'ecommerce_recommerce',
  // SaaS (10)
  'saas_horizontal', 'saas_vertical', 'saas_devtools', 'saas_martech', 'saas_salestech',
  'saas_collaboration', 'saas_security', 'saas_analytics', 'saas_nocode', 'saas_communication',
  // FoodTech (6)
  'foodtech_delivery', 'foodtech_cloud_kitchen', 'foodtech_processing', 'foodtech_beverages',
  'foodtech_nutrition', 'foodtech_restaurant',
  // Logistics (6)
  'logistics_last_mile', 'logistics_warehousing', 'logistics_cold_chain', 'logistics_freight',
  'logistics_reverse', 'logistics_3pl',
  // CleanTech (8)
  'cleantech_solar', 'cleantech_ev', 'cleantech_battery', 'cleantech_waste',
  'cleantech_carbon', 'cleantech_water', 'cleantech_hydrogen', 'cleantech_biomass',
  // AI/ML (6)
  'ai_conversational', 'ai_computer_vision', 'ai_genai', 'ai_data_analytics',
  'ai_mlops', 'ai_enterprise',
  // DeepTech (6)
  'deeptech_robotics', 'deeptech_quantum', 'deeptech_semiconductor', 'deeptech_iot',
  'deeptech_ar_vr', 'deeptech_nanotech',
  // AgriTech (5)
  'agritech_precision', 'agritech_marketplace', 'agritech_input', 'agritech_post_harvest',
  'agritech_dairy',
  // PropTech (5)
  'proptech_rental', 'proptech_construction', 'proptech_coworking', 'proptech_facility',
  'proptech_commercial',
  // Auto & Mobility (5)
  'auto_ev', 'auto_fleet', 'auto_ride_hailing', 'auto_parts', 'auto_connected',
  // Media & Advertising (5)
  'media_ott', 'media_creator', 'media_adtech', 'media_news', 'media_podcast',
  // Gaming (4)
  'gaming_mobile', 'gaming_esports', 'gaming_fantasy', 'gaming_casual',
  // Travel (4)
  'travel_booking', 'travel_experiences', 'travel_homestay', 'travel_business',
  // Manufacturing (5)
  'manufacturing_3d', 'manufacturing_smart', 'manufacturing_textile',
  'manufacturing_chemical', 'manufacturing_electronics',
  // B2B Services (5)
  'b2b_staffing', 'b2b_consulting', 'b2b_procurement', 'b2b_accounting', 'b2b_outsourcing',
  // LegalTech (3)
  'legaltech_contracts', 'legaltech_compliance', 'legaltech_dispute',
  // HRTech (4)
  'hrtech_recruitment', 'hrtech_payroll', 'hrtech_engagement', 'hrtech_gig',
  // Cybersecurity (3)
  'cybersecurity_identity', 'cybersecurity_threat', 'cybersecurity_cloud_sec',
  // Web3/Blockchain (4)
  'web3_defi', 'web3_nft', 'web3_infra', 'web3_dao',
  // SpaceTech (3)
  'spacetech_satellite', 'spacetech_launch', 'spacetech_data',
  // BioTech (4)
  'biotech_pharma', 'biotech_genomics', 'biotech_clinical', 'biotech_agri',
  // Drone Tech (2)
  'drone_commercial', 'drone_defense',
  // Retail Tech (3)
  'retail_pos', 'retail_analytics', 'retail_omnichannel',
  // SportsTech (3)
  'sportstech_analytics', 'sportstech_fitness', 'sportstech_wearables',
  // Standalone (15)
  'pet_care', 'social_impact', 'telecom', 'wedding_tech', 'beauty_tech',
  'govtech', 'event_tech', 'home_services', 'personal_finance', 'circular_economy',
  'eldercare', 'childcare', 'marketplace', 'insurance_distribution', 'other',
] as const

export type StartupCategory = typeof STARTUP_CATEGORIES[number]

export const CATEGORY_LABELS: Record<StartupCategory, string> = {
  // Fintech
  fintech_payments: 'Fintech — Payments & UPI',
  fintech_insurance: 'Fintech — InsurTech',
  fintech_banking: 'Fintech — NeoBank / Digital Banking',
  fintech_lending: 'Fintech — Lending & BNPL',
  fintech_wealthtech: 'Fintech — WealthTech / Investments',
  fintech_accounting: 'Fintech — Accounting & Invoicing',
  fintech_credit_scoring: 'Fintech — Credit Scoring & Underwriting',
  fintech_remittance: 'Fintech — Remittance & Cross-Border',
  fintech_embedded: 'Fintech — Embedded Finance',
  fintech_neobroking: 'Fintech — Neo-Broking & Trading',
  fintech_regtech: 'Fintech — RegTech & Compliance',
  fintech_open_banking: 'Fintech — Open Banking & Account Aggregation',
  fintech_microfinance: 'Fintech — Microfinance & Financial Inclusion',
  fintech_collections: 'Fintech — Collections & Recovery',
  // HealthTech
  healthtech_products: 'HealthTech — MedDevices & Products',
  healthtech_services: 'HealthTech — Telemedicine & Services',
  healthtech_mental: 'HealthTech — Mental Health & Therapy',
  healthtech_fitness: 'HealthTech — Fitness & Wellness',
  healthtech_pharma: 'HealthTech — Online Pharmacy',
  healthtech_genomics: 'HealthTech — Genomics & Precision Medicine',
  healthtech_hospital_mgmt: 'HealthTech — Hospital Management & SaaS',
  healthtech_elderly: 'HealthTech — Elderly Care',
  healthtech_fertility: 'HealthTech — Fertility & Women\'s Health',
  healthtech_diagnostics: 'HealthTech — Diagnostics & Lab Tech',
  // EdTech
  edtech_k12: 'EdTech — K-12 Schools',
  edtech_higher_ed: 'EdTech — Higher Education & Online Degrees',
  edtech_test_prep: 'EdTech — Test Prep & Competitive Exams',
  edtech_upskilling: 'EdTech — Upskilling & Professional Development',
  edtech_language: 'EdTech — Language Learning',
  edtech_coding: 'EdTech — Coding & STEM',
  edtech_corporate: 'EdTech — Corporate L&D',
  edtech_early_childhood: 'EdTech — Early Childhood & Preschool',
  edtech_study_abroad: 'EdTech — Study Abroad & Immigration',
  // E-Commerce
  ecommerce_general: 'E-Commerce — General / Horizontal',
  ecommerce_grocery: 'E-Commerce — Grocery & Quick Commerce',
  ecommerce_fashion: 'E-Commerce — Fashion & Lifestyle',
  ecommerce_electronics: 'E-Commerce — Electronics & Gadgets',
  ecommerce_luxury: 'E-Commerce — Luxury & Premium',
  ecommerce_beauty: 'E-Commerce — Beauty & Personal Care',
  ecommerce_furniture: 'E-Commerce — Furniture & Home Decor',
  ecommerce_b2b: 'E-Commerce — B2B / Wholesale',
  ecommerce_recommerce: 'E-Commerce — ReCommerce & Refurbished',
  // SaaS
  saas_horizontal: 'SaaS — Horizontal / General Purpose',
  saas_vertical: 'SaaS — Vertical / Industry-Specific',
  saas_devtools: 'SaaS — Developer Tools',
  saas_martech: 'SaaS — MarTech & Growth Tools',
  saas_salestech: 'SaaS — SalesTech & CRM',
  saas_collaboration: 'SaaS — Collaboration & Productivity',
  saas_security: 'SaaS — Security & Compliance',
  saas_analytics: 'SaaS — Analytics & BI',
  saas_nocode: 'SaaS — No-Code / Low-Code',
  saas_communication: 'SaaS — Communication & CPaaS',
  // FoodTech
  foodtech_delivery: 'FoodTech — Delivery & Aggregation',
  foodtech_cloud_kitchen: 'FoodTech — Cloud Kitchen',
  foodtech_processing: 'FoodTech — Food Processing & Packaging',
  foodtech_beverages: 'FoodTech — Beverages & D2C Brands',
  foodtech_nutrition: 'FoodTech — Nutrition & Health Food',
  foodtech_restaurant: 'FoodTech — Restaurant Tech & POS',
  // Logistics
  logistics_last_mile: 'Logistics — Last Mile Delivery',
  logistics_warehousing: 'Logistics — Warehousing & Fulfilment',
  logistics_cold_chain: 'Logistics — Cold Chain',
  logistics_freight: 'Logistics — Freight & Trucking',
  logistics_reverse: 'Logistics — Reverse Logistics & Returns',
  logistics_3pl: 'Logistics — 3PL & Supply Chain',
  // CleanTech
  cleantech_solar: 'CleanTech — Solar & Renewable Energy',
  cleantech_ev: 'CleanTech — EV & Charging',
  cleantech_battery: 'CleanTech — Battery & Energy Storage',
  cleantech_waste: 'CleanTech — Waste Management & Recycling',
  cleantech_carbon: 'CleanTech — Carbon Credits & Offsetting',
  cleantech_water: 'CleanTech — Water & Purification',
  cleantech_hydrogen: 'CleanTech — Green Hydrogen',
  cleantech_biomass: 'CleanTech — Biomass & Bioenergy',
  // AI/ML
  ai_conversational: 'AI — Conversational AI & Chatbots',
  ai_computer_vision: 'AI — Computer Vision',
  ai_genai: 'AI — Generative AI / LLMs',
  ai_data_analytics: 'AI — Data Analytics & Insights',
  ai_mlops: 'AI — MLOps & Model Infrastructure',
  ai_enterprise: 'AI — Enterprise AI Solutions',
  // DeepTech
  deeptech_robotics: 'DeepTech — Robotics & Automation',
  deeptech_quantum: 'DeepTech — Quantum Computing',
  deeptech_semiconductor: 'DeepTech — Semiconductor & Chip Design',
  deeptech_iot: 'DeepTech — IoT & Edge Computing',
  deeptech_ar_vr: 'DeepTech — AR / VR / Metaverse',
  deeptech_nanotech: 'DeepTech — Nanotechnology',
  // AgriTech
  agritech_precision: 'AgriTech — Precision Farming & IoT',
  agritech_marketplace: 'AgriTech — Marketplace & Farm-to-Fork',
  agritech_input: 'AgriTech — Inputs & Seeds',
  agritech_post_harvest: 'AgriTech — Post-Harvest & Storage',
  agritech_dairy: 'AgriTech — Dairy & Animal Husbandry',
  // PropTech
  proptech_rental: 'PropTech — Rental & Brokerage',
  proptech_construction: 'PropTech — Construction Tech',
  proptech_coworking: 'PropTech — Co-Working & Managed Spaces',
  proptech_facility: 'PropTech — Facility Management',
  proptech_commercial: 'PropTech — Commercial Real Estate',
  // Auto & Mobility
  auto_ev: 'Auto — EV & Electric Mobility',
  auto_fleet: 'Auto — Fleet Management',
  auto_ride_hailing: 'Auto — Ride Hailing & Shared Mobility',
  auto_parts: 'Auto — Spare Parts & Aftermarket',
  auto_connected: 'Auto — Connected Vehicles & Telematics',
  // Media & Advertising
  media_ott: 'Media — OTT & Streaming',
  media_creator: 'Media — Creator Economy & Influencer',
  media_adtech: 'Media — AdTech & Programmatic',
  media_news: 'Media — News & Digital Publishing',
  media_podcast: 'Media — Podcast & Audio',
  // Gaming
  gaming_mobile: 'Gaming — Mobile Games',
  gaming_esports: 'Gaming — Esports & Tournaments',
  gaming_fantasy: 'Gaming — Fantasy Sports & Real Money',
  gaming_casual: 'Gaming — Casual & Social Games',
  // Travel
  travel_booking: 'Travel — Booking & OTA',
  travel_experiences: 'Travel — Experiences & Activities',
  travel_homestay: 'Travel — Homestay & Alternate Stays',
  travel_business: 'Travel — Business Travel & Expense',
  // Manufacturing
  manufacturing_3d: 'Manufacturing — 3D Printing & Additive',
  manufacturing_smart: 'Manufacturing — Smart Factory & Industry 4.0',
  manufacturing_textile: 'Manufacturing — Textile & Apparel',
  manufacturing_chemical: 'Manufacturing — Chemical & Materials',
  manufacturing_electronics: 'Manufacturing — Electronics & Assembly',
  // B2B Services
  b2b_staffing: 'B2B — Staffing & Temp Workforce',
  b2b_consulting: 'B2B — Consulting & Advisory',
  b2b_procurement: 'B2B — Procurement & Vendor Management',
  b2b_accounting: 'B2B — Accounting & Tax Filing',
  b2b_outsourcing: 'B2B — Outsourcing & BPO',
  // LegalTech
  legaltech_contracts: 'LegalTech — Contracts & CLM',
  legaltech_compliance: 'LegalTech — Compliance & Governance',
  legaltech_dispute: 'LegalTech — Dispute Resolution & ODR',
  // HRTech
  hrtech_recruitment: 'HRTech — Recruitment & ATS',
  hrtech_payroll: 'HRTech — Payroll & Benefits',
  hrtech_engagement: 'HRTech — Employee Engagement & Culture',
  hrtech_gig: 'HRTech — Gig Economy & Freelance',
  // Cybersecurity
  cybersecurity_identity: 'Cybersecurity — Identity & Access Management',
  cybersecurity_threat: 'Cybersecurity — Threat Detection & Response',
  cybersecurity_cloud_sec: 'Cybersecurity — Cloud Security',
  // Web3/Blockchain
  web3_defi: 'Web3 — DeFi & Decentralised Finance',
  web3_nft: 'Web3 — NFT & Digital Collectibles',
  web3_infra: 'Web3 — Infrastructure & Protocols',
  web3_dao: 'Web3 — DAO & Governance',
  // SpaceTech
  spacetech_satellite: 'SpaceTech — Satellite & Communication',
  spacetech_launch: 'SpaceTech — Launch Vehicles & Propulsion',
  spacetech_data: 'SpaceTech — Earth Observation & Data',
  // BioTech
  biotech_pharma: 'BioTech — Pharma & Drug Discovery',
  biotech_genomics: 'BioTech — Genomics & Diagnostics',
  biotech_clinical: 'BioTech — Clinical Trials & CRO',
  biotech_agri: 'BioTech — Agri-Biotech & Crop Science',
  // Drone Tech
  drone_commercial: 'Drone — Commercial & Industrial',
  drone_defense: 'Drone — Defense & Surveillance',
  // Retail Tech
  retail_pos: 'Retail Tech — POS & Billing',
  retail_analytics: 'Retail Tech — Analytics & Demand Forecasting',
  retail_omnichannel: 'Retail Tech — Omnichannel & D2C Enablement',
  // SportsTech
  sportstech_analytics: 'SportsTech — Analytics & Performance',
  sportstech_fitness: 'SportsTech — Fitness & Gyms',
  sportstech_wearables: 'SportsTech — Wearables & Devices',
  // Standalone
  pet_care: 'Pet Care & Animal Health',
  social_impact: 'Social Impact & NGO Tech',
  telecom: 'Telecom & Connectivity',
  wedding_tech: 'Wedding Tech & Events',
  beauty_tech: 'Beauty Tech & Cosmetics',
  govtech: 'GovTech & Civic Tech',
  event_tech: 'Event Tech & Ticketing',
  home_services: 'Home Services & Urban Company Model',
  personal_finance: 'Personal Finance & Advisory',
  circular_economy: 'Circular Economy & Sustainability',
  eldercare: 'Eldercare & Senior Living',
  childcare: 'Childcare & Parenting',
  marketplace: 'Marketplace / Aggregator',
  insurance_distribution: 'Insurance Distribution & Broking',
  other: 'Other',
}

export const STAGES = [
  'idea', 'pre_seed', 'seed', 'pre_series_a',
  'series_a', 'series_b', 'series_c_plus',
] as const

export type Stage = typeof STAGES[number]

export const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idea Stage',
  pre_seed: 'Pre-Seed',
  seed: 'Seed',
  pre_series_a: 'Pre-Series A',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c_plus: 'Series C+',
}

export const BUSINESS_MODELS = [
  'saas_subscription', 'marketplace_commission', 'ecommerce_product',
  'advertising', 'freemium', 'transaction_based', 'licensing',
  'services', 'hardware_software', 'affiliate', 'data_monetization',
  'api_as_service', 'managed_service', 'franchise', 'rental_leasing',
  'hybrid', 'other',
] as const

export type BusinessModel = typeof BUSINESS_MODELS[number]

export const BUSINESS_MODEL_LABELS: Record<BusinessModel, string> = {
  saas_subscription: 'SaaS / Subscription',
  marketplace_commission: 'Marketplace / Commission',
  ecommerce_product: 'E-Commerce / Product Sales',
  advertising: 'Advertising / AdTech',
  freemium: 'Freemium (Free + Premium)',
  transaction_based: 'Transaction Fee / Per-Use',
  licensing: 'Licensing / White-Label',
  services: 'Professional Services',
  hardware_software: 'Hardware + Software Bundle',
  affiliate: 'Affiliate / Referral',
  data_monetization: 'Data Monetization / Analytics',
  api_as_service: 'API-as-a-Service',
  managed_service: 'Managed Service / BPO',
  franchise: 'Franchise Model',
  rental_leasing: 'Rental / Leasing',
  hybrid: 'Hybrid (Multiple Revenue Streams)',
  other: 'Other',
}

export const DEV_STAGES = [
  'idea', 'prototype', 'mvp', 'beta', 'production', 'scaling',
] as const

export type DevStage = typeof DEV_STAGES[number]

export const DEV_STAGE_LABELS: Record<DevStage, string> = {
  idea: 'Idea',
  prototype: 'Prototype',
  mvp: 'MVP',
  beta: 'Beta',
  production: 'Production',
  scaling: 'Scaling',
}

export const COMPETITIVE_ADVANTAGES = [
  'network_effects', 'proprietary_tech', 'brand', 'cost_advantage',
  'switching_costs', 'regulatory', 'data_moat', 'first_mover',
  'exclusive_partnerships', 'patents_ip', 'distribution', 'community',
  'vertical_integration', 'none',
] as const

export type CompetitiveAdvantage = typeof COMPETITIVE_ADVANTAGES[number]

export const COMPETITIVE_ADVANTAGE_LABELS: Record<CompetitiveAdvantage, string> = {
  network_effects: 'Network Effects',
  proprietary_tech: 'Proprietary Technology / Trade Secrets',
  brand: 'Strong Brand Recognition',
  cost_advantage: 'Cost / Unit Economics Advantage',
  switching_costs: 'High Switching Costs / Lock-in',
  regulatory: 'Regulatory Moat / Licenses',
  data_moat: 'Data Moat / Unique Dataset',
  first_mover: 'First Mover Advantage',
  exclusive_partnerships: 'Exclusive Partnerships / Contracts',
  patents_ip: 'Patents / Registered IP',
  distribution: 'Superior Distribution / Channel',
  community: 'Strong Community / User Base',
  vertical_integration: 'Vertical Integration',
  none: 'None Yet',
}

// Grouped sector structure for dropdown with headers
export const SECTOR_GROUPS: { group: string; items: StartupCategory[] }[] = [
  { group: 'Fintech', items: ['fintech_payments', 'fintech_insurance', 'fintech_banking', 'fintech_lending', 'fintech_wealthtech', 'fintech_accounting', 'fintech_credit_scoring', 'fintech_remittance', 'fintech_embedded', 'fintech_neobroking', 'fintech_regtech', 'fintech_open_banking', 'fintech_microfinance', 'fintech_collections'] },
  { group: 'HealthTech', items: ['healthtech_products', 'healthtech_services', 'healthtech_mental', 'healthtech_fitness', 'healthtech_pharma', 'healthtech_genomics', 'healthtech_hospital_mgmt', 'healthtech_elderly', 'healthtech_fertility', 'healthtech_diagnostics'] },
  { group: 'EdTech', items: ['edtech_k12', 'edtech_higher_ed', 'edtech_test_prep', 'edtech_upskilling', 'edtech_language', 'edtech_coding', 'edtech_corporate', 'edtech_early_childhood', 'edtech_study_abroad'] },
  { group: 'E-Commerce', items: ['ecommerce_general', 'ecommerce_grocery', 'ecommerce_fashion', 'ecommerce_electronics', 'ecommerce_luxury', 'ecommerce_beauty', 'ecommerce_furniture', 'ecommerce_b2b', 'ecommerce_recommerce'] },
  { group: 'SaaS', items: ['saas_horizontal', 'saas_vertical', 'saas_devtools', 'saas_martech', 'saas_salestech', 'saas_collaboration', 'saas_security', 'saas_analytics', 'saas_nocode', 'saas_communication'] },
  { group: 'FoodTech', items: ['foodtech_delivery', 'foodtech_cloud_kitchen', 'foodtech_processing', 'foodtech_beverages', 'foodtech_nutrition', 'foodtech_restaurant'] },
  { group: 'Logistics', items: ['logistics_last_mile', 'logistics_warehousing', 'logistics_cold_chain', 'logistics_freight', 'logistics_reverse', 'logistics_3pl'] },
  { group: 'CleanTech', items: ['cleantech_solar', 'cleantech_ev', 'cleantech_battery', 'cleantech_waste', 'cleantech_carbon', 'cleantech_water', 'cleantech_hydrogen', 'cleantech_biomass'] },
  { group: 'AI / ML', items: ['ai_conversational', 'ai_computer_vision', 'ai_genai', 'ai_data_analytics', 'ai_mlops', 'ai_enterprise'] },
  { group: 'DeepTech', items: ['deeptech_robotics', 'deeptech_quantum', 'deeptech_semiconductor', 'deeptech_iot', 'deeptech_ar_vr', 'deeptech_nanotech'] },
  { group: 'AgriTech', items: ['agritech_precision', 'agritech_marketplace', 'agritech_input', 'agritech_post_harvest', 'agritech_dairy'] },
  { group: 'PropTech', items: ['proptech_rental', 'proptech_construction', 'proptech_coworking', 'proptech_facility', 'proptech_commercial'] },
  { group: 'Auto & Mobility', items: ['auto_ev', 'auto_fleet', 'auto_ride_hailing', 'auto_parts', 'auto_connected'] },
  { group: 'Media & Advertising', items: ['media_ott', 'media_creator', 'media_adtech', 'media_news', 'media_podcast'] },
  { group: 'Gaming', items: ['gaming_mobile', 'gaming_esports', 'gaming_fantasy', 'gaming_casual'] },
  { group: 'Travel', items: ['travel_booking', 'travel_experiences', 'travel_homestay', 'travel_business'] },
  { group: 'Manufacturing', items: ['manufacturing_3d', 'manufacturing_smart', 'manufacturing_textile', 'manufacturing_chemical', 'manufacturing_electronics'] },
  { group: 'B2B Services', items: ['b2b_staffing', 'b2b_consulting', 'b2b_procurement', 'b2b_accounting', 'b2b_outsourcing'] },
  { group: 'LegalTech', items: ['legaltech_contracts', 'legaltech_compliance', 'legaltech_dispute'] },
  { group: 'HRTech', items: ['hrtech_recruitment', 'hrtech_payroll', 'hrtech_engagement', 'hrtech_gig'] },
  { group: 'Cybersecurity', items: ['cybersecurity_identity', 'cybersecurity_threat', 'cybersecurity_cloud_sec'] },
  { group: 'Web3 / Blockchain', items: ['web3_defi', 'web3_nft', 'web3_infra', 'web3_dao'] },
  { group: 'SpaceTech', items: ['spacetech_satellite', 'spacetech_launch', 'spacetech_data'] },
  { group: 'BioTech', items: ['biotech_pharma', 'biotech_genomics', 'biotech_clinical', 'biotech_agri'] },
  { group: 'Drone Tech', items: ['drone_commercial', 'drone_defense'] },
  { group: 'Retail Tech', items: ['retail_pos', 'retail_analytics', 'retail_omnichannel'] },
  { group: 'SportsTech', items: ['sportstech_analytics', 'sportstech_fitness', 'sportstech_wearables'] },
  { group: 'Other', items: ['pet_care', 'social_impact', 'telecom', 'wedding_tech', 'beauty_tech', 'govtech', 'event_tech', 'home_services', 'personal_finance', 'circular_economy', 'eldercare', 'childcare', 'marketplace', 'insurance_distribution', 'other'] },
]

// Short labels without redundant group prefix for grouped dropdowns
export const CATEGORY_SHORT_LABELS: Record<StartupCategory, string> = {
  fintech_payments: 'Payments & UPI',
  fintech_insurance: 'InsurTech',
  fintech_banking: 'NeoBank / Digital Banking',
  fintech_lending: 'Lending & BNPL',
  fintech_wealthtech: 'WealthTech / Investments',
  fintech_accounting: 'Accounting & Invoicing',
  fintech_credit_scoring: 'Credit Scoring & Underwriting',
  fintech_remittance: 'Remittance & Cross-Border',
  fintech_embedded: 'Embedded Finance',
  fintech_neobroking: 'Neo-Broking & Trading',
  fintech_regtech: 'RegTech & Compliance',
  fintech_open_banking: 'Open Banking & Account Aggregation',
  fintech_microfinance: 'Microfinance & Financial Inclusion',
  fintech_collections: 'Collections & Recovery',
  healthtech_products: 'MedDevices & Products',
  healthtech_services: 'Telemedicine & Services',
  healthtech_mental: 'Mental Health & Therapy',
  healthtech_fitness: 'Fitness & Wellness',
  healthtech_pharma: 'Online Pharmacy',
  healthtech_genomics: 'Genomics & Precision Medicine',
  healthtech_hospital_mgmt: 'Hospital Management & SaaS',
  healthtech_elderly: 'Elderly Care',
  healthtech_fertility: 'Fertility & Women\'s Health',
  healthtech_diagnostics: 'Diagnostics & Lab Tech',
  edtech_k12: 'K-12 Schools',
  edtech_higher_ed: 'Higher Education & Online Degrees',
  edtech_test_prep: 'Test Prep & Competitive Exams',
  edtech_upskilling: 'Upskilling & Professional Development',
  edtech_language: 'Language Learning',
  edtech_coding: 'Coding & STEM',
  edtech_corporate: 'Corporate L&D',
  edtech_early_childhood: 'Early Childhood & Preschool',
  edtech_study_abroad: 'Study Abroad & Immigration',
  ecommerce_general: 'General / Horizontal',
  ecommerce_grocery: 'Grocery & Quick Commerce',
  ecommerce_fashion: 'Fashion & Lifestyle',
  ecommerce_electronics: 'Electronics & Gadgets',
  ecommerce_luxury: 'Luxury & Premium',
  ecommerce_beauty: 'Beauty & Personal Care',
  ecommerce_furniture: 'Furniture & Home Decor',
  ecommerce_b2b: 'B2B / Wholesale',
  ecommerce_recommerce: 'ReCommerce & Refurbished',
  saas_horizontal: 'Horizontal / General Purpose',
  saas_vertical: 'Vertical / Industry-Specific',
  saas_devtools: 'Developer Tools',
  saas_martech: 'MarTech & Growth Tools',
  saas_salestech: 'SalesTech & CRM',
  saas_collaboration: 'Collaboration & Productivity',
  saas_security: 'Security & Compliance',
  saas_analytics: 'Analytics & BI',
  saas_nocode: 'No-Code / Low-Code',
  saas_communication: 'Communication & CPaaS',
  foodtech_delivery: 'Delivery & Aggregation',
  foodtech_cloud_kitchen: 'Cloud Kitchen',
  foodtech_processing: 'Food Processing & Packaging',
  foodtech_beverages: 'Beverages & D2C Brands',
  foodtech_nutrition: 'Nutrition & Health Food',
  foodtech_restaurant: 'Restaurant Tech & POS',
  logistics_last_mile: 'Last Mile Delivery',
  logistics_warehousing: 'Warehousing & Fulfilment',
  logistics_cold_chain: 'Cold Chain',
  logistics_freight: 'Freight & Trucking',
  logistics_reverse: 'Reverse Logistics & Returns',
  logistics_3pl: '3PL & Supply Chain',
  cleantech_solar: 'Solar & Renewable Energy',
  cleantech_ev: 'EV & Charging',
  cleantech_battery: 'Battery & Energy Storage',
  cleantech_waste: 'Waste Management & Recycling',
  cleantech_carbon: 'Carbon Credits & Offsetting',
  cleantech_water: 'Water & Purification',
  cleantech_hydrogen: 'Green Hydrogen',
  cleantech_biomass: 'Biomass & Bioenergy',
  ai_conversational: 'Conversational AI & Chatbots',
  ai_computer_vision: 'Computer Vision',
  ai_genai: 'Generative AI / LLMs',
  ai_data_analytics: 'Data Analytics & Insights',
  ai_mlops: 'MLOps & Model Infrastructure',
  ai_enterprise: 'Enterprise AI Solutions',
  deeptech_robotics: 'Robotics & Automation',
  deeptech_quantum: 'Quantum Computing',
  deeptech_semiconductor: 'Semiconductor & Chip Design',
  deeptech_iot: 'IoT & Edge Computing',
  deeptech_ar_vr: 'AR / VR / Metaverse',
  deeptech_nanotech: 'Nanotechnology',
  agritech_precision: 'Precision Farming & IoT',
  agritech_marketplace: 'Marketplace & Farm-to-Fork',
  agritech_input: 'Inputs & Seeds',
  agritech_post_harvest: 'Post-Harvest & Storage',
  agritech_dairy: 'Dairy & Animal Husbandry',
  proptech_rental: 'Rental & Brokerage',
  proptech_construction: 'Construction Tech',
  proptech_coworking: 'Co-Working & Managed Spaces',
  proptech_facility: 'Facility Management',
  proptech_commercial: 'Commercial Real Estate',
  auto_ev: 'EV & Electric Mobility',
  auto_fleet: 'Fleet Management',
  auto_ride_hailing: 'Ride Hailing & Shared Mobility',
  auto_parts: 'Spare Parts & Aftermarket',
  auto_connected: 'Connected Vehicles & Telematics',
  media_ott: 'OTT & Streaming',
  media_creator: 'Creator Economy & Influencer',
  media_adtech: 'AdTech & Programmatic',
  media_news: 'News & Digital Publishing',
  media_podcast: 'Podcast & Audio',
  gaming_mobile: 'Mobile Games',
  gaming_esports: 'Esports & Tournaments',
  gaming_fantasy: 'Fantasy Sports & Real Money',
  gaming_casual: 'Casual & Social Games',
  travel_booking: 'Booking & OTA',
  travel_experiences: 'Experiences & Activities',
  travel_homestay: 'Homestay & Alternate Stays',
  travel_business: 'Business Travel & Expense',
  manufacturing_3d: '3D Printing & Additive',
  manufacturing_smart: 'Smart Factory & Industry 4.0',
  manufacturing_textile: 'Textile & Apparel',
  manufacturing_chemical: 'Chemical & Materials',
  manufacturing_electronics: 'Electronics & Assembly',
  b2b_staffing: 'Staffing & Temp Workforce',
  b2b_consulting: 'Consulting & Advisory',
  b2b_procurement: 'Procurement & Vendor Management',
  b2b_accounting: 'Accounting & Tax Filing',
  b2b_outsourcing: 'Outsourcing & BPO',
  legaltech_contracts: 'Contracts & CLM',
  legaltech_compliance: 'Compliance & Governance',
  legaltech_dispute: 'Dispute Resolution & ODR',
  hrtech_recruitment: 'Recruitment & ATS',
  hrtech_payroll: 'Payroll & Benefits',
  hrtech_engagement: 'Employee Engagement & Culture',
  hrtech_gig: 'Gig Economy & Freelance',
  cybersecurity_identity: 'Identity & Access Management',
  cybersecurity_threat: 'Threat Detection & Response',
  cybersecurity_cloud_sec: 'Cloud Security',
  web3_defi: 'DeFi & Decentralised Finance',
  web3_nft: 'NFT & Digital Collectibles',
  web3_infra: 'Infrastructure & Protocols',
  web3_dao: 'DAO & Governance',
  spacetech_satellite: 'Satellite & Communication',
  spacetech_launch: 'Launch Vehicles & Propulsion',
  spacetech_data: 'Earth Observation & Data',
  biotech_pharma: 'Pharma & Drug Discovery',
  biotech_genomics: 'Genomics & Diagnostics',
  biotech_clinical: 'Clinical Trials & CRO',
  biotech_agri: 'Agri-Biotech & Crop Science',
  drone_commercial: 'Commercial & Industrial',
  drone_defense: 'Defense & Surveillance',
  retail_pos: 'POS & Billing',
  retail_analytics: 'Analytics & Demand Forecasting',
  retail_omnichannel: 'Omnichannel & D2C Enablement',
  sportstech_analytics: 'Analytics & Performance',
  sportstech_fitness: 'Fitness & Gyms',
  sportstech_wearables: 'Wearables & Devices',
  pet_care: 'Pet Care & Animal Health',
  social_impact: 'Social Impact & NGO Tech',
  telecom: 'Telecom & Connectivity',
  wedding_tech: 'Wedding Tech & Events',
  beauty_tech: 'Beauty Tech & Cosmetics',
  govtech: 'GovTech & Civic Tech',
  event_tech: 'Event Tech & Ticketing',
  home_services: 'Home Services',
  personal_finance: 'Personal Finance & Advisory',
  circular_economy: 'Circular Economy & Sustainability',
  eldercare: 'Eldercare & Senior Living',
  childcare: 'Childcare & Parenting',
  marketplace: 'Marketplace / Aggregator',
  insurance_distribution: 'Insurance Distribution & Broking',
  other: 'Other',
}

export const PARTNERSHIP_LEVELS = ['none', 'one', 'multiple'] as const
export type PartnershipLevel = typeof PARTNERSHIP_LEVELS[number]

export const PARTNERSHIP_LABELS: Record<PartnershipLevel, string> = {
  none: 'None',
  one: 'One Key Partner',
  multiple: 'Multiple Partners',
}

export const VALUATION_PURPOSES = [
  'indicative', 'fundraising', 'esop', 'rule_11ua', 'fema', 'ma',
] as const
export type ValuationPurpose = typeof VALUATION_PURPOSES[number]

export const PURPOSE_LABELS: Record<ValuationPurpose, string> = {
  indicative: 'Indicative Valuation',
  fundraising: 'Fundraising',
  esop: 'ESOP Valuation',
  rule_11ua: 'Tax / Rule 11UA',
  fema: 'FEMA Pricing',
  ma: 'M&A Advisory',
}

export const PURPOSE_PRICES: Record<ValuationPurpose, number> = {
  indicative: 0,
  fundraising: 499900,
  esop: 499900,
  rule_11ua: 999900,
  fema: 1499900,
  ma: 1499900,
}

// ============================================================
// Wizard Inputs (collected from user)
// ============================================================

export interface WizardInputs {
  // Step 1: Company Profile
  company_name: string
  sector: StartupCategory
  stage: Stage
  business_model: BusinessModel
  city: string
  founding_year: number

  // Step 2: Team
  team_size: number
  founder_experience: number      // 1-5
  domain_expertise: number        // 1-5
  previous_exits: boolean
  technical_cofounder: boolean
  key_hires: string[]             // ['cto', 'cfo', 'sales_lead']

  // Step 3: Financials
  annual_revenue: number          // in Rs (0 = pre-revenue)
  revenue_growth_pct: number
  gross_margin_pct: number
  monthly_burn: number
  cash_in_bank: number
  cac: number | null              // optional
  ltv: number | null              // optional
  last_round_size: number | null  // optional
  last_round_valuation: number | null // optional

  // Step 4: Market & Product
  tam: number                     // in Rs Cr
  dev_stage: DevStage
  competition_level: number       // 1-5
  competitive_advantages: CompetitiveAdvantage[]
  patents_count: number

  // Step 5: Strategic Factors
  strategic_partnerships: PartnershipLevel
  regulatory_risk: number         // 1-5
  revenue_concentration_pct: number | null
  international_revenue_pct: number

  // Step 6: ESOP & Cap Table (optional)
  esop_pool_pct: number | null
  time_to_liquidity_years: number | null
  current_cap_table: CapTableEntry[] | null
  target_raise: number | null
  expected_dilution_pct: number | null
}

export interface CapTableEntry {
  name: string
  percentage: number
  share_class: 'common' | 'preference' | 'esop' | 'advisory'
}

// ============================================================
// Derived Fields (computed, not collected)
// ============================================================

export interface DerivedFields {
  runway_months: number           // Infinity if profitable
  ltv_cac_ratio: number | null
  has_patents: boolean
  default_esop_pct: number
  startup_volatility: number      // clamped 0.40-0.80
}

// ============================================================
// Valuation Results
// ============================================================

export type ValuationApproach = 'income' | 'market' | 'asset_cost' | 'vc_startup'

export type ValuationMethodName =
  | 'dcf' | 'pwerm'                                           // Income
  | 'revenue_multiple' | 'ebitda_multiple' | 'comparable_txn'  // Market
  | 'nav' | 'replacement_cost'                                 // Asset/Cost
  | 'scorecard' | 'berkus' | 'risk_factor'                     // VC

export const METHOD_APPROACH: Record<ValuationMethodName, ValuationApproach> = {
  dcf: 'income', pwerm: 'income',
  revenue_multiple: 'market', ebitda_multiple: 'market', comparable_txn: 'market',
  nav: 'asset_cost', replacement_cost: 'asset_cost',
  scorecard: 'vc_startup', berkus: 'vc_startup', risk_factor: 'vc_startup',
}

export const APPROACH_ORDER: ValuationApproach[] = ['income', 'market', 'asset_cost', 'vc_startup']

export const APPROACH_LABELS: Record<ValuationApproach, string> = {
  income: 'Income Approach',
  market: 'Market Approach',
  asset_cost: 'Asset/Cost Approach',
  vc_startup: 'VC Methods',
}

export interface MethodResult {
  method: ValuationMethodName
  approach: ValuationApproach
  value: number                   // in Rs
  confidence: number              // 0.0 - 1.0
  details: Record<string, unknown> // method-specific breakdown
  applicable: boolean
}

export interface MonteCarloResult {
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
  iterations_valid: number
  iterations_total: number
}

export interface ValuationResult {
  methods: MethodResult[]
  composite_value: number         // weighted average in Rs
  composite_low: number           // P10
  composite_high: number          // P90
  confidence_score: number        // 0-100
  monte_carlo: MonteCarloResult | null
  ibc_recovery_range: { low: number; high: number; sector: string } | null
  warnings?: CrossMethodWarning[]
}

export interface CrossMethodWarning {
  method: string
  message: string
  severity: 'info' | 'warning'
}

export interface SensitivityResult {
  variable: string
  baseValue: number
  steps: { label: string; value: number; valuation: number }[]
}

// ============================================================
// ESOP & Cap Table
// ============================================================

export interface ESOPResult {
  value_per_share: number
  total_pool_value: number
  return_multiple: number
  sensitivity: {
    conservative: { volatility: number; time: number; value: number }
    base: { volatility: number; time: number; value: number }
    optimistic: { volatility: number; time: number; value: number }
  }
}

export interface CapTableRound {
  raise_amount: number
  pre_money: number
  esop_expansion_pct: number
  esop_timing: 'pre_round' | 'post_round'
}

export interface CapTableResult {
  shareholders: CapTableEntry[]
  post_money: number
  new_investor_pct: number
  founder_pct_after: number
}

// ============================================================
// Investor Matching
// ============================================================

export interface Investor {
  name: string
  type: 'vc' | 'pe' | 'angel' | 'angel_network' | 'family_office' | 'cvc' | 'government'
  sectors: StartupCategory[]
  stages: Stage[]
  check_size_min_cr: number
  check_size_max_cr: number
  city: string
  portfolio_highlights: string[]
  last_active_year: number
  website: string
  sweet_spot_cr?: number | null
  deals_per_year?: number | null
  follow_on_rate?: number | null
  board_seat?: boolean
  lead_investor?: boolean
  co_invest_with?: string[]
  geographic_focus?: string[]
  thesis_summary?: string | null
  contact_method?: 'website' | 'linkedin' | 'referral_only'
}

export interface InvestorMatch {
  investor: Investor
  score: number
  reasons: string[]
}

// ============================================================
// Comparable Companies
// ============================================================

export interface ComparableCompany {
  name: string
  sector: StartupCategory
  stage_at_round: Stage
  last_round_size_cr: number
  valuation_cr: number
  revenue_cr: number | null
  year: number
  city: string
  business_model: BusinessModel
  source: string
  revenue_multiple?: number | null
  ebitda_cr?: number | null
  ebitda_multiple?: number | null
  arr_cr?: number | null
  employees?: number | null
  founded_year?: number | null
  deal_type?: 'primary' | 'secondary' | 'ipo' | 'acquisition'
  currency_original?: 'INR' | 'USD'
  notes?: string | null
}

export interface ListedComparable {
  name: string
  ticker: string
  sector: StartupCategory
  market_cap_cr: number
  revenue_cr: number
  ebitda_cr: number
  pe_ratio: number | null
  ev_revenue: number
  ev_ebitda: number | null
  as_of_date: string
  source: 'BSE' | 'NSE' | 'screener.in'
}

// ============================================================
// Damodaran Data
// ============================================================

export interface DamodaranBenchmark {
  ev_revenue: number
  ev_ebitda: number | null        // null for banks
  wacc: number                    // as decimal, e.g., 0.128
  beta: number
  gross_margin: number | null     // null for banks
}

export interface SectorMapping {
  label: string
  description: string
  primary_damodaran: string
  secondary_damodaran: string | null
  adjacent_sectors: string[]
}

// ============================================================
// Supabase / API
// ============================================================

export interface CaptureRequest {
  email: string
  name?: string
  phone?: string
  valuation_inputs: WizardInputs
  valuation_result: ValuationResult
}

export interface CaptureResponse {
  report_id: string
  success: boolean
}

export interface CertifiedRequest {
  valuation_id: string
  report_type: ValuationPurpose
  purpose: string
}

// ============================================================
// Deal Check (Investor Module)
// ============================================================

export type DealVerdict = 'green' | 'yellow' | 'red' | 'blue'

export interface DealCheckInput {
  sector: StartupCategory
  stage: Stage
  revenue_cr: number
  growth_pct: number
  raise_cr: number
  ask_cr: number
}

export interface DealCheckResult {
  verdict: DealVerdict
  label: string
  explanation: string
  fairValue: number
  impliedMultiple: number
  sectorMedianMultiple: number
  dilutionPct: number
  comparables: ComparableCompany[]
  negotiationInsight: string
}
