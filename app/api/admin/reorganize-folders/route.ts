import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Folder mapping: old folder -> new folder
const folderMappings: Record<string, string> = {
  'project-photos': 'projects',
  'client-logos': 'logos',
  'approval-logos': 'logos',
  'category-images': 'product-categories',
  'uploads': 'content',
  'projects': 'projects', // already correct
  'approvals': 'logos',
  'product-images': 'products',
  'homepage': 'content',
  'Client%20Logos': 'logos'
}

interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text?: string
  uploaded_at: string
}

function getNewFolderFromPath(filePath: string): string {
  const pathParts = filePath.split('/')
  const currentFolder = pathParts[pathParts.length - 2] // Get folder name
  return folderMappings[currentFolder] || currentFolder
}

function generateNewPath(oldPath: string, newFolder: string): string {
  const baseUrl = 'https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/'
  const filename = oldPath.split('/').pop()
  return `${baseUrl}${newFolder}/${filename}`
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting media folder reorganization...')

    // Get all media files
    const { data: mediaFiles, error: fetchError } = await supabase
      .from('media_files')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (fetchError) {
      throw new Error(`Error fetching media files: ${fetchError.message}`)
    }
    console.log(`📁 Found ${mediaFiles.length} media files to process`)

    const results = {
      processed: 0,
      updated: 0,
      errors: 0,
      skipped: 0
    }

    const changeLog: any[] = []

    for (const file of mediaFiles) {
      results.processed++

      try {
        const pathParts = file.file_path.split('/')
        const currentFolder = pathParts[pathParts.length - 2] // Get folder name
        const newFolder = folderMappings[currentFolder]

        if (!newFolder) {
          console.log(`⚠️  Skipping file ${file.id}: Unknown folder '${currentFolder}'`)
          results.skipped++
          continue
        }

        if (newFolder === currentFolder) {
          console.log(`✅ File ${file.id} already in correct folder '${currentFolder}'`)
          results.skipped++
          continue
        }

        const newPath = generateNewPath(file.file_path, newFolder)
        const newFilename = newPath.split('/').pop() || file.filename

        console.log(`🔄 Moving file ${file.id}: ${currentFolder} -> ${newFolder}`)

        // Update database record
        const { error } = await supabase
          .from('media_files')
          .update({
            file_path: newPath,
            filename: newFilename
          })
          .eq('id', file.id)

        if (error) {
          throw new Error(`Database update failed: ${error.message}`)
        }

        results.updated++

        changeLog.push({
          id: file.id,
          filename: file.original_name,
          oldPath: file.file_path,
          newPath: newPath,
          oldFolder: currentFolder,
          newFolder: newFolder
        })

        console.log(`✅ Updated database record for file ${file.id}`)

      } catch (error) {
        console.error(`❌ Error processing file ${file.id}:`, error)
        results.errors++
      }
    }

    // Generate summary
    const newFolders = Object.values(folderMappings).filter((v, i, a) => a.indexOf(v) === i)
    const folderCounts = newFolders.map(folder => ({
      folder,
      count: changeLog.filter(c => c.newFolder === folder).length
    }))

    console.log('✅ Reorganization completed')

    return NextResponse.json({
      success: true,
      message: 'Media folder reorganization completed successfully',
      results: {
        ...results,
        changeLog: changeLog.length > 50 ? changeLog.slice(0, 50) : changeLog, // Limit log size
        folderStructure: folderCounts
      }
    })

  } catch (error) {
    console.error('❌ Fatal error during reorganization:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reorganize folders',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}