import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('📁 Listing storage folders...')

    // List all items in the root of the storage bucket
    const { data: rootItems, error: rootError } = await supabase.storage
      .from('yahska-media')
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (rootError) {
      throw new Error(`Failed to list root items: ${rootError.message}`)
    }

    console.log(`📁 Found ${rootItems?.length || 0} items in root`)

    const folders = rootItems?.filter(item => !item.id) || [] // Folders don't have id
    const files = rootItems?.filter(item => item.id) || [] // Files have id

    return NextResponse.json({
      success: true,
      data: {
        totalItems: rootItems?.length || 0,
        folders: folders.map(folder => folder.name),
        files: files.map(file => file.name),
        folderCount: folders.length,
        fileCount: files.length
      }
    })

  } catch (error) {
    console.error('❌ Error listing storage:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list storage',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}