#!/usr/bin/env node

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, '../admin.db');
const db = new Database(dbPath);

// Output directory for CSVs
const outputDir = path.join(__dirname, '../csv_exports');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🔄 Exporting database data to CSV files...\n');

// Helper function to escape CSV values
function escapeCsv(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const str = String(value);
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Helper function to convert array to CSV
function arrayToCsv(data, headers) {
  if (!data || data.length === 0) {
    return headers.join(',') + '\n';
  }
  
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const csvRow = headers.map(header => escapeCsv(row[header]));
    csvRows.push(csvRow.join(','));
  });
  
  return csvRows.join('\n');
}

// Export functions for each table
function exportProductCategories() {
  console.log('📦 Exporting product categories...');
  const data = db.prepare('SELECT * FROM product_categories ORDER BY sort_order').all();
  const headers = ['id', 'name', 'description', 'sort_order', 'is_active'];
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '01_product_categories.csv'), csv);
  console.log(`✅ Exported ${data.length} product categories`);
}

function exportProducts() {
  console.log('🛍️ Exporting products...');
  const data = db.prepare(`
    SELECT 
      name, description, price, category_id, applications, features, 
      image_url, is_active, usage, advantages, technical_specifications, 
      packaging_info, safety_information, product_code, specification_pdf,
      created_at, updated_at
    FROM products 
    ORDER BY updated_at DESC
  `).all();
  
  const headers = [
    'name', 'description', 'price', 'category_id', 'applications', 'features',
    'image_url', 'is_active', 'usage', 'advantages', 'technical_specifications',
    'packaging_info', 'safety_information', 'product_code', 'specification_pdf',
    'created_at', 'updated_at'
  ];
  
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '02_products.csv'), csv);
  console.log(`✅ Exported ${data.length} products`);
}

function exportProjectCategories() {
  console.log('🏗️ Exporting project categories...');
  const data = db.prepare('SELECT * FROM project_categories ORDER BY sort_order').all();
  const headers = ['id', 'name', 'description', 'icon_url', 'sort_order', 'is_active'];
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '03_project_categories.csv'), csv);
  console.log(`✅ Exported ${data.length} project categories`);
}

function exportProjects() {
  console.log('🏢 Exporting projects...');
  const data = db.prepare(`
    SELECT 
      name, description, category, location, client_name, completion_date,
      project_value, key_features, challenges, solutions, image_url,
      gallery_images, project_info_details, is_featured, is_active, sort_order, created_at, updated_at
    FROM projects 
    ORDER BY sort_order, updated_at DESC
  `).all();
  
  const headers = [
    'name', 'description', 'category', 'location', 'client_name', 'completion_date',
    'project_value', 'key_features', 'challenges', 'solutions', 'image_url',
    'gallery_images', 'project_info_details', 'is_featured', 'is_active', 'sort_order', 'created_at', 'updated_at'
  ];
  
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '04_projects.csv'), csv);
  console.log(`✅ Exported ${data.length} projects`);
}

function exportClients() {
  console.log('🏢 Exporting clients...');
  const data = db.prepare(`
    SELECT 
      company_name, industry, project_type, location, partnership_since,
      project_value, description, logo_url, website_url, is_featured,
      is_active, sort_order, created_at
    FROM clients 
    ORDER BY sort_order
  `).all();
  
  const headers = [
    'company_name', 'industry', 'project_type', 'location', 'partnership_since',
    'project_value', 'description', 'logo_url', 'website_url', 'is_featured',
    'is_active', 'sort_order', 'created_at'
  ];
  
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '05_clients.csv'), csv);
  console.log(`✅ Exported ${data.length} clients`);
}

