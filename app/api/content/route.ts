export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabase-helpers';

export async function GET(request: NextRequest) {
  try {
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
      ? await supabaseHelpers.getContent(page, section)
      : await supabaseHelpers.getContent(page);

    // Find the most recent update timestamp
    const lastUpdated = content && content.length > 0
      ? Math.max(...content.map(item => new Date(item.updated_at || 0).getTime()))
      : 0;

    return NextResponse.json({
      success: true,
      data: { content },
      lastUpdated: lastUpdated,
      timestamp: new Date().toISOString(),
      cacheBuster: Date.now() // Add cache busting
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
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
