import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { supabaseHelpers } from "@/lib/supabase-helpers";

export async function GET(request: NextRequest) {
  try {
    // Get content using helper function
    const content = await supabaseHelpers.getContent("home");

    // Fetch all other data in parallel
    const [
      categoriesResult,
      projectCategoriesResult,
      mediaFiles,
      pageImagesResult,
    ] = await Promise.all([

      // Categories
      supabaseAdmin
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(4),

      // Project categories
      supabaseAdmin
        .from("project_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(4),

      // All media files for logo processing
      supabaseHelpers.getAllMediaFiles(),

      // Page images for categories
      supabaseAdmin
        .from("page_images")
        .select("section, media_files(file_path)")
        .eq("page", "home")
        .in("section", ["construction_image", "concrete_image", "textile_image", "dyestuff_image"]),
    ]);

    // Process results
    const categories = categoriesResult.data || [];
    const projectCategories = projectCategoriesResult.data || [];

    // Filter and process client logos (similar to client-logos API)
    const clientLogos = (mediaFiles || [])
      .filter(
        (file: any) =>
          file.file_path.includes("client-logos") ||
          file.file_path.includes("Client%20Logos")
      )
      .map((file: any) => ({
        ...file,
        // Fix file_path: replace client-logos with Client Logos and encode properly
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
          // Remove duplicates based on original_name
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

    // Process category images
    const categoryImages: Record<string, string> = {};
    if (pageImagesResult.data) {
      pageImagesResult.data.forEach((item: any) => {
        if (item.media_files?.file_path) {
          // Map section names to category keys
          const sectionToCategoryMap: Record<string, string> = {
            "construction_image": "construction",
            "concrete_image": "concrete",
            "textile_image": "textile",
            "dyestuff_image": "dyestuff"
          };

          const categoryKey = sectionToCategoryMap[item.section];
          if (categoryKey) {
            categoryImages[categoryKey] = item.media_files.file_path;
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        content,
        categories,
        projectCategories,
        clientLogos,
        approvalLogos,
        categoryImages,
      },
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch homepage data"
      },
      { status: 500 }
    );
  }
}
