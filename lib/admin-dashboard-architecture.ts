// Admin Dashboard Integration System Architecture

import { ApiResponse } from './api-types'

// ============================================================================
// ADMIN DASHBOARD ARCHITECTURE
// ============================================================================

export interface AdminUser {
  id: number
  username: string
  email?: string
  full_name?: string
  role: 'admin' | 'editor' | 'viewer'
  permissions: string[]
  last_login?: number
  is_active: boolean
  created_at: string
}

export interface Permission {
  id: string
  name: string
  description: string
  category: 'content' | 'media' | 'users' | 'system' | 'analytics'
  actions: ('create' | 'read' | 'update' | 'delete' | 'publish')[]
}

export const DEFAULT_PERMISSIONS: Record<string, Permission> = {
  'content.products': {
    id: 'content.products',
    name: 'Product Management',
    description: 'Manage product catalog',
    category: 'content',
    actions: ['create', 'read', 'update', 'delete', 'publish']
  },
  'content.projects': {
    id: 'content.projects',
    name: 'Project Management',
    description: 'Manage project portfolio',
    category: 'content',
    actions: ['create', 'read', 'update', 'delete', 'publish']
  },
  'content.clients': {
    id: 'content.clients',
    name: 'Client Management',
    description: 'Manage client information',
    category: 'content',
    actions: ['create', 'read', 'update', 'delete']
  },
  'content.approvals': {
    id: 'content.approvals',
    name: 'Approval Management',
    description: 'Manage certifications and approvals',
    category: 'content',
    actions: ['create', 'read', 'update', 'delete']
  },
  'content.pages': {
    id: 'content.pages',
    name: 'Page Content',
    description: 'Edit website page content',
    category: 'content',
    actions: ['read', 'update']
  },
  'media.files': {
    id: 'media.files',
    name: 'Media Library',
    description: 'Upload and manage media files',
    category: 'media',
    actions: ['create', 'read', 'update', 'delete']
  },
  'media.bulk_operations': {
    id: 'media.bulk_operations',
    name: 'Bulk Media Operations',
    description: 'Bulk upload, delete, and organize media',
    category: 'media',
    actions: ['create', 'update', 'delete']
  },
  'users.management': {
    id: 'users.management',
    name: 'User Management',
    description: 'Manage admin users and permissions',
    category: 'users',
    actions: ['create', 'read', 'update', 'delete']
  },
  'system.settings': {
    id: 'system.settings',
    name: 'System Settings',
    description: 'Configure system-wide settings',
    category: 'system',
    actions: ['read', 'update']
  },
  'system.backup': {
    id: 'system.backup',
    name: 'Backup & Restore',
    description: 'Backup and restore system data',
    category: 'system',
    actions: ['create', 'read']
  },
  'analytics.view': {
    id: 'analytics.view',
    name: 'Analytics Dashboard',
    description: 'View system analytics and reports',
    category: 'analytics',
    actions: ['read']
  },
  'analytics.export': {
    id: 'analytics.export',
    name: 'Export Data',
    description: 'Export data and generate reports',
    category: 'analytics',
    actions: ['create', 'read']
  }
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: Object.keys(DEFAULT_PERMISSIONS),
  editor: [
    'content.products',
    'content.projects', 
    'content.clients',
    'content.approvals',
    'content.pages',
    'media.files',
    'media.bulk_operations',
    'analytics.view'
  ],
  viewer: [
    'content.products',
    'content.projects',
    'content.clients', 
    'content.approvals',
    'content.pages',
    'media.files',
    'analytics.view'
  ].map(permission => `${permission}:read`)
}

// ============================================================================
// CONTENT MANAGEMENT SYSTEM
// ============================================================================

export interface ContentSection {
  id: string
  page: string
  section: string
  title: string
  description: string
  fields: ContentField[]
  permissions?: string[]
  validation?: ValidationRules
}

export interface ContentField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'rich_text' | 'number' | 'select' | 'multiselect' | 
        'image' | 'gallery' | 'link' | 'boolean' | 'date' | 'json' | 'array'
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  help?: string
  required?: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
    fileTypes?: string[]
    maxFileSize?: number
  }
  conditional?: {
    field: string
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains'
    value: any
  }
  default?: any
}

