import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { join } from 'path'

const db = new Database(join(process.cwd(), 'admin.db'))

// Initialize database tables
export function initDatabase() {
  // Admin users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Website content table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT NOT NULL,
      section TEXT NOT NULL,
      content_key TEXT NOT NULL,
      content_value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(page, section, content_key)
    )
  `)



  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price TEXT,
      category_id TEXT NOT NULL,
      applications TEXT, -- JSON array
      features TEXT, -- JSON array
      image_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Product categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1
    )
  `)

  // Client testimonials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS client_testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      client_description TEXT,
      testimonial_text TEXT,
      partnership_years TEXT,
      logo_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // SEO settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS seo_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT UNIQUE NOT NULL,
      title TEXT,
      description TEXT,
      keywords TEXT,
      og_title TEXT,
      og_description TEXT,
      og_image TEXT,
      canonical_url TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Media files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      alt_text TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL, -- bullet_train, metro_rail, roads, buildings_infra, others
      location TEXT,
      client_name TEXT,
      completion_date TEXT,
      project_value TEXT,
      key_features TEXT, -- JSON array
      challenges TEXT,
      solutions TEXT,
      image_url TEXT,
      gallery_images TEXT, -- JSON array of image URLs
      is_featured BOOLEAN DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Project categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1
    )
  `)

  // Approvals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      authority_name TEXT NOT NULL,
      approval_type TEXT, -- certification, approval, license
      description TEXT,
      validity_period TEXT,
      certificate_number TEXT,
      issue_date TEXT,
      expiry_date TEXT,
      logo_url TEXT NOT NULL,
      certificate_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Enhanced clients table (separate from testimonials)
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      industry TEXT,
      project_type TEXT,
      location TEXT,
      partnership_since TEXT,
      project_value TEXT,
      description TEXT,
      logo_url TEXT NOT NULL,
      website_url TEXT,
      is_featured BOOLEAN DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Company information table
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field_name TEXT UNIQUE NOT NULL,
      field_value TEXT,
      field_type TEXT DEFAULT 'text',
      category TEXT DEFAULT 'general',
      is_active BOOLEAN DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Try to add new columns to products table (will silently fail if they already exist)
  try {
    db.exec(`ALTER TABLE products ADD COLUMN usage TEXT DEFAULT NULL`)
  } catch (e) { /* Column already exists */ }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN advantages TEXT DEFAULT NULL`)
  } catch (e) { /* Column already exists */ }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN technical_specifications TEXT DEFAULT NULL`)
  } catch (e) { /* Column already exists */ }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN packaging_info TEXT DEFAULT NULL`)
  } catch (e) { /* Column already exists */ }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN safety_information TEXT DEFAULT NULL`)
  } catch (e) { /* Column already exists */ }
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN product_code TEXT DEFAULT NULL`)
  } catch (e) { /* Column already exists */ }

  // Product images table for multiple images per product
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      image_type TEXT DEFAULT 'gallery',
      alt_text TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    )
  `)

  // Create indexes for performance
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_approvals_active ON approvals(is_active)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_company_info_category ON company_info(category)`)

  // Create default admin user if not exists
  createDefaultAdmin()
  
  // Insert default product categories
  insertDefaultCategories()
  
  // Insert default project categories
  insertDefaultProjectCategories()
  
  // Insert default company information
  insertDefaultCompanyInfo()
  
  // Insert default SEO settings
  insertDefaultSEO()
}

function createDefaultAdmin() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM admin_users')
  const result = stmt.get() as { count: number }
  
  if (result.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin', 10)
    const insertStmt = db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)')
    insertStmt.run('admin', hashedPassword)
    console.log('Default admin user created: admin/admin')
  }
}

