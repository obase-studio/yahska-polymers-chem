import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string || "uploads"
    const url = formData.get("url") as string // For URL uploads

    let uploadedFile
    let filePath: string
    let fileName: string
    let mimeType: string
    let fileSize: number

    if (file) {
      // Handle file upload
      fileName = file.name
      mimeType = file.type
      fileSize = file.size

      // Create unique filename
      const timestamp = Date.now()
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
      const uniqueFileName = `${timestamp}_${cleanFileName}`
      
      // Determine storage path based on category
      const storagePath = `${category}/${uniqueFileName}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("yahska-media")
        .upload(storagePath, file, {
          contentType: mimeType,
          upsert: false
        })

      if (uploadError) {
        console.error("Storage upload error:", uploadError)
        return NextResponse.json(
          { error: `Failed to upload file: ${uploadError.message}` },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("yahska-media")
        .getPublicUrl(storagePath)

      filePath = publicUrlData.publicUrl
      uploadedFile = uploadData

    } else if (url) {
      // Handle URL upload
      try {
        const response = await fetch(url)
        if (!response.ok) {
          return NextResponse.json(
            { error: "Failed to fetch image from URL" },
            { status: 400 }
          )
        }

        const blob = await response.blob()
        fileName = url.split("/").pop()?.split("?")[0] || "image"
        mimeType = blob.type || "image/jpeg"
        fileSize = blob.size

        // Create unique filename
        const timestamp = Date.now()
        const extension = fileName.split(".").pop() || "jpg"
        const uniqueFileName = `${timestamp}_url_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`
        
        const storagePath = `${category}/${uniqueFileName}`
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from("yahska-media")
          .upload(storagePath, blob, {
            contentType: mimeType,
            upsert: false
          })

        if (uploadError) {
          console.error("Storage upload error:", uploadError)
          return NextResponse.json(
            { error: `Failed to upload file: ${uploadError.message}` },
            { status: 500 }
          )
        }

        // Get public URL
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("yahska-media")
          .getPublicUrl(storagePath)

        filePath = publicUrlData.publicUrl
        uploadedFile = uploadData

      } catch (error) {
        console.error("URL fetch error:", error)
        return NextResponse.json(
          { error: "Failed to fetch image from URL" },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: "No file or URL provided" },
        { status: 400 }
      )
    }

    // Save media file record to database
    const { data: mediaFile, error: dbError } = await supabaseAdmin
      .from("media_files")
      .insert({
        filename: uploadedFile?.path || fileName,
        original_name: fileName,
        file_path: filePath,
        file_size: fileSize,
        mime_type: mimeType,
        alt_text: fileName.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database insert error:", dbError)
      return NextResponse.json(
        { error: `Failed to save media file record: ${dbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "File uploaded successfully",
      file: mediaFile
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    )
  }
}