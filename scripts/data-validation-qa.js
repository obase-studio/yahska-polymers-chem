#!/usr/bin/env node
/**
 * Data Validation and Quality Assurance for Yahska Polymers
 * 
 * Comprehensive validation system that ensures:
 * 1. Data integrity and completeness
 * 2. Foreign key relationship validation
 * 3. Media file existence verification
 * 4. Content quality checks
 * 5. Performance optimization validation
 * 6. SEO compliance verification
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Configuration
const CONFIG = {
  dbPath: path.join(__dirname, '../admin.db'),
  mediaPath: path.join(__dirname, '../public/media'),
  reportPath: path.join(__dirname, '../validation-reports'),
  verbose: process.argv.includes('--verbose'),
  fixIssues: process.argv.includes('--fix'),
  exportReport: process.argv.includes('--export')
};

// Logger utility
const logger = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  verbose: (msg) => CONFIG.verbose && console.log(`🔍 ${msg}`),
  section: (title) => {
    console.log('\n' + '='.repeat(60));
    console.log(`🔍 ${title}`);
    console.log('='.repeat(60));
  }
};

// Validation results storage
const validationResults = {
  summary: {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    warningsCount: 0,
    errorsCount: 0
  },
  database: {
    connection: false,
    tableStructure: [],
    recordCounts: {},
    indexStatus: []
  },
  dataIntegrity: {
    products: { total: 0, issues: [] },
    projects: { total: 0, issues: [] },
    clients: { total: 0, issues: [] },
    approvals: { total: 0, issues: [] },
    mediaFiles: { total: 0, issues: [] },
    content: { total: 0, issues: [] }
  },
  foreignKeys: {
    validRelationships: [],
    brokenRelationships: []
  },
  mediaValidation: {
    totalFiles: 0,
    existingFiles: 0,
    missingFiles: [],
    orphanedRecords: []
  },
  contentQuality: {
    completeness: {},
    seoCompliance: {},
    readability: {}
  },
  performance: {
    queryPerformance: [],
    indexUsage: [],
    recommendations: []
  }
};

/**
 * Initialize database connection
 */
function initializeDatabase() {
  try {
    const db = new Database(CONFIG.dbPath, { readonly: true });
    validationResults.database.connection = true;
    logger.success('Database connection established (read-only mode)');
    return db;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    validationResults.database.connection = false;
    return null;
  }
}

/**
 * Validate database structure and table integrity
 */
