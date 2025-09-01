import { NextResponse } from 'next/server'
import { supabaseHelpers } from '@/lib/supabase-helpers'

export async function GET() {
  try {
    const mediaFiles = await supabaseHelpers.getAllMediaFiles()
    
    // Filter for client logos only and fix URL encoding
    const clientLogos = mediaFiles
      .filter((file: any) => file.file_path.includes('client-logos'))
      .map((file: any) => ({
        ...file,
        // Fix file_path encoding for spaces and special characters
        file_path: file.file_path.replace(/([^:]\/)\/+/g, '$1').split('/').map((part: string, index: number) => 
          index < 3 ? part : encodeURIComponent(part)
        ).join('/')
      }))
      .filter((file: any, index: number, self: any[]) => 
        // Remove duplicates based on original_name
        index === self.findIndex((f: any) => f.original_name === file.original_name)
      )
      .sort((a: any, b: any) => a.original_name.localeCompare(b.original_name))
    
    return NextResponse.json(clientLogos)
  } catch (error) {
    console.error('Error fetching client logos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client logos' },
      { status: 500 }
    )
  }
}