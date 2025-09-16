import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// Note: Next.js 15 validates the second argument type of Route Handlers.
// Using a broad type here avoids mismatches with internal types during build.
export async function PUT(request: NextRequest, { params }: any) {
  try {
    await requireAuth()

    const { name, description, sort_order, is_active } = await request.json()
    const categoryId = params.id

    // Use supabaseAdmin to bypass RLS for admin operations
    const { data, error } = await supabaseAdmin
      .from('project_categories')
      .update({
        name,
        description,
        sort_order: parseInt(sort_order) || 0,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', categoryId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating project category:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update project category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project category updated successfully',
      data
    })
  } catch (error: any) {
    console.error('Error updating project category:', error)
    return NextResponse.json(
      { success: false, error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to update project category' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    await requireAuth()

    const categoryId = params.id

    // Use supabaseAdmin to bypass RLS for admin operations
    const { error } = await supabaseAdmin
      .from('project_categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('Supabase error deleting project category:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete project category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project category deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting project category:', error)
    return NextResponse.json(
      { success: false, error: error.message === 'Unauthorized' ? 'Unauthorized' : 'Failed to delete project category' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
