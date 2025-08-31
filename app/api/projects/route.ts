import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const supabase = supabaseAdmin
    
    let query = supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,client_name.ilike.%${search}%`)
    }
    
    // Apply limit
    query = query.limit(limit)
    
    const { data: projects, error } = await query
    
    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      data: projects || [],
      count: projects?.length || 0
    })
    
  } catch (error) {
    console.error('Error in projects API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}