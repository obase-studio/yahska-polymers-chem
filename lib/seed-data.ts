import { dbHelpers } from './database'

// Enhanced Product Categories based on 11 categories mentioned
export const ENHANCED_PRODUCT_CATEGORIES = [
  // Construction Chemicals
  { id: 'admixtures', name: 'Admixtures', description: 'Concrete admixtures for enhanced performance and durability', sort_order: 1 },
  { id: 'waterproofing', name: 'Waterproofing Compounds', description: 'Advanced waterproofing solutions for construction', sort_order: 2 },
  { id: 'repair', name: 'Repair & Rehabilitation', description: 'Structural repair and rehabilitation chemicals', sort_order: 3 },
  { id: 'flooring', name: 'Flooring Chemicals', description: 'Specialized chemicals for industrial flooring solutions', sort_order: 4 },
  { id: 'grouting', name: 'Grouting Compounds', description: 'High-performance grouting and anchoring solutions', sort_order: 5 },
  { id: 'sealants', name: 'Sealants & Adhesives', description: 'Professional grade sealants and bonding agents', sort_order: 6 },
  
  // Specialty Chemicals
  { id: 'textile', name: 'Textile Chemicals', description: 'Specialized chemicals for textile processing and finishing', sort_order: 7 },
  { id: 'dyestuff', name: 'Dyestuff Chemicals', description: 'Premium chemicals for dyeing and color applications', sort_order: 8 },
  { id: 'dispersing', name: 'Dispersing Agents', description: 'Specialized dispersing agents for various industrial applications', sort_order: 9 },
  { id: 'surfactants', name: 'Surfactants', description: 'Surface-active agents for multiple industrial uses', sort_order: 10 },
  { id: 'polymers', name: 'Polymer Solutions', description: 'Advanced polymer-based chemical solutions', sort_order: 11 }
]

