// Frontend Data Integration Architecture for Yahska Polymers

import { ApiResponse, ProductSearchParams, ProjectSearchParams, ClientSearchParams, ApprovalSearchParams } from './api-types'

// ============================================================================
// DATA FETCHING STRATEGIES
// ============================================================================

export enum FetchStrategy {
  SSG = 'ssg',           // Static Site Generation - Build time
  SSR = 'ssr',           // Server Side Rendering - Request time
  ISR = 'isr',           // Incremental Static Regeneration - Cached with revalidation
  CLIENT = 'client'      // Client Side Rendering - Browser
}

export interface DataFetchConfig {
  strategy: FetchStrategy
  revalidate?: number    // For ISR - seconds
  cacheTime?: number     // For client-side - seconds
  staleTime?: number     // How long data is considered fresh
  retry?: number         // Number of retry attempts
  retryDelay?: number    // Delay between retries in ms
}

// Default fetch configurations for different data types
export const FETCH_CONFIGS = {
  // Static content - rarely changes
  staticContent: {
    strategy: FetchStrategy.SSG,
    cacheTime: 86400, // 24 hours
    staleTime: 3600   // 1 hour
  } as DataFetchConfig,

  // Product catalog - changes occasionally
  products: {
    strategy: FetchStrategy.ISR,
    revalidate: 3600, // 1 hour
    cacheTime: 1800,  // 30 minutes
    staleTime: 600    // 10 minutes
  } as DataFetchConfig,

  // Project portfolio - changes occasionally
  projects: {
    strategy: FetchStrategy.ISR,
    revalidate: 7200, // 2 hours
    cacheTime: 3600,  // 1 hour
    staleTime: 1800   // 30 minutes
  } as DataFetchConfig,

  // Client information - relatively stable
  clients: {
    strategy: FetchStrategy.ISR,
    revalidate: 86400, // 24 hours
    cacheTime: 7200,   // 2 hours
    staleTime: 3600    // 1 hour
  } as DataFetchConfig,

  // Approvals - changes rarely but important to keep updated
  approvals: {
    strategy: FetchStrategy.ISR,
    revalidate: 43200, // 12 hours
    cacheTime: 14400,  // 4 hours
    staleTime: 7200    // 2 hours
  } as DataFetchConfig,

  // Dynamic search results - always fresh
  search: {
    strategy: FetchStrategy.CLIENT,
    cacheTime: 300,    // 5 minutes
    staleTime: 60,     // 1 minute
    retry: 3,
    retryDelay: 1000
  } as DataFetchConfig,

  // Admin dashboard data - always fresh
  admin: {
    strategy: FetchStrategy.CLIENT,
    cacheTime: 60,     // 1 minute
    staleTime: 30,     // 30 seconds
    retry: 2,
    retryDelay: 500
  } as DataFetchConfig
}

// ============================================================================
// DATA FETCHING SERVICES
// ============================================================================

export class DataFetchingService {
  private baseUrl: string
  private cache = new Map<string, { data: any; timestamp: number; expiresAt: number }>()

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  // Generic fetch method with caching and retry logic
  private async fetchWithRetry<T>(
    url: string,
    config: DataFetchConfig,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const cacheKey = `${url}:${JSON.stringify(options)}`
    const cached = this.cache.get(cacheKey)
    const now = Date.now()

    // Return cached data if still fresh
    if (cached && now < cached.expiresAt) {
      return cached.data
    }

    // Return stale data while revalidating in background
    if (cached && config.staleTime && (now - cached.timestamp) < config.staleTime * 1000) {
      // Revalidate in background
      this.revalidateInBackground(url, config, options, cacheKey)
      return cached.data
    }

    const maxRetries = config.retry || 1
    const retryDelay = config.retryDelay || 1000

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${url}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json() as ApiResponse<T>

        // Cache successful response
        if (config.cacheTime) {
          this.cache.set(cacheKey, {
            data,
            timestamp: now,
            expiresAt: now + config.cacheTime * 1000
          })
        }

        return data

      } catch (error) {
        if (attempt === maxRetries - 1) {
          // Last attempt failed - return cached data if available
          if (cached) {
            console.warn(`Fetch failed, returning stale data for ${url}:`, error)
            return cached.data
          }
          throw error
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
      }
    }

