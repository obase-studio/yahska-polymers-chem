import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    console.log("Testing deletion of file ID:", id);

    // First, check if file exists
    const { data: existingFile, error: fetchError } = await supabaseAdmin
      .from("media_files")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingFile) {
      console.log("File not found:", fetchError);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    console.log(
      "File found:",
      existingFile.original_name,
      existingFile.file_path
    );

    // Extract storage path and delete from storage first
    const url = new URL(existingFile.file_path);
    const pathParts = url.pathname.split("/");
    const storagePath = pathParts.slice(4).join("/");

    console.log("Storage path:", storagePath);

    // Delete from storage
    const { data: storageDeleteData, error: storageError } =
      await supabaseAdmin.storage.from("yahska-media").remove([storagePath]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      return NextResponse.json(
        { error: `Storage deletion failed: ${storageError.message}` },
        { status: 500 }
      );
    }

    console.log("Storage delete result:", storageDeleteData);

    // Delete from database
    const { data: deleteData, error: deleteError } = await supabaseAdmin
      .from("media_files")
      .delete()
      .eq("id", id)
      .select();

    if (deleteError) {
      console.error("Database delete error:", deleteError);
      return NextResponse.json(
        { error: `Database deletion failed: ${deleteError.message}` },
        { status: 500 }
      );
    }

    console.log("Database delete result:", deleteData);

    // Verify deletion
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from("media_files")
      .select("*")
      .eq("id", id)
      .single();

    if (verifyError && verifyError.code === "PGRST116") {
      // PGRST116 means no rows found, which is what we want
      console.log("File successfully deleted and verified");
      return NextResponse.json({
        message: "File deleted successfully from both storage and database",
        deletedFile: existingFile,
        storageDeleteResult: storageDeleteData,
        databaseDeleteResult: deleteData,
      });
    } else if (verifyData) {
      console.error("File still exists after deletion");
      return NextResponse.json(
        { error: "File still exists after deletion" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unexpected verification result" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Test delete error:", error);
    return NextResponse.json({ error: "Test delete failed" }, { status: 500 });
  }
}
