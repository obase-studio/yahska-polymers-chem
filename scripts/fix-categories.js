#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(process.cwd(), 'admin.db'));

// Category mapping based on product analysis
const categoryMappings = {
  // Concrete admixtures patterns
  'concrete': [
    'superplasticizer', 'super p', 'ypc', 'shotset', 'retarder', 'accelerator',
    'plasticizer', 'admixture', 'concrete', 'mortar mix'
  ],
  
  // Construction chemicals patterns  
  'construction': [
    'crystal', 'cure', 'grout', 'smoothcoat', 'waterproof', 'coating',
    'sealant', 'repair', 'bonding', 'adhesive', 'primer'
  ],
  
  // Dispersing agents patterns
  'dispersing': [
    'dispersing', 'dispersant', 'wetting', 'surfactant', 'emulsifier'
  ],
  
  // Textile chemicals patterns
  'textile': [
    'textile', 'dye', 'fabric', 'fiber', 'cotton', 'polyester',
    'washing', 'finishing', 'softener'
  ],
  
  // Dyestuff chemicals patterns  
  'dyestuff': [
    'color', 'pigment', 'dyestuff', 'reactive dye', 'acid dye',
    'direct dye', 'vat dye', 'colorant'
  ]
};

function categorizeProduct(productName, productDescription = '') {
  const text = (productName + ' ' + (productDescription || '')).toLowerCase();
  
  // Check each category's patterns
  for (const [category, patterns] of Object.entries(categoryMappings)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        return category;
      }
    }
  }
  
  // Default fallback - if it has chemical-like naming, assume construction
  return 'construction';
}

function main() {
  console.log('🔧 Starting category validation and updates...\n');
  
  // Get all products
  const products = db.prepare('SELECT id, name, description, category_id FROM products').all();
  const updates = [];
  const categoryStats = {};
  
  // Analyze each product
  for (const product of products) {
    const suggestedCategory = categorizeProduct(product.name, product.description);
    
    // Track stats
    if (!categoryStats[suggestedCategory]) categoryStats[suggestedCategory] = 0;
    categoryStats[suggestedCategory]++;
    
    // Check if update needed
    if (product.category_id !== suggestedCategory) {
      updates.push({
        id: product.id,
        name: product.name,
        currentCategory: product.category_id,
        suggestedCategory: suggestedCategory
      });
    }
  }
  
  console.log('📊 Category Distribution Analysis:');
  console.log('Current vs Suggested category counts:\n');
  
  // Get current category counts
  const currentStats = {};
  const currentCounts = db.prepare('SELECT category_id, COUNT(*) as count FROM products GROUP BY category_id').all();
  for (const row of currentCounts) {
    currentStats[row.category_id] = row.count;
  }
  
  // Display comparison
  const allCategories = new Set([...Object.keys(currentStats), ...Object.keys(categoryStats)]);
  for (const category of allCategories) {
    const current = currentStats[category] || 0;
    const suggested = categoryStats[category] || 0;
    const change = suggested - current;
    const changeStr = change > 0 ? `(+${change})` : change < 0 ? `(${change})` : '(no change)';
    
    console.log(`${category.padEnd(12)}: ${current.toString().padStart(3)} → ${suggested.toString().padStart(3)} ${changeStr}`);
  }
  
  console.log(`\n📝 Found ${updates.length} products that need category updates:\n`);
  
  if (updates.length > 0) {
    // Show first 10 updates as examples
    console.log('Examples of products to be updated:');
    for (const update of updates.slice(0, 10)) {
      console.log(`• ${update.name}`);
      console.log(`  ${update.currentCategory} → ${update.suggestedCategory}\n`);
    }
    
    if (updates.length > 10) {
      console.log(`... and ${updates.length - 10} more products\n`);
    }
    
    // Ask for confirmation (in actual script, you might want to add readline)
    console.log('✅ Ready to apply updates. Run with --apply flag to execute.\n');
    
    // If --apply flag is passed, apply updates
    if (process.argv.includes('--apply')) {
      console.log('🚀 Applying category updates...\n');
      
      const updateStmt = db.prepare('UPDATE products SET category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      let successCount = 0;
      
      for (const update of updates) {
        try {
          updateStmt.run(update.suggestedCategory, update.id);
          successCount++;
        } catch (error) {
          console.error(`Failed to update ${update.name}:`, error.message);
        }
      }
      
      console.log(`✅ Successfully updated ${successCount}/${updates.length} products\n`);
      
      // Verify final counts
      console.log('📊 Final category distribution:');
      const finalCounts = db.prepare('SELECT category_id, COUNT(*) as count FROM products GROUP BY category_id ORDER BY count DESC').all();
      for (const row of finalCounts) {
        console.log(`${row.category_id.padEnd(12)}: ${row.count} products`);
      }
    }
  } else {
    console.log('✅ All products are already correctly categorized!\n');
  }
  
  // Check for unused categories
  const unusedCategories = db.prepare(`
    SELECT pc.id, pc.name 
    FROM product_categories pc 
    LEFT JOIN products p ON pc.id = p.category_id 
    WHERE p.category_id IS NULL
  `).all();
  
  if (unusedCategories.length > 0) {
    console.log('⚠️  Unused categories (no products assigned):');
    for (const category of unusedCategories) {
      console.log(`• ${category.id} - ${category.name}`);
    }
    console.log('');
  }
  
  console.log('🏁 Category analysis complete!\n');
}

// Run the script
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}