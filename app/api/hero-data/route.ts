export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get only critical above-the-fold content
    const [
      content,
      categoriesResult,
    ] = await Promise.all([
      // Content for hero section
      supabaseHelpers.getContent("home"),

      // Only product categories for the main section
      supabaseAdmin
        .from("product_categories")
        .select("id, name, description, image_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(4),
    ]);

    const categories = categoriesResult.data || [];

    // Find the most recent update timestamp
    const lastUpdated = content && content.length > 0
      ? Math.max(...content.map(item => new Date(item.updated_at || 0).getTime()))
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        content,
        categories,
      },
      lastUpdated,
      timestamp: new Date().toISOString(),
      cacheBuster: Date.now()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hero data"
      },
      { status: 500 }
    );
  }
}