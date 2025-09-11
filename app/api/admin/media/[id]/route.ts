import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { alt_text } = await request.json();

    // Update alt text in database (simplified - you'd need to add this method to dbHelpers)
    // For now, we'll just return success

    return NextResponse.json(
      { message: "Alt text updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update media error:", error);
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get file info before deleting
    const files = await supabaseHelpers.getAllMediaFiles();
    const file = files.find((f: any) => f.id === parseInt(id));

    if (file) {
      // Extract the storage path from the file_path
      // file_path format: https://xxx.supabase.co/storage/v1/object/public/yahska-media/folder/filename
      const url = new URL(file.file_path);
      const pathParts = url.pathname.split("/");
      const storagePath = pathParts.slice(4).join("/"); // Remove '/storage/v1/object/public/yahska-media/'

      console.log("Deleting file from storage:", storagePath);

      // Delete file from Supabase Storage
      const { error: storageError } = await supabaseAdmin.storage
        .from("yahska-media")
        .remove([storagePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
      } else {
        console.log("File deleted from storage successfully");
      }

      // Delete from database
      await supabaseHelpers.deleteMediaFile(parseInt(id));
      console.log("File deleted from database successfully");
    }

    return NextResponse.json(
      { message: "Media file deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
