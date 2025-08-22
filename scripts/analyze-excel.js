const XLSX = require('xlsx');
const path = require('path');

// Read the Excel file
const excelPath = path.join(__dirname, '../client_documentation/Products Catalogue.xlsx');
console.log('📁 Reading Excel file:', excelPath);

try {
  const workbook = XLSX.readFile(excelPath);
  
  console.log('\n📊 Excel File Analysis:');
  console.log('========================');
  
  // List all sheet names
  console.log('\n📋 Sheet Names:');
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`  ${index + 1}. ${sheetName}`);
  });
  
  // Analyze each sheet
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n📄 Sheet: ${sheetName}`);
    console.log('─'.repeat(50));
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      console.log('  ❌ Empty sheet');
      return;
    }
    
    // Show first few rows
    console.log(`  📈 Total rows: ${jsonData.length}`);
    console.log(`  📋 Total columns: ${jsonData[0] ? jsonData[0].length : 0}`);
    
    // Show headers (first row)
    if (jsonData[0]) {
      console.log('  🏷️  Headers:');
      jsonData[0].forEach((header, index) => {
        if (header) {
          console.log(`    ${index + 1}. ${header}`);
        }
      });
    }
    
    // Analyze categories
    const categories = new Set();
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row[0]) {
        categories.add(row[0]);
      }
    }
    
    console.log('\n  🏷️  Product Categories Found:');
    Array.from(categories).sort().forEach(category => {
      let count = 0;
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row[0] === category) {
          count++;
        }
      }
      console.log(`    • ${category}: ${count} products`);
    });
    
    // Show sample data for each category
    console.log('\n  📝 Sample Data by Category:');
    Array.from(categories).sort().forEach(category => {
      console.log(`\n    📂 ${category}:`);
      let shown = 0;
      for (let i = 1; i < jsonData.length && shown < 2; i++) {
        const row = jsonData[i];
        if (row && row[0] === category && row.some(cell => cell)) {
          console.log(`      ${row[1]} - ${row[2]?.substring(0, 80)}...`);
          shown++;
        }
      }
    });
    
    // Show more detailed sample data (first 5 rows after header)
    if (jsonData.length > 1) {
      console.log('\n  📝 Detailed Sample Data (first 5 rows):');
      for (let i = 1; i <= Math.min(5, jsonData.length - 1); i++) {
        const row = jsonData[i];
        if (row && row.some(cell => cell)) {
          console.log(`\n    Row ${i}:`);
          console.log(`      Category: ${row[0] || 'N/A'}`);
          console.log(`      Product: ${row[1] || 'N/A'}`);
          console.log(`      Description: ${row[2]?.substring(0, 100) || 'N/A'}...`);
          console.log(`      Uses: ${row[3]?.substring(0, 100) || 'N/A'}...`);
          console.log(`      Advantages: ${row[4]?.substring(0, 100) || 'N/A'}...`);
        }
      }
    }
  });
  
} catch (error) {
  console.error('❌ Error reading Excel file:', error.message);
}
