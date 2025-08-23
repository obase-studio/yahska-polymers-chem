import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let products = dbHelpers.getAllProducts();
    const categories = dbHelpers.getAllCategories();
    
    // Filter by category if provided
    if (category && category !== 'all') {
      products = products.filter((product: any) => product.category_id === category);
    }
    
    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((product: any) => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description?.toLowerCase().includes(searchLower) ||
        product.category_name?.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        products, 
        categories, 
        total: products.length 
      } 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch products' 
    }, { status: 500 });
  }
}