    throw new Error('All fetch attempts failed')
  }

  private async revalidateInBackground<T>(
    url: string,
    config: DataFetchConfig,
    options: RequestInit | undefined,
    cacheKey: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      })

      if (response.ok) {
        const data = await response.json() as ApiResponse<T>
        const now = Date.now()
        
        this.cache.set(cacheKey, {
          data,
          timestamp: now,
          expiresAt: now + (config.cacheTime || 0) * 1000
        })
      }
    } catch (error) {
      console.warn('Background revalidation failed:', error)
    }
  }

  // Product data fetching
  public async getProducts(params?: ProductSearchParams): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.fetchWithRetry(`/products${queryString}`, FETCH_CONFIGS.products)
  }

  public async getProduct(id: string): Promise<ApiResponse<any>> {
    return this.fetchWithRetry(`/products/${id}`, FETCH_CONFIGS.products)
  }

  // Project data fetching
  public async getProjects(params?: ProjectSearchParams): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.fetchWithRetry(`/projects${queryString}`, FETCH_CONFIGS.projects)
  }

  public async getProject(id: string): Promise<ApiResponse<any>> {
    return this.fetchWithRetry(`/projects/${id}`, FETCH_CONFIGS.projects)
  }

  // Client data fetching
  public async getClients(params?: ClientSearchParams): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.fetchWithRetry(`/clients${queryString}`, FETCH_CONFIGS.clients)
  }

  // Approval data fetching
  public async getApprovals(params?: ApprovalSearchParams): Promise<ApiResponse<any>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.fetchWithRetry(`/approvals${queryString}`, FETCH_CONFIGS.approvals)
  }

  // Search across all entities
  public async search(query: string, entities: string[] = []): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({ 
      q: query,
      entities: entities.join(',')
    })
    return this.fetchWithRetry(`/search?${params.toString()}`, FETCH_CONFIGS.search)
  }

  // Clear cache
  public clearCache(): void {
    this.cache.clear()
  }

  // Get cache statistics
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// ============================================================================
// STATE MANAGEMENT ARCHITECTURE
// ============================================================================

// Global state interface
export interface AppState {
  products: {
    items: any[]
    categories: any[]
    loading: boolean
    error: string | null
    filters: ProductSearchParams
    totalCount: number
    currentPage: number
  }
  projects: {
    items: any[]
    categories: any[]
    loading: boolean
    error: string | null
    filters: ProjectSearchParams
    totalCount: number
    currentPage: number
  }
  clients: {
    items: any[]
    loading: boolean
    error: string | null
    filters: ClientSearchParams
  }
  approvals: {
    items: any[]
    loading: boolean
    error: string | null
    filters: ApprovalSearchParams
  }
  search: {
    query: string
    results: any[]
    loading: boolean
    error: string | null
  }
  ui: {
    theme: 'light' | 'dark'
    sidebarOpen: boolean
    notifications: Array<{
      id: string
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
      timestamp: number
    }>
  }
}

// Action types
export enum ActionType {
  // Products
  LOAD_PRODUCTS_START = 'LOAD_PRODUCTS_START',
  LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS',
  LOAD_PRODUCTS_ERROR = 'LOAD_PRODUCTS_ERROR',
  SET_PRODUCTS_FILTERS = 'SET_PRODUCTS_FILTERS',
  SET_PRODUCTS_PAGE = 'SET_PRODUCTS_PAGE',

