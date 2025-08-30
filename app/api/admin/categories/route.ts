import { NextRequest, NextResponse } from 'next/server'
import { supabaseHelpers } from '@/lib/supabase-helpers'

export async function GET() {
  try {
    // Get categories with product counts
    const categories = await supabaseHelpers.getAllCategoriesWithCounts()
    
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
    const { id, name, description, sort_order } = await request.json()
    
    if (!id || !name || !description) {
      return NextResponse.json(
        { success: false, error: 'ID, name, and description are required' },
        { status: 400 }
      )
    }
    
    // Check if category ID already exists
    const existing = await supabaseHelpers.getCategoryById(id)
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category ID already exists' },
        { status: 400 }
      )
    }
    
    const result = await supabaseHelpers.createCategory({
      id,
      name,
      description,
      sort_order: sort_order || 999
    })
    
    return NextResponse.json({
      success: true,
      data: { id: result?.[0]?.id }
    })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}