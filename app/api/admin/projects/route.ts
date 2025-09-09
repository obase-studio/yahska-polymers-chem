import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    await requireAuth();

    const { data: projects, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: projects || [],
    });
  } catch (error: any) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const project = await request.json();

    console.log("POST /api/admin/projects - Received project data:", project);

    // Validate required fields
    if (!project.name) {
      return NextResponse.json(
        { success: false, error: "Project name is required" },
        { status: 400 }
      );
    }

    // Process key_features if it's a string (convert to array)
    if (typeof project.key_features === "string") {
      project.key_features = project.key_features
        .split("\n")
        .filter((item: string) => item.trim());
    }

    // Process gallery_images if it's a string (convert to array)
    if (typeof project.gallery_images === "string") {
      project.gallery_images = project.gallery_images
        .split("\n")
        .filter((item: string) => item.trim());
    }

    const { data: result, error } = await supabaseAdmin
      .from("projects")
      .insert([project])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Project created successfully:", result?.[0]);

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: result?.[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
