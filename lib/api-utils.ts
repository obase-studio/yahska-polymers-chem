// API Utilities for Data Integration System

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiResponse, PaginationParams, SearchParams } from './api-types'
import { requireAuth } from './auth'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// API Response Utilities
export class ApiResponseBuilder {
  static success<T>(data: T, message?: string, meta?: any): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message,
      meta
    })
  }

  static error(error: string, status = 400, details?: any): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      error,
      ...(details && { details })
    }, { status })
  }

  static validationError(errors: any[]): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: errors
    }, { status: 422 })
  }
}

// Request Validation Utilities
export class RequestValidator {
  static async validateJson<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
  ): Promise<{ success: true; data: T } | { success: false; error: string; details: any[] }> {
    try {
      const body = await request.json()
      const result = schema.safeParse(body)
      
      if (!result.success) {
        return {
          success: false,
          error: 'Validation failed',
          details: result.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        }
      }

      return { success: true, data: result.data }
    } catch (error) {
      return {
        success: false,
        error: 'Invalid JSON',
        details: []
      }
    }
  }

  static validateSearchParams(
    searchParams: URLSearchParams
  ): SearchParams & PaginationParams {
    return {
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100), // Max 100 items per page
      offset: (parseInt(searchParams.get('page') || '1') - 1) * parseInt(searchParams.get('limit') || '20')
    }
  }
}

// Rate Limiting Middleware
export class RateLimiter {
  static create(windowMs: number, maxRequests: number) {
    return (request: NextRequest) => {
      const clientIp = this.getClientIp(request)
      const now = Date.now()
      const windowStart = now - windowMs

      // Clean up expired entries
      for (const [ip, data] of rateLimitStore.entries()) {
        if (data.resetTime < now) {
          rateLimitStore.delete(ip)
        }
      }

      const clientData = rateLimitStore.get(clientIp) || { count: 0, resetTime: now + windowMs }

      if (clientData.resetTime < now) {
        // Reset window
        clientData.count = 1
        clientData.resetTime = now + windowMs
      } else if (clientData.count >= maxRequests) {
        // Rate limit exceeded
        return ApiResponseBuilder.error(
          'Rate limit exceeded',
          429,
          { resetTime: clientData.resetTime }
        )
      } else {
        clientData.count++
      }

      rateLimitStore.set(clientIp, clientData)
      return null // No rate limit violation
    }
  }

  private static getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = request.headers.get('x-client-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    return realIp || clientIp || 'unknown'
  }
}

// CSRF Protection
export class CSRFProtection {
  private static readonly CSRF_TOKEN_HEADER = 'x-csrf-token'
  private static readonly CSRF_COOKIE = 'csrf-token'

  static async validateToken(request: NextRequest): Promise<boolean> {
    const token = request.headers.get(this.CSRF_TOKEN_HEADER)
    const cookieToken = request.cookies.get(this.CSRF_COOKIE)?.value

    if (!token || !cookieToken || token !== cookieToken) {
      return false
    }

    return true
  }

  static generateToken(): string {
    return crypto.randomUUID()
  }
}

// Input Sanitization
export class InputSanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .slice(0, 1000) // Limit length
  }

  static sanitizeHtml(input: string): string {
    // Allow only safe HTML tags
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li']
    const tagRegex = /<(\/?)([\w]+)([^>]*)>/g
    
    return input.replace(tagRegex, (match, closing, tagName, attributes) => {
      if (allowedTags.includes(tagName.toLowerCase())) {
        // Remove all attributes except for basic ones
        return `<${closing}${tagName}>`
      }
      return ''
    })
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255)
  }
}

