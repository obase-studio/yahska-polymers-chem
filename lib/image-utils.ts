// Utility functions for handling Supabase Storage images

const SUPABASE_STORAGE_BASE = 'https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media'

/**
 * Ensure image URL is properly formatted for Supabase Storage
 */
export function getImageUrl(filePath: string): string {
  if (!filePath) return ''
  
  // If already a full URL, return as is
  if (filePath.startsWith('http')) {
    return filePath
  }
  
  // If starts with /media/, convert to Supabase Storage URL
  if (filePath.startsWith('/media/')) {
    return `${SUPABASE_STORAGE_BASE}${filePath.replace('/media/', '/')}`
  }
  
  // If relative path, assume it's already in correct format for Supabase
  if (!filePath.startsWith('/')) {
    return `${SUPABASE_STORAGE_BASE}/${filePath}`
  }
  
  return `${SUPABASE_STORAGE_BASE}${filePath}`
}

/**
 * Generate thumbnail URL for images
 * Supabase Storage supports image transformations
 */
export function getThumbnailUrl(filePath: string, width: number = 200, height: number = 200): string {
  const baseUrl = getImageUrl(filePath)
  
  if (!baseUrl) return ''
  
  // For now, return the original image
  // In production, you might want to use Supabase image transformations:
  // return `${baseUrl}?width=${width}&height=${height}&resize=cover`
  
  return baseUrl
}

/**
 * Check if file is an image based on mime type or file extension
 */
export function isImageFile(mimeType?: string, fileName?: string): boolean {
  if (mimeType) {
    return mimeType.startsWith('image/')
  }
  
  if (fileName) {
    const ext = fileName.toLowerCase().split('.').pop()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
  }
  
  return false
}

/**
 * Get file type icon based on mime type
 */
export function getFileTypeIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎥'
  if (mimeType.includes('pdf')) return '📄'
  if (mimeType.includes('word') || mimeType.includes('doc')) return '📝'
  if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊'
  return '📁'
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}