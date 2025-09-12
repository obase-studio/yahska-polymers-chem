import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase-helpers";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const categoryId = resolvedParams.id;

    const { name, description, image_url, sort_order } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existing = await supabaseHelpers.getCategoryById(categoryId);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const result = await supabaseHelpers.updateCategory(categoryId, {
      name,
      description,
      image_url,
      sort_order: sort_order || existing.sort_order,
    });

    return NextResponse.json({
      success: true,
      data: { updated: result?.length > 0 },
    });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const categoryId = resolvedParams.id;

    console.log(
      "DELETE /api/admin/categories/[id] - Received categoryId:",
      categoryId
    );

    // Check if category has products
    const productCount = await supabaseHelpers.getProductCountByCategory(
      categoryId
    );
    console.log("Product count for category:", productCount);

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category with ${productCount} products. Move products to another category first.`,
        },
        { status: 400 }
      );
    }

    const result = await supabaseHelpers.deleteCategory(categoryId);
    console.log("Delete result:", result);

    return NextResponse.json({
      success: true,
      data: { deleted: !!result },
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