// File Upload Utilities
export class FileUploadHandler {
  static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  static readonly ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  static validateFile(file: File, type: 'image' | 'document' = 'image'): { valid: boolean; error?: string } {
    const allowedTypes = type === 'image' ? this.ALLOWED_IMAGE_TYPES : this.ALLOWED_DOCUMENT_TYPES

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
      }
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)}MB limit`
      }
    }

    return { valid: true }
  }

  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    const extension = originalName.split('.').pop()
    const sanitizedName = InputSanitizer.sanitizeFilename(originalName.split('.')[0])
    
    return `${sanitizedName}_${timestamp}_${random}.${extension}`
  }
}

// Database Transaction Utilities
export class DatabaseTransaction {
  static async executeInTransaction<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    // In production, implement proper transaction handling
    // For SQLite with better-sqlite3, use db.transaction()
    try {
      const result = await operation()
      return result
    } catch (error) {
      // Rollback would happen here
      throw error
    }
  }
}

// API Middleware Composition
export function createApiHandler(options: {
  requireAuth?: boolean
  rateLimit?: { windowMs: number; maxRequests: number }
  csrfProtection?: boolean
  methods?: string[]
}) {
  return async (
    handler: (request: NextRequest, context?: any) => Promise<NextResponse>
  ) => {
    return async (request: NextRequest, context?: any) => {
      try {
        // Method validation
        if (options.methods && !options.methods.includes(request.method)) {
          return ApiResponseBuilder.error('Method not allowed', 405)
        }

        // Rate limiting
        if (options.rateLimit) {
          const rateLimitCheck = RateLimiter.create(
            options.rateLimit.windowMs,
            options.rateLimit.maxRequests
          )(request)
          
          if (rateLimitCheck) {
            return rateLimitCheck
          }
        }

        // CSRF protection for state-changing operations
        if (options.csrfProtection && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
          const isValidCSRF = await CSRFProtection.validateToken(request)
          if (!isValidCSRF) {
            return ApiResponseBuilder.error('Invalid CSRF token', 403)
          }
        }

        // Authentication
        if (options.requireAuth) {
          await requireAuth()
        }

        return await handler(request, context)

      } catch (error) {
        console.error('API Handler Error:', error)
        
        if (error instanceof Error) {
          if (error.message === 'Unauthorized') {
            return ApiResponseBuilder.error('Unauthorized', 401)
          }
          return ApiResponseBuilder.error(error.message, 500)
        }

        return ApiResponseBuilder.error('Internal server error', 500)
      }
    }
  }
}

// Search and Filter Utilities
export class SearchFilterUtils {
  static buildWhereClause(
    params: SearchParams & Record<string, any>,
    searchFields: string[] = []
  ): { whereClause: string; bindings: any[] } {
    const conditions: string[] = []
    const bindings: any[] = []

    // Search across multiple fields
    if (params.search && searchFields.length > 0) {
      const searchConditions = searchFields.map(() => '?').join(' OR ')
      conditions.push(`(${searchConditions})`)
      searchFields.forEach(() => {
        bindings.push(`%${params.search}%`)
      })
    }

    // Date range filtering
    if (params.dateFrom) {
      conditions.push('created_at >= ?')
      bindings.push(params.dateFrom)
    }

    if (params.dateTo) {
      conditions.push('created_at <= ?')
      bindings.push(params.dateTo)
    }

    // Additional filters
    Object.entries(params).forEach(([key, value]) => {
      if (value && !['search', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder', 'page', 'limit', 'offset'].includes(key)) {
        conditions.push(`${key} = ?`)
        bindings.push(value)
      }
    })

    return {
      whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      bindings
    }
  }

  static buildOrderClause(params: SearchParams): string {
    if (!params.sortBy) {
      return 'ORDER BY created_at DESC'
    }

    const safeColumns = ['name', 'created_at', 'updated_at', 'sort_order', 'id']
    const sortBy = safeColumns.includes(params.sortBy) ? params.sortBy : 'created_at'
    const sortOrder = params.sortOrder === 'asc' ? 'ASC' : 'DESC'

    return `ORDER BY ${sortBy} ${sortOrder}`
  }

  static buildPaginationClause(params: PaginationParams): { clause: string; bindings: number[] } {
    const limit = Math.min(params.limit || 20, 100)
    const offset = params.offset || 0

    return {
      clause: 'LIMIT ? OFFSET ?',
      bindings: [limit, offset]
    }
  }
}

// Cache Utilities (for production, use Redis)
export class CacheManager {
  private static cache = new Map<string, { data: any; expiry: number }>()

  static set(key: string, data: any, ttlSeconds = 300): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000
    })
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    
    if (!cached || cached.expiry < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  static delete(key: string): void {
    this.cache.delete(key)
  }

  static clear(): void {
    this.cache.clear()
  }

  static generateKey(...parts: string[]): string {
    return parts.join(':')
  }
}

// Validation Schemas
export const ValidationSchemas = {
  product: z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    price: z.string().optional(),
    category_id: z.string().min(1),
    applications: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    usage: z.string().optional(),
    advantages: z.array(z.string()).optional(),
    technical_specifications: z.record(z.string()).optional(),
    packaging_info: z.string().optional(),
    safety_information: z.string().optional(),
    product_code: z.string().optional(),
    image_url: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    is_active: z.boolean().optional()
  }),

  project: z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    category: z.string().min(1),
    location: z.string().optional(),
    client_name: z.string().optional(),
    completion_date: z.string().optional(),
    project_value: z.string().optional(),
    key_features: z.array(z.string()).optional(),
    challenges: z.string().optional(),
    solutions: z.string().optional(),
    image_url: z.string().url().optional(),
    gallery_images: z.array(z.string().url()).optional(),
    is_featured: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional()
  }),

  client: z.object({
    company_name: z.string().min(1).max(255),
    industry: z.string().optional(),
    project_type: z.string().optional(),
    location: z.string().optional(),
    partnership_since: z.string().optional(),
    project_value: z.string().optional(),
    description: z.string().optional(),
    logo_url: z.string().url(),
    website_url: z.string().url().optional(),
    is_featured: z.boolean().optional(),
    sort_order: z.number().int().min(0).optional()
  }),

  approval: z.object({
    authority_name: z.string().min(1).max(255),
    approval_type: z.string().optional(),
    description: z.string().optional(),
    validity_period: z.string().optional(),
    certificate_number: z.string().optional(),
    issue_date: z.string().optional(),
    expiry_date: z.string().optional(),
    logo_url: z.string().url(),
    certificate_url: z.string().url().optional(),
    sort_order: z.number().int().min(0).optional()
  })
}