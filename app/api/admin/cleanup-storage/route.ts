import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Old folders to clean up
const oldFoldersToCleanup = [
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

// Folder mappings for migration
const folderMappings: Record<string, string> = {
  'Client Logos': 'logos',
  'client-logos': 'logos',
  'approval-logos': 'logos',
  'approvals': 'logos',
  'category-images': 'product-categories',
  'product-images': 'products',
  'project-photos': 'projects',
  'uploads': 'content',
  'homepage': 'content',
  'specifications': 'content',
  'Yahska Images': 'content'
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Starting storage cleanup and migration...')

    // List all files in the yahska-media bucket
    const { data: files, error: listError } = await supabase.storage
      .from('yahska-media')
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (listError) {
      throw new Error(`Failed to list storage files: ${listError.message}`)
    }

    console.log(`📁 Found ${files?.length || 0} items in storage`)

    const results = {
      foldersProcessed: 0,
      filesMoved: 0,
      foldersDeleted: 0,
      errors: 0
    }

    const migrationLog: any[] = []

    // Process each old folder
    for (const folder of oldFoldersToCleanup) {
      try {
        console.log(`🔄 Processing folder: ${folder}`)
        results.foldersProcessed++

        // List files in this folder
        const { data: folderFiles, error: folderListError } = await supabase.storage
          .from('yahska-media')
          .list(folder, {
            limit: 1000
          })

        if (folderListError) {
          console.warn(`⚠️ Could not list files in ${folder}:`, folderListError.message)
          continue
        }

        if (!folderFiles || folderFiles.length === 0) {
          console.log(`📂 Folder ${folder} is empty, skipping...`)
          continue
        }

        console.log(`📄 Found ${folderFiles.length} files in ${folder}`)

        const newFolder = folderMappings[folder]
        if (!newFolder) {
          console.warn(`⚠️ No mapping found for folder ${folder}, skipping...`)
          continue
        }

        // Move each file to the new folder
        for (const file of folderFiles) {
          if (file.name && !file.name.includes('/')) { // Only process actual files, not subfolders
            const oldPath = `${folder}/${file.name}`
            const newPath = `${newFolder}/${file.name}`

            try {
              // Move file in storage
              const { error: moveError } = await supabase.storage
                .from('yahska-media')
                .move(oldPath, newPath)

              if (moveError) {
                console.error(`❌ Failed to move ${oldPath} to ${newPath}:`, moveError.message)
                results.errors++
              } else {
                console.log(`✅ Moved: ${oldPath} → ${newPath}`)
                results.filesMoved++

                migrationLog.push({
                  oldPath,
                  newPath,
                  oldFolder: folder,
                  newFolder: newFolder,
                  fileName: file.name
                })

                // Update database record to match the new storage path
                const newFullPath = `https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/${newPath}`
                const { error: dbError } = await supabase
                  .from('media_files')
                  .update({
                    file_path: newFullPath,
                    filename: file.name
                  })
                  .like('file_path', `%${folder}/${file.name}`)

                if (dbError) {
                  console.warn(`⚠️ Database update failed for ${file.name}:`, dbError.message)
                }
              }
            } catch (error) {
              console.error(`❌ Error moving ${oldPath}:`, error)
              results.errors++
            }
          }
        }

        // After moving all files, try to delete the empty folder
        try {
          const { error: deleteError } = await supabase.storage
            .from('yahska-media')
            .remove([folder])

          if (deleteError) {
            console.warn(`⚠️ Could not delete empty folder ${folder}:`, deleteError.message)
          } else {
            console.log(`🗑️ Deleted empty folder: ${folder}`)
            results.foldersDeleted++
          }
        } catch (error) {
          console.warn(`⚠️ Error deleting folder ${folder}:`, error)
        }

      } catch (error) {
        console.error(`❌ Error processing folder ${folder}:`, error)
        results.errors++
      }
    }

    // Final summary
    const newFolderStructure = [
      'logos',
      'product-categories',
      'products',
      'projects',
      'project-categories',
      'content'
    ]

    console.log('✅ Storage cleanup completed!')

    return NextResponse.json({
      success: true,
      message: 'Storage cleanup and migration completed successfully',
      results: {
        ...results,
        migrationLog: migrationLog.slice(0, 50), // Limit log size
        newFolderStructure,
        cleanedUpFolders: oldFoldersToCleanup
      }
    })

  } catch (error) {
    console.error('❌ Fatal error during storage cleanup:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cleanup storage',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}