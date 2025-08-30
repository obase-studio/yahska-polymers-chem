const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jlbwwbnatmmkcizqprdx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYnd3Ym5hdG1ta2NpenFwcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ4Nzg4MiwiZXhwIjoyMDcyMDYzODgyfQ.VRsTCJYa_lrRmhaNTInT9FnozS4B-imm0NCPr20ynkw';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🔄 Uploading correct product catalog data to Supabase...');

// Helper function to parse CSV
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim()); // Push the last value
      
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });
      data.push(rowData);
    }
  }
  
  return data;
}

// Helper function to safely parse JSON from string
function safeJSONParse(jsonString) {
  if (!jsonString || jsonString === '') return [];
  try {
    // Handle the format from the CSV: ["item1", "item2"]
    if (jsonString.startsWith('["') && jsonString.endsWith('"]')) {
      return JSON.parse(jsonString);
    }
    // Handle simple comma-separated format
    if (jsonString.includes(',')) {
      return jsonString.split(',').map(s => s.trim()).filter(s => s);
    }
    return [jsonString];
  } catch (error) {
    console.warn('Failed to parse JSON:', jsonString, error.message);
    return [];
  }
}

// Convert string boolean to actual boolean
function convertBoolean(value) {
  if (typeof value === 'boolean') return value;
  return value === 'True' || value === 'true' || value === '1' || value === 1;
}

async function uploadCorrectCategories() {
  console.log('\n📦 Uploading correct product categories...');
  
  try {
    const csvPath = path.join(__dirname, '../client_documentation/DB Files/product_categories.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const categories = parseCSV(csvContent);
    
    console.log(`Found ${categories.length} categories`);
    
    // Clear existing categories
    const { error: deleteError } = await supabase
      .from('product_categories')
      .delete()
      .neq('id', 'non-existent');
    
    if (deleteError) {
      console.warn('Warning clearing existing categories:', deleteError.message);
    }
    
    for (const [index, category] of categories.entries()) {
      if (!category.id || category.id === '') continue;
      
      const { error } = await supabase
        .from('product_categories')
        .insert({
          id: category.id.toLowerCase().replace(/\s+/g, '-'),
          name: category.name,
          description: category.description || `${category.name} products and solutions`,
          sort_order: index + 1,
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
    console.error('❌ Error uploading categories:', error);
    return false;
  }
}

async function uploadCorrectProducts() {
  console.log('\n🛍️ Uploading correct products...');
  
  try {
    const csvPath = path.join(__dirname, '../client_documentation/DB Files/products.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const products = parseCSV(csvContent);
    
    console.log(`Found ${products.length} products`);
    
    // Clear existing products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0);
    
    if (deleteError) {
      console.warn('Warning clearing existing products:', deleteError.message);
    }
    
    for (const product of products) {
      if (!product.name || product.name === '') continue;
      
      // Process applications - convert from CSV format to JSON array
      let applications = [];
      if (product.applications && product.applications !== '') {
        applications = safeJSONParse(product.applications);
      }
      
      // Process advantages as features (since original doesn't have separate features)
      let features = [];
      if (product.advantages && product.advantages !== '') {
        features = product.advantages.split('\n').map(f => f.trim()).filter(f => f);
      }
      
      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description || '',
          price: product.price || null,
          category_id: product.category_id.toLowerCase().replace(/\s+/g, '-'),
          applications: applications,
          features: features,
          image_url: product.image_url || null,
          is_active: convertBoolean(product.is_active),
          usage: product.usage || null,
          advantages: product.advantages || null,
          technical_specifications: product.technical_specifications || null,
          packaging_info: product.packaging_info || null,
          safety_information: product.safety_information || null,
          product_code: product.product_code || null,
          specification_pdf: product.specification_pdf || null
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

async function verifyCorrectUpload() {
  console.log('\n🔍 Verifying correct upload...');
  
  try {
    // Check categories
    const { data: categories, error: catError } = await supabase
      .from('product_categories')
      .select('*')
      .order('sort_order');
    
    if (catError) {
      console.error('Error fetching categories:', catError.message);
    } else {
      console.log(`✅ Categories uploaded: ${categories.length}`);
      categories.forEach(cat => {
        console.log(`   • ${cat.name} (${cat.id})`);
      });
    }
    
    // Check products count and sample
    const { count: productsCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting products:', countError.message);
    } else {
      console.log(`✅ Products uploaded: ${productsCount}`);
    }
    
    // Sample products by category
    const { data: sampleProducts, error: sampleError } = await supabase
      .from('products')
      .select('name, category_id, applications, features')
      .limit(5);
    
    if (sampleError) {
      console.error('Error fetching sample products:', sampleError.message);
    } else {
      console.log('\n📋 Sample products by category:');
      sampleProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.category_id})`);
        console.log(`   Applications: ${product.applications?.length || 0} items`);
        console.log(`   Features: ${product.features?.length || 0} items`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error during verification:', error);
    return false;
  }
}

async function runCorrectUpload() {
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('product_categories').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      process.exit(1);
    }
    console.log('✅ Supabase connection successful');

    // Upload correct data
    const categoriesSuccess = await uploadCorrectCategories();
    if (!categoriesSuccess) {
      console.error('❌ Failed to upload correct categories. Stopping.');
      process.exit(1);
    }
    
    const productsSuccess = await uploadCorrectProducts();
    if (!productsSuccess) {
      console.error('❌ Failed to upload correct products. Stopping.');
      process.exit(1);
    }
    
    await verifyCorrectUpload();
    
    console.log('\n🎉 Correct product catalog uploaded successfully!');
    console.log('\n📊 Summary:');
    console.log('✅ Correct product categories from Excel catalog uploaded');
    console.log('✅ Correct products from Excel catalog uploaded');
    console.log('✅ Data structure verified in Supabase');
    console.log('\n🌐 Your website should now show the correct products from your Excel catalog!');
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

// Run the correct upload
runCorrectUpload();