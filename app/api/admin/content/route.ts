import { NextRequest, NextResponse } from "next/server"
import { supabaseHelpers } from "@/lib/supabase-helpers"
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const section = searchParams.get('section')
    
    if (!page) {
      return NextResponse.json(
        { error: "Page parameter is required" },
        { status: 400 }
      )
    }
    
    const content = await supabaseHelpers.getContent(page, section || undefined)
    return NextResponse.json(content)
  } catch (error) {
    console.error("Get content error:", error)
    return NextResponse.json(
      { error: "Failed to get content" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    
    const { page, section, content_key, content_value } = await request.json()
    
    console.log('Admin content POST - Received data:', { page, section, content_key, content_value: content_value?.substring(0, 100) + '...' })
    
    if (!page || !section || !content_key) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Save to database
    const result = await supabaseHelpers.setContent(page, section, content_key, content_value)
    console.log('Admin content POST - Database result:', result)
    
    // Verify the save worked by reading it back
    const verification = await supabaseHelpers.getContent(page, section)
    console.log('Admin content POST - Verification read:', verification?.length, 'items')
    
    return NextResponse.json({ 
      message: "Content saved successfully",
      timestamp: new Date().toISOString()
    }, { 
      status: 200, 
      headers: { 
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      } 
    })
  } catch (error) {
    console.error("Save content error:", error)
    return NextResponse.json(
      { error: "Failed to save content", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}