function insertDefaultCategories() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM product_categories')
  const result = stmt.get() as { count: number }
  
  if (result.count === 0) {
    const categories = [
      { id: 'construction', name: 'Construction Chemicals', description: 'Advanced solutions for construction and infrastructure projects', sort_order: 1 },
      { id: 'concrete', name: 'Concrete Admixtures', description: 'High-performance additives for enhanced concrete properties', sort_order: 2 },
      { id: 'dispersing', name: 'Dispersing Agents', description: 'Specialized dispersing agents for various industrial applications', sort_order: 3 },
      { id: 'textile', name: 'Textile Chemicals', description: 'Specialized chemicals for textile processing and finishing', sort_order: 4 },
      { id: 'dyestuff', name: 'Dyestuff Chemicals', description: 'Premium chemicals for dyeing and color applications', sort_order: 5 }
    ]
    
    const insertStmt = db.prepare('INSERT OR IGNORE INTO product_categories (id, name, description, sort_order) VALUES (?, ?, ?, ?)')
    categories.forEach(cat => {
      insertStmt.run(cat.id, cat.name, cat.description, cat.sort_order)
    })
  }
}

function insertDefaultSEO() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM seo_settings')
  const result = stmt.get() as { count: number }
  
  if (result.count === 0) {
    const pages = [
      {
        page: 'home',
        title: 'Yahska Polymers - Construction Chemicals & Concrete Admixtures',
        description: 'Leading manufacturer of construction chemicals, concrete admixtures, textile chemicals, and dyestuff chemicals. Quality products for industrial applications.',
        keywords: 'construction chemicals, concrete admixtures, textile chemicals, dyestuff chemicals, polymer manufacturer'
      },
      {
        page: 'about',
        title: 'About Yahska Polymers - 20+ Years of Chemical Manufacturing Excellence',
        description: 'Learn about Yahska Polymers Private Limited, established in 2003. Over 20 years of experience in chemical manufacturing and industrial solutions.',
        keywords: 'about yahska polymers, chemical manufacturer, ahmedabad, gujarat, ISO certified'
      },
      {
        page: 'products',
        title: 'Products - Construction Chemicals & Industrial Solutions | Yahska Polymers',
        description: 'Explore our comprehensive range of construction chemicals, concrete admixtures, textile chemicals, and specialized industrial chemical solutions.',
        keywords: 'construction chemicals products, concrete admixtures, textile chemicals, dispersing agents'
      },
      {
        page: 'projects',
        title: 'Projects - Infrastructure & Construction Projects | Yahska Polymers',
        description: 'Explore our project portfolio including Bullet Train, Metro & Rail, Roads, Buildings & Infrastructure projects across India.',
        keywords: 'infrastructure projects, construction projects, bullet train, metro rail, roads, buildings'
      },
      {
        page: 'clients',
        title: 'Our Clients - Trusted Partners in Construction | Yahska Polymers',
        description: 'Yahska Polymers proudly serves leading construction companies, infrastructure developers, and cement manufacturers across India.',
        keywords: 'construction clients, infrastructure partners, cement companies, construction contractors'
      },
      {
        page: 'approvals',
        title: 'Certifications & Approvals - Quality Assured | Yahska Polymers',
        description: 'View our certifications and approvals from leading authorities including DMRC, NHSRCL, MMRDA, and other government bodies.',
        keywords: 'certifications, approvals, DMRC, NHSRCL, MMRDA, quality assurance, government approvals'
      },
      {
        page: 'contact',
        title: 'Contact Yahska Polymers - Get Quote for Chemical Solutions',
        description: 'Contact Yahska Polymers for your chemical solution requirements. Located in Ahmedabad, Gujarat. Expert technical support available.',
        keywords: 'contact yahska polymers, chemical solutions quote, ahmedabad gujarat, technical support'
      }
    ]
    
    const insertStmt = db.prepare('INSERT OR IGNORE INTO seo_settings (page, title, description, keywords) VALUES (?, ?, ?, ?)')
    pages.forEach(page => {
      insertStmt.run(page.page, page.title, page.description, page.keywords)
    })
  }
}

