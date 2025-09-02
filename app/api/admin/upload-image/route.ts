import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${sanitizedName}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('yahska-media')
      .upload(`${folder}/${fileName}`, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: "Failed to upload file to storage" },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('yahska-media')
      .getPublicUrl(uploadData.path)

    // Save file info to database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('media_files')
      .insert([{
        filename: fileName,
        original_name: file.name,
        file_path: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        alt_text: `Image: ${file.name.replace(/\.[^/.]+$/, "")}`
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Try to clean up uploaded file
      await supabaseAdmin.storage
        .from('yahska-media')
        .remove([uploadData.path])
      
      return NextResponse.json(
        { success: false, error: "Failed to save file information" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        id: dbData.id,
        filename: dbData.filename,
        original_name: dbData.original_name,
        file_path: dbData.file_path,
        file_size: dbData.file_size,
        mime_type: dbData.mime_type,
        alt_text: dbData.alt_text
      }
    })

  } catch (error) {
    console.error("Upload image error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    )
  }
}