export interface ValidationRules {
  required?: string[]
  custom?: Array<{
    field: string
    validator: (value: any, allValues: any) => string | null
    message: string
  }>
}

export class ContentManagementService {
  private baseUrl: string

  constructor(baseUrl: string = '/api/admin') {
    this.baseUrl = baseUrl
  }

  // Get content for a specific page/section
  async getContent(page: string, section?: string): Promise<ApiResponse<any>> {
    const url = section 
      ? `${this.baseUrl}/content?page=${page}&section=${section}`
      : `${this.baseUrl}/content?page=${page}`
    
    const response = await fetch(url)
    return response.json()
  }

  // Update content
  async updateContent(updates: Array<{
    page: string
    section: string
    content_key: string
    content_value: any
  }>): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates })
    })
    return response.json()
  }

  // Get content history
  async getContentHistory(page: string, section: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/content/history?page=${page}&section=${section}`)
    return response.json()
  }

  // Bulk content operations
  async bulkUpdateContent(operations: Array<{
    action: 'update' | 'delete' | 'restore'
    page: string
    section: string
    content_key: string
    content_value?: any
  }>): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/content/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operations })
    })
    return response.json()
  }
}

// ============================================================================
// MEDIA ASSET MANAGEMENT
// ============================================================================

export interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text?: string
  folder_path?: string
  width?: number
  height?: number
  duration?: number
  thumbnail_url?: string
  checksum: string
  uploaded_by: number
  is_public: boolean
  download_count: number
  uploaded_at: string
  tags?: string[]
  metadata?: Record<string, any>
}

export interface MediaFolder {
  id: string
  name: string
  path: string
  parent_id?: string
  file_count: number
  size: number
  created_at: string
  permissions?: string[]
}

export interface MediaUploadOptions {
  folder?: string
  alt_text?: string
  tags?: string[]
  resize?: {
    width: number
    height: number
    quality?: number
  }
  generateThumbnail?: boolean
  compress?: boolean
}

export interface BulkUploadResult {
  successful: Array<{ file: string; id: number; url: string }>
  failed: Array<{ file: string; error: string }>
  summary: {
    total: number
    successful: number
    failed: number
    totalSize: number
  }
}

export class MediaManagementService {
  private baseUrl: string

  constructor(baseUrl: string = '/api/admin') {
    this.baseUrl = baseUrl
  }

  // Get media files with filtering and pagination
  async getMediaFiles(params: {
    folder?: string
    search?: string
    type?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<ApiResponse<{ files: MediaFile[]; total: number }>> {
    const queryString = new URLSearchParams(params as any).toString()
    const response = await fetch(`${this.baseUrl}/media?${queryString}`)
    return response.json()
  }

  // Upload single file
  async uploadFile(file: File, options: MediaUploadOptions = {}): Promise<ApiResponse<MediaFile>> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (options.folder) formData.append('folder', options.folder)
    if (options.alt_text) formData.append('alt_text', options.alt_text)
    if (options.tags) formData.append('tags', JSON.stringify(options.tags))
    if (options.resize) formData.append('resize', JSON.stringify(options.resize))
    if (options.generateThumbnail) formData.append('generateThumbnail', 'true')
    if (options.compress) formData.append('compress', 'true')

    const response = await fetch(`${this.baseUrl}/media/upload`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  }

  // Bulk upload files
  async bulkUploadFiles(
    files: FileList | File[], 
    options: MediaUploadOptions = {}
  ): Promise<ApiResponse<BulkUploadResult>> {
    const formData = new FormData()
    
    Array.from(files).forEach((file, index) => {
      formData.append(`files`, file)
    })

    if (options.folder) formData.append('folder', options.folder)
    if (options.tags) formData.append('tags', JSON.stringify(options.tags))
    if (options.resize) formData.append('resize', JSON.stringify(options.resize))
    if (options.generateThumbnail) formData.append('generateThumbnail', 'true')
    if (options.compress) formData.append('compress', 'true')

    const response = await fetch(`${this.baseUrl}/media/bulk-upload`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  }

  // Update file metadata
  async updateFile(id: number, updates: Partial<MediaFile>): Promise<ApiResponse<MediaFile>> {
    const response = await fetch(`${this.baseUrl}/media/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return response.json()
  }

  // Delete files
  async deleteFiles(ids: number[]): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/media/bulk-delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })
    return response.json()
  }

  // Move files to folder
  async moveFiles(fileIds: number[], targetFolder: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/media/move`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileIds, targetFolder })
    })
    return response.json()
  }

  // Create folder
  async createFolder(name: string, parentPath?: string): Promise<ApiResponse<MediaFolder>> {
    const response = await fetch(`${this.baseUrl}/media/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentPath })
    })
    return response.json()
  }

  // Get folders
  async getFolders(): Promise<ApiResponse<MediaFolder[]>> {
    const response = await fetch(`${this.baseUrl}/media/folders`)
    return response.json()
  }

  // Generate optimized URLs
  generateOptimizedUrl(
    file: MediaFile, 
    options: { width?: number; height?: number; quality?: number; format?: string } = {}
  ): string {
    const params = new URLSearchParams()
    if (options.width) params.set('w', options.width.toString())
    if (options.height) params.set('h', options.height.toString())
    if (options.quality) params.set('q', options.quality.toString())
    if (options.format) params.set('f', options.format)

    const separator = file.file_path.includes('?') ? '&' : '?'
    return `${file.file_path}${separator}${params.toString()}`
  }
}

