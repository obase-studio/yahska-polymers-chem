// Database Schema Enhancements for Yahska Polymers Data Integration System

import Database from 'better-sqlite3'
import { join } from 'path'

export class DatabaseEnhancements {
  private db: Database.Database

  constructor(dbPath?: string) {
    this.db = new Database(dbPath || join(process.cwd(), 'admin.db'))
  }

  // Enhanced Database Schema with Security and Performance Optimizations
  public initEnhancedSchema(): void {
    // Enable foreign key constraints
    this.db.exec('PRAGMA foreign_keys = ON')
    
    // Performance settings
    this.db.exec('PRAGMA journal_mode = WAL')
    this.db.exec('PRAGMA synchronous = NORMAL')
    this.db.exec('PRAGMA cache_size = 1000')
    this.db.exec('PRAGMA temp_store = memory')

    // Create enhanced tables with proper constraints and indexes
    this.createSecurityTables()
    this.createAuditTables()
    this.createCacheTables()
    this.enhanceExistingTables()
    this.createIndexes()
    this.createTriggers()
  }

  // Security Enhancement Tables
  private createSecurityTables(): void {
    // Session management
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_activity INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
      )
    `)

    // Login attempts tracking
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        success BOOLEAN NOT NULL,
        attempted_at INTEGER DEFAULT (strftime('%s', 'now')),
        user_agent TEXT
      )
    `)

    // API rate limiting
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id TEXT PRIMARY KEY, -- IP address or user identifier
        endpoint TEXT NOT NULL,
        count INTEGER DEFAULT 1,
        reset_time INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)

    // CSRF tokens
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS csrf_tokens (
        token TEXT PRIMARY KEY,
        user_id INTEGER,
        expires_at INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
      )
    `)

    // File upload security
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS file_security_scan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL,
        scan_status TEXT DEFAULT 'pending', -- pending, safe, unsafe, error
        scan_result TEXT, -- JSON with scan details
        scanned_at INTEGER,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (file_id) REFERENCES media_files(id) ON DELETE CASCADE
      )
    `)
  }

  // Audit and Logging Tables
  private createAuditTables(): void {
    // Comprehensive audit log
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL, -- products, projects, clients, etc.
        entity_id INTEGER NOT NULL,
        action TEXT NOT NULL, -- create, update, delete, view
        old_values TEXT, -- JSON of previous values
        new_values TEXT, -- JSON of new values
        user_id INTEGER,
        ip_address TEXT,
        user_agent TEXT,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL
      )
    `)

    // System activity log
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL, -- error, warning, info, debug
        category TEXT NOT NULL, -- auth, api, database, file_upload, etc.
        message TEXT NOT NULL,
        details TEXT, -- JSON with additional details
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        ip_address TEXT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL
      )
    `)

    // Performance metrics
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        response_time INTEGER NOT NULL, -- in milliseconds
        status_code INTEGER NOT NULL,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL
      )
    `)
  }

  // Caching Tables
  private createCacheTables(): void {
    // Application cache
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS app_cache (
        cache_key TEXT PRIMARY KEY,
        cache_value TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `)

    // Page cache for frontend
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS page_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_path TEXT NOT NULL,
        cache_key TEXT NOT NULL,
        cache_data TEXT NOT NULL, -- JSON or HTML
        expires_at INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        UNIQUE(page_path, cache_key)
      )
    `)
  }

  // Enhance existing tables with additional fields and constraints
  private enhanceExistingTables(): void {
    // Enhanced admin users table
    this.addColumnIfNotExists('admin_users', 'email', 'TEXT UNIQUE')
    this.addColumnIfNotExists('admin_users', 'full_name', 'TEXT')
    this.addColumnIfNotExists('admin_users', 'role', 'TEXT DEFAULT "admin"')
    this.addColumnIfNotExists('admin_users', 'last_login', 'INTEGER')
    this.addColumnIfNotExists('admin_users', 'failed_login_attempts', 'INTEGER DEFAULT 0')
    this.addColumnIfNotExists('admin_users', 'locked_until', 'INTEGER')
    this.addColumnIfNotExists('admin_users', 'password_changed_at', 'INTEGER')
    this.addColumnIfNotExists('admin_users', 'two_factor_secret', 'TEXT')
    this.addColumnIfNotExists('admin_users', 'two_factor_enabled', 'BOOLEAN DEFAULT 0')
    this.addColumnIfNotExists('admin_users', 'is_active', 'BOOLEAN DEFAULT 1')

    // Enhanced media files table
    this.addColumnIfNotExists('media_files', 'folder_path', 'TEXT DEFAULT ""')
    this.addColumnIfNotExists('media_files', 'checksum', 'TEXT')
    this.addColumnIfNotExists('media_files', 'width', 'INTEGER')
    this.addColumnIfNotExists('media_files', 'height', 'INTEGER')
    this.addColumnIfNotExists('media_files', 'duration', 'INTEGER') // For video files
    this.addColumnIfNotExists('media_files', 'compressed_version', 'TEXT')
    this.addColumnIfNotExists('media_files', 'thumbnail_url', 'TEXT')
    this.addColumnIfNotExists('media_files', 'uploaded_by', 'INTEGER')
    this.addColumnIfNotExists('media_files', 'is_public', 'BOOLEAN DEFAULT 1')
    this.addColumnIfNotExists('media_files', 'download_count', 'INTEGER DEFAULT 0')

    // Enhanced products table for better data management
    this.addColumnIfNotExists('products', 'sku', 'TEXT UNIQUE')
    this.addColumnIfNotExists('products', 'weight', 'REAL')
    this.addColumnIfNotExists('products', 'dimensions', 'TEXT') // JSON: {length, width, height}
    this.addColumnIfNotExists('products', 'inventory_status', 'TEXT DEFAULT "in_stock"')
    this.addColumnIfNotExists('products', 'min_order_quantity', 'INTEGER')
    this.addColumnIfNotExists('products', 'max_order_quantity', 'INTEGER')
    this.addColumnIfNotExists('products', 'manufacturer_info', 'TEXT') // JSON
    this.addColumnIfNotExists('products', 'certifications', 'TEXT') // JSON array
    this.addColumnIfNotExists('products', 'related_products', 'TEXT') // JSON array of product IDs
    this.addColumnIfNotExists('products', 'seo_title', 'TEXT')
    this.addColumnIfNotExists('products', 'seo_description', 'TEXT')
    this.addColumnIfNotExists('products', 'seo_keywords', 'TEXT')
    this.addColumnIfNotExists('products', 'view_count', 'INTEGER DEFAULT 0')
    this.addColumnIfNotExists('products', 'inquiry_count', 'INTEGER DEFAULT 0')

    // Enhanced projects table
    this.addColumnIfNotExists('projects', 'project_status', 'TEXT DEFAULT "completed"')
    this.addColumnIfNotExists('projects', 'budget_range', 'TEXT')
    this.addColumnIfNotExists('projects', 'team_size', 'INTEGER')
    this.addColumnIfNotExists('projects', 'duration_months', 'INTEGER')
    this.addColumnIfNotExists('projects', 'technologies_used', 'TEXT') // JSON array
    this.addColumnIfNotExists('projects', 'project_manager', 'TEXT')
    this.addColumnIfNotExists('projects', 'external_links', 'TEXT') // JSON array
    this.addColumnIfNotExists('projects', 'awards', 'TEXT') // JSON array
    this.addColumnIfNotExists('projects', 'environmental_impact', 'TEXT')
    this.addColumnIfNotExists('projects', 'view_count', 'INTEGER DEFAULT 0')

    // Enhanced clients table
    this.addColumnIfNotExists('clients', 'contact_person', 'TEXT')
    this.addColumnIfNotExists('clients', 'contact_email', 'TEXT')
    this.addColumnIfNotExists('clients', 'contact_phone', 'TEXT')
    this.addColumnIfNotExists('clients', 'annual_revenue', 'TEXT')
    this.addColumnIfNotExists('clients', 'employee_count_range', 'TEXT')
    this.addColumnIfNotExists('clients', 'headquarters_location', 'TEXT')
    this.addColumnIfNotExists('clients', 'business_type', 'TEXT') // B2B, B2C, etc.
    this.addColumnIfNotExists('clients', 'client_since_verified', 'BOOLEAN DEFAULT 0')
    this.addColumnIfNotExists('clients', 'testimonial_permission', 'BOOLEAN DEFAULT 0')
    this.addColumnIfNotExists('clients', 'case_study_permission', 'BOOLEAN DEFAULT 0')

    // Enhanced approvals table
    this.addColumnIfNotExists('approvals', 'renewal_due_date', 'TEXT')
    this.addColumnIfNotExists('approvals', 'approval_status', 'TEXT DEFAULT "active"')
    this.addColumnIfNotExists('approvals', 'authority_website', 'TEXT')
    this.addColumnIfNotExists('approvals', 'verification_url', 'TEXT')
    this.addColumnIfNotExists('approvals', 'scope_of_approval', 'TEXT')
    this.addColumnIfNotExists('approvals', 'geographic_coverage', 'TEXT')
    this.addColumnIfNotExists('approvals', 'renewal_cost', 'TEXT')
    this.addColumnIfNotExists('approvals', 'responsible_person', 'TEXT')
    this.addColumnIfNotExists('approvals', 'notification_sent', 'BOOLEAN DEFAULT 0')
  }

  // Create comprehensive indexes for performance
  private createIndexes(): void {
    // Security-related indexes
    this.createIndexIfNotExists('idx_user_sessions_expires', 'user_sessions', 'expires_at')
    this.createIndexIfNotExists('idx_user_sessions_user_id', 'user_sessions', 'user_id')
    this.createIndexIfNotExists('idx_login_attempts_ip_time', 'login_attempts', 'ip_address, attempted_at')
    this.createIndexIfNotExists('idx_rate_limits_reset_time', 'rate_limits', 'reset_time')
    this.createIndexIfNotExists('idx_csrf_tokens_expires', 'csrf_tokens', 'expires_at')

    // Audit and performance indexes
    this.createIndexIfNotExists('idx_audit_logs_entity', 'audit_logs', 'entity_type, entity_id')
    this.createIndexIfNotExists('idx_audit_logs_timestamp', 'audit_logs', 'timestamp')
    this.createIndexIfNotExists('idx_audit_logs_user', 'audit_logs', 'user_id')
    this.createIndexIfNotExists('idx_system_logs_timestamp', 'system_logs', 'timestamp')
    this.createIndexIfNotExists('idx_system_logs_level', 'system_logs', 'level')
    this.createIndexIfNotExists('idx_performance_metrics_endpoint', 'performance_metrics', 'endpoint, timestamp')

    // Cache indexes
    this.createIndexIfNotExists('idx_app_cache_expires', 'app_cache', 'expires_at')
    this.createIndexIfNotExists('idx_page_cache_expires', 'page_cache', 'expires_at')
    this.createIndexIfNotExists('idx_page_cache_path', 'page_cache', 'page_path')

    // Enhanced entity indexes
    this.createIndexIfNotExists('idx_products_sku', 'products', 'sku')
    this.createIndexIfNotExists('idx_products_inventory_status', 'products', 'inventory_status')
    this.createIndexIfNotExists('idx_products_view_count', 'products', 'view_count DESC')
    this.createIndexIfNotExists('idx_projects_status', 'projects', 'project_status')
    this.createIndexIfNotExists('idx_projects_completion_date', 'projects', 'completion_date')
    this.createIndexIfNotExists('idx_clients_industry', 'clients', 'industry')
    this.createIndexIfNotExists('idx_approvals_status_expiry', 'approvals', 'approval_status, expiry_date')
    this.createIndexIfNotExists('idx_approvals_renewal_due', 'approvals', 'renewal_due_date')

    // Media file indexes
    this.createIndexIfNotExists('idx_media_files_folder', 'media_files', 'folder_path')
    this.createIndexIfNotExists('idx_media_files_checksum', 'media_files', 'checksum')
    this.createIndexIfNotExists('idx_media_files_uploaded_by', 'media_files', 'uploaded_by')

    // Full-text search indexes (SQLite FTS5)
    this.createFTSIndexes()
  }

  // Create Full-Text Search indexes
  private createFTSIndexes(): void {
    // Products FTS
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
        id UNINDEXED,
        name,
        description,
        applications,
        features,
        usage,
        advantages,
        technical_specifications,
        product_code,
        content='products',
        content_rowid='id'
      )
    `)

    // Projects FTS
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS projects_fts USING fts5(
        id UNINDEXED,
        name,
        description,
        location,
        client_name,
        key_features,
        challenges,
        solutions,
        content='projects',
        content_rowid='id'
      )
    `)

    // Clients FTS
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS clients_fts USING fts5(
        id UNINDEXED,
        company_name,
        industry,
        description,
        location,
        content='clients',
        content_rowid='id'
      )
    `)
  }

  // Create triggers for data integrity and automation
  private createTriggers(): void {
    // Auto-update timestamps
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS products_updated_at
      AFTER UPDATE ON products
      BEGIN
        UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `)

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS projects_updated_at
      AFTER UPDATE ON projects
      BEGIN
        UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `)

    // FTS synchronization triggers
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS products_fts_insert
      AFTER INSERT ON products
      BEGIN
        INSERT INTO products_fts(id, name, description, applications, features, usage, advantages, technical_specifications, product_code)
        VALUES (NEW.id, NEW.name, NEW.description, NEW.applications, NEW.features, NEW.usage, NEW.advantages, NEW.technical_specifications, NEW.product_code);
      END
    `)

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS products_fts_update
      AFTER UPDATE ON products
      BEGIN
        UPDATE products_fts SET
          name = NEW.name,
          description = NEW.description,
          applications = NEW.applications,
          features = NEW.features,
          usage = NEW.usage,
          advantages = NEW.advantages,
          technical_specifications = NEW.technical_specifications,
          product_code = NEW.product_code
        WHERE id = NEW.id;
      END
    `)

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS products_fts_delete
      AFTER DELETE ON products
      BEGIN
        DELETE FROM products_fts WHERE id = OLD.id;
      END
    `)

    // Similar triggers for projects and clients
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS projects_fts_insert
      AFTER INSERT ON projects
      BEGIN
        INSERT INTO projects_fts(id, name, description, location, client_name, key_features, challenges, solutions)
        VALUES (NEW.id, NEW.name, NEW.description, NEW.location, NEW.client_name, NEW.key_features, NEW.challenges, NEW.solutions);
      END
    `)

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS projects_fts_update
      AFTER UPDATE ON projects
      BEGIN
        UPDATE projects_fts SET
          name = NEW.name,
          description = NEW.description,
          location = NEW.location,
          client_name = NEW.client_name,
          key_features = NEW.key_features,
          challenges = NEW.challenges,
          solutions = NEW.solutions
        WHERE id = NEW.id;
      END
    `)

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS projects_fts_delete
      AFTER DELETE ON projects
      BEGIN
        DELETE FROM projects_fts WHERE id = OLD.id;
      END
    `)

    // Audit trail triggers
    this.createAuditTriggers()

    // Auto-cleanup triggers
    this.createCleanupTriggers()
  }

  // Create audit trail triggers
  private createAuditTriggers(): void {
    const auditTables = ['products', 'projects', 'clients', 'approvals', 'admin_users', 'media_files']

    auditTables.forEach(table => {
      // Insert trigger
      this.db.exec(`
        CREATE TRIGGER IF NOT EXISTS audit_${table}_insert
        AFTER INSERT ON ${table}
        BEGIN
          INSERT INTO audit_logs (entity_type, entity_id, action, new_values, timestamp)
          VALUES ('${table}', NEW.id, 'create', json_object(${this.getColumnList(table)}), strftime('%s', 'now'));
        END
      `)

      // Update trigger
      this.db.exec(`
        CREATE TRIGGER IF NOT EXISTS audit_${table}_update
        AFTER UPDATE ON ${table}
        BEGIN
          INSERT INTO audit_logs (entity_type, entity_id, action, old_values, new_values, timestamp)
          VALUES ('${table}', NEW.id, 'update', 
                  json_object(${this.getOldColumnList(table)}),
                  json_object(${this.getColumnList(table)}),
                  strftime('%s', 'now'));
        END
      `)

      // Delete trigger
      this.db.exec(`
        CREATE TRIGGER IF NOT EXISTS audit_${table}_delete
        AFTER DELETE ON ${table}
        BEGIN
          INSERT INTO audit_logs (entity_type, entity_id, action, old_values, timestamp)
          VALUES ('${table}', OLD.id, 'delete', json_object(${this.getOldColumnList(table)}), strftime('%s', 'now'));
        END
      `)
    })
  }

  // Create cleanup triggers for expired data
  private createCleanupTriggers(): void {
    // Clean expired sessions
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS cleanup_expired_sessions
      AFTER INSERT ON user_sessions
      BEGIN
        DELETE FROM user_sessions WHERE expires_at < strftime('%s', 'now');
      END
    `)

    // Clean expired CSRF tokens
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS cleanup_expired_csrf_tokens
      AFTER INSERT ON csrf_tokens
      BEGIN
        DELETE FROM csrf_tokens WHERE expires_at < strftime('%s', 'now');
      END
    `)

    // Clean old rate limit entries
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS cleanup_old_rate_limits
      AFTER INSERT ON rate_limits
      BEGIN
        DELETE FROM rate_limits WHERE reset_time < strftime('%s', 'now');
      END
    `)

    // Clean expired cache entries
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS cleanup_expired_cache
      AFTER INSERT ON app_cache
      BEGIN
        DELETE FROM app_cache WHERE expires_at < strftime('%s', 'now');
        DELETE FROM page_cache WHERE expires_at < strftime('%s', 'now');
      END
    `)
  }

  // Helper methods
  private addColumnIfNotExists(table: string, column: string, definition: string): void {
    try {
      this.db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
    } catch (error) {
      // Column already exists or other error - ignore
    }
  }

  private createIndexIfNotExists(indexName: string, table: string, columns: string): void {
    try {
      this.db.exec(`CREATE INDEX IF NOT EXISTS ${indexName} ON ${table} (${columns})`)
    } catch (error) {
      console.warn(`Failed to create index ${indexName}:`, error)
    }
  }

  private getColumnList(table: string): string {
    // This would dynamically get columns for each table
    // For now, returning a basic set - in production, query PRAGMA table_info
    const basicColumns = "'id', NEW.id, 'name', NEW.name, 'created_at', NEW.created_at, 'updated_at', NEW.updated_at"
    return basicColumns
  }

  private getOldColumnList(table: string): string {
    const basicColumns = "'id', OLD.id, 'name', OLD.name, 'created_at', OLD.created_at, 'updated_at', OLD.updated_at"
    return basicColumns
  }

  // Maintenance methods
  public vacuum(): void {
    this.db.exec('VACUUM')
  }

  public analyze(): void {
    this.db.exec('ANALYZE')
  }

  public rebuildFTSIndexes(): void {
    this.db.exec('INSERT INTO products_fts(products_fts) VALUES("rebuild")')
    this.db.exec('INSERT INTO projects_fts(projects_fts) VALUES("rebuild")')
    this.db.exec('INSERT INTO clients_fts(clients_fts) VALUES("rebuild")')
  }

  public getSchemaVersion(): string {
    try {
      const result = this.db.prepare('PRAGMA user_version').get() as { user_version: number }
      return result.user_version.toString()
    } catch {
      return '0'
    }
  }

  public setSchemaVersion(version: number): void {
    this.db.exec(`PRAGMA user_version = ${version}`)
  }

  // Database statistics
  public getDatabaseStats(): any {
    const stats = {
      size: (this.db.exec('PRAGMA page_size * PRAGMA page_count') as any)[0],
      tables: this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all(),
      indexes: this.db.prepare("SELECT name FROM sqlite_master WHERE type='index'").all(),
      triggers: this.db.prepare("SELECT name FROM sqlite_master WHERE type='trigger'").all()
    }
    return stats
  }
}

