import { NextRequest, NextResponse } from 'next/server'
import { supabaseHelpers } from '@/lib/supabase-helpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const section = searchParams.get('section')

    if (!page || !section) {
      return NextResponse.json(
        { error: 'Missing page or section parameter' },
        { status: 400 }
      )
    }

    try {
      const pageImage = await supabaseHelpers.getPageImage(page, section)
      return NextResponse.json(pageImage)
    } catch (error: any) {
      // If table doesn't exist, return null (no image)
      if (error?.message?.includes('page_images')) {
        return NextResponse.json(null)
      }
      throw error
    }
  } catch (error) {
    console.error('Error fetching page image:', error)
    return NextResponse.json(null)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { page, section, media_file_id } = await request.json()

    if (!page || !section || !media_file_id) {
      return NextResponse.json(
        { error: 'Missing required fields: page, section, media_file_id' },
        { status: 400 }
      )
    }

    const pageImage = await supabaseHelpers.setPageImage(page, section, media_file_id)
    
    return NextResponse.json(pageImage)
  } catch (error) {
    console.error('Error setting page image:', error)
    return NextResponse.json(
      { error: 'Failed to set page image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const section = searchParams.get('section')

    if (!page || !section) {
      return NextResponse.json(
        { error: 'Missing page or section parameter' },
        { status: 400 }
      )
    }

    await supabaseHelpers.removePageImage(page, section)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing page image:', error)
    return NextResponse.json(
      { error: 'Failed to remove page image' },
      { status: 500 }
    )
  }
}