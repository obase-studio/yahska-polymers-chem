#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔄 Updating application code to use Supabase instead of SQLite...\n');

// Files to update
const filesToUpdate = [
  // API Routes
  'app/api/products/[id]/route.ts',
  'app/api/admin/products/[id]/route.ts',
  'app/api/content/route.ts',
  'app/api/admin/content/route.ts',
  'app/api/admin/categories/route.ts',
  'app/api/admin/categories/[id]/route.ts',
  'app/api/admin/seo/route.ts',
  'app/api/admin/media/upload/route.ts',
  'app/api/admin/media/[id]/route.ts',
  'app/api/admin/auth/login/route.ts',
  'app/api/sync/content/route.ts',
  
  // Pages
  'app/page.tsx',
  'app/products/page.tsx',
  'app/about/page.tsx',
  'app/contact/page.tsx',
  'app/admin/dashboard/page.tsx',
  'app/admin/products/page.tsx',
  'app/admin/products/new/page.tsx',
  'app/admin/products/[id]/edit/page.tsx',
  'app/admin/media/page.tsx',
  'app/admin/seo/page.tsx',
  'app/admin/clients/page.tsx',
  
  // Lib files
  'lib/auth.ts'
];

// Replacements to make
const replacements = [
  {
    from: /import \{ dbHelpers \} from ['"]@\/lib\/database['"]/g,
    to: "import { supabaseHelpers as dbHelpers } from '@/lib/supabase-helpers'"
  },
  {
    from: /from ['"]@\/lib\/database['"]/g,
    to: "from '@/lib/supabase-helpers'"
  },
  {
    from: /dbHelpers\.([a-zA-Z_][a-zA-Z0-9_]*)\(/g,
    to: 'await dbHelpers.$1('
  },
  {
    from: /= dbHelpers\./g,
    to: '= await dbHelpers.'
  },
  {
    from: /const ([a-zA-Z_][a-zA-Z0-9_]*) = await dbHelpers\./g,
    to: 'const $1 = await dbHelpers.'
  },
  {
    from: /let ([a-zA-Z_][a-zA-Z0-9_]*) = await dbHelpers\./g,
    to: 'let $1 = await dbHelpers.'
  },
  {
    from: /result\.lastInsertRowid/g,
    to: 'result?.[0]?.id'
  },
  {
    from: /export async function ([A-Z]+)\(/g,
    to: 'export async function $1('
  }
];

let updatedCount = 0;
let errorCount = 0;

// Function to update a single file
function updateFile(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    let hasChanges = false;

    // Apply replacements
    replacements.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    });

    // Fix double awaits
    content = content.replace(/await await/g, 'await');
    
    // Fix function declarations that don't need async if they weren't before
    const functionDeclarations = originalContent.match(/export function ([A-Z]+)\(/g);
    if (functionDeclarations) {
      functionDeclarations.forEach(declaration => {
        const funcName = declaration.match(/export function ([A-Z]+)\(/)?.[1];
        if (funcName && !originalContent.includes(`export async function ${funcName}(`)) {
          // Only make async if it now contains await
          if (content.includes(`await dbHelpers`) && content.includes(`export function ${funcName}(`)) {
            content = content.replace(`export function ${funcName}(`, `export async function ${funcName}(`);
            hasChanges = true;
          }
        }
      });
    }

    if (hasChanges) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Updated: ${filePath}`);
      updatedCount++;
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    errorCount++;
    return false;
  }
}

// Update all specified files
console.log('📝 Updating specified files...\n');

filesToUpdate.forEach(file => {
  updateFile(file);
});

// Also update any other files that might contain database imports
console.log('\n🔍 Searching for other files with database imports...\n');

try {
  // Find all TypeScript files that import from database
  const allFiles = glob.sync('**/*.{ts,tsx}', {
    ignore: [
      'node_modules/**',
      '.next/**',
      'scripts/**',
      'lib/database.ts',
      'lib/database-*.ts',
      'lib/supabase*.ts'
    ]
  });

  allFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes("from '@/lib/database'") || content.includes('from "@/lib/database"')) {
        if (!filesToUpdate.includes(file)) {
          console.log(`📄 Found additional file: ${file}`);
          updateFile(file);
        }
      }
    } catch (error) {
      // Ignore files that can't be read
    }
  });
} catch (error) {
  console.error('Error searching for additional files:', error.message);
}

// Summary
console.log('\n📊 Migration Summary:');
console.log(`✅ Files updated: ${updatedCount}`);
console.log(`❌ Errors: ${errorCount}`);

if (errorCount === 0) {
  console.log('\n🎉 Code migration completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy .env.supabase.example to .env.local with your credentials');
  console.log('2. Test your application: npm run dev');
  console.log('3. Check that all functionality works with Supabase');
  console.log('\n⚠️  Remember to update any remaining manual database calls!');
} else {
  console.log('\n⚠️  Some files had errors. Please check them manually.');
}