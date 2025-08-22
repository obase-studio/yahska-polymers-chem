const XLSX = require('xlsx');
const path = require('path');
const Database = require('better-sqlite3');

// Database connection
const dbPath = path.join(__dirname, '../admin.db');
const db = new Database(dbPath);

console.log('🚀 Starting Excel Product Catalog Import...');
console.log('📁 Database:', dbPath);

// Read the Excel file
const excelPath = path.join(__dirname, '../client_documentation/Products Catalogue.xlsx');
console.log('📊 Excel file:', excelPath);

try {
  const workbook = XLSX.readFile(excelPath);
  const worksheet = workbook.Sheets['Sheet1'];
  
  // Convert to JSON with headers
  const products = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`\n📈 Found ${products.length} products to import`);
  
  // Clean and validate data
  const validProducts = products.filter(product => {
    return product['Category'] && 
           product['Product Name'] && 
           product['Description'] &&
           product['Category'] !== 'For Letterhead & Business Cards::' &&
           product['Category'] !== '• Admixtures • Curing Compound • Segmental Glue • Crystalline • Micro Silica • Grouts • Accelerator • Others';
  });
  
  console.log(`✅ Valid products: ${validProducts.length}`);
  
  // Map Excel categories to database categories
  const categoryMapping = {
    'Admixtures': 'concrete',
    'Accelerators': 'concrete',
    'Misc Admixtures': 'concrete',
    'Curing Compound': 'construction',
    'Floor Hardeners': 'construction',
    'Grouts': 'construction',
    'Structural Bonding': 'construction',
    'Integral Waterproofing': 'construction',
    'Corrosion Inhibitor': 'construction',
    'Micro Silica': 'construction',
    'Mould Release Agent': 'construction',
    'Other': 'construction'
  };
  
  // Get existing categories from database
  const existingCategories = db.prepare('SELECT id, name FROM product_categories').all();
  console.log('\n🏷️  Existing database categories:');
  existingCategories.forEach(cat => {
    console.log(`  • ${cat.id}: ${cat.name}`);
  });
  
  // Create new categories if needed
  const newCategories = [];
  validProducts.forEach(product => {
    const excelCategory = product['Category'];
    if (!categoryMapping[excelCategory] && !existingCategories.find(cat => cat.name === excelCategory)) {
      newCategories.push(excelCategory);
    }
  });
  
  if (newCategories.length > 0) {
    console.log('\n🆕 New categories to add:');
    newCategories.forEach(cat => console.log(`  • ${cat}`));
    
    // Add new categories to database
    const insertCategoryStmt = db.prepare(`
      INSERT INTO product_categories (id, name, description, sort_order) 
      VALUES (?, ?, ?, ?)
    `);
    
    newCategories.forEach((category, index) => {
      const categoryId = category.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const description = `Products in the ${category} category`;
      const sortOrder = existingCategories.length + index + 1;
      
      try {
        insertCategoryStmt.run(categoryId, category, description, sortOrder);
        console.log(`  ✅ Added category: ${category}`);
      } catch (error) {
        console.log(`  ⚠️  Category ${category} already exists or error: ${error.message}`);
      }
    });
  }
  
  // Update category mapping with new categories
  newCategories.forEach(category => {
    const categoryId = category.toLowerCase().replace(/[^a-z0-9]/g, '_');
    categoryMapping[category] = categoryId;
  });
  
  console.log('\n🔄 Category mapping:');
  Object.entries(categoryMapping).forEach(([excel, dbCat]) => {
    console.log(`  ${excel} → ${dbCat}`);
  });
  
  // Prepare insert statement
  const insertProductStmt = db.prepare(`
    INSERT INTO products (
      name, description, category_id, applications, features, 
      usage, advantages, technical_specifications, 
      product_code, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  
  // Import products
  console.log('\n📦 Importing products...');
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  validProducts.forEach((product, index) => {
    try {
      const excelCategory = product['Category'];
      const dbCategory = categoryMapping[excelCategory] || 'construction';
      
      // Check if product already exists
      const existingProduct = db.prepare('SELECT id FROM products WHERE name = ?').get(product['Product Name']);
      if (existingProduct) {
        console.log(`  ⏭️  Skipped (exists): ${product['Product Name']}`);
        skipped++;
        return;
      }
      
      // Prepare data
      const productData = {
        name: product['Product Name'].trim(),
        description: product['Description']?.trim() || '',
        category_id: dbCategory,
        applications: product['Uses']?.split('\n').filter(use => use.trim()) || [],
        features: product['Advantages']?.split('\n').filter(adv => adv.trim()) || [],
        usage: product['Uses']?.trim() || '',
        advantages: product['Advantages']?.trim() || '',
        technical_specifications: '',
        product_code: `YP-${product['Product Name'].replace(/[^A-Z0-9]/g, '')}`,
        is_active: 1
      };
      
      // Insert product
      insertProductStmt.run(
        productData.name,
        productData.description,
        productData.category_id,
        JSON.stringify(productData.applications),
        JSON.stringify(productData.features),
        productData.usage,
        productData.advantages,
        productData.technical_specifications,
        productData.product_code,
        productData.is_active
      );
      
      imported++;
      if (imported % 10 === 0) {
        console.log(`  ✅ Imported ${imported} products...`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error importing ${product['Product Name']}: ${error.message}`);
      errors++;
    }
  });
  
  // Final summary
  console.log('\n🎉 Import Complete!');
  console.log('==================');
  console.log(`📊 Total products processed: ${validProducts.length}`);
  console.log(`✅ Successfully imported: ${imported}`);
  console.log(`⏭️  Skipped (already exist): ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  
  // Show final database status
  const finalCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  console.log(`\n📈 Total products in database: ${finalCount.count}`);
  
  // Show products by category
  const productsByCategory = db.prepare(`
    SELECT pc.name as category, COUNT(p.id) as count 
    FROM product_categories pc 
    LEFT JOIN products p ON pc.id = p.category_id 
    GROUP BY pc.id, pc.name 
    ORDER BY pc.sort_order
  `).all();
  
  console.log('\n🏷️  Products by category:');
  productsByCategory.forEach(cat => {
    console.log(`  • ${cat.category}: ${cat.count} products`);
  });
  
} catch (error) {
  console.error('❌ Fatal error during import:', error.message);
  console.error(error.stack);
} finally {
  db.close();
  console.log('\n🔒 Database connection closed');
}
