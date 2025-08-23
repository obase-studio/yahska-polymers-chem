#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(process.cwd(), 'admin.db'));

function main() {
  console.log('🔍 Category-Product Sync Diagnostic\n');
  
  // Get all categories with product counts
  const categoryStats = db.prepare(`
    SELECT pc.id, pc.name, COUNT(p.id) as product_count 
    FROM product_categories pc 
    LEFT JOIN products p ON pc.id = p.category_id 
    GROUP BY pc.id, pc.name 
    ORDER BY pc.sort_order
  `).all();
  
  console.log('📊 Database Category Distribution:');
  console.log('=' .repeat(50));
  
  for (const stat of categoryStats) {
    console.log(`${stat.name.padEnd(25)}: ${stat.product_count.toString().padStart(2)} products`);
    
    if (stat.product_count > 0) {
      // Show actual products in this category
      const products = db.prepare('SELECT name FROM products WHERE category_id = ? ORDER BY name').all(stat.id);
      console.log(`  Products: ${products.map(p => p.name).join(', ')}`);
    }
    console.log('');
  }
  
  console.log('🔗 API Test Results:');
  console.log('=' .repeat(50));
  
  // Test API for each category
  const fetch = require('node-fetch');
  
  async function testAPI() {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ API responded successfully`);
        console.log(`   Total products: ${result.data.products.length}`);
        console.log(`   Total categories: ${result.data.categories.length}`);
        
        // Group products by category from API
        const apiCategoryStats = {};
        for (const product of result.data.products) {
          if (!apiCategoryStats[product.category_id]) {
            apiCategoryStats[product.category_id] = [];
          }
          apiCategoryStats[product.category_id].push(product.name);
        }
        
        console.log('\n📡 API Category Distribution:');
        for (const category of result.data.categories) {
          const count = apiCategoryStats[category.id]?.length || 0;
          console.log(`${category.name.padEnd(25)}: ${count.toString().padStart(2)} products`);
          
          if (count > 0) {
            console.log(`  Products: ${apiCategoryStats[category.id].join(', ')}`);
          }
          console.log('');
        }
        
        // Compare database vs API
        console.log('🔄 Database vs API Comparison:');
        console.log('=' .repeat(50));
        
        let discrepancies = 0;
        for (const dbStat of categoryStats) {
          const apiCount = apiCategoryStats[dbStat.id]?.length || 0;
          const match = dbStat.product_count === apiCount;
          
          if (!match) {
            discrepancies++;
            console.log(`❌ ${dbStat.name}: DB=${dbStat.product_count}, API=${apiCount}`);
          } else {
            console.log(`✅ ${dbStat.name}: ${dbStat.product_count} products (matches)`);
          }
        }
        
        if (discrepancies === 0) {
          console.log('\n🎯 Perfect! Database and API are in sync.');
        } else {
          console.log(`\n⚠️  Found ${discrepancies} discrepancies between database and API.`);
        }
        
      } else {
        console.log(`❌ API Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ API Connection Error: ${error.message}`);
      console.log('   Make sure the dev server is running on localhost:3000');
    }
  }
  
  return testAPI();
}

// Run the diagnostic
main().then(() => {
  db.close();
  console.log('\n🏁 Diagnostic complete!');
}).catch(error => {
  console.error('❌ Error:', error.message);
  db.close();
  process.exit(1);
});