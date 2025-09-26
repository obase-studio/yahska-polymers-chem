import { NextRequest, NextResponse } from 'next/server'
import { supabaseHelpers } from '@/lib/supabase-helpers'
import { triggerRevalidation, type ContentType } from '@/lib/cms-revalidation'
import { NO_CACHE_HEADERS } from '@/lib/api-cache-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { page, contentType } = await request.json()

    if (!page) {
      return NextResponse.json({ error: 'Page required' }, {
        status: 400,
        headers: NO_CACHE_HEADERS
      })
    }

    // Get the latest content for the page
    const content = await supabaseHelpers.getContent(page)
    const lastUpdated = content && content.length > 0
      ? Math.max(...content.map(item => new Date(item.updated_at || 0).getTime()))
      : 0

    console.log(`🔄 Sync API - Page: ${page}, Content Type: ${contentType || 'content'}, Items: ${content?.length}, Last updated: ${lastUpdated}`)

    // Determine content type for revalidation
    let revalidationType: ContentType = 'content'

    if (contentType) {
      revalidationType = contentType
    } else if (page === 'header') {
      revalidationType = 'content' // Header is treated as general content
    }

    // Trigger comprehensive revalidation
    const revalidationResults = await triggerRevalidation(revalidationType, page === 'header' ? undefined : page)

    return NextResponse.json({
      success: true,
      page,
      contentType: revalidationType,
      lastUpdated,
      contentCount: content?.length || 0,
      timestamp: new Date().toISOString(),
      revalidation: {
        pathsRevalidated: revalidationResults.paths,
        tagsRevalidated: revalidationResults.tags,
        layoutRevalidated: revalidationResults.layout,
        errors: revalidationResults.errors
      }
    }, {
      headers: NO_CACHE_HEADERS
    })
  } catch (error) {
    console.error('❌ Sync API error:', error)
    return NextResponse.json(
      {
        error: 'Sync failed',
        details: error instanceof Error ? error.message : String(error)
      },
      {
        status: 500,
        headers: NO_CACHE_HEADERS
      }
    )
  }
}