// Sample Products with detailed information
export const SAMPLE_PRODUCTS = [
  // Admixtures Category
  {
    name: 'Super Plasticizer SP-400',
    description: 'High-performance superplasticizer for concrete with excellent workability and strength enhancement',
    price: 'Contact for pricing',
    category_id: 'admixtures',
    product_code: 'YP-SP-400',
    applications: ['High-strength concrete', 'Precast concrete', 'Ready-mix concrete', 'Infrastructure projects'],
    features: ['High water reduction', 'Improved workability', 'Enhanced durability', 'Chloride-free'],
    usage: 'Add 0.5-2.0% by weight of cement. Mix thoroughly with concrete for 2-3 minutes for optimal dispersion.',
    advantages: ['Reduces water content by 20-25%', 'Increases concrete strength', 'Improves pumpability', 'Extends setting time'],
    technical_specifications: 'Specific gravity: 1.18-1.22, pH: 6-8, Chloride content: <0.1%',
    packaging_info: 'Available in 50kg, 200kg drums and 1000kg IBC containers',
    safety_information: 'Wear protective gloves and eyewear. Avoid direct skin contact. Store in cool, dry place.',
    image_url: '/images/products/superplasticizer.jpg'
  },
  {
    name: 'Retarding Admixture RT-300',
    description: 'Concrete retarding admixture for extended working time in hot weather conditions',
    price: 'Contact for pricing',
    category_id: 'admixtures',
    product_code: 'YP-RT-300',
    applications: ['Hot weather concreting', 'Large pours', 'Transportation of ready-mix', 'Slip-form construction'],
    features: ['Extended setting time', 'Maintains workability', 'No adverse effects on strength', 'Compatible with other admixtures'],
    usage: 'Dosage: 0.2-0.6% by weight of cement. Add during mixing or to ready-mix concrete.',
    advantages: ['Delays initial setting by 2-4 hours', 'Maintains concrete workability', 'Prevents cold joints', 'Reduces plastic shrinkage'],
    technical_specifications: 'Setting time delay: 2-4 hours, Compressive strength: ≥90% of control',
    packaging_info: 'Available in 50kg, 200kg containers',
    safety_information: 'Non-toxic, environmentally friendly. Standard concrete handling precautions apply.',
    image_url: '/images/products/retarding-admixture.jpg'
  },
  
  // Waterproofing Category
  {
    name: 'Crystalline Waterproofing CW-500',
    description: 'Penetrating crystalline waterproofing treatment for concrete structures',
    price: 'Contact for pricing',
    category_id: 'waterproofing',
    product_code: 'YP-CW-500',
    applications: ['Basements', 'Water tanks', 'Swimming pools', 'Tunnels', 'Bridge decks'],
    features: ['Self-healing properties', 'Permanent protection', 'Non-toxic', 'Easy application'],
    usage: 'Apply 1-2 coats on clean, damp concrete surface. Coverage: 1-1.5 kg/m² for two coats.',
    advantages: ['Blocks water permanently', 'Self-healing micro-cracks', 'Increases concrete durability', 'Allows concrete to breathe'],
    technical_specifications: 'Compressive strength: >40 MPa, Water penetration: <10mm under 5 bar pressure',
    packaging_info: 'Available in 25kg bags',
    safety_information: 'Dust mask recommended during application. Wash hands after use.',
    image_url: '/images/products/crystalline-waterproofing.jpg'
  },

  // Textile Chemicals Category
  {
    name: 'Textile Dispersant TD-200',
    description: 'High-efficiency dispersing agent for textile dyeing processes',
    price: 'Contact for pricing',
    category_id: 'textile',
    product_code: 'YP-TD-200',
    applications: ['Textile dyeing', 'Fabric processing', 'Color dispersion', 'Print paste preparation'],
    features: ['Excellent dispersing power', 'Thermal stability', 'pH stable', 'Low foaming'],
    usage: 'Add 0.5-2.0 g/L to dyeing bath. Adjust based on fabric type and dye concentration.',
    advantages: ['Uniform dye distribution', 'Reduced dyeing time', 'Better color fastness', 'Cost-effective'],
    technical_specifications: 'Active content: 30%, pH: 7-9, Viscosity: 50-150 cP',
    packaging_info: 'Available in 50kg, 200kg drums',
    safety_information: 'Avoid contact with eyes. Use in well-ventilated area.',
    image_url: '/images/products/textile-dispersant.jpg'
  }
]

// Client Companies Data based on logos found
export const SAMPLE_CLIENTS = [
  {
    company_name: 'L&T Construction',
    industry: 'Infrastructure & Construction',
    project_type: 'Metro Rail, Buildings',
    location: 'Pan India',
    partnership_since: '2010',
    project_value: '₹500+ Crores',
    description: 'Leading construction and engineering company, trusted partner for major infrastructure projects',
    logo_url: '/images/clients/lt-logo.webp',
    website_url: 'https://www.larsentoubro.com',
    is_featured: 1,
    sort_order: 1
  },
  {
    company_name: 'Tata Projects',
    industry: 'Infrastructure & Construction',
    project_type: 'Industrial, Infrastructure',
    location: 'Pan India',
    partnership_since: '2012',
    project_value: '₹300+ Crores',
    description: 'Premier infrastructure development company specializing in complex engineering projects',
    logo_url: '/images/clients/tata-projects.webp',
    website_url: 'https://www.tataprojects.com',
    is_featured: 1,
    sort_order: 2
  },
  {
    company_name: 'J Kumar Infraprojects',
    industry: 'Infrastructure & Construction',
    project_type: 'Metro Rail, Tunneling',
    location: 'Mumbai, Delhi, Ahmedabad',
    partnership_since: '2008',
    project_value: '₹200+ Crores',
    description: 'Specialized in metro rail construction and underground infrastructure development',
    logo_url: '/images/clients/j-kumar.jpg',
    website_url: 'https://www.jkumar.com',
    is_featured: 1,
    sort_order: 3
  },
  {
    company_name: 'Shapoorji Pallonji',
    industry: 'Infrastructure & Construction',
    project_type: 'Buildings, Infrastructure',
    location: 'Pan India',
    partnership_since: '2009',
    project_value: '₹400+ Crores',
    description: 'One of India\'s leading construction and engineering companies with global presence',
    logo_url: '/images/clients/shapoorji-pallonji.png',
    website_url: 'https://www.shapoorji.com',
    is_featured: 1,
    sort_order: 4
  },
  {
    company_name: 'Dilip Buildcon',
    industry: 'Infrastructure & Construction',
    project_type: 'Roads, Highways',
    location: 'Pan India',
    partnership_since: '2011',
    project_value: '₹250+ Crores',
    description: 'Leading infrastructure development company specializing in road and highway construction',
    logo_url: '/images/clients/dilip-buildcon.png',
    website_url: 'https://www.dilipbuildcon.com',
    is_featured: 1,
    sort_order: 5
  }
]

