import { NextRequest, NextResponse } from 'next/server'
import { supabaseHelpers } from '@/lib/supabase-helpers'

export async function GET() {
  try {
    // For now, return hardcoded project categories until we have a proper database table
    const projectCategories = [
      { id: "bullet-train", name: "High Speed Rail", description: "High-speed railway projects and infrastructure", sort_order: 1, is_active: true, project_count: 0 },
      { id: "metro-rail", name: "Metro & Rail", description: "Metro systems and urban rail transport", sort_order: 2, is_active: true, project_count: 0 },
      { id: "roads", name: "Roads & Highways", description: "Road construction and highway development", sort_order: 3, is_active: true, project_count: 0 },
      { id: "buildings-factories", name: "Buildings & Factories", description: "Commercial and industrial construction", sort_order: 4, is_active: true, project_count: 0 },
      { id: "others", name: "Other Projects", description: "Miscellaneous construction and infrastructure projects", sort_order: 5, is_active: true, project_count: 0 }
    ]
    
    return NextResponse.json({
      success: true,
      data: projectCategories
    })
  } catch (error: any) {
    console.error('Error fetching project categories:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch project categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, name, description, sort_order } = await request.json()
    
    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: 'ID and name are required' },
        { status: 400 }
      )
    }
    
    // For now, return success - in a real implementation, you'd save to database
    return NextResponse.json({
      success: true,
      message: 'Project category management is coming soon'
    })
  } catch (error: any) {
    console.error('Error creating project category:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create project category' },
      { status: 500 }
    )
  }
}