  // Projects
  LOAD_PROJECTS_START = 'LOAD_PROJECTS_START',
  LOAD_PROJECTS_SUCCESS = 'LOAD_PROJECTS_SUCCESS',
  LOAD_PROJECTS_ERROR = 'LOAD_PROJECTS_ERROR',
  SET_PROJECTS_FILTERS = 'SET_PROJECTS_FILTERS',
  SET_PROJECTS_PAGE = 'SET_PROJECTS_PAGE',

  // Clients
  LOAD_CLIENTS_START = 'LOAD_CLIENTS_START',
  LOAD_CLIENTS_SUCCESS = 'LOAD_CLIENTS_SUCCESS',
  LOAD_CLIENTS_ERROR = 'LOAD_CLIENTS_ERROR',
  SET_CLIENTS_FILTERS = 'SET_CLIENTS_FILTERS',

  // Approvals
  LOAD_APPROVALS_START = 'LOAD_APPROVALS_START',
  LOAD_APPROVALS_SUCCESS = 'LOAD_APPROVALS_SUCCESS',
  LOAD_APPROVALS_ERROR = 'LOAD_APPROVALS_ERROR',
  SET_APPROVALS_FILTERS = 'SET_APPROVALS_FILTERS',

  // Search
  SEARCH_START = 'SEARCH_START',
  SEARCH_SUCCESS = 'SEARCH_SUCCESS',
  SEARCH_ERROR = 'SEARCH_ERROR',
  CLEAR_SEARCH = 'CLEAR_SEARCH',

  // UI
  SET_THEME = 'SET_THEME',
  TOGGLE_SIDEBAR = 'SET_SIDEBAR',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
}

// Action interfaces
export interface Action {
  type: ActionType
  payload?: any
}

// State management hooks for React
export interface UseDataOptions {
  fetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  refetchInterval?: number
  enabled?: boolean
}

// Custom hook for products
export function useProducts(params?: ProductSearchParams, options: UseDataOptions = {}) {
  // Implementation would use React hooks (useState, useEffect, etc.)
  // This is the interface design
  return {
    data: [] as any[],
    loading: false,
    error: null as string | null,
    refetch: () => Promise.resolve(),
    loadMore: () => Promise.resolve(),
    hasNextPage: false,
    isLoadingMore: false
  }
}

// Custom hook for projects
export function useProjects(params?: ProjectSearchParams, options: UseDataOptions = {}) {
  return {
    data: [] as any[],
    loading: false,
    error: null as string | null,
    refetch: () => Promise.resolve(),
    loadMore: () => Promise.resolve(),
    hasNextPage: false,
    isLoadingMore: false
  }
}

// ============================================================================
// ERROR HANDLING AND LOADING STATES
// ============================================================================

export interface ErrorState {
  code: string
  message: string
  details?: any
  timestamp: number
}

export interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
}

export class ErrorHandler {
  static handleAPIError(error: any): ErrorState {
    if (error.response) {
      // HTTP error response
      return {
        code: `HTTP_${error.response.status}`,
        message: error.response.data?.message || error.response.statusText,
        details: error.response.data,
        timestamp: Date.now()
      }
    } else if (error.request) {
      // Network error
      return {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to server. Please check your internet connection.',
        timestamp: Date.now()
      }
    } else {
      // Other error
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
        timestamp: Date.now()
      }
    }
  }

  static getErrorMessage(error: ErrorState): string {
    switch (error.code) {
      case 'HTTP_401':
        return 'You are not authorized to access this resource.'
      case 'HTTP_403':
        return 'Access forbidden. Please check your permissions.'
      case 'HTTP_404':
        return 'The requested resource was not found.'
      case 'HTTP_429':
        return 'Too many requests. Please try again later.'
      case 'HTTP_500':
        return 'Server error. Please try again later.'
      case 'NETWORK_ERROR':
        return 'Connection failed. Please check your internet connection.'
      default:
        return error.message
    }
  }

  static shouldRetry(error: ErrorState): boolean {
    return ['NETWORK_ERROR', 'HTTP_500', 'HTTP_502', 'HTTP_503', 'HTTP_504'].includes(error.code)
  }
}

