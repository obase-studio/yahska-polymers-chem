import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      throw error
    }
    
    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const project = await request.json()
    
    // Process key_features if it's a string (convert to array)
    if (typeof project.key_features === 'string') {
      project.key_features = project.key_features.split('\n').filter((item: string) => item.trim())
    }
    
    // Process gallery_images if it's a string (convert to array)
    if (typeof project.gallery_images === 'string') {
      project.gallery_images = project.gallery_images.split('\n').filter((item: string) => item.trim())
    }
    
    const { data: result, error } = await supabaseAdmin
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
    
    if (error) {
      throw error
    }
    
    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: result[0]
    })
  } catch (error: any) {
    console.error("Update project error:", error)
    console.error("Error message:", error?.message || 'No message')
    console.error("Error details:", JSON.stringify(error, null, 2))

    const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to update project: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: "Project deleted successfully"
    })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}