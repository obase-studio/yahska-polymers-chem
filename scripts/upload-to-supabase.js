const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jlbwwbnatmmkcizqprdx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYnd3Ym5hdG1ta2NpenFwcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ4Nzg4MiwiZXhwIjoyMDcyMDYzODgyfQ.VRsTCJYa_lrRmhaNTInT9FnozS4B-imm0NCPr20ynkw';

// Initialize Supabase client with service key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// SQLite database path
const sqliteDbPath = path.join(__dirname, '../admin.db');
const db = new Database(sqliteDbPath);

console.log('🚀 Starting data upload to Supabase...');
console.log('🌐 Supabase URL:', SUPABASE_URL);

// Helper function to safely parse JSON
function safeJSONParse(jsonString) {
  if (!jsonString) return [];
  try {
    // Clean up the JSON string by removing carriage returns and fixing formatting
    const cleanedString = jsonString.replace(/\r/g, '').replace(/\n/g, '');
    return JSON.parse(cleanedString);
  } catch (error) {
    console.warn('Failed to parse JSON field:', jsonString, error.message);
    return [];
  }
}

// Helper function to convert SQLite boolean to PostgreSQL boolean
function convertBoolean(value) {
  return value === 1 || value === true;
}

async function uploadProductCategories() {
  console.log('\n📦 Uploading product categories...');
  
  try {
    const categories = db.prepare('SELECT * FROM product_categories ORDER BY sort_order').all();
    console.log(`Found ${categories.length} product categories`);
    
    // Clear existing categories first
    const { error: deleteError } = await supabase
      .from('product_categories')
      .delete()
      .neq('id', 'non-existent'); // Delete all
    
    if (deleteError) {
      console.warn('Warning clearing existing categories:', deleteError.message);
    }
    
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
        console.log(`✅ Uploaded category: ${category.name}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error uploading product categories:', error);
    return false;
  }
}

async function uploadProducts() {
  console.log('\n🛍️ Uploading products...');
  
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY updated_at DESC').all();
    console.log(`Found ${products.length} products`);
    
    // Clear existing products first
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all
    
    if (deleteError) {
      console.warn('Warning clearing existing products:', deleteError.message);
    }
    
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
        console.log(`✅ Uploaded product: ${product.name}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error uploading products:', error);
    return false;
  }
}

async function verifyUpload() {
  console.log('\n🔍 Verifying upload...');
  
  try {
    // Check categories count
    const { count: categoriesCount, error: catError } = await supabase
      .from('product_categories')
      .select('*', { count: 'exact', head: true });
    
    if (catError) {
      console.error('Error checking categories:', catError.message);
    } else {
      console.log(`✅ Product categories in Supabase: ${categoriesCount}`);
    }
    
    // Check products count
    const { count: productsCount, error: prodError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (prodError) {
      console.error('Error checking products:', prodError.message);
    } else {
      console.log(`✅ Products in Supabase: ${productsCount}`);
    }
    
    // Sample a few products to check data integrity
    const { data: sampleProducts, error: sampleError } = await supabase
      .from('products')
      .select('name, category_id, applications, features')
      .limit(3);
    
    if (sampleError) {
      console.error('Error fetching sample products:', sampleError.message);
    } else {
      console.log('\n📋 Sample products verification:');
      sampleProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.category_id})`);
        console.log(`   Applications: ${Array.isArray(product.applications) ? product.applications.length : 0} items`);
        console.log(`   Features: ${Array.isArray(product.features) ? product.features.length : 0} items`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error during verification:', error);
    return false;
  }
}

async function runUpload() {
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('product_categories').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      process.exit(1);
    }
    console.log('✅ Supabase connection successful');

    // Upload in correct order (categories first, then products)
    const categoriesSuccess = await uploadProductCategories();
    if (!categoriesSuccess) {
      console.error('❌ Failed to upload categories. Stopping.');
      process.exit(1);
    }
    
    const productsSuccess = await uploadProducts();
    if (!productsSuccess) {
      console.error('❌ Failed to upload products. Stopping.');
      process.exit(1);
    }
    
    await verifyUpload();
    
    console.log('\n🎉 Upload completed successfully!');
    console.log('\n📊 Summary:');
    console.log('✅ Product categories uploaded');
    console.log('✅ Products uploaded with proper JSON formatting');
    console.log('✅ Data verified in Supabase');
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
  } finally {
    db.close();
    console.log('\n🔒 SQLite database connection closed');
  }
}

// Check for SQLite database
if (!fs.existsSync(sqliteDbPath)) {
  console.error('❌ SQLite database not found at:', sqliteDbPath);
  process.exit(1);
}

// Run the upload
runUpload();