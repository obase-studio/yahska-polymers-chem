-- Supabase PostgreSQL Schema for Yahska Polymers Chemical Website
-- Run this script in your Supabase SQL Editor

-- Enable Row Level Security (RLS) and necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Website content management table
CREATE TABLE site_content (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    section VARCHAR(255) NOT NULL,
    content_key VARCHAR(255) NOT NULL,
    content_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page, section, content_key)
);

-- Product categories table
CREATE TABLE product_categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Products table with detailed specifications
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(255),
    category_id VARCHAR(255) NOT NULL,
    applications JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    usage TEXT,
    advantages TEXT,
    technical_specifications TEXT,
    packaging_info TEXT,
    safety_information TEXT,
    product_code VARCHAR(255),
    specification_pdf TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE RESTRICT
);

-- Product images for gallery
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'gallery',
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Project categories
CREATE TABLE project_categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Projects showcase
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    client_name VARCHAR(255),
    completion_date VARCHAR(255),
    project_value VARCHAR(255),
    key_features JSONB DEFAULT '[]'::jsonb,
    challenges TEXT,
    solutions TEXT,
    image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    project_info_details TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category) REFERENCES project_categories(id) ON DELETE RESTRICT
);

-- Client testimonials
CREATE TABLE client_testimonials (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_description TEXT,
    testimonial_text TEXT,
    partnership_years VARCHAR(255),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client information
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    project_type VARCHAR(255),
    location VARCHAR(255),
    partnership_since VARCHAR(255),
    project_value VARCHAR(255),
    description TEXT,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Approvals, certifications, and licenses
CREATE TABLE approvals (
    id SERIAL PRIMARY KEY,
    authority_name VARCHAR(255) NOT NULL,
    approval_type VARCHAR(100),
    description TEXT,
    validity_period VARCHAR(255),
    certificate_number VARCHAR(255),
    issue_date VARCHAR(255),
    expiry_date VARCHAR(255),
    logo_url TEXT NOT NULL,
    certificate_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEO settings for different pages
CREATE TABLE seo_settings (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    keywords TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    canonical_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media files management
CREATE TABLE media_files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(255),
    alt_text TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content change history for auditing
CREATE TABLE content_history (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    section VARCHAR(255) NOT NULL,
    content_key VARCHAR(255) NOT NULL,
    content_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) DEFAULT 'admin'
);

-- Company information fields
CREATE TABLE company_info (
    id SERIAL PRIMARY KEY,
    field_name VARCHAR(255) UNIQUE NOT NULL,
    field_value TEXT,
    field_type VARCHAR(50) DEFAULT 'text',
    category VARCHAR(255) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_updated_at ON products(updated_at);

CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_active ON projects(is_active);
CREATE INDEX idx_projects_featured ON projects(is_featured);

CREATE INDEX idx_clients_active ON clients(is_active);
CREATE INDEX idx_clients_featured ON clients(is_featured);

CREATE INDEX idx_approvals_active ON approvals(is_active);
CREATE INDEX idx_approvals_type ON approvals(approval_type);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_active ON product_images(is_active);

CREATE INDEX idx_company_info_category ON company_info(category);
CREATE INDEX idx_company_info_active ON company_info(is_active);

CREATE INDEX idx_site_content_page ON site_content(page);
CREATE INDEX idx_site_content_section ON site_content(section);

-- Create triggers for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_info_updated_at BEFORE UPDATE ON company_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Public read access for website content (adjust based on your needs)
CREATE POLICY "Public read access" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON product_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON project_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON client_testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON clients FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON approvals FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON media_files FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_info FOR SELECT USING (is_active = true);

-- Admin-only access for admin_users table
CREATE POLICY "Admin only" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Content history is read-only for auditing
CREATE POLICY "Read only access" ON content_history FOR SELECT USING (true);
