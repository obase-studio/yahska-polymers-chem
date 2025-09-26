/**
 * Media Folder Reorganization Script
 *
 * Reorganizes Supabase storage folders into a cleaner structure:
 * - products: Product images
 * - product-categories: Product category images
 * - projects: Project images
 * - project-categories: Project category images
 * - logos: All logos (header, client, approval)
 * - content: Website content images (hero sections, etc.)
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Folder mapping: old folder -> new folder
const folderMappings = {
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

async function getAllMediaFiles() {
  const { data, error } = await supabase
    .from('media_files')
    .select('*')
    .order('uploaded_at', { ascending: false })

  if (error) {
    throw new Error(`Error fetching media files: ${error.message}`)
  }

  return data || []
}

async function updateMediaFileRecord(id, newFilePath) {
  const { error } = await supabase
    .from('media_files')
    .update({
      file_path: newFilePath,
      filename: newFilePath.split('/').pop()
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Error updating media file ${id}: ${error.message}`)
  }
}

async function moveFileInStorage(oldPath, newPath) {
  try {
    // Extract the storage path (remove the full URL)
    const baseUrl = 'https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/'
    const oldStoragePath = oldPath.replace(baseUrl, '')
    const newStoragePath = newPath.replace(baseUrl, '')

    // Move the file in Supabase Storage
    const { data, error } = await supabase.storage
      .from('yahska-media')
      .move(oldStoragePath, newStoragePath)

    if (error) {
      console.warn(`Warning: Could not move file in storage ${oldStoragePath} -> ${newStoragePath}:`, error.message)
      return false
    }

    return true
  } catch (error) {
    console.warn(`Warning: Storage move failed for ${oldPath}:`, error.message)
    return false
  }
}

function getNewFolderFromPath(filePath) {
  // Extract current folder from path
  const pathParts = filePath.split('/')
  const currentFolder = pathParts[pathParts.length - 2] // Get folder name (second to last part)

  // Map to new folder
  return folderMappings[currentFolder] || currentFolder
}

function generateNewPath(oldPath, newFolder) {
  const baseUrl = 'https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/'
  const filename = oldPath.split('/').pop()
  return `${baseUrl}${newFolder}/${filename}`
}

async function reorganizeFolders() {
  console.log('🚀 Starting media folder reorganization...')

  try {
    // Get all media files
    const mediaFiles = await getAllMediaFiles()
    console.log(`📁 Found ${mediaFiles.length} media files to process`)

    const results = {
      processed: 0,
      updated: 0,
      moved: 0,
      errors: 0,
      skipped: 0
    }

    const changeLog = []

    for (const file of mediaFiles) {
      results.processed++

      try {
        const currentFolder = file.file_path.split('/').slice(-2, -1)[0] // Get folder name
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

        console.log(`🔄 Moving file ${file.id}: ${currentFolder} -> ${newFolder}`)

        // Try to move file in storage first
        const storageMoved = await moveFileInStorage(file.file_path, newPath)
        if (storageMoved) {
          results.moved++
        }

        // Update database record regardless of storage move result
        await updateMediaFileRecord(file.id, newPath)
        results.updated++

        changeLog.push({
          id: file.id,
          filename: file.original_name,
          oldPath: file.file_path,
          newPath: newPath,
          oldFolder: currentFolder,
          newFolder: newFolder,
          storageMoved: storageMoved
        })

        console.log(`✅ Updated database record for file ${file.id}`)

      } catch (error) {
        console.error(`❌ Error processing file ${file.id}:`, error.message)
        results.errors++
      }
    }

    // Save change log
    const logPath = path.join(process.cwd(), 'media-reorganization-log.json')
    fs.writeFileSync(logPath, JSON.stringify(changeLog, null, 2))

    // Print summary
    console.log('\n📊 REORGANIZATION SUMMARY:')
    console.log('='.repeat(50))
    console.log(`Total files processed: ${results.processed}`)
    console.log(`Database records updated: ${results.updated}`)
    console.log(`Storage files moved: ${results.moved}`)
    console.log(`Files skipped (already correct): ${results.skipped}`)
    console.log(`Errors encountered: ${results.errors}`)
    console.log(`Change log saved to: ${logPath}`)
    console.log('\n🎉 Folder reorganization completed!')

    // Print new folder structure
    const newFolders = Object.values(folderMappings).filter((v, i, a) => a.indexOf(v) === i)
    console.log('\n📂 NEW FOLDER STRUCTURE:')
    newFolders.forEach(folder => {
      const count = changeLog.filter(c => c.newFolder === folder).length
      console.log(`  • ${folder}: ${count} files`)
    })

  } catch (error) {
    console.error('❌ Fatal error during reorganization:', error.message)
    process.exit(1)
  }
}

// Run the reorganization
reorganizeFolders()