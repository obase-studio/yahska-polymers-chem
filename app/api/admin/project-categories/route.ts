import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase-helpers";

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export async function GET() {
  try {
    const projectCategories = await supabaseHelpers.getAllProjectCategories();

    return NextResponse.json({
      success: true,
      data: projectCategories,
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

export async function POST(request: NextRequest) {
  try {
    const { id, name, description, icon_url, sort_order } =
      await request.json();

    let newId = id ? slugify(id) : slugify(name);

    if (!newId) {
      newId = `project-category-${Date.now()}`;
    }
    if (!newId || !name || !description) {
      return NextResponse.json(
        { success: false, error: "ID, name, and description are required" },
        { status: 400 }
      );
    }

    const result = await supabaseHelpers.createProjectCategory({
      id: newId,
      name,
      description,
      icon_url,
      sort_order: sort_order || 1,
    });

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error: any) {
    console.error("Error creating project category:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create project category",
      },
      { status: 500 }
    );
  }
}
