import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting storage debug...')

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

    const debugInfo = {
      rootItems: rootItems?.map(item => ({
        name: item.name,
        type: item.id ? 'file' : 'folder',
        size: item.metadata?.size,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [],
      folderContents: {} as Record<string, any[] | { error: string }>
    }

    // Check contents of each folder
    if (rootItems) {
      for (const item of rootItems) {
        if (!item.id) { // This is a folder
          console.log(`🔄 Checking folder: ${item.name}`)

          const { data: folderFiles, error: folderError } = await supabase.storage
            .from('yahska-media')
            .list(item.name, {
              limit: 1000
            })

          if (folderError) {
            console.warn(`⚠️ Could not list files in ${item.name}:`, folderError.message)
            debugInfo.folderContents[item.name] = { error: folderError.message }
          } else {
            debugInfo.folderContents[item.name] = folderFiles?.map(file => ({
              name: file.name,
              type: file.id ? 'file' : 'subfolder',
              size: file.metadata?.size,
              created_at: file.created_at
            })) || []
          }
        }
      }
    }

    // Also check the old folders we want to clean up
    const oldFoldersToCheck = [
      'Client Logos',
      'Yahska Images',
      'approval-logos',
      'approvals',
      'category-images',
      'client-logos',
      'homepage',
      'product-images',
      'project-photos',
      'specifications',
      'uploads'
    ]

    for (const folder of oldFoldersToCheck) {
      if (!debugInfo.folderContents[folder]) {
        console.log(`🔄 Checking old folder: ${folder}`)

        const { data: folderFiles, error: folderError } = await supabase.storage
          .from('yahska-media')
          .list(folder, {
            limit: 1000
          })

        if (folderError) {
          console.warn(`⚠️ Could not list files in ${folder}:`, folderError.message)
          debugInfo.folderContents[folder] = { error: folderError.message }
        } else {
          debugInfo.folderContents[folder] = folderFiles?.map(file => ({
            name: file.name,
            type: file.id ? 'file' : 'subfolder',
            size: file.metadata?.size,
            created_at: file.created_at
          })) || []
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Storage debug completed',
      data: debugInfo
    })

  } catch (error) {
    console.error('❌ Error during storage debug:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to debug storage',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}