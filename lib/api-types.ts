// API Type Definitions for Data Integration System

// Base API Response Interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}

// Pagination Parameters
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

// Search and Filter Parameters
export interface SearchParams {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  dateFrom?: string
  dateTo?: string
}

// Product API Types
export interface ProductSearchParams extends SearchParams, PaginationParams {
  category?: string
  isActive?: boolean
  priceMin?: number
  priceMax?: number
}

export interface ProductCreateRequest {
  name: string
  description?: string
  price?: string
  category_id: string
  applications?: string[]
  features?: string[]
  usage?: string
  advantages?: string[]
  technical_specifications?: Record<string, string>
  packaging_info?: string
  safety_information?: string
  product_code?: string
  image_url?: string
  images?: string[]
  is_active?: boolean
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: number
}

export interface ProductBulkOperation {
  operation: 'activate' | 'deactivate' | 'delete' | 'update_category'
  productIds: number[]
  data?: Partial<ProductCreateRequest>
}

// Project API Types
export interface ProjectSearchParams extends SearchParams, PaginationParams {
  category?: string
  isActive?: boolean
  isFeatured?: boolean
  location?: string
  clientName?: string
  completionYear?: string
}

export interface ProjectCreateRequest {
  name: string
  description?: string
  category: string
  location?: string
  client_name?: string
  completion_date?: string
  project_value?: string
  key_features?: string[]
  challenges?: string
  solutions?: string
  image_url?: string
  gallery_images?: string[]
  is_featured?: boolean
  sort_order?: number
}

export interface ProjectUpdateRequest extends Partial<ProjectCreateRequest> {
  id: number
}

// Client API Types
export interface ClientSearchParams extends SearchParams, PaginationParams {
  industry?: string
  isFeatured?: boolean
  location?: string
  partnershipYear?: string
}

export interface ClientCreateRequest {
  company_name: string
  industry?: string
  project_type?: string
  location?: string
  partnership_since?: string
  project_value?: string
  description?: string
  logo_url: string
  website_url?: string
  is_featured?: boolean
  sort_order?: number
}

export interface ClientUpdateRequest extends Partial<ClientCreateRequest> {
  id: number
}

// Approval API Types
export interface ApprovalSearchParams extends SearchParams, PaginationParams {
  approvalType?: string
  authorityName?: string
  isExpired?: boolean
}

export interface ApprovalCreateRequest {
  authority_name: string
  approval_type?: string
  description?: string
  validity_period?: string
  certificate_number?: string
  issue_date?: string
  expiry_date?: string
  logo_url: string
  certificate_url?: string
  sort_order?: number
}

export interface ApprovalUpdateRequest extends Partial<ApprovalCreateRequest> {
  id: number
}

// Content Management API Types
export interface ContentUpdateRequest {
  page: string
  section: string
  content_key: string
  content_value: string
}

export interface ContentBulkUpdateRequest {
  updates: ContentUpdateRequest[]
}

// Media Management API Types
export interface MediaFileSearchParams extends SearchParams, PaginationParams {
  mimeType?: string
  sizeMin?: number
  sizeMax?: number
  uploadDateFrom?: string
  uploadDateTo?: string
}

export interface MediaUploadRequest {
  file: File
  alt_text?: string
  category?: string
}

export interface MediaBulkDeleteRequest {
  fileIds: number[]
}

// SEO Management API Types
export interface SEOUpdateRequest {
  page: string
  title?: string
  description?: string
  keywords?: string
  og_title?: string
  og_description?: string
  og_image?: string
  canonical_url?: string
}

// Analytics and Reporting Types
export interface AnalyticsParams {
  dateFrom: string
  dateTo: string
  metric?: 'views' | 'downloads' | 'inquiries'
  groupBy?: 'day' | 'week' | 'month'
}

export interface DashboardStats {
  totalProducts: number
  totalProjects: number
  totalClients: number
  totalApprovals: number
  recentUpdates: Array<{
    type: 'product' | 'project' | 'client' | 'approval'
    name: string
    action: 'created' | 'updated' | 'deleted'
    timestamp: string
  }>
}

// Validation Schema Types
export interface ValidationRule {
  field: string
  rules: Array<{
    type: 'required' | 'minLength' | 'maxLength' | 'email' | 'url' | 'number' | 'date'
    value?: any
    message: string
  }>
}

// Export/Import Types
export interface ExportRequest {
  entity: 'products' | 'projects' | 'clients' | 'approvals'
  format: 'csv' | 'excel' | 'json'
  filters?: SearchParams
  fields?: string[]
}

export interface ImportRequest {
  entity: 'products' | 'projects' | 'clients' | 'approvals'
  file: File
  mapping: Record<string, string>
  options: {
    skipFirstRow?: boolean
    updateExisting?: boolean
    validateOnly?: boolean
  }
}

// Audit Trail Types
export interface AuditLogEntry {
  id: number
  entity_type: string
  entity_id: number
  action: 'create' | 'update' | 'delete'
  changes: Record<string, { old: any, new: any }>
  user: string
  timestamp: string
  ip_address?: string
}

export interface AuditLogSearchParams extends SearchParams, PaginationParams {
  entityType?: string
  entityId?: number
  action?: string
  user?: string
  dateFrom?: string
  dateTo?: string
}