// Government Approvals Data
export const SAMPLE_APPROVALS = [
  {
    authority_name: 'Delhi Metro Rail Corporation (DMRC)',
    approval_type: 'Approved Supplier',
    description: 'Approved supplier of construction chemicals for Delhi Metro projects',
    validity_period: 'Valid till 2026',
    certificate_number: 'DMRC/2023/CC/156',
    issue_date: '2023-01-15',
    expiry_date: '2026-01-15',
    logo_url: '/images/approvals/dmrc.png',
    certificate_url: '/documents/dmrc-approval.pdf',
    sort_order: 1
  },
  {
    authority_name: 'National High Speed Rail Corporation Limited (NHSRCL)',
    approval_type: 'Technical Approval',
    description: 'Technical approval for construction chemicals used in Bullet Train project',
    validity_period: 'Valid till 2027',
    certificate_number: 'NHSRCL/2023/TA/089',
    issue_date: '2023-03-10',
    expiry_date: '2027-03-10',
    logo_url: '/images/approvals/nhsrcl-logo.png',
    certificate_url: '/documents/nhsrcl-approval.pdf',
    sort_order: 2
  },
  {
    authority_name: 'Mumbai Metropolitan Region Development Authority (MMRDA)',
    approval_type: 'Vendor Registration',
    description: 'Registered vendor for supply of construction chemicals for Mumbai Metro projects',
    validity_period: 'Valid till 2025',
    certificate_number: 'MMRDA/2022/VR/234',
    issue_date: '2022-06-20',
    expiry_date: '2025-06-20',
    logo_url: '/images/approvals/mmrda.jpg',
    certificate_url: '/documents/mmrda-approval.pdf',
    sort_order: 3
  },
  {
    authority_name: 'Gujarat Metro Rail Corporation (GMRC)',
    approval_type: 'Approved Supplier',
    description: 'Approved supplier of admixtures and construction chemicals',
    validity_period: 'Valid till 2026',
    certificate_number: 'GMRC/2023/AS/067',
    issue_date: '2023-05-12',
    expiry_date: '2026-05-12',
    logo_url: '/images/approvals/gmrc.png',
    certificate_url: '/documents/gmrc-approval.pdf',
    sort_order: 4
  },
  {
    authority_name: 'Railway Vikas Nigam Limited (RVNL)',
    approval_type: 'Technical Approval',
    description: 'Technical approval for railway infrastructure projects',
    validity_period: 'Valid till 2025',
    certificate_number: 'RVNL/2022/TA/145',
    issue_date: '2022-08-30',
    expiry_date: '2025-08-30',
    logo_url: '/images/approvals/rvnl.png',
    certificate_url: '/documents/rvnl-approval.pdf',
    sort_order: 5
  }
]

