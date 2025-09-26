// Standardized caching configuration for APIs
export const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store'
} as const

// For admin APIs that handle CMS data
export const ADMIN_API_CONFIG = {
  dynamic: 'force-dynamic',
  revalidate: 0
} as const

// For frontend APIs that serve content
export const FRONTEND_API_CONFIG = {
  dynamic: 'force-dynamic',
  revalidate: 0
} as const

// Helper function to create standardized response with no-cache headers
export function createNoCacheResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...NO_CACHE_HEADERS
    }
  })
}

// Cache tags for content-related data
export const CACHE_TAGS = {
  CONTENT: 'content',
  PRODUCTS: 'products',
  PROJECTS: 'projects',
  CATEGORIES: 'categories',
  PROJECT_CATEGORIES: 'project-categories',
  MEDIA: 'media',
  BRANDING: 'branding',
  NAVIGATION: 'navigation',
  SEO: 'seo'
} as const