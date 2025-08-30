#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔄 Converting remaining API routes to use Supabase...\n');

// Files that need to be converted
const routesToUpdate = [
  'app/api/admin/categories/[id]/route.ts',
  'app/api/admin/content/route.ts', 
  'app/api/admin/seo/route.ts',
  'app/api/admin/media/upload/route.ts',
  'app/api/admin/media/[id]/route.ts',
  'app/api/admin/auth/login/route.ts',
  'app/api/sync/content/route.ts'
];

// Conversion patterns
const conversions = [
  {
    from: /import \{ dbHelpers,?\s*initDatabase\s*\} from ['"]@\/lib\/database['"]/g,
    to: "import { supabaseHelpers } from '@/lib/supabase-helpers'"
  },
  {
    from: /import \{ dbHelpers \} from ['"]@\/lib\/database['"]/g,
    to: "import { supabaseHelpers } from '@/lib/supabase-helpers'"
  },
  {
    from: /initDatabase\(\)\s*;?\s*/g,
    to: ''
  },
  {
    from: /dbHelpers\./g,
    to: 'await supabaseHelpers.'
  },
  {
    from: /await await/g,
    to: 'await'
  },
  {
    from: /result\.lastInsertRowid/g,
    to: 'result?.[0]?.id'
  },
  {
    from: /result\.changes/g,
    to: 'result?.length'
  }
];

// Function to convert a single file
function convertFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    let hasChanges = false;

    // Apply conversions
    conversions.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    });

    // Make functions async if they use await
    if (content.includes('await supabaseHelpers') && !originalContent.includes('async function')) {
      // Find function declarations and make them async
      content = content.replace(
        /export function (GET|POST|PUT|DELETE)\(/g,
        'export async function $1('
      );
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Converted: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
    return false;
  }
}

// Convert specific routes
let convertedCount = 0;
let errorCount = 0;

routesToUpdate.forEach(route => {
  if (convertFile(route)) {
    convertedCount++;
  }
});

// Also find and convert any other files that might have database imports
console.log('\n🔍 Searching for additional API files...\n');

try {
  const allApiFiles = glob.sync('app/api/**/*.{ts,tsx}', {
    ignore: ['node_modules/**']
  });

  allApiFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if ((content.includes("from '@/lib/database'") || content.includes('dbHelpers')) 
          && !routesToUpdate.includes(file)) {
        console.log(`📄 Found additional file: ${file}`);
        if (convertFile(file)) {
          convertedCount++;
        }
      }
    } catch (error) {
      // Ignore files that can't be read
    }
  });
} catch (error) {
  console.error('Error searching for additional files:', error.message);
  errorCount++;
}

// Summary
console.log('\n📊 Conversion Summary:');
console.log(`✅ Files converted: ${convertedCount}`);
console.log(`❌ Errors: ${errorCount}`);

if (errorCount === 0) {
  console.log('\n🎉 API route conversion completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update authentication system for Supabase');
  console.log('2. Test all API endpoints');
  console.log('3. Remove SQLite dependencies');
} else {
  console.log('\n⚠️  Some files had errors. Please check them manually.');
}

console.log('\n🔍 Manual review recommended for:');
console.log('- Authentication routes (may need Supabase Auth integration)');
console.log('- File upload routes (may need Supabase Storage)');
console.log('- Any custom database logic');