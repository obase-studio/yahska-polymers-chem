const Database = require('better-sqlite3');
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, '../admin.db');
const db = new Database(dbPath);

console.log('🔧 Starting Database Migration...');
console.log('📁 Database:', dbPath);

try {
  // Check current schema
  console.log('\n📊 Current products table schema:');
  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='products'").get();
  console.log(schema.sql);
  
  // Add missing columns
  const columnsToAdd = [
    { name: 'usage', type: 'TEXT DEFAULT NULL' },
    { name: 'advantages', type: 'TEXT DEFAULT NULL' },
    { name: 'technical_specifications', type: 'TEXT DEFAULT NULL' },
    { name: 'packaging_info', type: 'TEXT DEFAULT NULL' },
    { name: 'safety_information', type: 'TEXT DEFAULT NULL' },
    { name: 'product_code', type: 'TEXT DEFAULT NULL' }
  ];
  
  console.log('\n🔧 Adding missing columns...');
  
  columnsToAdd.forEach(column => {
    try {
      const sql = `ALTER TABLE products ADD COLUMN ${column.name} ${column.type}`;
      db.exec(sql);
      console.log(`  ✅ Added column: ${column.name}`);
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log(`  ⏭️  Column ${column.name} already exists`);
      } else {
        console.log(`  ⚠️  Error adding ${column.name}: ${error.message}`);
      }
    }
  });
  
  // Verify new schema
  console.log('\n📊 Updated products table schema:');
  const updatedSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='products'").get();
  console.log(updatedSchema.sql);
  
  // Show all columns
  console.log('\n🏷️  All columns in products table:');
  const columns = db.prepare("PRAGMA table_info(products)").all();
  columns.forEach(col => {
    console.log(`  • ${col.name} (${col.type})`);
  });
  
  console.log('\n✅ Database migration completed successfully!');
  
} catch (error) {
  console.error('❌ Error during migration:', error.message);
  console.error(error.stack);
} finally {
  db.close();
  console.log('\n🔒 Database connection closed');
}
