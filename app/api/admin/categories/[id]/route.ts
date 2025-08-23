import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers, initDatabase } from '@/lib/database'

interface Context {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    initDatabase()
    
    const { params } = context
    const resolvedParams = await params
    const categoryId = resolvedParams.id
    
    const { name, description, sort_order } = await request.json()
    
    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      )
    }
    
    // Check if category exists
    const existing = dbHelpers.getCategoryById(categoryId)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    const result = dbHelpers.updateCategory(categoryId, {
      name,
      description,
      sort_order: sort_order || existing.sort_order
    })
    
    return NextResponse.json({
      success: true,
      data: { updated: result.changes > 0 }
    })
  } catch (error: any) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    initDatabase()
    
    const { params } = context
    const resolvedParams = await params
    const categoryId = resolvedParams.id
    
    // Check if category has products
    const productCount = dbHelpers.getProductCountByCategory(categoryId)
    if (productCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category with ${productCount} products. Move products to another category first.` 
        },
        { status: 400 }
      )
    }
    
    const result = dbHelpers.deleteCategory(categoryId)
    
    return NextResponse.json({
      success: true,
      data: { deleted: result.changes > 0 }
    })
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    )
  }
}