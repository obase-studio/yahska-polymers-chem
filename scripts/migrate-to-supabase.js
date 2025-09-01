const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Configuration - UPDATE THESE VALUES
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jlbwwbnatmmkcizqprdx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYnd3Ym5hdG1ta2NpenFwcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ4Nzg4MiwiZXhwIjoyMDcyMDYzODgyfQ.VRsTCJYa_lrRmhaNTInT9FnozS4B-imm0NCPr20ynkw'; // Use service key for admin operations

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// SQLite database path
const sqliteDbPath = path.join(__dirname, '../admin.db');

// Check if SQLite database exists
if (!fs.existsSync(sqliteDbPath)) {
  console.error('❌ SQLite database not found at:', sqliteDbPath);
  process.exit(1);
}

const db = new Database(sqliteDbPath);

console.log('🚀 Starting migration from SQLite to Supabase...');
console.log('📁 SQLite DB:', sqliteDbPath);
console.log('🌐 Supabase URL:', SUPABASE_URL);

// Helper function to convert SQLite boolean to PostgreSQL boolean
function convertBoolean(value) {
  return value === 1 || value === true;
}

// Helper function to safely parse JSON
function safeJSONParse(jsonString) {
  if (!jsonString) return [];
  try {
    const cleanedString = jsonString.replace(/\r/g, '').replace(/\n/g, '');
    return JSON.parse(cleanedString);
  } catch (error) {
    console.warn('Failed to parse JSON:', jsonString, error.message);
    return [];
  }
}

// Migration functions for each table
async function migrateAdminUsers() {
  console.log('\n👤 Migrating admin_users...');
  
  const users = db.prepare('SELECT * FROM admin_users').all();
  console.log(`Found ${users.length} admin users`);
  
  for (const user of users) {
    const { error } = await supabase
      .from('admin_users')
      .insert({
        username: user.username,
        password: user.password,
        created_at: user.created_at
      });
    
    if (error) {
      console.error(`❌ Error inserting user ${user.username}:`, error.message);
    } else {
      console.log(`✅ Migrated user: ${user.username}`);
    }
  }
}

async function migrateProductCategories() {
  console.log('\n📦 Migrating product_categories...');
  
  const categories = db.prepare('SELECT * FROM product_categories').all();
  console.log(`Found ${categories.length} product categories`);
  
  for (const category of categories) {
    const { error } = await supabase
      .from('product_categories')
      .insert({
        id: category.id,
        name: category.name,
        description: category.description,
        sort_order: category.sort_order,
        is_active: convertBoolean(category.is_active)
      });
    
    if (error) {
      console.error(`❌ Error inserting category ${category.name}:`, error.message);
    } else {
      console.log(`✅ Migrated category: ${category.name}`);
    }
  }
}

async function migrateProducts() {
  console.log('\n🛍️ Migrating products...');
  
  const products = db.prepare('SELECT * FROM products').all();
  console.log(`Found ${products.length} products`);
  
  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        applications: safeJSONParse(product.applications),
        features: safeJSONParse(product.features),
        image_url: product.image_url,
        is_active: convertBoolean(product.is_active),
        usage: product.usage,
        advantages: product.advantages,
        technical_specifications: product.technical_specifications,
        packaging_info: product.packaging_info,
        safety_information: product.safety_information,
        product_code: product.product_code,
        specification_pdf: product.specification_pdf,
        created_at: product.created_at,
        updated_at: product.updated_at
      });
    
    if (error) {
      console.error(`❌ Error inserting product ${product.name}:`, error.message);
    } else {
      console.log(`✅ Migrated product: ${product.name}`);
    }
  }
}

async function migrateProjectCategories() {
  console.log('\n🏗️ Migrating project_categories...');
  
  // Check if table exists
  try {
    const categories = db.prepare('SELECT * FROM project_categories').all();
    console.log(`Found ${categories.length} project categories`);
    
    for (const category of categories) {
      const { error } = await supabase
        .from('project_categories')
        .insert({
          id: category.id,
          name: category.name,
          description: category.description,
          icon_url: category.icon_url,
          sort_order: category.sort_order,
          is_active: convertBoolean(category.is_active)
        });
      
      if (error) {
        console.error(`❌ Error inserting project category ${category.name}:`, error.message);
      } else {
        console.log(`✅ Migrated project category: ${category.name}`);
      }
    }
  } catch (error) {
    console.log('⚠️ project_categories table not found, skipping...');
  }
}

