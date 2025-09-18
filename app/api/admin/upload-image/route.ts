import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `category-images/${timestamp}_${cleanFileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("yahska-media")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("yahska-media")
      .getPublicUrl(fileName);

    // Save media file record to database
    const { data: mediaFile, error: dbError } = await supabaseAdmin
      .from("media_files")
      .insert({
        filename: fileName,
        original_name: file.name,
        file_path: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        alt_text: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      // File was uploaded to storage but failed to save to database
      // We'll still return success but log the error
      console.warn("File uploaded to storage but not saved to database:", dbError);
    }

    return NextResponse.json({
      success: true,
      data: {
        filename: fileName,
        url: urlData.publicUrl,
        file_path: urlData.publicUrl,
        size: file.size,
        originalName: file.name,
        mediaFile: mediaFile,
      },
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
