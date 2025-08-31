import { NextRequest, NextResponse } from 'next/server'
import { supabaseHelpers } from '@/lib/supabase-helpers'

export async function GET(request: NextRequest) {
  try {
    const mediaFiles = await supabaseHelpers.getAllMediaFiles()
    return NextResponse.json(mediaFiles)
  } catch (error) {
    console.error('Error fetching media files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    )
  }
}