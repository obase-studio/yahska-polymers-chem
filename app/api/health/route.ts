import { NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'

export async function GET() {
  try {
    // Check database connectivity
    const dbStatus = await checkDatabaseHealth()
    
    // Check media files accessibility
    const mediaStatus = await checkMediaHealth()
    
    // Overall health status
    const isHealthy = dbStatus && mediaStatus
    
    const healthData = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: dbStatus ? 'healthy' : 'unhealthy',
          message: dbStatus ? 'Database connection successful' : 'Database connection failed'
        },
        media: {
          status: mediaStatus ? 'healthy' : 'unhealthy',
          message: mediaStatus ? 'Media files accessible' : 'Media files not accessible'
        }
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
    
    return NextResponse.json(healthData, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}

async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Try to access the database
    const categories = dbHelpers.getAllCategories()
    return Array.isArray(categories) && categories.length > 0
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

async function checkMediaHealth(): Promise<boolean> {
  try {
    // Check if media directory exists and is accessible
    const fs = require('fs')
    const path = require('path')
    
    const mediaDir = path.join(process.cwd(), 'public', 'media')
    const exists = fs.existsSync(mediaDir)
    
    if (!exists) {
      return false
    }
    
    // Check if we can read the directory
    const files = fs.readdirSync(mediaDir)
    return files.length > 0
    
  } catch (error) {
    console.error('Media health check failed:', error)
    return false
  }
}
