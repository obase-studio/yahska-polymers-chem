import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate ID is a number
    const projectId = parseInt(id)
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    // Fetch the specific project
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories (
          name
        )
      `)
      .eq('id', projectId)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}