function validateDatabaseStructure(db) {
  logger.section('Database Structure Validation');
  validationResults.summary.totalTests++;
  
  try {
    // Check required tables exist
    const requiredTables = [
      'admin_users', 'site_content', 'content_history', 'products', 
      'product_categories', 'product_images', 'client_testimonials', 
      'seo_settings', 'media_files', 'projects', 'project_categories', 
      'approvals', 'clients', 'company_info'
    ];
    
    const existingTables = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all().map(row => row.name);
    
    logger.info(`Found ${existingTables.length} tables in database`);
    
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    const extraTables = existingTables.filter(table => !requiredTables.includes(table));
    
    if (missingTables.length > 0) {
      logger.error(`Missing required tables: ${missingTables.join(', ')}`);
      validationResults.summary.errorsCount++;
    }
    
    if (extraTables.length > 0) {
      logger.warning(`Extra tables found: ${extraTables.join(', ')}`);
      validationResults.summary.warningsCount++;
    }
    
    // Check table structures
    for (const table of existingTables) {
      const columns = db.prepare(`PRAGMA table_info(${table})`).all();
      validationResults.database.tableStructure.push({
        table,
        columnCount: columns.length,
        columns: columns.map(col => ({ name: col.name, type: col.type, nullable: !col.notnull }))
      });
      logger.verbose(`Table ${table}: ${columns.length} columns`);
    }
    
    // Get record counts
    for (const table of existingTables) {
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
      validationResults.database.recordCounts[table] = count.count;
      logger.verbose(`${table}: ${count.count} records`);
    }
    
    // Check indexes
    const indexes = db.prepare(`
      SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'
    `).all();
    
    validationResults.database.indexStatus = indexes.map(idx => ({
      name: idx.name,
      table: idx.tbl_name,
      definition: idx.sql
    }));
    
    logger.info(`Found ${indexes.length} custom indexes`);
    validationResults.summary.passedTests++;
    logger.success('Database structure validation completed');
    
  } catch (error) {
    logger.error(`Database structure validation failed: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

/**
 * Validate data integrity for each table
 */
function validateDataIntegrity(db) {
  logger.section('Data Integrity Validation');
  
  // Validate products
  validateProductsData(db);
  
  // Validate projects
  validateProjectsData(db);
  
  // Validate clients
  validateClientsData(db);
  
  // Validate approvals
  validateApprovalsData(db);
  
  // Validate media files
  validateMediaData(db);
  
  // Validate content
  validateContentData(db);
}

function validateProductsData(db) {
  logger.info('Validating products data...');
  validationResults.summary.totalTests++;
  
  try {
    const products = db.prepare('SELECT * FROM products').all();
    validationResults.dataIntegrity.products.total = products.length;
    
    for (const product of products) {
      const issues = [];
      
      // Check required fields
      if (!product.name || product.name.trim() === '') {
        issues.push(`Product ID ${product.id}: Missing or empty name`);
      }
      
      if (!product.category_id || product.category_id.trim() === '') {
        issues.push(`Product ID ${product.id}: Missing category_id`);
      }
      
      if (!product.description || product.description.trim() === '') {
        issues.push(`Product ID ${product.id}: Missing description`);
      }
      
      // Validate JSON fields
      try {
        if (product.applications) JSON.parse(product.applications);
      } catch (e) {
        issues.push(`Product ID ${product.id}: Invalid applications JSON`);
      }
      
      try {
        if (product.features) JSON.parse(product.features);
      } catch (e) {
        issues.push(`Product ID ${product.id}: Invalid features JSON`);
      }
      
      // Check category exists
      const categoryExists = db.prepare('SELECT id FROM product_categories WHERE id = ?').get(product.category_id);
      if (!categoryExists) {
        issues.push(`Product ID ${product.id}: Invalid category_id '${product.category_id}'`);
      }
      
      if (issues.length > 0) {
        validationResults.dataIntegrity.products.issues.push(...issues);
        validationResults.summary.errorsCount += issues.length;
      }
    }
    
    if (validationResults.dataIntegrity.products.issues.length === 0) {
      logger.success(`Products validation passed (${products.length} products)`);
      validationResults.summary.passedTests++;
    } else {
      logger.error(`Products validation failed (${validationResults.dataIntegrity.products.issues.length} issues)`);
      validationResults.summary.failedTests++;
    }
    
  } catch (error) {
    logger.error(`Products validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

function validateProjectsData(db) {
  logger.info('Validating projects data...');
  validationResults.summary.totalTests++;
  
  try {
    const projects = db.prepare('SELECT * FROM projects').all();
    validationResults.dataIntegrity.projects.total = projects.length;
    
    for (const project of projects) {
      const issues = [];
      
      // Check required fields
      if (!project.name || project.name.trim() === '') {
        issues.push(`Project ID ${project.id}: Missing or empty name`);
      }
      
      if (!project.category || project.category.trim() === '') {
        issues.push(`Project ID ${project.id}: Missing category`);
      }
      
      // Validate JSON fields
      try {
        if (project.key_features) JSON.parse(project.key_features);
      } catch (e) {
        issues.push(`Project ID ${project.id}: Invalid key_features JSON`);
      }
      
      try {
        if (project.gallery_images) JSON.parse(project.gallery_images);
      } catch (e) {
        issues.push(`Project ID ${project.id}: Invalid gallery_images JSON`);
      }
      
      // Check category exists
      const categoryExists = db.prepare('SELECT id FROM project_categories WHERE id = ?').get(project.category);
      if (!categoryExists) {
        issues.push(`Project ID ${project.id}: Invalid category '${project.category}'`);
      }
      
      if (issues.length > 0) {
        validationResults.dataIntegrity.projects.issues.push(...issues);
        validationResults.summary.errorsCount += issues.length;
      }
    }
    
    if (validationResults.dataIntegrity.projects.issues.length === 0) {
      logger.success(`Projects validation passed (${projects.length} projects)`);
      validationResults.summary.passedTests++;
    } else {
      logger.error(`Projects validation failed (${validationResults.dataIntegrity.projects.issues.length} issues)`);
      validationResults.summary.failedTests++;
    }
    
  } catch (error) {
    logger.error(`Projects validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

function validateClientsData(db) {
  logger.info('Validating clients data...');
  validationResults.summary.totalTests++;
  
  try {
    const clients = db.prepare('SELECT * FROM clients').all();
    validationResults.dataIntegrity.clients.total = clients.length;
    
    for (const client of clients) {
      const issues = [];
      
      // Check required fields
      if (!client.company_name || client.company_name.trim() === '') {
        issues.push(`Client ID ${client.id}: Missing or empty company_name`);
      }
      
      if (!client.logo_url || client.logo_url.trim() === '') {
        issues.push(`Client ID ${client.id}: Missing logo_url`);
      }
      
      // Validate URLs
      if (client.website_url && !client.website_url.match(/^https?:\/\/.+/)) {
        issues.push(`Client ID ${client.id}: Invalid website_url format`);
      }
      
      if (issues.length > 0) {
        validationResults.dataIntegrity.clients.issues.push(...issues);
        validationResults.summary.errorsCount += issues.length;
      }
    }
    
    if (validationResults.dataIntegrity.clients.issues.length === 0) {
      logger.success(`Clients validation passed (${clients.length} clients)`);
      validationResults.summary.passedTests++;
    } else {
      logger.error(`Clients validation failed (${validationResults.dataIntegrity.clients.issues.length} issues)`);
      validationResults.summary.failedTests++;
    }
    
  } catch (error) {
    logger.error(`Clients validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

function validateApprovalsData(db) {
  logger.info('Validating approvals data...');
  validationResults.summary.totalTests++;
  
  try {
    const approvals = db.prepare('SELECT * FROM approvals').all();
    validationResults.dataIntegrity.approvals.total = approvals.length;
    
    for (const approval of approvals) {
      const issues = [];
      
      // Check required fields
      if (!approval.authority_name || approval.authority_name.trim() === '') {
        issues.push(`Approval ID ${approval.id}: Missing or empty authority_name`);
      }
      
      if (!approval.logo_url || approval.logo_url.trim() === '') {
        issues.push(`Approval ID ${approval.id}: Missing logo_url`);
      }
      
      // Validate date formats
      if (approval.issue_date && !approval.issue_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        issues.push(`Approval ID ${approval.id}: Invalid issue_date format (should be YYYY-MM-DD)`);
      }
      
      if (approval.expiry_date && !approval.expiry_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        issues.push(`Approval ID ${approval.id}: Invalid expiry_date format (should be YYYY-MM-DD)`);
      }
      
      if (issues.length > 0) {
        validationResults.dataIntegrity.approvals.issues.push(...issues);
        validationResults.summary.errorsCount += issues.length;
      }
    }
    
    if (validationResults.dataIntegrity.approvals.issues.length === 0) {
      logger.success(`Approvals validation passed (${approvals.length} approvals)`);
      validationResults.summary.passedTests++;
    } else {
      logger.error(`Approvals validation failed (${validationResults.dataIntegrity.approvals.issues.length} issues)`);
      validationResults.summary.failedTests++;
    }
    
  } catch (error) {
    logger.error(`Approvals validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

function validateMediaData(db) {
  logger.info('Validating media files data...');
  validationResults.summary.totalTests++;
  
  try {
    const mediaFiles = db.prepare('SELECT * FROM media_files').all();
    validationResults.dataIntegrity.mediaFiles.total = mediaFiles.length;
    
    for (const media of mediaFiles) {
      const issues = [];
      
      // Check required fields
      if (!media.filename || media.filename.trim() === '') {
        issues.push(`Media ID ${media.id}: Missing or empty filename`);
      }
      
      if (!media.file_path || media.file_path.trim() === '') {
        issues.push(`Media ID ${media.id}: Missing file_path`);
      }
      
      // Validate file size
      if (media.file_size && media.file_size <= 0) {
        issues.push(`Media ID ${media.id}: Invalid file_size`);
      }
      
      // Validate mime type
      if (!media.mime_type || !media.mime_type.includes('/')) {
        issues.push(`Media ID ${media.id}: Invalid or missing mime_type`);
      }
      
      if (issues.length > 0) {
        validationResults.dataIntegrity.mediaFiles.issues.push(...issues);
        validationResults.summary.errorsCount += issues.length;
      }
    }
    
    if (validationResults.dataIntegrity.mediaFiles.issues.length === 0) {
      logger.success(`Media files validation passed (${mediaFiles.length} files)`);
      validationResults.summary.passedTests++;
    } else {
      logger.error(`Media files validation failed (${validationResults.dataIntegrity.mediaFiles.issues.length} issues)`);
      validationResults.summary.failedTests++;
    }
    
  } catch (error) {
    logger.error(`Media files validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

function validateContentData(db) {
  logger.info('Validating content data...');
  validationResults.summary.totalTests++;
  
  try {
    const content = db.prepare('SELECT * FROM site_content').all();
    validationResults.dataIntegrity.content.total = content.length;
    
    for (const item of content) {
      const issues = [];
      
      // Check required fields
      if (!item.page || item.page.trim() === '') {
        issues.push(`Content ID ${item.id}: Missing or empty page`);
      }
      
      if (!item.section || item.section.trim() === '') {
        issues.push(`Content ID ${item.id}: Missing or empty section`);
      }
      
      if (!item.content_key || item.content_key.trim() === '') {
        issues.push(`Content ID ${item.id}: Missing or empty content_key`);
      }
      
      // Check content length
      if (item.content_value && item.content_value.length > 10000) {
        issues.push(`Content ID ${item.id}: Content value too long (${item.content_value.length} characters)`);
      }
      
      if (issues.length > 0) {
        validationResults.dataIntegrity.content.issues.push(...issues);
        validationResults.summary.errorsCount += issues.length;
      }
    }
    
    if (validationResults.dataIntegrity.content.issues.length === 0) {
      logger.success(`Content validation passed (${content.length} items)`);
      validationResults.summary.passedTests++;
    } else {
      logger.error(`Content validation failed (${validationResults.dataIntegrity.content.issues.length} issues)`);
      validationResults.summary.failedTests++;
    }
    
  } catch (error) {
    logger.error(`Content validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

/**
 * Validate foreign key relationships
 */
function validateForeignKeys(db) {
  logger.section('Foreign Key Relationships Validation');
  validationResults.summary.totalTests++;
  
  try {
    // Check product -> category relationships
    const orphanedProducts = db.prepare(`
      SELECT p.id, p.name, p.category_id 
      FROM products p 
      LEFT JOIN product_categories pc ON p.category_id = pc.id 
      WHERE pc.id IS NULL AND p.category_id IS NOT NULL
    `).all();
    
    if (orphanedProducts.length > 0) {
      validationResults.foreignKeys.brokenRelationships.push({
        type: 'products_categories',
        count: orphanedProducts.length,
        details: orphanedProducts
      });
      logger.error(`Found ${orphanedProducts.length} products with invalid category references`);
      validationResults.summary.errorsCount += orphanedProducts.length;
    }
    
    // Check project -> category relationships
    const orphanedProjects = db.prepare(`
      SELECT p.id, p.name, p.category 
      FROM projects p 
      LEFT JOIN project_categories pc ON p.category = pc.id 
      WHERE pc.id IS NULL AND p.category IS NOT NULL
    `).all();
    
    if (orphanedProjects.length > 0) {
      validationResults.foreignKeys.brokenRelationships.push({
        type: 'projects_categories',
        count: orphanedProjects.length,
        details: orphanedProjects
      });
      logger.error(`Found ${orphanedProjects.length} projects with invalid category references`);
      validationResults.summary.errorsCount += orphanedProjects.length;
    }
    
    // Check product_images -> products relationships
    const orphanedProductImages = db.prepare(`
      SELECT pi.id, pi.product_id 
      FROM product_images pi 
      LEFT JOIN products p ON pi.product_id = p.id 
      WHERE p.id IS NULL
    `).all();
    
    if (orphanedProductImages.length > 0) {
      validationResults.foreignKeys.brokenRelationships.push({
        type: 'product_images_products',
        count: orphanedProductImages.length,
        details: orphanedProductImages
      });
      logger.error(`Found ${orphanedProductImages.length} product images with invalid product references`);
      validationResults.summary.errorsCount += orphanedProductImages.length;
    }
    
    if (validationResults.foreignKeys.brokenRelationships.length === 0) {
      logger.success('Foreign key validation passed - all relationships are valid');
      validationResults.summary.passedTests++;
    } else {
      logger.error('Foreign key validation failed - broken relationships found');
      validationResults.summary.failedTests++;
    }
    
  } catch (error) {
    logger.error(`Foreign key validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

/**
 * Validate media file existence
 */
function validateMediaFiles(db) {
  logger.section('Media File Existence Validation');
  validationResults.summary.totalTests++;
  
  try {
    const mediaFiles = db.prepare('SELECT id, filename, file_path FROM media_files').all();
    validationResults.mediaValidation.totalFiles = mediaFiles.length;
    
    for (const media of mediaFiles) {
      const fullPath = path.join(__dirname, '..', 'public', media.file_path);
      
      if (fs.existsSync(fullPath)) {
        validationResults.mediaValidation.existingFiles++;
        logger.verbose(`✓ Found: ${media.file_path}`);
      } else {
        validationResults.mediaValidation.missingFiles.push({
          id: media.id,
          filename: media.filename,
          path: media.file_path,
          expectedLocation: fullPath
        });
        logger.error(`✗ Missing: ${media.file_path}`);
        validationResults.summary.errorsCount++;
      }
    }
    
    // Check for orphaned files (files on disk not in database)
    const mediaDirectories = [
      'client-logos',
      'approval-logos',
      'project-photos'
    ];
    
    for (const dir of mediaDirectories) {
      const dirPath = path.join(CONFIG.mediaPath, dir);
      if (fs.existsSync(dirPath)) {
        const files = getAllFiles(dirPath);
        for (const file of files) {
          const relativePath = file.replace(path.join(__dirname, '..', 'public'), '').replace(/\\/g, '/');
          const inDatabase = mediaFiles.some(m => m.file_path === relativePath);
          
          if (!inDatabase) {
            validationResults.mediaValidation.orphanedRecords.push({
              path: relativePath,
              fullPath: file
            });
            logger.warning(`Orphaned file: ${relativePath}`);
            validationResults.summary.warningsCount++;
          }
        }
      }
    }
    
    const missingCount = validationResults.mediaValidation.missingFiles.length;
    const orphanedCount = validationResults.mediaValidation.orphanedRecords.length;
    
    if (missingCount === 0 && orphanedCount === 0) {
      logger.success(`Media validation passed (${validationResults.mediaValidation.existingFiles}/${mediaFiles.length} files found)`);
      validationResults.summary.passedTests++;
    } else {
      logger.error(`Media validation issues: ${missingCount} missing, ${orphanedCount} orphaned`);
      validationResults.summary.failedTests++;
    }
    
  } catch (error) {
    logger.error(`Media validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

/**
 * Get all files in directory recursively
 */
function getAllFiles(dirPath) {
  const files = [];
  
  function scanDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.match(/\.(jpg|jpeg|png|webp|gif|svg|pdf|doc|docx)$/i)) {
        files.push(fullPath);
      }
    }
  }
  
  try {
    scanDirectory(dirPath);
  } catch (error) {
    logger.error(`Error scanning directory ${dirPath}: ${error.message}`);
  }
  
  return files;
}

/**
 * Validate content quality and SEO compliance
 */
function validateContentQuality(db) {
  logger.section('Content Quality & SEO Validation');
  validationResults.summary.totalTests += 2;
  
  try {
    // Check content completeness
    const requiredPages = ['home', 'about', 'products', 'projects', 'clients', 'approvals', 'contact'];
    const seoSettings = db.prepare('SELECT page, title, description, keywords FROM seo_settings').all();
    const pageContent = db.prepare('SELECT page, COUNT(*) as content_items FROM site_content GROUP BY page').all();
    
    validationResults.contentQuality.completeness = {
      requiredPages: requiredPages.length,
      pagesWithSEO: 0,
      pagesWithContent: 0,
      missingPages: []
    };
    
    // Check SEO completeness
    for (const page of requiredPages) {
      const seo = seoSettings.find(s => s.page === page);
      const content = pageContent.find(c => c.page === page);
      
      if (seo) {
        validationResults.contentQuality.completeness.pagesWithSEO++;
        
        // Validate SEO quality
        if (!seo.title || seo.title.length < 30 || seo.title.length > 60) {
          validationResults.contentQuality.seoCompliance[page] = validationResults.contentQuality.seoCompliance[page] || [];
          validationResults.contentQuality.seoCompliance[page].push(`Title length issue (${seo.title?.length || 0} chars, recommended: 30-60)`);
        }
        
        if (!seo.description || seo.description.length < 120 || seo.description.length > 160) {
          validationResults.contentQuality.seoCompliance[page] = validationResults.contentQuality.seoCompliance[page] || [];
          validationResults.contentQuality.seoCompliance[page].push(`Meta description length issue (${seo.description?.length || 0} chars, recommended: 120-160)`);
        }
        
        if (!seo.keywords || seo.keywords.split(',').length < 3) {
          validationResults.contentQuality.seoCompliance[page] = validationResults.contentQuality.seoCompliance[page] || [];
          validationResults.contentQuality.seoCompliance[page].push('Insufficient keywords (minimum 3 recommended)');
        }
      } else {
        validationResults.contentQuality.completeness.missingPages.push(`${page}: Missing SEO settings`);
      }
      
      if (content) {
        validationResults.contentQuality.completeness.pagesWithContent++;
      } else {
        validationResults.contentQuality.completeness.missingPages.push(`${page}: Missing content`);
      }
    }
    
    // Content quality assessment
    if (validationResults.contentQuality.completeness.pagesWithSEO === requiredPages.length &&
        validationResults.contentQuality.completeness.pagesWithContent === requiredPages.length) {
      logger.success('Content completeness validation passed');
      validationResults.summary.passedTests++;
    } else {
      logger.error(`Content completeness issues: ${validationResults.contentQuality.completeness.missingPages.length} missing`);
      validationResults.summary.failedTests++;
      validationResults.summary.errorsCount += validationResults.contentQuality.completeness.missingPages.length;
    }
    
    // SEO compliance assessment
    const seoIssuesCount = Object.values(validationResults.contentQuality.seoCompliance).reduce((total, issues) => total + issues.length, 0);
    
    if (seoIssuesCount === 0) {
      logger.success('SEO compliance validation passed');
      validationResults.summary.passedTests++;
    } else {
      logger.warning(`SEO compliance issues found: ${seoIssuesCount} warnings`);
      validationResults.summary.warningsCount += seoIssuesCount;
    }
    
  } catch (error) {
    logger.error(`Content quality validation error: ${error.message}`);
    validationResults.summary.failedTests += 2;
    validationResults.summary.errorsCount++;
  }
}

/**
 * Validate performance optimization
 */
function validatePerformance(db) {
  logger.section('Performance Validation');
  validationResults.summary.totalTests++;
  
  try {
    // Test query performance
    const queries = [
      { name: 'products_list', query: 'SELECT * FROM products WHERE is_active = 1' },
      { name: 'projects_by_category', query: 'SELECT * FROM projects WHERE category = ? AND is_active = 1', params: ['metro_rail'] },
      { name: 'clients_featured', query: 'SELECT * FROM clients WHERE is_featured = 1 AND is_active = 1' },
      { name: 'media_files_count', query: 'SELECT COUNT(*) FROM media_files' }
    ];
    
    for (const testQuery of queries) {
      const startTime = process.hrtime();
      
      try {
        const stmt = db.prepare(testQuery.query);
        if (testQuery.params) {
          stmt.all(...testQuery.params);
        } else {
          stmt.all();
        }
        
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const milliseconds = seconds * 1000 + nanoseconds / 1000000;
        
        validationResults.performance.queryPerformance.push({
          query: testQuery.name,
          executionTime: milliseconds,
          status: milliseconds < 100 ? 'good' : milliseconds < 500 ? 'acceptable' : 'slow'
        });
        
        logger.verbose(`Query ${testQuery.name}: ${milliseconds.toFixed(2)}ms`);
        
      } catch (error) {
        logger.error(`Query ${testQuery.name} failed: ${error.message}`);
        validationResults.summary.errorsCount++;
      }
    }
    
    // Performance recommendations
    const slowQueries = validationResults.performance.queryPerformance.filter(q => q.status === 'slow');
    const recordCounts = validationResults.database.recordCounts;
    
    if (recordCounts.products > 1000 && !validationResults.database.indexStatus.some(i => i.name.includes('products_category'))) {
      validationResults.performance.recommendations.push('Consider adding index on products.category_id for better performance');
    }
    
    if (recordCounts.projects > 500 && !validationResults.database.indexStatus.some(i => i.name.includes('projects_category'))) {
      validationResults.performance.recommendations.push('Consider adding index on projects.category for better performance');
    }
    
    if (slowQueries.length === 0) {
      logger.success('Performance validation passed - all queries execute efficiently');
      validationResults.summary.passedTests++;
    } else {
      logger.warning(`Performance concerns: ${slowQueries.length} slow queries detected`);
      validationResults.summary.warningsCount += slowQueries.length;
    }
    
  } catch (error) {
    logger.error(`Performance validation error: ${error.message}`);
    validationResults.summary.failedTests++;
    validationResults.summary.errorsCount++;
  }
}

/**
 * Export validation report
 */
function exportValidationReport() {
  if (!CONFIG.exportReport) return;
  
  logger.section('Exporting Validation Report');
  
  try {
    if (!fs.existsSync(CONFIG.reportPath)) {
      fs.mkdirSync(CONFIG.reportPath, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(CONFIG.reportPath, `validation-report-${timestamp}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: validationResults.summary,
      database: validationResults.database,
      dataIntegrity: validationResults.dataIntegrity,
      foreignKeys: validationResults.foreignKeys,
      mediaValidation: validationResults.mediaValidation,
      contentQuality: validationResults.contentQuality,
      performance: validationResults.performance
    };
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    logger.success(`Validation report exported: ${reportFile}`);
    
    // Create summary report
    const summaryFile = path.join(CONFIG.reportPath, `validation-summary-${timestamp}.txt`);
    const summary = `
Yahska Polymers Data Validation Report
Generated: ${new Date().toISOString()}

SUMMARY
=======
Total Tests: ${validationResults.summary.totalTests}
Passed Tests: ${validationResults.summary.passedTests}
Failed Tests: ${validationResults.summary.failedTests}
Warnings: ${validationResults.summary.warningsCount}
Errors: ${validationResults.summary.errorsCount}

DATABASE RECORDS
===============
Products: ${validationResults.database.recordCounts.products || 0}
Projects: ${validationResults.database.recordCounts.projects || 0}
Clients: ${validationResults.database.recordCounts.clients || 0}
Approvals: ${validationResults.database.recordCounts.approvals || 0}
Media Files: ${validationResults.database.recordCounts.media_files || 0}
Content Items: ${validationResults.database.recordCounts.site_content || 0}

VALIDATION RESULTS
=================
Data Integrity Issues: ${Object.values(validationResults.dataIntegrity).reduce((total, category) => total + category.issues.length, 0)}
Broken Foreign Keys: ${validationResults.foreignKeys.brokenRelationships.length}
Missing Media Files: ${validationResults.mediaValidation.missingFiles.length}
Orphaned Media Files: ${validationResults.mediaValidation.orphanedRecords.length}
SEO Compliance Issues: ${Object.values(validationResults.contentQuality.seoCompliance).reduce((total, issues) => total + issues.length, 0)}
Performance Recommendations: ${validationResults.performance.recommendations.length}

STATUS: ${validationResults.summary.errorsCount === 0 ? 'PASSED' : 'NEEDS ATTENTION'}
    `;
    
    fs.writeFileSync(summaryFile, summary);
    logger.success(`Summary report exported: ${summaryFile}`);
    
  } catch (error) {
    logger.error(`Report export failed: ${error.message}`);
  }
}

/**
 * Main validation execution
 */
async function executeValidation() {
  logger.section('Data Validation & Quality Assurance Execution');
  
  const startTime = Date.now();
  let db;
  
  try {
    // Initialize database
    db = initializeDatabase();
    if (!db) {
      throw new Error('Database initialization failed');
    }
    
    // Execute validation steps
    logger.info('Starting validation procedures...');
    
    validateDatabaseStructure(db);
    validateDataIntegrity(db);
    validateForeignKeys(db);
    validateMediaFiles(db);
    validateContentQuality(db);
    validatePerformance(db);
    
  } catch (error) {
    logger.error(`Validation execution failed: ${error.message}`);
  } finally {
    if (db) {
      db.close();
      logger.info('Database connection closed');
    }
  }
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  // Export report
  exportValidationReport();
  
  // Final summary
  logger.section('Validation Summary');
  logger.info(`Execution time: ${duration.toFixed(2)} seconds`);
  logger.info('Results:');
  logger.info(`  Total tests: ${validationResults.summary.totalTests}`);
  logger.info(`  Passed tests: ${validationResults.summary.passedTests}`);
  logger.info(`  Failed tests: ${validationResults.summary.failedTests}`);
  logger.info(`  Warnings: ${validationResults.summary.warningsCount}`);
  logger.info(`  Errors: ${validationResults.summary.errorsCount}`);
  
  const overallStatus = validationResults.summary.errorsCount === 0 ? 'PASSED' : 'NEEDS ATTENTION';
  logger.info(`  Overall status: ${overallStatus}`);
  
  if (validationResults.summary.errorsCount > 0) {
    logger.error('Critical issues found that require immediate attention');
  } else if (validationResults.summary.warningsCount > 0) {
    logger.warning('Non-critical issues found that should be addressed');
  } else {
    logger.success('All validation checks passed successfully!');
  }
  
  return validationResults;
}

// Execute if run directly
if (require.main === module) {
  // Handle command line arguments
  if (process.argv.includes('--help')) {
    console.log(`
Yahska Polymers Data Validation & Quality Assurance Tool

Usage: node data-validation-qa.js [options]

Options:
  --verbose     Enable verbose logging
  --fix         Attempt to fix issues where possible (NOT IMPLEMENTED)
  --export      Export detailed validation reports
  --help        Show this help message

Validation Procedures:
  1. Database structure and table integrity
  2. Data integrity for all tables  
  3. Foreign key relationship validation
  4. Media file existence verification
  5. Content quality and SEO compliance
  6. Performance optimization validation

Examples:
  node data-validation-qa.js --verbose
  node data-validation-qa.js --export
  node data-validation-qa.js --verbose --export
    `);
    process.exit(0);
  }
  
  executeValidation()
    .then(results => {
      process.exit(results.summary.errorsCount === 0 ? 0 : 1);
    })
    .catch(error => {
      logger.error(`Fatal error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  executeValidation,
  validationResults
};