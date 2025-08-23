#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(process.cwd(), 'admin.db'));

// Manual product mappings based on Excel data
// You can modify this mapping based on your exact Excel categories
const productCategoryMapping = {
  // Examples - update these based on your Excel data
  'Test Superplasticizer': 'admixtures',
  'Super P UT': 'admixtures',
  'YPC IB20': 'admixtures',
  'YPC X22': 'admixtures',
  'YPC 40X': 'admixtures',
  'YPC RB70': 'admixtures',
  'YPC 120X': 'admixtures',
  'YP Accelerator': 'accelerators',
  'YP Retarder': 'others',
  'YP Shotset 30': 'others',
  'AntiCorr FG': 'corrosion_inhibitor',
  'AntiCorr CN': 'corrosion_inhibitor',
  'SuperCure X150': 'curing_compound',
  'SuperCure CC375': 'curing_compound',
  'SuperCure D120': 'curing_compound',
  'YP Grout NS2': 'grouts',
  'YP Grout NS85': 'grouts',
  'YP Grout EPLV': 'grouts',
  'YP Grout MC': 'grouts',
  'YP Crystal IP': 'integral_waterproofing',
  'YP Floor HD M': 'floor_hardeners',
  'YP Floor HD NM': 'floor_hardeners',
  'YP Bond EP': 'structural_bonding',
  'YP LW+': 'misc_admixtures',
  'YP EGA 100': 'misc_admixtures',
  'YP SmoothCoat': 'misc_admixtures',
  // Add more mappings as needed...
};

function main() {
  console.log('🗃️  Manual Product-Category Mapping Tool\n');
  
  // Get all current products
  const products = db.prepare('SELECT id, name, category_id FROM products ORDER BY name').all();
  
  console.log('📋 Current Products and Categories:\n');
  console.log('Product Name'.padEnd(25) + 'Current Category'.padEnd(20) + 'Suggested Category');
  console.log('='.repeat(70));
  
  const updates = [];
  
  for (const product of products) {
    const suggestedCategory = productCategoryMapping[product.name] || product.category_id;
    const needsUpdate = suggestedCategory !== product.category_id;
    
    console.log(
      product.name.padEnd(25) + 
      product.category_id.padEnd(20) + 
      suggestedCategory + 
      (needsUpdate ? ' ← UPDATE' : '')
    );
    
    if (needsUpdate) {
      updates.push({
        id: product.id,
        name: product.name,
        currentCategory: product.category_id,
        newCategory: suggestedCategory
      });
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`Total products: ${products.length}`);
  console.log(`Products needing updates: ${updates.length}`);
  
  if (updates.length > 0) {
    console.log('\n🔄 Products to be updated:');
    for (const update of updates) {
      console.log(`• ${update.name}: ${update.currentCategory} → ${update.newCategory}`);
    }
    
    // Apply updates if --apply flag is provided
    if (process.argv.includes('--apply')) {
      console.log('\n🚀 Applying updates...');
      
      const updateStmt = db.prepare('UPDATE products SET category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      let successCount = 0;
      
      for (const update of updates) {
        try {
          updateStmt.run(update.newCategory, update.id);
          console.log(`✅ Updated ${update.name}`);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to update ${update.name}:`, error.message);
        }
      }
      
      console.log(`\n✅ Successfully updated ${successCount}/${updates.length} products`);
      
      // Show final distribution
      console.log('\n📊 Final category distribution:');
      const finalStats = db.prepare(`
        SELECT pc.name, COUNT(p.id) as count 
        FROM product_categories pc 
        LEFT JOIN products p ON pc.id = p.category_id 
        GROUP BY pc.id, pc.name 
        ORDER BY pc.sort_order
      `).all();
      
      for (const stat of finalStats) {
        console.log(`${stat.name.padEnd(25)}: ${stat.count} products`);
      }
    } else {
      console.log('\n💡 To apply these changes, run: node scripts/manual-product-mapping.js --apply');
    }
  } else {
    console.log('\n✅ All products are correctly categorized!');
  }
  
  console.log('\n📝 To customize mappings:');
  console.log('1. Edit the productCategoryMapping object in this script');
  console.log('2. Add your product names and their correct categories');
  console.log('3. Run the script again to see the changes');
  console.log('4. Use --apply flag to save the changes\n');
}

// Helper function to show available categories
function showCategories() {
  console.log('📂 Available Categories:');
  const categories = db.prepare('SELECT id, name FROM product_categories ORDER BY sort_order').all();
  for (const cat of categories) {
    console.log(`• ${cat.id} - ${cat.name}`);
  }
  console.log('');
}

// Show help
if (process.argv.includes('--help')) {
  console.log('Manual Product-Category Mapping Tool');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/manual-product-mapping.js           # Preview changes');
  console.log('  node scripts/manual-product-mapping.js --apply   # Apply changes');
  console.log('  node scripts/manual-product-mapping.js --categories # Show available categories');
  console.log('');
  process.exit(0);
}

if (process.argv.includes('--categories')) {
  showCategories();
  process.exit(0);
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