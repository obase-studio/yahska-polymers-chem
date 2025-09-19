import { NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase-helpers";

export async function GET() {
  try {
    const categories = await supabaseHelpers.getAllProjectCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("Error fetching project categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch project categories",
      },
      { status: 500 }
    );
  }
}
