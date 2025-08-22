const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

// Database connection
const dbPath = path.join(__dirname, '../admin.db')
const db = new Database(dbPath)

console.log('🚀 Starting Media Asset Organization...')
console.log('📁 Database:', dbPath)

// Media categories
const MEDIA_CATEGORIES = {
  'client-logos': {
    name: 'Client Logos',
    description: 'Logos of client companies and partners',
    path: '../client_documentation/approvals clients projects photos/Client Logos'
  },
  'approval-logos': {
    name: 'Approval Authority Logos',
    description: 'Logos of government and regulatory authorities',
    path: '../client_documentation/approvals clients projects photos/Approvals logos'
  },
  'project-photos': {
    name: 'Project Photos',
    description: 'Photos of completed projects and construction sites',
    path: '../client_documentation/approvals clients projects photos/Projects photos'
  }
}

// Project photo subcategories
const PROJECT_SUBCATEGORIES = {
  'metro-rail': {
    name: 'Metro Rail Projects',
    description: 'Metro rail infrastructure projects',
    path: 'Metro Rail'
  },
  'road-projects': {
    name: 'Road Projects',
    description: 'Highway and road construction projects',
    path: 'Road Projects'
  },
  'buildings-factories': {
    name: 'Buildings & Factories',
    description: 'Commercial and industrial construction projects',
    path: 'Buildings Factories'
  },
  'bullet': {
    name: 'Bullet Train Projects',
    description: 'High-speed rail projects',
    path: 'Bullet'
  },
  'others': {
    name: 'Other Projects',
    description: 'Miscellaneous construction projects',
    path: 'Others'
  }
}

// Function to get file info
function getFileInfo(filePath) {
  try {
    const stats = fs.statSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    
    let mimeType = 'application/octet-stream'
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
      mimeType = `image/${ext.slice(1)}`
    } else if (ext === '.pdf') {
      mimeType = 'application/pdf'
    } else if (['.doc', '.docx'].includes(ext)) {
      mimeType = 'application/msword'
    }
    
    return {
      size: stats.size,
      mimeType,
      ext
    }
  } catch (error) {
    console.error(`Error getting file info for ${filePath}:`, error)
    return { size: 0, mimeType: 'application/octet-stream', ext: '' }
  }
}

// Function to create media directory structure
function createMediaDirectories() {
  const mediaDir = path.join(__dirname, '../public/media')
  const dirs = [
    'client-logos',
    'approval-logos',
    'project-photos/metro-rail',
    'project-photos/road-projects',
    'project-photos/buildings-factories',
    'project-photos/bullet',
    'project-photos/others'
  ]
  
  dirs.forEach(dir => {
    const fullPath = path.join(mediaDir, dir)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
      console.log(`📁 Created directory: ${dir}`)
    }
  })
}

// Function to copy and organize client logos
function organizeClientLogos() {
  console.log('\n🏢 Organizing Client Logos...')
  const sourceDir = path.join(__dirname, MEDIA_CATEGORIES['client-logos'].path)
  const targetDir = path.join(__dirname, '../public/media/client-logos')
  
  if (!fs.existsSync(sourceDir)) {
    console.log(`❌ Source directory not found: ${sourceDir}`)
    return []
  }
  
  const files = fs.readdirSync(sourceDir)
  const organizedFiles = []
  
  files.forEach(file => {
    if (file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      const sourcePath = path.join(sourceDir, file)
      const targetPath = path.join(targetDir, file)
      
      try {
        fs.copyFileSync(sourcePath, targetPath)
        const fileInfo = getFileInfo(sourcePath)
        
        organizedFiles.push({
          filename: file,
          original_name: file,
          file_path: `/media/client-logos/${file}`,
          file_size: fileInfo.size,
          mime_type: fileInfo.mimeType,
          alt_text: `Client logo: ${path.parse(file).name}`,
          category: 'client-logos'
        })
        
        console.log(`✅ Copied: ${file}`)
      } catch (error) {
        console.error(`❌ Error copying ${file}:`, error)
      }
    }
  })
  
  return organizedFiles
}

