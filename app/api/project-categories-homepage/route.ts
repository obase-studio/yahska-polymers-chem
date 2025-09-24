import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Project categories for the projects section
    const projectCategoriesResult = await supabaseAdmin
      .from("project_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(4);

    const projectCategories = projectCategoriesResult.data || [];

    return NextResponse.json({
      success: true,
      data: {
        projectCategories,
      },
    });
  } catch (error) {
    console.error("Error fetching project categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project categories"
      },
      { status: 500 }
    );
  }
}