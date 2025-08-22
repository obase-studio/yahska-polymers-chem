import { NextRequest, NextResponse } from 'next/server'
import { dbHelpers } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    // Get all products from database
    let products = dbHelpers.getAllProducts()
    
        // Filter by category if specified
    if (category && category !== 'all') {
      products = products.filter((product: any) => product.category_id === category)
    }
    
    // Filter by search term if specified
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter((product: any) =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.applications?.toLowerCase().includes(searchLower) ||
        product.features?.toLowerCase().includes(searchLower)
      )
    }
    
    // Get categories for reference
    const categories = dbHelpers.getAllCategories()
    
    return NextResponse.json({
      success: true,
      data: {
        products,
        categories,
        total: products.length,
        filters: {
          category,
          search
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
