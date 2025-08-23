import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers, initDatabase } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    initDatabase()
    
    const { page } = await request.json()
    
    if (!page) {
      return NextResponse.json({ error: 'Page required' }, { status: 400 })
    }
    
    // Get the latest content for the page
    const content = dbHelpers.getContent(page)
    const lastUpdated = content && content.length > 0 
      ? Math.max(...content.map(item => new Date(item.updated_at || 0).getTime()))
      : 0
    
    console.log(`Sync API - Page: ${page}, Content items: ${content?.length}, Last updated: ${lastUpdated}`)
    
    return NextResponse.json({
      success: true,
      page,
      lastUpdated,
      contentCount: content?.length || 0,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}