function insertDefaultProjectCategories() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM project_categories')
  const result = stmt.get() as { count: number }
  
  if (result.count === 0) {
    const categories = [
      { 
        id: 'bullet_train', 
        name: 'Bullet Train', 
        description: 'High-speed rail projects including NHSRCL Mumbai-Ahmedabad corridor',
        sort_order: 1 
      },
      { 
        id: 'metro_rail', 
        name: 'Metro & Rail', 
        description: 'Metro systems, railway infrastructure, and urban transit projects',
        sort_order: 2 
      },
      { 
        id: 'roads', 
        name: 'Roads', 
        description: 'Highway construction, expressways, and road infrastructure projects',
        sort_order: 3 
      },
      { 
        id: 'buildings_infra', 
        name: 'Buildings & Infrastructure', 
        description: 'Commercial buildings, industrial facilities, and infrastructure development',
        sort_order: 4 
      },
      { 
        id: 'others', 
        name: 'Others', 
        description: 'Airports, dams, canals, and other specialized construction projects',
        sort_order: 5 
      }
    ]
    
    const insertStmt = db.prepare('INSERT OR IGNORE INTO project_categories (id, name, description, sort_order) VALUES (?, ?, ?, ?)')
    categories.forEach(cat => {
      insertStmt.run(cat.id, cat.name, cat.description, cat.sort_order)
    })
  }
}

function insertDefaultCompanyInfo() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM company_info')
  const result = stmt.get() as { count: number }
  
  if (result.count === 0) {
    const companyData = [
      // About Us Information
      { field_name: 'company_name', field_value: 'Yahska Polymers Private Limited', category: 'about' },
      { field_name: 'established_year', field_value: '2003', category: 'about' },
      { field_name: 'company_description', field_value: 'Leading manufacturer of construction chemicals, concrete admixtures, textile chemicals, and dyestuff chemicals with over 20 years of experience in industrial solutions.', category: 'about' },
      { field_name: 'mission', field_value: 'To provide innovative chemical solutions that enhance construction quality and efficiency while maintaining the highest standards of safety and environmental responsibility.', category: 'about' },
      { field_name: 'vision', field_value: 'To be the most trusted partner in chemical manufacturing, driving innovation in construction and industrial applications across India and beyond.', category: 'about' },
      
      // Contact Information
      { field_name: 'head_office_address', field_value: 'Ahmedabad, Gujarat, India', category: 'contact' },
      { field_name: 'phone', field_value: '+91-XXXX-XXXXXX', category: 'contact' },
      { field_name: 'email', field_value: 'info@yahskapolymers.com', category: 'contact' },
      { field_name: 'website', field_value: 'www.yahskapolymers.com', category: 'contact' },
      
      // Business Information
      { field_name: 'total_experience', field_value: '20+ years', category: 'general' },
      { field_name: 'employee_count', field_value: '50+', category: 'general' },
      { field_name: 'manufacturing_facilities', field_value: '2', category: 'general' },
      { field_name: 'product_categories', field_value: '11', category: 'general' },
      { field_name: 'active_projects', field_value: '100+', category: 'general' },
      
      // Quality & Certifications
      { field_name: 'iso_certified', field_value: 'true', category: 'quality' },
      { field_name: 'quality_policy', field_value: 'Committed to delivering high-quality chemical solutions through continuous innovation, strict quality control, and customer-focused approach.', category: 'quality' }
    ]
    
    const insertStmt = db.prepare('INSERT OR IGNORE INTO company_info (field_name, field_value, category) VALUES (?, ?, ?)')
    companyData.forEach(data => {
      insertStmt.run(data.field_name, data.field_value, data.category)
    })
  }
}

