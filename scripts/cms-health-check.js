#!/usr/bin/env node

/**
 * CMS Health Check - Quick system status check
 */

const fs = require('fs');
const path = require('path');

class CMSHealthCheck {
  constructor() {
    this.checks = [];
  }

  async run() {
    console.log('🏥 CMS Health Check\n');
    
    await this.checkEnvironmentVariables();
    await this.checkCriticalFiles();
    await this.checkDatabaseSchema();
    await this.quickAPITest();
    
    this.printResults();
  }

  log(check, status, details = '') {
    const icons = { pass: '✅', fail: '❌', warn: '⚠️' };
    console.log(`${icons[status]} ${check}${details ? ` - ${details}` : ''}`);
    this.checks.push({ check, status, details });
  }

  async checkEnvironmentVariables() {
    console.log('🔧 Environment Variables');
    
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (!fs.existsSync(envPath)) {
      this.log('Environment file exists', 'fail', '.env.local not found');
      return;
    }
    
    this.log('Environment file exists', 'pass');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_KEY'
    ];
    
    requiredVars.forEach(varName => {
      if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`)) {
        this.log(`${varName}`, 'pass');
      } else {
        this.log(`${varName}`, 'fail', 'Not configured or using placeholder value');
      }
    });
  }

  async checkCriticalFiles() {
    console.log('\n📁 Critical Files');
    
    const criticalFiles = [
      { path: 'app/api/admin/content/route.ts', name: 'Admin Content API' },
      { path: 'app/api/content/route.ts', name: 'Frontend Content API' },
      { path: 'app/api/sync/content/route.ts', name: 'Sync API' },
      { path: 'lib/supabase-helpers.ts', name: 'Supabase Helpers' },
      { path: 'components/admin/content-editor-with-media.tsx', name: 'Content Editor' },
      { path: 'app/admin/content/page.tsx', name: 'Admin Content Page' }
    ];
    
    criticalFiles.forEach(({ path: filePath, name }) => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        this.log(name, 'pass');
      } else {
        this.log(name, 'fail', `${filePath} missing`);
      }
    });
  }

  async checkDatabaseSchema() {
    console.log('\n🗄️  Database Schema (estimated)');
    
    // Check if we can read the Supabase helpers file for clues
    const helpersPath = path.join(process.cwd(), 'lib/supabase-helpers.ts');
    
    if (fs.existsSync(helpersPath)) {
      const content = fs.readFileSync(helpersPath, 'utf8');
      
      const expectedTables = ['site_content', 'products', 'media_files', 'admin_users'];
      
      expectedTables.forEach(table => {
        if (content.includes(`'${table}'`) || content.includes(`"${table}"`)) {
          this.log(`${table} table referenced`, 'pass');
        } else {
          this.log(`${table} table referenced`, 'warn', 'Not found in helpers');
        }
      });
    } else {
      this.log('Database schema check', 'fail', 'Supabase helpers not found');
    }
  }

  async quickAPITest() {
    console.log('\n🌐 Quick API Test');
    
    // Check if server might be running
    try {
      if (typeof fetch === 'undefined') {
        global.fetch = require('node-fetch');
      }

      const response = await fetch('http://localhost:3000/api/content?page=home', {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        this.log('API accessibility', 'pass', 'Server responding');
        
        const data = await response.json();
        if (data.success !== undefined) {
          this.log('API response format', 'pass', 'Correct structure');
        } else {
          this.log('API response format', 'warn', 'Unexpected structure');
        }
      } else {
        this.log('API accessibility', 'fail', `HTTP ${response.status}`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        this.log('API accessibility', 'warn', 'Server not running (expected if not testing)');
      } else {
        this.log('API accessibility', 'fail', error.message);
      }
    }
  }

  printResults() {
    console.log('\n📊 Health Check Summary');
    console.log('='.repeat(40));
    
    const passed = this.checks.filter(c => c.status === 'pass').length;
    const failed = this.checks.filter(c => c.status === 'fail').length;
    const warnings = this.checks.filter(c => c.status === 'warn').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    
    const totalChecks = this.checks.length;
    const score = Math.round((passed / totalChecks) * 100);
    
    console.log(`\n🎯 Health Score: ${score}%`);
    
    if (score >= 90) {
      console.log('🟢 System appears healthy');
    } else if (score >= 70) {
      console.log('🟡 System has minor issues');
    } else {
      console.log('🔴 System needs attention');
    }

    if (failed > 0) {
      console.log('\n🔧 Issues to fix:');
      this.checks.filter(c => c.status === 'fail').forEach((check, i) => {
        console.log(`${i + 1}. ${check.check}: ${check.details}`);
      });
    }

    console.log('\n💡 Run "npm run diagnose:cms" for detailed analysis');
  }
}

// Make fetch available
if (typeof fetch === 'undefined') {
  try {
    global.fetch = require('node-fetch');
  } catch (e) {
    // node-fetch not available
  }
}

const healthCheck = new CMSHealthCheck();
healthCheck.run().catch(console.error);