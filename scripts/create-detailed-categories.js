#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(process.cwd(), 'admin.db'));

// Comprehensive category list based on the Excel data
const detailedCategories = [
  // Main construction/concrete categories
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
  
  // Keep existing broad categories for backward compatibility
  { id: 'concrete', name: 'Concrete Admixtures', description: 'High-performance additives for enhanced concrete properties', sort_order: 20 },
  { id: 'construction', name: 'Construction Chemicals', description: 'Advanced solutions for construction and infrastructure projects', sort_order: 21 },
  { id: 'dispersing', name: 'Dispersing Agents', description: 'Specialized dispersing agents for various industrial applications', sort_order: 22 },
  { id: 'textile', name: 'Textile Chemicals', description: 'Specialized chemicals for textile processing and finishing', sort_order: 23 },
  { id: 'dyestuff', name: 'Dyestuff Chemicals', description: 'Premium chemicals for dyeing and color applications', sort_order: 24 }
];

// Enhanced product categorization patterns
const categoryMappings = {
  'accelerators': [
    'accelerator', 'yp accelerator', 'set accelerator', 'quick set'
  ],
  'admixtures': [
    'superplasticizer', 'super p', 'ypc', 'plasticizer', 'admixture'
  ],
  'corrosion_inhibitor': [
    'anticorr', 'anti-corr', 'corrosion', 'inhibitor', 'protection'
  ],
  'curing_compound': [
    'supercure', 'cure', 'curing', 'compound', 'cc375', 'x150', 'd120'
  ],
  'floor_hardeners': [
    'floor hd', 'floor hardener', 'hardener', 'surface hardener', 'hd m', 'hd nm'
  ],
  'grouts': [
    'grout', 'yp grout', 'ns2', 'ns85', 'eplv', 'mc'
  ],
  'integral_waterproofing': [
    'crystal', 'crystalline', 'waterproof', 'yp crystal', 'integral waterproof'
  ],
  'mould_release_agent': [
    'release', 'mould release', 'form release', 'release agent'
  ],
  'structural_bonding': [
    'bond', 'bonding', 'yp bond', 'ep', 'structural bond', 'adhesive'
  ],
  'misc_admixtures': [
    'lw+', 'ega', 'misc', 'special', 'smoothcoat'
  ],
  'others': [
    'shotset', 'retarder', 'other'
  ]
};

function categorizeProductDetailed(productName, productDescription = '') {
  const text = (productName + ' ' + (productDescription || '')).toLowerCase();
  
  // Check each detailed category's patterns
  for (const [category, patterns] of Object.entries(categoryMappings)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        return category;
      }
    }
  }
  
  // Fallback to broader categories
  if (text.includes('concrete') || text.includes('mortar') || text.includes('cement')) {
    return 'concrete';
  }
  
  return 'construction'; // Default fallback
}

function main() {
  console.log('🏗️  Creating detailed category structure...\n');
  
  // Backup current category assignments
  console.log('📋 Backing up current assignments...');
  const currentProducts = db.prepare('SELECT id, name, category_id FROM products').all();
  
  // Clear existing categories and recreate with detailed structure
  console.log('🗑️  Clearing existing product_categories...');
  db.prepare('DELETE FROM product_categories').run();
  
  // Insert new detailed categories
  console.log('➕ Creating detailed categories...');
  const insertCategory = db.prepare(`
    INSERT INTO product_categories (id, name, description, sort_order, is_active) 
    VALUES (?, ?, ?, ?, 1)
  `);
  
  for (const category of detailedCategories) {
    insertCategory.run(category.id, category.name, category.description, category.sort_order);
    console.log(`   ✓ ${category.name}`);
  }
  
  console.log(`\n📊 Created ${detailedCategories.length} categories\n`);
  
  // Recategorize all products with new detailed system
  console.log('🔄 Re-categorizing products with detailed categories...');
  
  const updateProduct = db.prepare('UPDATE products SET category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  const categoryStats = {};
  let updatedCount = 0;
  
  for (const product of currentProducts) {
    const newCategory = categorizeProductDetailed(product.name);
    
    // Track stats
    if (!categoryStats[newCategory]) categoryStats[newCategory] = 0;
    categoryStats[newCategory]++;
    
    // Update product
    updateProduct.run(newCategory, product.id);
    updatedCount++;
    
    if (product.category_id !== newCategory) {
      console.log(`   ${product.name}: ${product.category_id} → ${newCategory}`);
    }
  }
  
  console.log(`\n✅ Updated ${updatedCount} products\n`);
  
  // Display final category distribution
  console.log('📊 Final category distribution:');
  console.log('=' .repeat(50));
  
  const finalStats = db.prepare(`
    SELECT pc.id, pc.name, COUNT(p.id) as product_count 
    FROM product_categories pc 
    LEFT JOIN products p ON pc.id = p.category_id 
    GROUP BY pc.id, pc.name 
    ORDER BY pc.sort_order
  `).all();
  
  for (const stat of finalStats) {
    const count = stat.product_count || 0;
    const status = count > 0 ? '✅' : '⚠️ ';
    console.log(`${status} ${stat.name.padEnd(25)}: ${count.toString().padStart(3)} products`);
  }
  
  console.log('\n🎯 Category structure update complete!\n');
  
  // Show categories with no products
  const emptyCategories = finalStats.filter(stat => stat.product_count === 0);
  if (emptyCategories.length > 0) {
    console.log('📝 Categories ready for new products:');
    for (const category of emptyCategories) {
      console.log(`   • ${category.name}`);
    }
    console.log('');
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