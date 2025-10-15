import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase-helpers";

export async function GET(request: NextRequest) {
  try {
    const logos = await supabaseHelpers.getHomepageLogos();

    return NextResponse.json({
      success: true,
      data: logos,
    });
  } catch (error) {
    console.error("Error fetching homepage logos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch homepage logos",
      },
      { status: 500 }
    );
  }
}
