import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase-helpers";

export async function GET(request: NextRequest) {
  try {
    // All media files for logo processing
    const mediaFiles = await supabaseHelpers.getAllMediaFiles();

    // Filter and process client logos
    const clientLogos = (mediaFiles || [])
      .filter(
        (file: any) =>
          file.file_path.includes("client-logos") ||
          file.file_path.includes("Client%20Logos")
      )
      .map((file: any) => ({
        ...file,
        file_path: file.file_path
          .replace("client-logos", "Client%20Logos")
          .replace(/([^:]\/)\/+/g, "$1")
          .split("/")
          .map((part: string, index: number) =>
            index < 3
              ? part
              : part.includes("%")
              ? part
              : encodeURIComponent(part)
          )
          .join("/"),
      }))
      .filter(
        (file: any, index: number, self: any[]) =>
          index ===
          self.findIndex((f: any) => f.original_name === file.original_name)
      )
      .filter(
        (logo: any) => logo.filename !== "17.Raj Infrastructure – Pkg 13.jpg"
      )
      .sort((a: any, b: any) => a.original_name.localeCompare(b.original_name));

    const approvalLogos = (mediaFiles || [])
      .filter(
        (file: any) =>
          file.file_path.includes("approval-logos") ||
          file.file_path.includes("approvals")
      )
      .map((file: any) => ({
        ...file,
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
          index ===
          self.findIndex((f: any) => f.original_name === file.original_name)
      )
      .sort((a: any, b: any) => a.original_name.localeCompare(b.original_name));

    return NextResponse.json({
      success: true,
      data: {
        clientLogos,
        approvalLogos,
      },
    });
  } catch (error) {
    console.error("Error fetching homepage logos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch homepage logos"
      },
      { status: 500 }
    );
  }
}