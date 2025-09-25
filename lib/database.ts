import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { join } from 'path'
import { parseProductData } from './database-client'

// This ensures the database is only initialized on the server side
let db: any = null;

export function getDatabase() {
  if (!db) {
    db = new Database(join(process.cwd(), 'admin.db'));
  }
  return db;
}

// Initialize database tables
export function initDatabase() {
  const db = getDatabase();
  
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
      category_id TEXT NOT NULL,
      applications TEXT, -- JSON array
      features TEXT, -- JSON array
      image_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Rest of the table creation code...
  // (keeping the same table creation logic as before)

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
  
  try {
    db.exec(`ALTER TABLE products ADD COLUMN specification_pdf TEXT DEFAULT NULL`)
  } catch (e) { /* Column already exists */ }

  try {
    db.exec(`ALTER TABLE projects ADD COLUMN project_info_details TEXT DEFAULT NULL`)
  } catch (e) { /* Column already exists */ }

  // Create default admin user if not exists
  createDefaultAdmin()
}

function createDefaultAdmin() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT COUNT(*) as count FROM admin_users')
  const result = stmt.get() as { count: number }
  
  if (result.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin', 10)
    const insertStmt = db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)')
    insertStmt.run('admin', hashedPassword)
    console.log('Default admin user created: admin/admin')
  }
}

// Database helper functions
export const dbHelpers = {
  // Content management
  getContent: (page: string, section?: string) => {
    const db = getDatabase();
    if (section) {
      const stmt = db.prepare('SELECT * FROM site_content WHERE page = ? AND section = ?')
      return stmt.all(page, section)
    } else {
      const stmt = db.prepare('SELECT * FROM site_content WHERE page = ?')
      return stmt.all(page)
    }
  },

  setContent: (page: string, section: string, contentKey: string, contentValue: string) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO site_content (page, section, content_key, content_value, updated_at) 
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    return stmt.run(page, section, contentKey, contentValue)
  },

  // Products
  getAllProducts: () => {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT p.*, pc.name as category_name 
      FROM products p 
      LEFT JOIN product_categories pc ON p.category_id = pc.id 
      ORDER BY p.updated_at DESC
    `)
    const products = stmt.all();
    return products.map((product: any) => parseProductData(product));
  },

  getProductById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?')
    const product = stmt.get(id);
    return product ? parseProductData(product) : null;
  },

  updateProduct: (id: number, product: any) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE products SET 
        name = ?, description = ?, category_id = ?, 
        applications = ?, features = ?, image_url = ?, 
        usage = ?, advantages = ?, technical_specifications = ?, 
        packaging_info = ?, safety_information = ?, product_code = ?,
        specification_pdf = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    return stmt.run(
      product.name,
      product.description,
      product.category_id,
      JSON.stringify(product.applications || []),
      JSON.stringify(product.features || []),
      product.image_url,
      product.usage,
      product.advantages,
      product.technical_specifications,
      product.packaging_info,
      product.safety_information,
      product.product_code,
      product.specification_pdf,
      id
    )
  },

  deleteProduct: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM products WHERE id = ?')
    return stmt.run(id)
  },

  createProduct: (product: any) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO products (
        name, description, category_id, applications, features, 
        image_url, usage, advantages, technical_specifications, 
        packaging_info, safety_information, product_code, specification_pdf
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      product.name,
      product.description,
      product.category_id,
      JSON.stringify(product.applications || []),
      JSON.stringify(product.features || []),
      product.image_url,
      product.usage,
      product.advantages,
      product.technical_specifications,
      product.packaging_info,
      product.safety_information,
      product.product_code,
      product.specification_pdf
    )
  },

  // Categories
  getAllCategories: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM product_categories ORDER BY sort_order')
    return stmt.all()
  },

  getAllCategoriesWithCounts: () => {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT pc.*, COUNT(p.id) as product_count 
      FROM product_categories pc 
      LEFT JOIN products p ON pc.id = p.category_id 
      GROUP BY pc.id, pc.name, pc.description, pc.sort_order, pc.is_active 
      ORDER BY pc.sort_order
    `)
    return stmt.all()
  },

  getCategoryById: (id: string) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM product_categories WHERE id = ?')
    return stmt.get(id)
  },

  createCategory: (category: any) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO product_categories (id, name, description, sort_order, is_active) 
      VALUES (?, ?, ?, ?, 1)
    `)
    return stmt.run(category.id, category.name, category.description, category.sort_order)
  },

  updateCategory: (id: string, category: any) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE product_categories 
      SET name = ?, description = ?, sort_order = ? 
      WHERE id = ?
    `)
    return stmt.run(category.name, category.description, category.sort_order, id)
  },

  deleteCategory: (id: string) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM product_categories WHERE id = ?')
    return stmt.run(id)
  },

  getProductCountByCategory: (categoryId: string) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?')
    const result = stmt.get(categoryId) as { count: number }
    return result.count
  },

  // Client testimonials
  getAllTestimonials: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM client_testimonials ORDER BY sort_order, id')
    return stmt.all()
  },

  // Media files
  getAllMediaFiles: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM media_files ORDER BY uploaded_at DESC')
    return stmt.all()
  },

  // SEO settings
  getAllSEOSettings: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM seo_settings ORDER BY page')
    return stmt.all()
  },

  setSEOSettings: (page: string, seoData: any) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO seo_settings (
        page, title, description, keywords, og_title, og_description, 
        og_image, canonical_url, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `)
    return stmt.run(
      page,
      seoData.title,
      seoData.description,
      seoData.keywords,
      seoData.og_title,
      seoData.og_description,
      seoData.og_image,
      seoData.canonical_url
    )
  },

  // Media files operations
  deleteMediaFile: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM media_files WHERE id = ?')
    return stmt.run(id)
  },

  saveMediaFile: (fileData: any) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO media_files (filename, original_name, file_path, file_size, mime_type, alt_text) 
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      fileData.filename,
      fileData.originalName,
      fileData.filePath,
      fileData.fileSize,
      fileData.mimeType,
      fileData.altText || null
    )
  },

  // Admin authentication
  getAdminByUsername: (username: string) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ?')
    return stmt.get(username)
  }
}

// This ensures the database is closed when the Node.js process exits
if (typeof process !== 'undefined') {
  process.on('exit', () => {
    if (db) {
      db.close();
    }
  });
}
