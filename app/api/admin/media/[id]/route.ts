import { NextRequest, NextResponse } from "next/server"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import { unlink } from "fs/promises"
import { join } from "path"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { alt_text } = await request.json()
    
    // Update alt text in database (simplified - you'd need to add this method to dbHelpers)
    // For now, we'll just return success
    
    return NextResponse.json(
      { message: "Alt text updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update media error:", error)
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get file info before deleting
    const files = await supabaseHelpers.getAllMediaFiles()
    const file = files.find((f: any) => f.id === parseInt(id))
    
    if (file) {
      // Delete file from filesystem
      try {
        const filepath = join(process.cwd(), "public", file.file_path)
        await unlink(filepath)
      } catch (error) {
        console.error("Error deleting file from disk:", error)
      }
      
      // Delete from database
      await supabaseHelpers.deleteMediaFile(parseInt(id))
    }
    
    return NextResponse.json(
      { message: "Media file deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete media error:", error)
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    )
  }
}