function exportApprovals() {
  console.log('🏅 Exporting approvals...');
  const data = db.prepare(`
    SELECT 
      authority_name, approval_type, description, validity_period,
      certificate_number, issue_date, expiry_date, logo_url, certificate_url,
      is_active, sort_order, created_at
    FROM approvals 
    ORDER BY sort_order
  `).all();
  
  const headers = [
    'authority_name', 'approval_type', 'description', 'validity_period',
    'certificate_number', 'issue_date', 'expiry_date', 'logo_url', 'certificate_url',
    'is_active', 'sort_order', 'created_at'
  ];
  
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '06_approvals.csv'), csv);
  console.log(`✅ Exported ${data.length} approvals`);
}

function exportMediaFiles() {
  console.log('📁 Exporting media files...');
  const data = db.prepare(`
    SELECT 
      filename, original_name, file_path, file_size, mime_type, 
      alt_text, uploaded_at
    FROM media_files 
    ORDER BY uploaded_at DESC
  `).all();
  
  const headers = [
    'filename', 'original_name', 'file_path', 'file_size', 'mime_type',
    'alt_text', 'uploaded_at'
  ];
  
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '07_media_files.csv'), csv);
  console.log(`✅ Exported ${data.length} media files`);
}

function exportProductImages() {
  console.log('🖼️ Exporting product images...');
  const data = db.prepare(`
    SELECT 
      product_id, image_url, image_type, alt_text, sort_order, is_active
    FROM product_images 
    ORDER BY product_id, sort_order
  `).all();
  
  const headers = ['product_id', 'image_url', 'image_type', 'alt_text', 'sort_order', 'is_active'];
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '08_product_images.csv'), csv);
  console.log(`✅ Exported ${data.length} product images`);
}

function exportCompanyInfo() {
  console.log('🏢 Exporting company info...');
  const data = db.prepare(`
    SELECT 
      field_name, field_value, field_type, category, is_active, updated_at
    FROM company_info 
    ORDER BY category, field_name
  `).all();
  
  const headers = ['field_name', 'field_value', 'field_type', 'category', 'is_active', 'updated_at'];
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '09_company_info.csv'), csv);
  console.log(`✅ Exported ${data.length} company info items`);
}

function exportSEOSettings() {
  console.log('🔍 Exporting SEO settings...');
  const data = db.prepare(`
    SELECT 
      page, title, description, keywords, og_title, og_description,
      og_image, canonical_url, updated_at
    FROM seo_settings 
    ORDER BY page
  `).all();
  
  const headers = [
    'page', 'title', 'description', 'keywords', 'og_title', 'og_description',
    'og_image', 'canonical_url', 'updated_at'
  ];
  
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '10_seo_settings.csv'), csv);
  console.log(`✅ Exported ${data.length} SEO settings`);
}

function exportSiteContent() {
  console.log('📝 Exporting site content...');
  const data = db.prepare(`
    SELECT 
      page, section, content_key, content_value, updated_at
    FROM site_content 
    ORDER BY page, section, content_key
  `).all();
  
  const headers = ['page', 'section', 'content_key', 'content_value', 'updated_at'];
  const csv = arrayToCsv(data, headers);
  fs.writeFileSync(path.join(outputDir, '11_site_content.csv'), csv);
  console.log(`✅ Exported ${data.length} site content items`);
}

// Main export function
function runExport() {
  try {
    console.log(`📂 Output directory: ${outputDir}\n`);
    
    exportProductCategories();
    exportProducts();
    exportProjectCategories();
    exportProjects();
    exportClients();
    exportApprovals();
    exportMediaFiles();
    exportProductImages();
    exportCompanyInfo();
    exportSEOSettings();
    exportSiteContent();
    
    console.log('\n🎉 Export completed successfully!');
    console.log(`\n📁 CSV files saved to: ${outputDir}`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the exported CSV files');
    console.log('2. Edit data as needed');
    console.log('3. Import to Supabase using the import templates');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    db.close();
    console.log('\n🔒 Database connection closed');
  }
}

// Check if database exists
if (!fs.existsSync(dbPath)) {
  console.error('❌ SQLite database not found at:', dbPath);
  process.exit(1);
}

// Run the export
runExport();
