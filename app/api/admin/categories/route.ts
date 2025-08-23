import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers, initDatabase } from '@/lib/database'

export async function GET() {
  try {
    initDatabase()
    
    // Get categories with product counts
    const categories = dbHelpers.getAllCategoriesWithCounts()
    
    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    initDatabase()
    
    const { id, name, description, sort_order } = await request.json()
    
    if (!id || !name || !description) {
      return NextResponse.json(
        { success: false, error: 'ID, name, and description are required' },
        { status: 400 }
      )
    }
    
    // Check if category ID already exists
    const existing = dbHelpers.getCategoryById(id)
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category ID already exists' },
        { status: 400 }
      )
    }
    
    const result = dbHelpers.createCategory({
      id,
      name,
      description,
      sort_order: sort_order || 999
    })
    
    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid }
    })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}