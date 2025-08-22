import { NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { page, ...seoData } = await request.json()
    
    dbHelpers.setSEOSettings(page, seoData)
    
    return NextResponse.json(
      { message: "SEO settings saved successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Save SEO settings error:", error)
    return NextResponse.json(
      { error: "Failed to save SEO settings" },
      { status: 500 }
    )
  }
}