async function migrateProjects() {
  console.log('\n🏢 Migrating projects...');
  
  try {
    const projects = db.prepare('SELECT * FROM projects').all();
    console.log(`Found ${projects.length} projects`);
    
    for (const project of projects) {
      const { error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          category: project.category,
          location: project.location,
          client_name: project.client_name,
          completion_date: project.completion_date,
          project_value: project.project_value,
          key_features: safeJSONParse(project.key_features),
          challenges: project.challenges,
          solutions: project.solutions,
          image_url: project.image_url,
          gallery_images: safeJSONParse(project.gallery_images),
          is_featured: convertBoolean(project.is_featured),
          is_active: convertBoolean(project.is_active),
          sort_order: project.sort_order,
          created_at: project.created_at,
          updated_at: project.updated_at
        });
      
      if (error) {
        console.error(`❌ Error inserting project ${project.name}:`, error.message);
      } else {
        console.log(`✅ Migrated project: ${project.name}`);
      }
    }
  } catch (error) {
    console.log('⚠️ projects table not found, skipping...');
  }
}

async function migrateSiteContent() {
  console.log('\n📝 Migrating site_content...');
  
  const content = db.prepare('SELECT * FROM site_content').all();
  console.log(`Found ${content.length} content items`);
  
  for (const item of content) {
    const { error } = await supabase
      .from('site_content')
      .insert({
        page: item.page,
        section: item.section,
        content_key: item.content_key,
        content_value: item.content_value,
        updated_at: item.updated_at
      });
    
    if (error) {
      console.error(`❌ Error inserting content ${item.page}/${item.section}/${item.content_key}:`, error.message);
    } else {
      console.log(`✅ Migrated content: ${item.page}/${item.section}/${item.content_key}`);
    }
  }
}

async function migrateClientTestimonials() {
  console.log('\n💬 Migrating client_testimonials...');
  
  try {
    const testimonials = db.prepare('SELECT * FROM client_testimonials').all();
    console.log(`Found ${testimonials.length} testimonials`);
    
    for (const testimonial of testimonials) {
      const { error } = await supabase
        .from('client_testimonials')
        .insert({
          client_name: testimonial.client_name,
          client_description: testimonial.client_description,
          testimonial_text: testimonial.testimonial_text,
          partnership_years: testimonial.partnership_years,
          logo_url: testimonial.logo_url,
          is_active: convertBoolean(testimonial.is_active),
          sort_order: testimonial.sort_order,
          created_at: testimonial.created_at
        });
      
      if (error) {
        console.error(`❌ Error inserting testimonial from ${testimonial.client_name}:`, error.message);
      } else {
        console.log(`✅ Migrated testimonial: ${testimonial.client_name}`);
      }
    }
  } catch (error) {
    console.log('⚠️ client_testimonials table not found, skipping...');
  }
}

async function migrateClients() {
  console.log('\n🏢 Migrating clients...');
  
  try {
    const clients = db.prepare('SELECT * FROM clients').all();
    console.log(`Found ${clients.length} clients`);
    
    for (const client of clients) {
      const { error } = await supabase
        .from('clients')
        .insert({
          company_name: client.company_name,
          industry: client.industry,
          project_type: client.project_type,
          location: client.location,
          partnership_since: client.partnership_since,
          project_value: client.project_value,
          description: client.description,
          logo_url: client.logo_url,
          website_url: client.website_url,
          is_featured: convertBoolean(client.is_featured),
          is_active: convertBoolean(client.is_active),
          sort_order: client.sort_order,
          created_at: client.created_at
        });
      
      if (error) {
        console.error(`❌ Error inserting client ${client.company_name}:`, error.message);
      } else {
        console.log(`✅ Migrated client: ${client.company_name}`);
      }
    }
  } catch (error) {
    console.log('⚠️ clients table not found, skipping...');
  }
}

async function migrateApprovals() {
  console.log('\n🏅 Migrating approvals...');
  
  try {
    const approvals = db.prepare('SELECT * FROM approvals').all();
    console.log(`Found ${approvals.length} approvals`);
    
    for (const approval of approvals) {
      const { error } = await supabase
        .from('approvals')
        .insert({
          authority_name: approval.authority_name,
          approval_type: approval.approval_type,
          description: approval.description,
          validity_period: approval.validity_period,
          certificate_number: approval.certificate_number,
          issue_date: approval.issue_date,
          expiry_date: approval.expiry_date,
          logo_url: approval.logo_url,
          certificate_url: approval.certificate_url,
          is_active: convertBoolean(approval.is_active),
          sort_order: approval.sort_order,
          created_at: approval.created_at
        });
      
      if (error) {
        console.error(`❌ Error inserting approval ${approval.authority_name}:`, error.message);
      } else {
        console.log(`✅ Migrated approval: ${approval.authority_name}`);
      }
    }
  } catch (error) {
    console.log('⚠️ approvals table not found, skipping...');
  }
}

