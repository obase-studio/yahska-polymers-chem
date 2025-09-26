import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseHelpers } from "@/lib/supabase-helpers";
import { NO_CACHE_HEADERS } from "@/lib/api-cache-config";
import { triggerRevalidation } from "@/lib/cms-revalidation";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    await requireAuth();
    const products = await supabaseHelpers.getAllProducts();
    return NextResponse.json(products, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers: NO_CACHE_HEADERS
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const product = await request.json();

    console.log("POST /api/admin/products - Received product data:", product);

    // Validate required fields
    if (!product.name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!product.category_id) {
      return NextResponse.json(
        { error: "Product category is required" },
        { status: 400 }
      );
    }

    const result = await supabaseHelpers.createProduct(product);

    console.log("Product created successfully:", result?.[0]);

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No product was created. Check RLS policies.",
        },
        {
          status: 400,
          headers: NO_CACHE_HEADERS
        }
      );
    }

    // Trigger revalidation for products
    await triggerRevalidation('products');

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: result?.[0],
      },
      {
        status: 201,
        headers: NO_CACHE_HEADERS
      }
    );
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      {
        status: 500,
        headers: NO_CACHE_HEADERS
      }
    );
  }
}
