import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const section = searchParams.get('section')
    
    if (!page || !section) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Page and section parameters are required' 
        },
        { status: 400 }
      )
    }

    // Get content history from database
    const history = dbHelpers.getContentHistory(page, section)
    
    return NextResponse.json({
      success: true,
      data: history
    })
    
  } catch (error) {
    console.error('Error fetching content history:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch content history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