async function migrateSEOSettings() {
  console.log('\n🔍 Migrating seo_settings...');
  
  try {
    const seoSettings = db.prepare('SELECT * FROM seo_settings').all();
    console.log(`Found ${seoSettings.length} SEO settings`);
    
    for (const seo of seoSettings) {
      const { error } = await supabase
        .from('seo_settings')
        .insert({
          page: seo.page,
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
          og_title: seo.og_title,
          og_description: seo.og_description,
          og_image: seo.og_image,
          canonical_url: seo.canonical_url,
          updated_at: seo.updated_at
        });
      
      if (error) {
        console.error(`❌ Error inserting SEO settings for ${seo.page}:`, error.message);
      } else {
        console.log(`✅ Migrated SEO settings: ${seo.page}`);
      }
    }
  } catch (error) {
    console.log('⚠️ seo_settings table not found, skipping...');
  }
}

async function migrateMediaFiles() {
  console.log('\n📁 Migrating media_files...');
  
  try {
    const mediaFiles = db.prepare('SELECT * FROM media_files').all();
    console.log(`Found ${mediaFiles.length} media files`);
    
    for (const media of mediaFiles) {
      const { error } = await supabase
        .from('media_files')
        .insert({
          filename: media.filename,
          original_name: media.original_name,
          file_path: media.file_path,
          file_size: media.file_size,
          mime_type: media.mime_type,
          alt_text: media.alt_text,
          uploaded_at: media.uploaded_at
        });
      
      if (error) {
        console.error(`❌ Error inserting media file ${media.filename}:`, error.message);
      } else {
        console.log(`✅ Migrated media file: ${media.filename}`);
      }
    }
  } catch (error) {
    console.log('⚠️ media_files table not found, skipping...');
  }
}

async function migrateCompanyInfo() {
  console.log('\n🏢 Migrating company_info...');
  
  try {
    const companyInfo = db.prepare('SELECT * FROM company_info').all();
    console.log(`Found ${companyInfo.length} company info items`);
    
    for (const info of companyInfo) {
      const { error } = await supabase
        .from('company_info')
        .insert({
          field_name: info.field_name,
          field_value: info.field_value,
          field_type: info.field_type,
          category: info.category,
          is_active: convertBoolean(info.is_active),
          updated_at: info.updated_at
        });
      
      if (error) {
        console.error(`❌ Error inserting company info ${info.field_name}:`, error.message);
      } else {
        console.log(`✅ Migrated company info: ${info.field_name}`);
      }
    }
  } catch (error) {
    console.log('⚠️ company_info table not found, skipping...');
  }
}

async function migrateProductImages() {
  console.log('\n🖼️ Migrating product_images...');
  
  try {
    const productImages = db.prepare('SELECT * FROM product_images').all();
    console.log(`Found ${productImages.length} product images`);
    
    for (const image of productImages) {
      const { error } = await supabase
        .from('product_images')
        .insert({
          product_id: image.product_id,
          image_url: image.image_url,
          image_type: image.image_type,
          alt_text: image.alt_text,
          sort_order: image.sort_order,
          is_active: convertBoolean(image.is_active)
        });
      
      if (error) {
        console.error(`❌ Error inserting product image for product ${image.product_id}:`, error.message);
      } else {
        console.log(`✅ Migrated product image for product: ${image.product_id}`);
      }
    }
  } catch (error) {
    console.log('⚠️ product_images table not found, skipping...');
  }
}

// Main migration function
async function runMigration() {
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('admin_users').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      process.exit(1);
    }
    console.log('✅ Supabase connection successful');

    // Run migrations in order (respecting foreign key dependencies)
    await migrateAdminUsers();
    await migrateProductCategories();
    await migrateProducts();
    await migrateProjectCategories();
    await migrateProjects();
    await migrateSiteContent();
    await migrateClientTestimonials();
    await migrateClients();
    await migrateApprovals();
    await migrateSEOSettings();
    await migrateMediaFiles();
    await migrateCompanyInfo();
    await migrateProductImages();

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    
    // Get counts from Supabase
    const tables = [
      'admin_users', 'product_categories', 'products', 'site_content',
      'client_testimonials', 'clients', 'approvals', 'seo_settings',
      'media_files', 'company_info', 'product_images'
    ];
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`  • ${table}: ${count} records`);
        }
      } catch (e) {
        // Table might not exist or might be empty
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    db.close();
    console.log('\n🔒 SQLite database connection closed');
  }
}

// Check for required environment variables
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_SERVICE_KEY === 'YOUR_SUPABASE_SERVICE_KEY') {
  console.error('❌ Please set your Supabase credentials in environment variables:');
  console.error('   SUPABASE_URL=your_supabase_url');
  console.error('   SUPABASE_SERVICE_KEY=your_service_key');
  console.error('\nOr edit this script directly to add your credentials.');
  process.exit(1);
}

// Run the migration
runMigration();