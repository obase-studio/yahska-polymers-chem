import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/database';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { params } = context;
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid product ID' 
      }, { status: 400 });
    }
    
    const product = dbHelpers.getProductById(productId);
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { product } 
    });
  } catch (error: any) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch product details' 
    }, { status: 500 });
  }
}