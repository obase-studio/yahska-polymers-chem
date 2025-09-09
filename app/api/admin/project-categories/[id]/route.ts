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

    const { name, description, sort_order, is_active } = await request.json();

    console.log("PUT /api/admin/project-categories/[id] - Received data:", {
      categoryId,
      name,
      description,
      sort_order,
      is_active,
    });

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existing = await supabaseHelpers.getProjectCategoryById(categoryId);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Project category not found" },
        { status: 404 }
      );
    }

    const updateData = {
      name,
      description,
      sort_order: sort_order || existing.sort_order,
      is_active: is_active !== undefined ? is_active : existing.is_active,
    };

    console.log("About to update with data:", updateData);
    console.log("Existing category:", existing);

    const result = await supabaseHelpers.updateProjectCategory(
      categoryId,
      updateData
    );

    console.log("Update result:", result);

    if (!result || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No rows were updated. Project category may not exist or RLS policies may be blocking the update.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { updated: result.length > 0, category: result[0] },
    });
  } catch (error: any) {
    console.error("Error updating project category:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update project category",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const categoryId = resolvedParams.id;

    // Check if category has projects
    const projectCount = await supabaseHelpers.getProjectCountByCategory(
      categoryId
    );
    if (projectCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete project category with ${projectCount} projects. Move projects to another category first.`,
        },
        { status: 400 }
      );
    }

    const result = await supabaseHelpers.deleteProjectCategory(categoryId);

    return NextResponse.json({
      success: true,
      data: { deleted: !!result },
    });
  } catch (error: any) {
    console.error("Error deleting project category:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete project category",
      },
      { status: 500 }
    );
  }
}