// Sample Projects Data
export const SAMPLE_PROJECTS = [
  // Bullet Train Projects
  {
    name: 'Mumbai-Ahmedabad High Speed Rail Corridor',
    description: 'Supply of high-performance concrete admixtures for India\'s first bullet train project',
    category: 'bullet_train',
    location: 'Mumbai to Ahmedabad, Gujarat & Maharashtra',
    client_name: 'NHSRCL & L&T Construction',
    completion_date: 'Ongoing (2024-2026)',
    project_value: '₹150 Crores',
    key_features: [
      'High-strength concrete for viaducts',
      'Specialized admixtures for tunneling',
      'Waterproofing solutions for stations',
      'Quality assurance for 320 km/h speeds'
    ],
    challenges: 'Meeting stringent quality requirements for high-speed rail infrastructure, ensuring durability for 100+ years',
    solutions: 'Developed specialized high-performance admixtures with enhanced durability and strength characteristics',
    image_url: '/images/projects/bullet-train-main.webp',
    gallery_images: [
      '/images/projects/bullet/bullet-train-projects.webp',
      '/images/projects/bullet/bullet-train.webp'
    ],
    is_featured: 1,
    sort_order: 1
  },

  // Metro Rail Projects
  {
    name: 'Ahmedabad-Gandhinagar Metro Rail Project',
    description: 'Comprehensive supply of construction chemicals for Phase 1 & 2 of Ahmedabad Metro',
    category: 'metro_rail',
    location: 'Ahmedabad & Gandhinagar, Gujarat',
    client_name: 'Gujarat Metro Rail Corporation & J Kumar Infraprojects',
    completion_date: 'Phase 1: 2023, Phase 2: Ongoing',
    project_value: '₹80 Crores',
    key_features: [
      'Underground station construction',
      'Elevated corridor admixtures',
      'Waterproofing for tunnels',
      'Repair chemicals for infrastructure'
    ],
    challenges: 'Complex underground construction in urban areas, ensuring minimal disruption to city traffic',
    solutions: 'Supplied quick-setting admixtures and specialized waterproofing solutions for rapid construction',
    image_url: '/images/projects/metro/ahmedabad-gandhinagar-metro.webp',
    gallery_images: [
      '/images/projects/metro/ahmedabad-gandhinagar-metro-1.webp',
      '/images/projects/metro/ahmedabad-gandhinagar-metro.jpg'
    ],
    is_featured: 1,
    sort_order: 2
  },
  {
    name: 'Surat Metro Rail Project',
    description: 'Construction chemicals supply for Surat\'s first metro rail system',
    category: 'metro_rail',
    location: 'Surat, Gujarat',
    client_name: 'Gujarat Metro Rail Corporation',
    completion_date: 'Ongoing (2023-2025)',
    project_value: '₹45 Crores',
    key_features: [
      'Precast segment production',
      'Station construction chemicals',
      'Tunnel boring support',
      'Architectural concrete solutions'
    ],
    challenges: 'First metro project in Surat, establishing quality standards and local logistics',
    solutions: 'Set up dedicated quality control and supply chain management for consistent delivery',
    image_url: '/images/projects/metro/surat-metro.webp',
    gallery_images: [
      '/images/projects/metro/surat-metro-1.webp',
      '/images/projects/metro/surat-metro-2.jpeg'
    ],
    is_featured: 1,
    sort_order: 3
  },

  // Road Projects
  {
    name: 'Vadodara-Mumbai Expressway',
    description: 'Supply of high-performance concrete chemicals for 8-lane expressway construction',
    category: 'roads',
    location: 'Vadodara to Mumbai via Bharuch',
    client_name: 'L&T Construction & Dilip Buildcon',
    completion_date: 'Phase 1: 2024',
    project_value: '₹120 Crores',
    key_features: [
      'Pavement quality concrete (PQC)',
      'Bridge construction chemicals',
      'Rapid setting admixtures',
      'Durability enhancement solutions'
    ],
    challenges: 'Large scale concrete requirements, maintaining quality across multiple sites',
    solutions: 'Established regional supply hubs and mobile quality testing units for consistent delivery',
    image_url: '/images/projects/roads/vadodara-mumbai-expressway.jpg',
    gallery_images: [
      '/images/projects/roads/vadodara-mumbai-expressway-1.jpeg',
      '/images/projects/roads/vme2.jpg'
    ],
    is_featured: 1,
    sort_order: 4
  },
  {
    name: 'Delhi-Vadodara Access Controlled Expressway',
    description: '8-lane expressway with advanced PQC technology and construction chemicals',
    category: 'roads',
    location: 'Delhi to Vadodara',
    client_name: 'National Highways Authority of India',
    completion_date: 'Ongoing (2023-2025)',
    project_value: '₹200 Crores',
    key_features: [
      'High-strength PQC pavement',
      'Bridge and culvert chemicals',
      'Toll plaza construction',
      'Quality control laboratories'
    ],
    challenges: 'Extreme weather variations across the route, ensuring uniform quality standards',
    solutions: 'Weather-resistant formulations and region-specific admixture solutions',
    image_url: '/images/projects/roads/delhi-vadodara-pqc-8-line.jpeg',
    gallery_images: [
      '/images/projects/roads/delhi-vadodara-pqc-8-line-1.jpeg',
      '/images/projects/roads/delhi-vadodara-pqc-8-line-2.jpeg'
    ],
    is_featured: 1,
    sort_order: 5
  },

  // Buildings & Infrastructure
  {
    name: 'Tata Semiconductor Fab Facility, Dholera',
    description: 'Specialized construction chemicals for India\'s largest semiconductor manufacturing facility',
    category: 'buildings_infra',
    location: 'Dholera SIR, Gujarat',
    client_name: 'Tata Projects Limited',
    completion_date: 'Ongoing (2023-2025)',
    project_value: '₹75 Crores',
    key_features: [
      'Clean room construction',
      'Precision concrete solutions',
      'Anti-static flooring chemicals',
      'Vibration-free concrete mixes'
    ],
    challenges: 'Ultra-precise construction requirements for semiconductor manufacturing',
    solutions: 'Developed specialized low-shrinkage, high-precision concrete solutions',
    image_url: '/images/projects/buildings/tata-semiconductor-fab-facility-dholera.jpeg',
    gallery_images: [
      '/images/projects/buildings/tata-semiconductor-fab-facility-dholera-2.jpeg'
    ],
    is_featured: 1,
    sort_order: 6
  },
  {
    name: 'Motera Cricket Stadium Construction',
    description: 'Construction chemicals for the world\'s largest cricket stadium',
    category: 'buildings_infra',
    location: 'Ahmedabad, Gujarat',
    client_name: 'Gujarat State Cricket Association',
    completion_date: 'Completed 2020',
    project_value: '₹25 Crores',
    key_features: [
      'Precast concrete elements',
      'Architectural concrete finish',
      'Waterproofing solutions',
      'High-strength structural concrete'
    ],
    challenges: 'Large span structures, architectural concrete requirements, tight timeline',
    solutions: 'High-performance admixtures for precast elements and architectural finishes',
    image_url: '/images/projects/buildings/motera-cricket-stadium.jpg',
    gallery_images: [],
    is_featured: 1,
    sort_order: 7
  },

  // Others Category
  {
    name: 'Vadodara Airport Expansion',
    description: 'Construction chemicals for runway and terminal building construction',
    category: 'others',
    location: 'Vadodara, Gujarat',
    client_name: 'Airport Authority of India',
    completion_date: 'Completed 2022',
    project_value: '₹15 Crores',
    key_features: [
      'Runway concrete solutions',
      'Terminal building chemicals',
      'Rapid repair solutions',
      'Weather-resistant formulations'
    ],
    challenges: 'Airport operational continuity during construction, high-strength requirements',
    solutions: 'Rapid-setting formulations for minimal downtime and high-performance runway concrete',
    image_url: '/images/projects/others/vadodara-airport-1.jpg',
    gallery_images: [
      '/images/projects/others/vadodara-airport-2.jpg'
    ],
    is_featured: 0,
    sort_order: 8
  },
  {
    name: 'Jamrani Dam, Uttarakhand',
    description: 'Waterproofing and construction chemicals for major dam project',
    category: 'others',
    location: 'Nainital, Uttarakhand',
    client_name: 'Uttarakhand Irrigation Department',
    completion_date: 'Ongoing (2022-2024)',
    project_value: '₹30 Crores',
    key_features: [
      'Mass concrete solutions',
      'Waterproofing systems',
      'Anti-washout admixtures',
      'Temperature control admixtures'
    ],
    challenges: 'Mass concrete placement, extreme weather conditions, remote location',
    solutions: 'Specialized mass concrete admixtures and logistics solutions for remote areas',
    image_url: '/images/projects/others/jamrani-dam-uttarakhand-1.jpeg',
    gallery_images: [
      '/images/projects/others/jamrani-dam-uttarakhand-2.jpeg',
      '/images/projects/others/jamrani-dam-uttarakhand-3.jpeg'
    ],
    is_featured: 0,
    sort_order: 9
  }
]

