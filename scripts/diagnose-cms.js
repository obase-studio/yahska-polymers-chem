#!/usr/bin/env node

/**
 * CMS Diagnostic Script
 * Tests all aspects of the CMS system to identify disconnect points
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 CMS Diagnostic Tool Starting...\n');

class CMSDiagnostic {
  constructor() {
    this.results = [];
    this.errors = [];
    this.serverProcess = null;
  }

  async runDiagnostic() {
    console.log('📋 Running CMS Diagnostic Tests\n');
    
    await this.checkEnvironment();
    await this.checkFileStructure();
    await this.checkDependencies();
    await this.startServerForTesting();
    await this.testAPIEndpoints();
    await this.testDataFlow();
    await this.stopServer();
    
    this.printSummary();
  }

  log(message, status = 'info') {
    const icons = { 
      success: '✅', 
      error: '❌', 
      warning: '⚠️', 
      info: '🔍',
      running: '🔄'
    };
    
    console.log(`${icons[status]} ${message}`);
    this.results.push({ message, status, timestamp: new Date() });
  }

  async checkEnvironment() {
    console.log('\n📋 Checking Environment Configuration...');
    
    // Check .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      this.log('Environment file (.env.local) found', 'success');
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
        'SUPABASE_SERVICE_KEY'
      ];
      
      requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
          this.log(`${varName} is configured`, 'success');
        } else {
          this.log(`${varName} is missing`, 'error');
          this.errors.push(`Missing environment variable: ${varName}`);
        }
      });
    } else {
      this.log('Environment file (.env.local) not found', 'error');
      this.errors.push('Missing .env.local file');
    }

    // Check Node.js version
    const nodeVersion = process.version;
    this.log(`Node.js version: ${nodeVersion}`, nodeVersion.startsWith('v18') || nodeVersion.startsWith('v20') ? 'success' : 'warning');
  }

  async checkFileStructure() {
    console.log('\n📁 Checking File Structure...');
    
    const criticalFiles = [
      'app/api/admin/content/route.ts',
      'app/api/content/route.ts', 
      'app/api/sync/content/route.ts',
      'lib/supabase-helpers.ts',
      'lib/supabase.ts',
      'components/admin/content-editor-with-media.tsx',
      'app/admin/content/page.tsx'
    ];
    
    criticalFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        this.log(`${file} exists`, 'success');
      } else {
        this.log(`${file} missing`, 'error');
        this.errors.push(`Missing critical file: ${file}`);
      }
    });
  }

  async checkDependencies() {
    console.log('\n📦 Checking Dependencies...');
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const requiredDeps = [
        '@supabase/supabase-js',
        'next',
        'react',
        'typescript'
      ];
      
      requiredDeps.forEach(dep => {
        if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
          this.log(`${dep} is installed`, 'success');
        } else {
          this.log(`${dep} is missing`, 'error');
          this.errors.push(`Missing dependency: ${dep}`);
        }
      });
    }
  }

  async startServerForTesting() {
    console.log('\n🚀 Starting Development Server...');
    
    return new Promise((resolve) => {
      this.log('Starting Next.js development server...', 'running');
      
      this.serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        detached: false
      });

      let serverReady = false;
      
      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready') && output.includes('localhost:3000') && !serverReady) {
          serverReady = true;
          this.log('Development server started successfully', 'success');
          setTimeout(resolve, 2000); // Wait for server to fully initialize
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('EADDRINUSE')) {
          this.log('Port 3000 already in use - server may already be running', 'warning');
          resolve();
        } else if (error.includes('Error')) {
          this.log(`Server error: ${error.trim()}`, 'error');
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!serverReady) {
          this.log('Server startup timeout - continuing with existing server if available', 'warning');
          resolve();
        }
      }, 30000);
    });
  }

  async testAPIEndpoints() {
    console.log('\n🌐 Testing API Endpoints...');
    
    const endpoints = [
      { url: 'http://localhost:3000/api/content?page=home', method: 'GET', name: 'Frontend Content API' },
      { url: 'http://localhost:3000/api/admin/content?page=home&section=hero', method: 'GET', name: 'Admin Content API (GET)' },
      { 
        url: 'http://localhost:3000/api/admin/content', 
        method: 'POST', 
        name: 'Admin Content API (POST)',
        body: {
          page: 'test',
          section: 'diagnostic',
          content_key: 'test_key',
          content_value: 'Diagnostic test value'
        }
      },
      { 
        url: 'http://localhost:3000/api/sync/content', 
        method: 'POST', 
        name: 'Sync API',
        body: { page: 'home' }
      }
    ];

    for (const endpoint of endpoints) {
      try {
        const options = {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' }
        };

        if (endpoint.body) {
          options.body = JSON.stringify(endpoint.body);
        }

        const response = await fetch(endpoint.url, options);
        
        if (response.ok) {
          const data = await response.json();
          this.log(`${endpoint.name}: OK (${response.status})`, 'success');
          
          // Additional validation for specific endpoints
          if (endpoint.name === 'Frontend Content API' && data.success) {
            this.log(`- Content items found: ${data.data.content?.length || 0}`, 'info');
          }
          
          if (endpoint.name === 'Sync API' && data.success) {
            this.log(`- Last updated: ${data.lastUpdated}`, 'info');
            this.log(`- Content count: ${data.contentCount}`, 'info');
          }
        } else {
          this.log(`${endpoint.name}: Failed (${response.status})`, 'error');
          this.errors.push(`API endpoint failed: ${endpoint.name} - ${response.status}`);
        }
      } catch (error) {
        this.log(`${endpoint.name}: Connection failed - ${error.message}`, 'error');
        this.errors.push(`API connection failed: ${endpoint.name} - ${error.message}`);
      }

      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async testDataFlow() {
    console.log('\n🔄 Testing Complete Data Flow...');
    
    try {
      // Test 1: Save content via admin API
      this.log('Testing admin content save...', 'running');
      
      const savePayload = {
        page: 'diagnostic_test',
        section: 'test_section',
        content_key: 'test_headline',
        content_value: `Test content saved at ${new Date().toISOString()}`
      };

      const saveResponse = await fetch('http://localhost:3000/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savePayload)
      });

      if (saveResponse.ok) {
        this.log('Admin content save: Success', 'success');
      } else {
        this.log('Admin content save: Failed', 'error');
        this.errors.push('Admin content save failed');
        return;
      }

      // Wait for data propagation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test 2: Retrieve content via frontend API
      this.log('Testing frontend content retrieval...', 'running');
      
      const retrieveResponse = await fetch('http://localhost:3000/api/content?page=diagnostic_test');
      
      if (retrieveResponse.ok) {
        const data = await retrieveResponse.json();
        
        if (data.success && data.data.content?.length > 0) {
          const savedContent = data.data.content.find(
            item => item.content_key === 'test_headline'
          );
          
          if (savedContent && savedContent.content_value.includes('Test content saved')) {
            this.log('Frontend content retrieval: Success - Data flow working!', 'success');
          } else {
            this.log('Frontend content retrieval: Content mismatch', 'warning');
            this.errors.push('Content retrieved but values don\'t match');
          }
        } else {
          this.log('Frontend content retrieval: No content found', 'warning');
          this.errors.push('Saved content not found in frontend API');
        }
      } else {
        this.log('Frontend content retrieval: Failed', 'error');
        this.errors.push('Frontend content retrieval failed');
      }

      // Test 3: Sync API response
      this.log('Testing content sync...', 'running');
      
      const syncResponse = await fetch('http://localhost:3000/api/sync/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'diagnostic_test' })
      });

      if (syncResponse.ok) {
        const syncData = await syncResponse.json();
        if (syncData.success && syncData.contentCount > 0) {
          this.log(`Content sync: Success (${syncData.contentCount} items)`, 'success');
        } else {
          this.log('Content sync: No content synchronized', 'warning');
        }
      } else {
        this.log('Content sync: Failed', 'error');
        this.errors.push('Content sync failed');
      }

      // Cleanup: Delete test content
      const deleteResponse = await fetch('http://localhost:3000/api/admin/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 'diagnostic_test',
          section: 'test_section',
          content_key: 'test_headline'
        })
      });

      if (deleteResponse.ok) {
        this.log('Test cleanup: Success', 'success');
      }

    } catch (error) {
      this.log(`Data flow test failed: ${error.message}`, 'error');
      this.errors.push(`Data flow test error: ${error.message}`);
    }
  }

  async stopServer() {
    if (this.serverProcess) {
      console.log('\n🛑 Stopping Test Server...');
      this.serverProcess.kill('SIGTERM');
      
      // Wait for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!this.serverProcess.killed) {
        this.serverProcess.kill('SIGKILL');
      }
      
      this.log('Test server stopped', 'info');
    }
  }

  printSummary() {
    console.log('\n📊 DIAGNOSTIC SUMMARY');
    console.log('=' .repeat(50));
    
    const successCount = this.results.filter(r => r.status === 'success').length;
    const errorCount = this.errors.length;
    const warningCount = this.results.filter(r => r.status === 'warning').length;
    
    console.log(`✅ Successful checks: ${successCount}`);
    console.log(`❌ Errors found: ${errorCount}`);
    console.log(`⚠️  Warnings: ${warningCount}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔧 CRITICAL ISSUES TO FIX:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      
      console.log('\n💡 RECOMMENDATIONS:');
      
      if (this.errors.some(e => e.includes('environment variable'))) {
        console.log('- Configure missing environment variables in .env.local');
        console.log('- Check Supabase connection settings');
      }
      
      if (this.errors.some(e => e.includes('API'))) {
        console.log('- Verify Supabase database schema and permissions');
        console.log('- Check API route implementations');
        console.log('- Test database connectivity manually');
      }
      
      if (this.errors.some(e => e.includes('Content'))) {
        console.log('- Check site_content table exists in Supabase');
        console.log('- Verify RLS (Row Level Security) policies');
        console.log('- Test database CRUD operations');
      }
      
    } else {
      console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
      console.log('The CMS appears to be working correctly.');
    }
    
    console.log('\n📝 For detailed logs, check the results above.');
    console.log('Run this diagnostic whenever you suspect CMS issues.');
  }
}

// Make fetch available in Node.js environment
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Run the diagnostic
const diagnostic = new CMSDiagnostic();
diagnostic.runDiagnostic().catch(error => {
  console.error('❌ Diagnostic failed:', error);
  process.exit(1);
});