// ============================================================================
// BULK OPERATIONS AND IMPORT/EXPORT
// ============================================================================

export interface ImportMapping {
  sourceField: string
  targetField: string
  transformer?: 'uppercase' | 'lowercase' | 'trim' | 'split_comma' | 'parse_json'
  defaultValue?: any
}

export interface ImportOptions {
  skipFirstRow: boolean
  updateExisting: boolean
  validateOnly: boolean
  batchSize?: number
  onProgress?: (processed: number, total: number) => void
  onError?: (row: number, error: string, data: any) => void
}

export interface ImportResult {
  total: number
  processed: number
  successful: number
  failed: number
  errors: Array<{ row: number; error: string; data: any }>
  created: number
  updated: number
  summary: Record<string, any>
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'json'
  fields?: string[]
  filters?: Record<string, any>
  includeImages?: boolean
  dateRange?: { from: string; to: string }
}

export class BulkOperationService {
  private baseUrl: string

  constructor(baseUrl: string = '/api/admin') {
    this.baseUrl = baseUrl
  }

  // Import data from CSV/Excel
  async importData(
    entity: 'products' | 'projects' | 'clients' | 'approvals',
    file: File,
    mapping: ImportMapping[],
    options: ImportOptions
  ): Promise<ApiResponse<ImportResult>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mapping', JSON.stringify(mapping))
    formData.append('options', JSON.stringify(options))

    const response = await fetch(`${this.baseUrl}/${entity}/import`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  }