// Function to copy and organize approval logos
function organizeApprovalLogos() {
  console.log('\n🏛️ Organizing Approval Authority Logos...')
  const sourceDir = path.join(__dirname, MEDIA_CATEGORIES['approval-logos'].path)
  const targetDir = path.join(__dirname, '../public/media/approval-logos')
  
  if (!fs.existsSync(sourceDir)) {
    console.log(`❌ Source directory not found: ${sourceDir}`)
    return []
  }
  
  const files = fs.readdirSync(sourceDir)
  const organizedFiles = []
  
  files.forEach(file => {
    if (file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      const sourcePath = path.join(sourceDir, file)
      const targetPath = path.join(targetDir, file)
      
      try {
        fs.copyFileSync(sourcePath, targetPath)
        const fileInfo = getFileInfo(sourcePath)
        
        organizedFiles.push({
          filename: file,
          original_name: file,
          file_path: `/media/approval-logos/${file}`,
          file_size: fileInfo.size,
          mime_type: fileInfo.mimeType,
          alt_text: `Approval authority logo: ${path.parse(file).name}`,
          category: 'approval-logos'
        })
        
        console.log(`✅ Copied: ${file}`)
      } catch (error) {
        console.error(`❌ Error copying ${file}:`, error)
      }
    }
  })
  
  return organizedFiles
}

// Function to copy and organize project photos
function organizeProjectPhotos() {
  console.log('\n🏗️ Organizing Project Photos...')
  const sourceDir = path.join(__dirname, MEDIA_CATEGORIES['project-photos'].path)
  const organizedFiles = []
  
  if (!fs.existsSync(sourceDir)) {
    console.log(`❌ Source directory not found: ${sourceDir}`)
    return []
  }
  
  Object.entries(PROJECT_SUBCATEGORIES).forEach(([key, subcat]) => {
    const subcatSourceDir = path.join(sourceDir, subcat.path)
    const subcatTargetDir = path.join(__dirname, `../public/media/project-photos/${key}`)
    
    if (!fs.existsSync(subcatSourceDir)) {
      console.log(`⚠️ Subcategory directory not found: ${subcatSourceDir}`)
      return
    }
    
    console.log(`\n📸 Processing ${subcat.name}...`)
    
    try {
      const files = fs.readdirSync(subcatSourceDir)
      
      files.forEach(file => {
        if (file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          const sourcePath = path.join(subcatSourceDir, file)
          const targetPath = path.join(subcatTargetDir, file)
          
          try {
            fs.copyFileSync(sourcePath, targetPath)
            const fileInfo = getFileInfo(sourcePath)
            
            organizedFiles.push({
              filename: file,
              original_name: file,
              file_path: `/media/project-photos/${key}/${file}`,
              file_size: fileInfo.size,
              mime_type: fileInfo.mimeType,
              alt_text: `${subcat.name}: ${path.parse(file).name}`,
              category: `project-photos-${key}`,
              subcategory: subcat.name
            })
            
            console.log(`✅ Copied: ${file}`)
          } catch (error) {
            console.error(`❌ Error copying ${file}:`, error)
          }
        }
      })
    } catch (error) {
      console.error(`❌ Error processing ${subcat.name}:`, error)
    }
  })
  
  return organizedFiles
}

// Function to insert media files into database
function insertMediaFiles(files) {
  console.log('\n💾 Inserting media files into database...')
  
  const insertStmt = db.prepare(`
    INSERT INTO media_files (filename, original_name, file_path, file_size, mime_type, alt_text, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `)
  
  let insertedCount = 0
  
  files.forEach(file => {
    try {
      insertStmt.run(
        file.filename,
        file.original_name,
        file.file_path,
        file.file_size,
        file.mime_type,
        file.alt_text
      )
      insertedCount++
    } catch (error) {
      console.error(`❌ Error inserting ${file.filename}:`, error)
    }
  })
  
  console.log(`✅ Inserted ${insertedCount} media files into database`)
  return insertedCount
}

// Main execution
try {
  console.log('📊 Media Asset Organization Summary:')
  console.log('=====================================')
  
  // Create media directories
  createMediaDirectories()
  
  // Organize different types of media
  const clientLogos = organizeClientLogos()
  const approvalLogos = organizeApprovalLogos()
  const projectPhotos = organizeProjectPhotos()
  
  // Combine all files
  const allFiles = [...clientLogos, ...approvalLogos, ...projectPhotos]
  
  console.log('\n📈 Organization Results:')
  console.log(`   Client Logos: ${clientLogos.length}`)
  console.log(`   Approval Logos: ${approvalLogos.length}`)
  console.log(`   Project Photos: ${projectPhotos.length}`)
  console.log(`   Total Files: ${allFiles.length}`)
  
  if (allFiles.length > 0) {
    // Insert into database
    const insertedCount = insertMediaFiles(allFiles)
    console.log(`\n💾 Database: ${insertedCount}/${allFiles.length} files inserted`)
  }
  
  console.log('\n🎉 Media asset organization completed!')
  
} catch (error) {
  console.error('❌ Error during media organization:', error)
} finally {
  db.close()
  console.log('\n🔒 Database connection closed')
}