// ============================================================================
// SEO OPTIMIZATION ARCHITECTURE
// ============================================================================

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
  noindex?: boolean
  structuredData?: any
}

export class SEOManager {
  static generateProductSEO(product: any): SEOConfig {
    return {
      title: `${product.name} | Yahska Polymers - Construction Chemicals`,
      description: `${product.description?.substring(0, 160)}...`,
      keywords: [
        product.name,
        product.category_name,
        'construction chemicals',
        'concrete admixtures',
        ...(product.applications || [])
      ],
      ogTitle: product.name,
      ogDescription: product.description,
      ogImage: product.image_url,
      ogType: 'product',
      structuredData: {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image_url,
        brand: {
          '@type': 'Brand',
          name: 'Yahska Polymers'
        },
        category: product.category_name
      }
    }
  }

  static generateProjectSEO(project: any): SEOConfig {
    return {
      title: `${project.name} | Infrastructure Projects | Yahska Polymers`,
      description: `${project.description?.substring(0, 160)}...`,
      keywords: [
        project.name,
        project.category_name,
        project.location,
        'infrastructure project',
        'construction project',
        ...(project.key_features || [])
      ],
      ogTitle: project.name,
      ogDescription: project.description,
      ogImage: project.image_url,
      ogType: 'article',
      structuredData: {
        '@context': 'https://schema.org/',
        '@type': 'CreativeWork',
        name: project.name,
        description: project.description,
        image: project.image_url,
        creator: {
          '@type': 'Organization',
          name: 'Yahska Polymers'
        },
        locationCreated: project.location,
        dateCompleted: project.completion_date
      }
    }
  }

  static generateListingSEO(type: string, items: any[], filters?: any): SEOConfig {
    const count = items.length
    const category = filters?.category

    let title: string
    let description: string

    switch (type) {
      case 'products':
        title = category 
          ? `${category} Products | Yahska Polymers`
          : `All Products | Yahska Polymers - Construction Chemicals`
        description = `Browse our comprehensive range of ${category || 'construction chemicals and concrete admixtures'}. ${count} products available.`
        break
      case 'projects':
        title = category
          ? `${category} Projects | Yahska Polymers`
          : `Infrastructure Projects | Yahska Polymers`
        description = `Explore our ${category || 'infrastructure'} projects portfolio. ${count} completed projects showcase our expertise.`
        break
      default:
        title = 'Yahska Polymers - Construction Chemicals'
        description = 'Leading manufacturer of construction chemicals and industrial solutions.'
    }

    return {
      title,
      description,
      keywords: [
        'construction chemicals',
        'concrete admixtures',
        'infrastructure projects',
        'Yahska Polymers',
        ...(category ? [category] : [])
      ]
    }
  }
}

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

export class PerformanceOptimizer {
  // Image lazy loading and optimization
  static optimizeImageUrl(url: string, width?: number, height?: number, quality: number = 80): string {
    if (!url) return ''
    
    // Add image optimization parameters
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('q', quality.toString())
    params.set('f', 'webp')
    
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${params.toString()}`
  }

  // Debounce utility for search inputs
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  // Throttle utility for scroll events
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  }

  // Intersection Observer for lazy loading
  static createIntersectionObserver(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    return new IntersectionObserver(callback, {
      rootMargin: '100px',
      threshold: 0.1,
      ...options
    })
  }

  // Virtual scrolling for large lists
  static calculateVirtualScrollParams(
    totalItems: number,
    itemHeight: number,
    containerHeight: number,
    scrollTop: number
  ) {
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount + 1, totalItems - 1)
    const offsetY = startIndex * itemHeight

    return {
      startIndex,
      endIndex,
      visibleCount,
      offsetY
    }
  }
}

// Create global data fetching service instance
export const dataService = new DataFetchingService()
