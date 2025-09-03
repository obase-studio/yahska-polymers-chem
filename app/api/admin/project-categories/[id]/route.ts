import { NextRequest, NextResponse } from 'next/server'

// Note: Next.js 15 validates the second argument type of Route Handlers.
// Using a broad type here avoids mismatches with internal types during build.
export async function PUT(request: NextRequest, { params }: any) {
  try {
    const { name, description, sort_order, is_active } = await request.json()
    
    // For now, return success - in a real implementation, you'd update the database
    return NextResponse.json({
      success: true,
      message: 'Project category management is coming soon'
    })
  } catch (error: any) {
    console.error('Error updating project category:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update project category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    // For now, return success - in a real implementation, you'd delete from database
    return NextResponse.json({
      success: true,
      message: 'Project category management is coming soon'
    })
  } catch (error: any) {
    console.error('Error deleting project category:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete project category' },
      { status: 500 }
    )
  }
}