// Database Population Functions
export async function populateProductCategories() {
  try {
    console.log('Populating enhanced product categories...')
    
    for (const category of ENHANCED_PRODUCT_CATEGORIES) {
      try {
        // Update existing categories
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO product_categories (id, name, description, sort_order) 
          VALUES (?, ?, ?, ?)
        `)
        stmt.run(category.id, category.name, category.description, category.sort_order)
      } catch (error) {
        console.error(`Error inserting category ${category.id}:`, error)
      }
    }
    
    console.log(`✅ Successfully populated ${ENHANCED_PRODUCT_CATEGORIES.length} product categories`)
  } catch (error) {
    console.error('Error populating product categories:', error)
  }
}

export async function populateProducts() {
  try {
    console.log('Populating sample products...')
    
    for (const product of SAMPLE_PRODUCTS) {
      try {
        dbHelpers.createProduct(product)
      } catch (error) {
        console.error(`Error inserting product ${product.name}:`, error)
      }
    }
    
    console.log(`✅ Successfully populated ${SAMPLE_PRODUCTS.length} sample products`)
  } catch (error) {
    console.error('Error populating products:', error)
  }
}

export async function populateClients() {
  try {
    console.log('Populating client data...')
    
    for (const client of SAMPLE_CLIENTS) {
      try {
        dbHelpers.createClient(client)
      } catch (error) {
        console.error(`Error inserting client ${client.company_name}:`, error)
      }
    }
    
    console.log(`✅ Successfully populated ${SAMPLE_CLIENTS.length} clients`)
  } catch (error) {
    console.error('Error populating clients:', error)
  }
}

export async function populateApprovals() {
  try {
    console.log('Populating approvals data...')
    
    for (const approval of SAMPLE_APPROVALS) {
      try {
        dbHelpers.createApproval(approval)
      } catch (error) {
        console.error(`Error inserting approval ${approval.authority_name}:`, error)
      }
    }
    
    console.log(`✅ Successfully populated ${SAMPLE_APPROVALS.length} approvals`)
  } catch (error) {
    console.error('Error populating approvals:', error)
  }
}

export async function populateProjects() {
  try {
    console.log('Populating projects data...')
    
    for (const project of SAMPLE_PROJECTS) {
      try {
        dbHelpers.createProject(project)
      } catch (error) {
        console.error(`Error inserting project ${project.name}:`, error)
      }
    }
    
    console.log(`✅ Successfully populated ${SAMPLE_PROJECTS.length} projects`)
  } catch (error) {
    console.error('Error populating projects:', error)
  }
}

// Main seed function
export async function seedAllData() {
  console.log('🌱 Starting database seeding process...')
  
  try {
    await populateProductCategories()
    await populateProducts()
    await populateClients()
    await populateApprovals()
    await populateProjects()
    
    console.log('🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - ${ENHANCED_PRODUCT_CATEGORIES.length} Product Categories`)
    console.log(`   - ${SAMPLE_PRODUCTS.length} Sample Products`)
    console.log(`   - ${SAMPLE_CLIENTS.length} Client Companies`)
    console.log(`   - ${SAMPLE_APPROVALS.length} Government Approvals`)
    console.log(`   - ${SAMPLE_PROJECTS.length} Project Case Studies`)
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error)
  }
}

// Individual seed functions for selective seeding
export const seedFunctions = {
  categories: populateProductCategories,
  products: populateProducts,
  clients: populateClients,
  approvals: populateApprovals,
  projects: populateProjects,
  all: seedAllData
}