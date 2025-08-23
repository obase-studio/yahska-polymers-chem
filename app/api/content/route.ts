export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers, initDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Initialize database
    initDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    
    if (!page) {
      return NextResponse.json({ 
        success: false, 
        error: 'Page parameter is required' 
      }, { status: 400 });
    }
    
    const content = section 
      ? dbHelpers.getContent(page, section)
      : dbHelpers.getContent(page);
    
    // Find the most recent update timestamp
    const lastUpdated = content && content.length > 0 
      ? Math.max(...content.map(item => new Date(item.updated_at || 0).getTime()))
      : 0;
    
    return NextResponse.json({ 
      success: true, 
      data: { content },
      lastUpdated: lastUpdated,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch content' 
    }, { status: 500 });
  }
}