// Database helper functions
export const dbHelpers = {
  // Admin authentication
  getAdminByUsername: (username: string) => {
    const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ?')
    return stmt.get(username)
  },

  // Content management
  getContent: (page: string, section?: string) => {
    if (section) {
      const stmt = db.prepare('SELECT * FROM site_content WHERE page = ? AND section = ?')
      return stmt.all(page, section)
    } else {
      const stmt = db.prepare('SELECT * FROM site_content WHERE page = ?')
      return stmt.all(page)
    }
  },

  setContent: (page: string, section: string, contentKey: string, contentValue: string) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO site_content (page, section, content_key, content_value, updated_at) 
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    return stmt.run(page, section, contentKey, contentValue)
  },

  // Products
  getAllProducts: () => {
    const stmt = db.prepare(`
      SELECT p.*, pc.name as category_name 
      FROM products p 
      LEFT JOIN product_categories pc ON p.category_id = pc.id 
      ORDER BY p.updated_at DESC
    `)
    return stmt.all()
  },

  getProductById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?')
    return stmt.get(id)
  },

  createProduct: (product: any) => {
    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, category_id, applications, features, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      product.name,
      product.description,
      product.price,
      product.category_id,
      JSON.stringify(product.applications),
      JSON.stringify(product.features),
      product.image_url
    )
  },

  updateProduct: (id: number, product: any) => {
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, category_id = ?, applications = ?, features = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    return stmt.run(
      product.name,
      product.description,
      product.price,
      product.category_id,
      JSON.stringify(product.applications),
      JSON.stringify(product.features),
      product.image_url,
      id
    )
  },

  deleteProduct: (id: number) => {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?')
    return stmt.run(id)
  },

  // Categories
  getAllCategories: () => {
    const stmt = db.prepare('SELECT * FROM product_categories ORDER BY sort_order')
    return stmt.all()
  },

  // Client testimonials
  getAllTestimonials: () => {
    const stmt = db.prepare('SELECT * FROM client_testimonials ORDER BY sort_order, id')
    return stmt.all()
  },

  createTestimonial: (testimonial: any) => {
    const stmt = db.prepare(`
      INSERT INTO client_testimonials (client_name, client_description, testimonial_text, partnership_years, logo_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      testimonial.client_name,
      testimonial.client_description,
      testimonial.testimonial_text,
      testimonial.partnership_years,
      testimonial.logo_url,
      testimonial.sort_order || 0
    )
  },

  updateTestimonial: (id: number, testimonial: any) => {
    const stmt = db.prepare(`
      UPDATE client_testimonials 
      SET client_name = ?, client_description = ?, testimonial_text = ?, partnership_years = ?, logo_url = ?, sort_order = ?
      WHERE id = ?
    `)
    return stmt.run(
      testimonial.client_name,
      testimonial.client_description,
      testimonial.testimonial_text,
      testimonial.partnership_years,
      testimonial.logo_url,
      testimonial.sort_order || 0,
      id
    )
  },

  deleteTestimonial: (id: number) => {
    const stmt = db.prepare('DELETE FROM client_testimonials WHERE id = ?')
    return stmt.run(id)
  },

  // SEO settings
  getSEOSettings: (page: string) => {
    const stmt = db.prepare('SELECT * FROM seo_settings WHERE page = ?')
    return stmt.get(page)
  },

  setSEOSettings: (page: string, seo: any) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO seo_settings 
      (page, title, description, keywords, og_title, og_description, og_image, canonical_url, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    return stmt.run(
      page,
      seo.title,
      seo.description,
      seo.keywords,
      seo.og_title,
      seo.og_description,
      seo.og_image,
      seo.canonical_url
    )
  },

  getAllSEOSettings: () => {
    const stmt = db.prepare('SELECT * FROM seo_settings ORDER BY page')
    return stmt.all()
  },

  // Media files
  saveMediaFile: (file: any) => {
    const stmt = db.prepare(`
      INSERT INTO media_files (filename, original_name, file_path, file_size, mime_type, alt_text)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      file.filename,
      file.original_name,
      file.file_path,
      file.file_size,
      file.mime_type,
      file.alt_text || ''
    )
  },

  getAllMediaFiles: () => {
    const stmt = db.prepare('SELECT * FROM media_files ORDER BY uploaded_at DESC')
    return stmt.all()
  },

  deleteMediaFile: (id: number) => {
    const stmt = db.prepare('DELETE FROM media_files WHERE id = ?')
    return stmt.run(id)
  },

  // Projects
  getAllProjects: () => {
    const stmt = db.prepare(`
      SELECT p.*, pc.name as category_name 
      FROM projects p 
      LEFT JOIN project_categories pc ON p.category = pc.id 
      WHERE p.is_active = 1
      ORDER BY p.sort_order, p.updated_at DESC
    `)
    return stmt.all()
  },

  getProjectsByCategory: (category: string) => {
    const stmt = db.prepare(`
      SELECT p.*, pc.name as category_name 
      FROM projects p 
      LEFT JOIN project_categories pc ON p.category = pc.id 
      WHERE p.category = ? AND p.is_active = 1
      ORDER BY p.sort_order, p.updated_at DESC
    `)
    return stmt.all(category)
  },

  getFeaturedProjects: () => {
    const stmt = db.prepare(`
      SELECT p.*, pc.name as category_name 
      FROM projects p 
      LEFT JOIN project_categories pc ON p.category = pc.id 
      WHERE p.is_featured = 1 AND p.is_active = 1
      ORDER BY p.sort_order, p.updated_at DESC
    `)
    return stmt.all()
  },

  getProjectById: (id: number) => {
    const stmt = db.prepare(`
      SELECT p.*, pc.name as category_name 
      FROM projects p 
      LEFT JOIN project_categories pc ON p.category = pc.id 
      WHERE p.id = ?
    `)
    return stmt.get(id)
  },

  createProject: (project: any) => {
    const stmt = db.prepare(`
      INSERT INTO projects (name, description, category, location, client_name, completion_date, 
        project_value, key_features, challenges, solutions, image_url, gallery_images, 
        is_featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      project.name,
      project.description,
      project.category,
      project.location,
      project.client_name,
      project.completion_date,
      project.project_value,
      JSON.stringify(project.key_features || []),
      project.challenges,
      project.solutions,
      project.image_url,
      JSON.stringify(project.gallery_images || []),
      project.is_featured || 0,
      project.sort_order || 0
    )
  },

  updateProject: (id: number, project: any) => {
    const stmt = db.prepare(`
      UPDATE projects 
      SET name = ?, description = ?, category = ?, location = ?, client_name = ?, completion_date = ?, 
        project_value = ?, key_features = ?, challenges = ?, solutions = ?, image_url = ?, 
        gallery_images = ?, is_featured = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    return stmt.run(
      project.name,
      project.description,
      project.category,
      project.location,
      project.client_name,
      project.completion_date,
      project.project_value,
      JSON.stringify(project.key_features || []),
      project.challenges,
      project.solutions,
      project.image_url,
      JSON.stringify(project.gallery_images || []),
      project.is_featured || 0,
      project.sort_order || 0,
      id
    )
  },

  deleteProject: (id: number) => {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?')
    return stmt.run(id)
  },

  // Project Categories
  getAllProjectCategories: () => {
    const stmt = db.prepare('SELECT * FROM project_categories WHERE is_active = 1 ORDER BY sort_order')
    return stmt.all()
  },

  // Clients
  getAllClients: () => {
    const stmt = db.prepare('SELECT * FROM clients WHERE is_active = 1 ORDER BY sort_order, company_name')
    return stmt.all()
  },

  getFeaturedClients: () => {
    const stmt = db.prepare('SELECT * FROM clients WHERE is_featured = 1 AND is_active = 1 ORDER BY sort_order, company_name')
    return stmt.all()
  },

  getClientById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM clients WHERE id = ?')
    return stmt.get(id)
  },

  createClient: (client: any) => {
    const stmt = db.prepare(`
      INSERT INTO clients (company_name, industry, project_type, location, partnership_since, 
        project_value, description, logo_url, website_url, is_featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      client.company_name,
      client.industry,
      client.project_type,
      client.location,
      client.partnership_since,
      client.project_value,
      client.description,
      client.logo_url,
      client.website_url,
      client.is_featured || 0,
      client.sort_order || 0
    )
  },

  updateClient: (id: number, client: any) => {
    const stmt = db.prepare(`
      UPDATE clients 
      SET company_name = ?, industry = ?, project_type = ?, location = ?, partnership_since = ?, 
        project_value = ?, description = ?, logo_url = ?, website_url = ?, is_featured = ?, sort_order = ?
      WHERE id = ?
    `)
    return stmt.run(
      client.company_name,
      client.industry,
      client.project_type,
      client.location,
      client.partnership_since,
      client.project_value,
      client.description,
      client.logo_url,
      client.website_url,
      client.is_featured || 0,
      client.sort_order || 0,
      id
    )
  },

  deleteClient: (id: number) => {
    const stmt = db.prepare('DELETE FROM clients WHERE id = ?')
    return stmt.run(id)
  },

  // Approvals
  getAllApprovals: () => {
    const stmt = db.prepare('SELECT * FROM approvals WHERE is_active = 1 ORDER BY sort_order, authority_name')
    return stmt.all()
  },

  getApprovalById: (id: number) => {
    const stmt = db.prepare('SELECT * FROM approvals WHERE id = ?')
    return stmt.get(id)
  },

  createApproval: (approval: any) => {
    const stmt = db.prepare(`
      INSERT INTO approvals (authority_name, approval_type, description, validity_period, 
        certificate_number, issue_date, expiry_date, logo_url, certificate_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      approval.authority_name,
      approval.approval_type,
      approval.description,
      approval.validity_period,
      approval.certificate_number,
      approval.issue_date,
      approval.expiry_date,
      approval.logo_url,
      approval.certificate_url,
      approval.sort_order || 0
    )
  },

  updateApproval: (id: number, approval: any) => {
    const stmt = db.prepare(`
      UPDATE approvals 
      SET authority_name = ?, approval_type = ?, description = ?, validity_period = ?, 
        certificate_number = ?, issue_date = ?, expiry_date = ?, logo_url = ?, certificate_url = ?, sort_order = ?
      WHERE id = ?
    `)
    return stmt.run(
      approval.authority_name,
      approval.approval_type,
      approval.description,
      approval.validity_period,
      approval.certificate_number,
      approval.issue_date,
      approval.expiry_date,
      approval.logo_url,
      approval.certificate_url,
      approval.sort_order || 0,
      id
    )
  },

  deleteApproval: (id: number) => {
    const stmt = db.prepare('DELETE FROM approvals WHERE id = ?')
    return stmt.run(id)
  },

  // Company Information
  getCompanyInfo: (category?: string) => {
    if (category) {
      const stmt = db.prepare('SELECT * FROM company_info WHERE category = ? AND is_active = 1')
      return stmt.all(category)
    } else {
      const stmt = db.prepare('SELECT * FROM company_info WHERE is_active = 1')
      return stmt.all()
    }
  },

  getCompanyField: (fieldName: string) => {
    const stmt = db.prepare('SELECT * FROM company_info WHERE field_name = ? AND is_active = 1')
    return stmt.get(fieldName)
  },

  setCompanyInfo: (fieldName: string, fieldValue: string, category: string = 'general', fieldType: string = 'text') => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO company_info (field_name, field_value, field_type, category, updated_at) 
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    return stmt.run(fieldName, fieldValue, fieldType, category)
  },

  // Product Images
  getProductImages: (productId: number) => {
    const stmt = db.prepare('SELECT * FROM product_images WHERE product_id = ? AND is_active = 1 ORDER BY sort_order')
    return stmt.all(productId)
  },

  addProductImage: (productId: number, imageUrl: string, imageType: string = 'gallery', altText?: string, sortOrder: number = 0) => {
    const stmt = db.prepare(`
      INSERT INTO product_images (product_id, image_url, image_type, alt_text, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `)
    return stmt.run(productId, imageUrl, imageType, altText || '', sortOrder)
  },

  deleteProductImage: (id: number) => {
    const stmt = db.prepare('DELETE FROM product_images WHERE id = ?')
    return stmt.run(id)
  }
}

export default db