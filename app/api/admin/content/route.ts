import { NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/database"

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
    
    const content = dbHelpers.getContent(page, section || undefined)
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
    
    if (!page || !section || !content_key) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    dbHelpers.setContent(page, section, content_key, content_value)
    
    return NextResponse.json(
      { message: "Content saved successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Save content error:", error)
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    )
  }
}