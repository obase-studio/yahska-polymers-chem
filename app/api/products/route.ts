import { NextRequest, NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabase-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let products = await supabaseHelpers.getAllProducts();
    const categories = await supabaseHelpers.getAllCategories();
    
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
        total: products.length,
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
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
