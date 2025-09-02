import { NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase-helpers";

export async function GET() {
  try {
    const mediaFiles = await supabaseHelpers.getAllMediaFiles();

    // Filter for approval logos only and fix URL encoding
    const approvalLogos = mediaFiles
      .filter((file: any) => file.file_path.includes("approval-logos"))
      .map((file: any) => ({
        ...file,
        // Fix file_path: replace approval-logos with approvals and encode properly
        file_path: file.file_path
          .replace("approval-logos", "approvals")
          .replace(/([^:]\/)\/+/g, "$1")
          .split("/")
          .map((part: string, index: number) =>
            index < 3 ? part : encodeURIComponent(part)
          )
          .join("/"),
      }))
      .filter(
        (file: any, index: number, self: any[]) =>
          // Remove duplicates based on original_name
          index ===
          self.findIndex((f: any) => f.original_name === file.original_name)
      )
      .sort((a: any, b: any) => a.original_name.localeCompare(b.original_name));

    return NextResponse.json(approvalLogos);
  } catch (error) {
    console.error("Error fetching approval logos:", error);
    return NextResponse.json(
      { error: "Failed to fetch approval logos" },
      { status: 500 }
    );
  }
}
