#!/usr/bin/env node

/**
 * CMS Issue Fixer - Automatically fix common CMS problems
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class CMSIssueFixer {
  constructor() {
    this.fixes = [];
  }

  async run() {
    console.log('🔧 CMS Issue Fixer\n');
    
    await this.checkAndFixEnvironment();
    await this.checkAndFixDependencies();
    await this.checkAndFixConfigurations();
    await this.generateMissingFiles();
    
    this.printSummary();
  }

  log(message, status = 'info') {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: '🔍', fix: '🔧' };
    console.log(`${icons[status]} ${message}`);
    this.fixes.push({ message, status, timestamp: new Date() });
  }

  async checkAndFixEnvironment() {
    console.log('🔧 Environment Configuration');
    
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (!fs.existsSync(envPath)) {
      this.log('Creating .env.local template', 'fix');
      
      const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Note: Replace the values above with your actual Supabase credentials
# You can find these in your Supabase project dashboard under Settings > API
`;
      
      fs.writeFileSync(envPath, envTemplate);
      this.log('Created .env.local template - Please configure with your Supabase credentials', 'warning');
    } else {
      this.log('Environment file exists', 'success');
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('your_supabase_')) {
        this.log('Environment contains placeholder values - Please configure with actual Supabase credentials', 'warning');
      }
    }
  }

  async checkAndFixDependencies() {
    console.log('\n📦 Dependencies');
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const requiredDeps = {
        '@supabase/supabase-js': '^2.38.0',
        '@testing-library/jest-dom': '^6.1.4',
        '@testing-library/react': '^14.0.0',
        'jest': '^29.7.0',
        'jest-environment-jsdom': '^29.7.0'
      };

      const missingDeps = [];
      
      Object.entries(requiredDeps).forEach(([dep, version]) => {
        if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
          missingDeps.push(`${dep}@${version}`);
        }
      });

      if (missingDeps.length > 0) {
        this.log(`Installing missing dependencies: ${missingDeps.join(', ')}`, 'fix');
        
        await this.runCommand('npm', ['install', ...missingDeps]);
        this.log('Dependencies installed', 'success');
      } else {
        this.log('All required dependencies present', 'success');
      }

      // Add test scripts to package.json if missing
      if (!packageJson.scripts['test:cms']) {
        this.log('Adding CMS test scripts to package.json', 'fix');
        
        packageJson.scripts = packageJson.scripts || {};
        Object.assign(packageJson.scripts, {
          "test:cms": "jest __tests__ --testNamePattern=\"CMS\"",
          "test:cms:unit": "jest __tests__/cms-unit-tests.test.js",
          "test:cms:integration": "jest __tests__/cms-integration-tests.test.js",
          "test:cms:e2e": "jest __tests__/cms-e2e-tests.test.js",
          "diagnose:cms": "node scripts/diagnose-cms.js",
          "health:cms": "node scripts/cms-health-check.js"
        });
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        this.log('Test scripts added to package.json', 'success');
      }
    }
  }

  async checkAndFixConfigurations() {
    console.log('\n⚙️  Configuration Files');
    
    // Check if jest.config.js exists and is properly configured
    const jestConfigPath = path.join(process.cwd(), 'jest.config.js');
    if (!fs.existsSync(jestConfigPath)) {
      this.log('Jest configuration missing - already created by previous setup', 'info');
    } else {
      this.log('Jest configuration exists', 'success');
    }

    // Check if jest.setup.js exists
    const jestSetupPath = path.join(process.cwd(), 'jest.setup.js');
    if (!fs.existsSync(jestSetupPath)) {
      this.log('Jest setup file missing - already created by previous setup', 'info');
    } else {
      this.log('Jest setup file exists', 'success');
    }
  }

  async generateMissingFiles() {
    console.log('\n📄 Missing Files Check');
    
    const criticalFiles = [
      {
        path: '__tests__',
        type: 'directory',
        name: 'Tests Directory'
      }
    ];

    criticalFiles.forEach(({ path: filePath, type, name }) => {
      const fullPath = path.join(process.cwd(), filePath);
      
      if (type === 'directory') {
        if (!fs.existsSync(fullPath)) {
          this.log(`Creating ${name}`, 'fix');
          fs.mkdirSync(fullPath, { recursive: true });
          this.log(`${name} created`, 'success');
        } else {
          this.log(`${name} exists`, 'success');
        }
      }
    });

    // Check test files
    const testFiles = [
      '__tests__/cms-unit-tests.test.js',
      '__tests__/cms-integration-tests.test.js', 
      '__tests__/cms-e2e-tests.test.js'
    ];

    testFiles.forEach(testFile => {
      const testPath = path.join(process.cwd(), testFile);
      if (fs.existsSync(testPath)) {
        this.log(`${testFile} exists`, 'success');
      } else {
        this.log(`${testFile} missing - already created by previous setup`, 'info');
      }
    });
  }

  async runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { stdio: 'pipe' });
      
      let output = '';
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        output += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command failed with code ${code}: ${output}`));
        }
      });
    });
  }

  printSummary() {
    console.log('\n📊 Fix Summary');
    console.log('='.repeat(40));
    
    const fixes = this.fixes.filter(f => f.status === 'fix').length;
    const successes = this.fixes.filter(f => f.status === 'success').length;
    const warnings = this.fixes.filter(f => f.status === 'warning').length;
    const errors = this.fixes.filter(f => f.status === 'error').length;
    
    console.log(`🔧 Fixes Applied: ${fixes}`);
    console.log(`✅ Successful Checks: ${successes}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`❌ Errors: ${errors}`);
    
    if (warnings > 0 || errors > 0) {
      console.log('\n🚨 Manual Actions Required:');
      
      this.fixes.filter(f => f.status === 'warning' || f.status === 'error').forEach((fix, i) => {
        console.log(`${i + 1}. ${fix.message}`);
      });
      
      console.log('\n🔗 Next Steps:');
      console.log('1. Configure your Supabase credentials in .env.local');
      console.log('2. Ensure your Supabase database has the required tables:');
      console.log('   - site_content');
      console.log('   - products');
      console.log('   - media_files');
      console.log('   - admin_users');
      console.log('3. Run "npm run health:cms" to verify the fixes');
      console.log('4. Run "npm run diagnose:cms" for complete testing');
    } else {
      console.log('\n🎉 All issues fixed! Run "npm run health:cms" to verify.');
    }
  }
}

const fixer = new CMSIssueFixer();
fixer.run().catch(console.error);