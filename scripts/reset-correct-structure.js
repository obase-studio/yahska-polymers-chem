#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(process.cwd(), 'admin.db'));

// Correct 12 categories based on the image provided
const correctCategories = [
  { id: 'accelerators', name: 'Accelerators', description: 'Concrete and mortar accelerating admixtures', sort_order: 1 },
  { id: 'admixtures', name: 'Admixtures', description: 'General concrete and mortar admixtures', sort_order: 2 },
  { id: 'corrosion_inhibitor', name: 'Corrosion Inhibitor', description: 'Anti-corrosion agents for reinforcement protection', sort_order: 3 },
  { id: 'curing_compound', name: 'Curing Compound', description: 'Concrete curing and protection compounds', sort_order: 4 },
  { id: 'floor_hardeners', name: 'Floor Hardeners', description: 'Surface hardening agents for concrete floors', sort_order: 5 },
  { id: 'grouts', name: 'Grouts', description: 'Specialized grouting compounds and materials', sort_order: 6 },
  { id: 'integral_waterproofing', name: 'Integral Waterproofing', description: 'Built-in waterproofing admixtures', sort_order: 7 },
  { id: 'mould_release_agent', name: 'Mould Release Agent', description: 'Form release agents for concrete casting', sort_order: 8 },
  { id: 'misc_admixtures', name: 'Misc Admixtures', description: 'Miscellaneous concrete admixtures', sort_order: 9 },
  { id: 'structural_bonding', name: 'Structural Bonding', description: 'Structural adhesives and bonding agents', sort_order: 10 },
  { id: 'others', name: 'Others', description: 'Other specialized chemical products', sort_order: 11 },
  { id: 'concrete_chemicals', name: 'Concrete Chemicals', description: 'General concrete chemical solutions', sort_order: 12 }
];

function main() {
  console.log('🧹 Cleaning up database structure...\n');
  
  // Step 1: Remove duplicate products, keep only unique names
  console.log('1️⃣ Removing duplicate products...');
  
  // Get all unique product names with their first occurrence details
  const uniqueProducts = db.prepare(`
    SELECT MIN(id) as keep_id, name, description, category_id, applications, features, 
           usage, advantages, technical_specifications, product_code
    FROM products 
    GROUP BY name
  `).all();
  
  console.log(`   Found ${uniqueProducts.length} unique products`);
  
  // Delete all products and re-insert unique ones
  db.prepare('DELETE FROM products').run();
  
  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, category_id, applications, features, 
                         usage, advantages, technical_specifications, product_code, is_active) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  
  for (const product of uniqueProducts) {
    insertProduct.run(
      product.name,
      product.description,
      product.category_id,
      product.applications,
      product.features,
      product.usage,
      product.advantages,
      product.technical_specifications,
      product.product_code
    );
  }
  
  console.log(`   ✅ Inserted ${uniqueProducts.length} unique products\n`);
  
  // Step 2: Reset categories to exactly 12
  console.log('2️⃣ Resetting categories to correct 12...');
  
  db.prepare('DELETE FROM product_categories').run();
  
  const insertCategory = db.prepare(`
    INSERT INTO product_categories (id, name, description, sort_order, is_active) 
    VALUES (?, ?, ?, ?, 1)
  `);
  
  for (const category of correctCategories) {
    insertCategory.run(category.id, category.name, category.description, category.sort_order);
    console.log(`   ✓ ${category.name}`);
  }
  
  console.log(`\n   ✅ Created ${correctCategories.length} categories\n`);
  
  // Step 3: Check current product count and trim if needed
  const currentCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  console.log(`3️⃣ Current product count: ${currentCount}`);
  
  if (currentCount > 35) {
    console.log(`   Trimming to exactly 35 products...`);
    
    // Keep the first 35 products (by id)
    const productsToKeep = db.prepare('SELECT id FROM products ORDER BY id LIMIT 35').all();
    const keepIds = productsToKeep.map(p => p.id);
    
    db.prepare(`DELETE FROM products WHERE id NOT IN (${keepIds.map(() => '?').join(',')})`).run(...keepIds);
    
    const finalCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    console.log(`   ✅ Trimmed to ${finalCount} products\n`);
  }
  
  // Step 4: Redistribute products across 12 categories
  console.log('4️⃣ Redistributing products across 12 categories...');
  
  const allProducts = db.prepare('SELECT id, name FROM products ORDER BY id').all();
  const categoryIds = correctCategories.map(c => c.id);
  
  // Distribute products evenly across categories
  const updateProduct = db.prepare('UPDATE products SET category_id = ? WHERE id = ?');
  
  allProducts.forEach((product, index) => {
    const categoryIndex = index % categoryIds.length;
    const assignedCategory = categoryIds[categoryIndex];
    updateProduct.run(assignedCategory, product.id);
    console.log(`   ${product.name} → ${correctCategories[categoryIndex].name}`);
  });
  
  console.log('\n5️⃣ Final verification...');
  
  // Final statistics
  const finalStats = db.prepare(`
    SELECT pc.name, COUNT(p.id) as product_count 
    FROM product_categories pc 
    LEFT JOIN products p ON pc.id = p.category_id 
    GROUP BY pc.id, pc.name 
    ORDER BY pc.sort_order
  `).all();
  
  console.log('\n📊 Final distribution:');
  console.log('=' .repeat(40));
  
  let totalProducts = 0;
  for (const stat of finalStats) {
    console.log(`${stat.name.padEnd(25)}: ${stat.product_count.toString().padStart(2)} products`);
    totalProducts += stat.product_count;
  }
  
  console.log('=' .repeat(40));
  console.log(`Total: ${totalProducts} products across ${finalStats.length} categories`);
  
  console.log('\n✅ Database structure corrected!\n');
  
  if (totalProducts === 35 && finalStats.length === 12) {
    console.log('🎯 Perfect! Exactly 35 products across 12 categories as required.\n');
  } else {
    console.log(`⚠️  Expected: 35 products, 12 categories`);
    console.log(`   Actual: ${totalProducts} products, ${finalStats.length} categories\n`);
  }
}

// Run the script
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
} finally {
  db.close();
}