  // Export data to various formats
  async exportData(
    entity: 'products' | 'projects' | 'clients' | 'approvals',
    options: ExportOptions
  ): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${entity}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    })
    return response.blob()
  }

  // Bulk operations on entities
  async bulkUpdate(
    entity: 'products' | 'projects' | 'clients' | 'approvals',
    operation: {
      action: 'update' | 'delete' | 'activate' | 'deactivate' | 'publish' | 'unpublish'
      ids: number[]
      data?: Record<string, any>
    }
  ): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/${entity}/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(operation)
    })
    return response.json()
  }

  // Get import template
  async getImportTemplate(
    entity: 'products' | 'projects' | 'clients' | 'approvals',
    format: 'csv' | 'excel' = 'csv'
  ): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${entity}/import-template?format=${format}`)
    return response.blob()
  }

  // Validate import data
  async validateImportData(
    entity: 'products' | 'projects' | 'clients' | 'approvals',
    file: File,
    mapping: ImportMapping[]
  ): Promise<ApiResponse<{ valid: boolean; errors: any[]; preview: any[] }>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mapping', JSON.stringify(mapping))
    formData.append('validateOnly', 'true')

    const response = await fetch(`${this.baseUrl}/${entity}/validate-import`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  }
}

// ============================================================================
// DASHBOARD WIDGETS AND ANALYTICS
// ============================================================================

export interface DashboardWidget {
  id: string
  title: string
  type: 'stat' | 'chart' | 'table' | 'progress' | 'activity' | 'quick_actions'
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number; w: number; h: number }
  config: Record<string, any>
  permissions?: string[]
  refreshInterval?: number // seconds
}

export interface DashboardConfig {
  id: string
  name: string
  widgets: DashboardWidget[]
  layout: 'grid' | 'masonry'
  autoRefresh: boolean
  refreshInterval: number
  permissions: string[]
}

export interface AnalyticsData {
  totalProducts: number
  totalProjects: number
  totalClients: number
  totalApprovals: number
  totalMediaFiles: number
  recentActivities: Array<{
    type: string
    entity: string
    action: string
    user: string
    timestamp: string
    details: any
  }>
  popularContent: Array<{
    type: string
    name: string
    views: number
    lastViewed: string
  }>
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical'
    uptime: number
    responseTime: number
    errorRate: number
    storageUsed: number
    storageTotal: number
  }
  trends: {
    period: string
    data: Array<{
      date: string
      products: number
      projects: number
      clients: number
      pageViews: number
    }>
  }
}

export class DashboardService {
  private baseUrl: string

  constructor(baseUrl: string = '/api/admin') {
    this.baseUrl = baseUrl
  }

  // Get dashboard analytics
  async getAnalytics(period: string = '30d'): Promise<ApiResponse<AnalyticsData>> {
    const response = await fetch(`${this.baseUrl}/analytics?period=${period}`)
    return response.json()
  }

  // Get dashboard configuration
  async getDashboardConfig(userId?: number): Promise<ApiResponse<DashboardConfig>> {
    const url = userId 
      ? `${this.baseUrl}/dashboard/config?userId=${userId}`
      : `${this.baseUrl}/dashboard/config`
    const response = await fetch(url)
    return response.json()
  }

  // Save dashboard configuration
  async saveDashboardConfig(config: DashboardConfig): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/dashboard/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    return response.json()
  }

  // Get widget data
  async getWidgetData(widgetId: string, params: Record<string, any> = {}): Promise<ApiResponse<any>> {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${this.baseUrl}/dashboard/widgets/${widgetId}?${queryString}`)
    return response.json()
  }

  // Get system health
  async getSystemHealth(): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseUrl}/system/health`)
    return response.json()
  }

  // Get activity logs
  async getActivityLogs(params: {
    page?: number
    limit?: number
    entity?: string
    action?: string
    user?: string
    dateFrom?: string
    dateTo?: string
  } = {}): Promise<ApiResponse<any>> {
    const queryString = new URLSearchParams(params as any).toString()
    const response = await fetch(`${this.baseUrl}/activity-logs?${queryString}`)
    return response.json()
  }
}

// ============================================================================
// REAL-TIME UPDATES AND NOTIFICATIONS
// ============================================================================

export interface NotificationConfig {
  id: string
  type: 'email' | 'web' | 'webhook'
  events: string[]
  conditions?: Record<string, any>
  recipients?: string[]
  template?: string
  enabled: boolean
}

export interface WebSocketMessage {
  type: 'notification' | 'activity' | 'system_status' | 'content_change'
  data: any
  timestamp: number
  user?: string
}

export class RealTimeService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners = new Map<string, Array<(data: any) => void>>()

  connect(token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/admin/ws?token=${token}`
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.attemptReconnect(token)
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const listeners = this.listeners.get(message.type) || []
    listeners.forEach(listener => listener(message.data))
  }

  private attemptReconnect(token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.connect(token)
    }, delay)
  }

  on(eventType: string, listener: (data: any) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(listener)
  }

  off(eventType: string, listener?: (data: any) => void): void {
    if (!listener) {
      this.listeners.delete(eventType)
      return
    }

    const listeners = this.listeners.get(eventType) || []
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
  }
}

// Create service instances
export const contentService = new ContentManagementService()
export const mediaService = new MediaManagementService()
export const bulkService = new BulkOperationService()
export const dashboardService = new DashboardService()
export const realTimeService = new RealTimeService()