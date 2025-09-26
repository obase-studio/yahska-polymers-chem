import { revalidatePath, revalidateTag } from 'next/cache'

// Content types that require revalidation
export type ContentType = 'content' | 'products' | 'projects' | 'categories' | 'project-categories' | 'media'

// Revalidation configuration for different content types
export const REVALIDATION_CONFIG = {
  content: {
    paths: ['/', '/about', '/products', '/projects', '/contact', '/clients'] as string[],
    tags: ['content', 'branding', 'navigation'] as string[],
    revalidateLayout: true
  },
  products: {
    paths: ['/products'] as string[],
    tags: ['products', 'categories'] as string[],
    revalidateLayout: false
  },
  projects: {
    paths: ['/projects'] as string[],
    tags: ['projects', 'project-categories'] as string[],
    revalidateLayout: false
  },
  categories: {
    paths: ['/', '/products'] as string[],
    tags: ['categories', 'products', 'navigation'] as string[],
    revalidateLayout: true
  },
  'project-categories': {
    paths: ['/', '/projects'] as string[],
    tags: ['project-categories', 'projects', 'navigation'] as string[],
    revalidateLayout: true
  },
  media: {
    paths: ['/', '/about', '/products', '/projects', '/contact', '/clients'] as string[],
    tags: ['media', 'content'] as string[],
    revalidateLayout: false
  }
}

// Function to trigger comprehensive revalidation
export async function triggerRevalidation(contentType: ContentType, specificPage?: string) {
  const config = REVALIDATION_CONFIG[contentType]
  const results = {
    paths: [] as string[],
    tags: [] as string[],
    layout: false,
    errors: [] as string[]
  }

  try {
    // Revalidate specific paths
    for (const path of config.paths) {
      try {
        revalidatePath(path)
        results.paths.push(path)
        console.log(`✓ Revalidated path: ${path}`)
      } catch (e) {
        const error = `Failed to revalidate path ${path}: ${e}`
        results.errors.push(error)
        console.log(`✗ ${error}`)
      }
    }

    // If there's a specific page, also revalidate it
    if (specificPage && !config.paths.includes(`/${specificPage}`)) {
      try {
        revalidatePath(`/${specificPage}`)
        results.paths.push(`/${specificPage}`)
        console.log(`✓ Revalidated specific page: /${specificPage}`)
      } catch (e) {
        const error = `Failed to revalidate specific page /${specificPage}: ${e}`
        results.errors.push(error)
        console.log(`✗ ${error}`)
      }
    }

    // Revalidate layout if needed
    if (config.revalidateLayout) {
      try {
        revalidatePath('/', 'layout')
        results.layout = true
        console.log('✓ Revalidated layout')
      } catch (e) {
        const error = `Failed to revalidate layout: ${e}`
        results.errors.push(error)
        console.log(`✗ ${error}`)
      }
    }

    // Revalidate cache tags
    for (const tag of config.tags) {
      try {
        revalidateTag(tag)
        results.tags.push(tag)
        console.log(`✓ Revalidated tag: ${tag}`)
      } catch (e) {
        const error = `Failed to revalidate tag ${tag}: ${e}`
        results.errors.push(error)
        console.log(`✗ ${error}`)
      }
    }

    console.log(`🔄 Revalidation completed for ${contentType}:`, {
      paths: results.paths.length,
      tags: results.tags.length,
      layout: results.layout,
      errors: results.errors.length
    })

    return results
  } catch (error) {
    console.error(`❌ Critical revalidation error for ${contentType}:`, error)
    results.errors.push(`Critical error: ${error}`)
    return results
  }
}

// Helper function to call sync API from admin operations
export async function notifyContentChange(contentType: ContentType, specificPage?: string) {
  try {
    const response = await fetch('/api/sync/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: specificPage || contentType,
        contentType
      }),
      cache: 'no-store'
    })

    const result = await response.json()
    console.log(`📡 Sync notification sent for ${contentType}:`, result)
    return result
  } catch (error) {
    console.error(`❌ Failed to send sync notification for ${contentType}:`, error)
    return { error: `Sync notification failed: ${error}` }
  }
}