// Database migration utilities
export class DatabaseMigration {
  private db: Database.Database
  private enhancements: DatabaseEnhancements

  constructor(dbPath?: string) {
    this.db = new Database(dbPath || join(process.cwd(), 'admin.db'))
    this.enhancements = new DatabaseEnhancements(dbPath)
  }

  public async runMigrations(): Promise<void> {
    const currentVersion = parseInt(this.enhancements.getSchemaVersion())
    const targetVersion = 2 // Current schema version

    if (currentVersion < targetVersion) {
      console.log(`Migrating database from version ${currentVersion} to ${targetVersion}`)
      
      // Run migrations in sequence
      if (currentVersion < 1) {
        await this.migrateToV1()
      }
      
      if (currentVersion < 2) {
        await this.migrateToV2()
      }

      this.enhancements.setSchemaVersion(targetVersion)
      console.log('Database migration completed')
    }
  }

  private async migrateToV1(): Promise<void> {
    // Initial enhanced schema
    this.enhancements.initEnhancedSchema()
  }

  private async migrateToV2(): Promise<void> {
    // Additional enhancements and optimizations
    this.enhancements.vacuum()
    this.enhancements.analyze()
    this.enhancements.rebuildFTSIndexes()
  }

  public async backupDatabase(backupPath: string): Promise<void> {
    const backup = new Database(backupPath)
    await (this.db as any).backup(backup)
    backup.close()
  }

  public async restoreDatabase(backupPath: string): Promise<void> {
    const backup = new Database(backupPath)
    await (backup as any).backup(this.db)
    backup.close()
  }
}