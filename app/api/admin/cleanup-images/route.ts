import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { dryRun = true } = await request.json()

    console.log(`🧹 Starting image cleanup (dry run: ${dryRun})`)

    const cleanupResults = {
      brokenMediaFiles: [] as any[],
      brokenContentReferences: [] as any[],
      brokenProductImages: [] as any[],
      brokenProjectImages: [] as any[],
      brokenCategoryImages: [] as any[],
      validatedFiles: 0,
      cleanedReferences: 0
    }

    // 1. Get all media files from database
    const { data: mediaFiles, error: mediaError } = await supabase
      .from('media_files')
      .select('*')

    if (mediaError) {
      throw new Error(`Failed to fetch media files: ${mediaError.message}`)
    }

    console.log(`📁 Found ${mediaFiles?.length || 0} media files in database`)

    // 2. Validate each media file exists in storage
    for (const file of mediaFiles || []) {
      try {
        const { data, error } = await supabase.storage
          .from('yahska-media')
          .download(file.file_path.replace('https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/', ''))

        if (error || !data) {
          console.log(`❌ Broken file: ${file.file_path}`)
          cleanupResults.brokenMediaFiles.push({
            id: file.id,
            filename: file.filename,
            file_path: file.file_path,
            error: error?.message || 'File not found'
          })
        } else {
          cleanupResults.validatedFiles++
        }
      } catch (error) {
        console.log(`❌ Error checking file: ${file.file_path}`)
        cleanupResults.brokenMediaFiles.push({
          id: file.id,
          filename: file.filename,
          file_path: file.file_path,
          error: 'Storage access error'
        })
      }
    }

    // 3. Check site_content table for broken image references
    const { data: contentItems, error: contentError } = await supabase
      .from('site_content')
      .select('*')
      .or('content_key.eq.image_url,content_key.eq.image_id,content_key.eq.logo,content_key.eq.background_image')

    if (!contentError && contentItems) {
      for (const item of contentItems) {
        if (item.content_value && item.content_value.includes('http')) {
          // It's a URL, check if it exists
          try {
            const response = await fetch(item.content_value, { method: 'HEAD' })
            if (!response.ok) {
              cleanupResults.brokenContentReferences.push({
                id: item.id,
                page: item.page,
                section: item.section,
                content_key: item.content_key,
                content_value: item.content_value,
                error: `HTTP ${response.status}`
              })
            }
          } catch (error) {
            cleanupResults.brokenContentReferences.push({
              id: item.id,
              page: item.page,
              section: item.section,
              content_key: item.content_key,
              content_value: item.content_value,
              error: 'Network error'
            })
          }
        }
      }
    }

    // 4. Check products table for broken image references
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, image_url, specification_pdf')
      .not('image_url', 'is', null)

    if (!productsError && products) {
      for (const product of products) {
        if (product.image_url) {
          try {
            const response = await fetch(product.image_url, { method: 'HEAD' })
            if (!response.ok) {
              cleanupResults.brokenProductImages.push({
                id: product.id,
                name: product.name,
                image_url: product.image_url,
                error: `HTTP ${response.status}`
              })
            }
          } catch (error) {
            cleanupResults.brokenProductImages.push({
              id: product.id,
              name: product.name,
              image_url: product.image_url,
              error: 'Network error'
            })
          }
        }
      }
    }

    // 5. Check project categories table
    const { data: projectCategories, error: projectCategoriesError } = await supabase
      .from('project_categories')
      .select('id, name, icon_url')
      .not('icon_url', 'is', null)

    if (!projectCategoriesError && projectCategories) {
      for (const category of projectCategories) {
        if (category.icon_url) {
          try {
            const response = await fetch(category.icon_url, { method: 'HEAD' })
            if (!response.ok) {
              cleanupResults.brokenCategoryImages.push({
                id: category.id,
                name: category.name,
                icon_url: category.icon_url,
                error: `HTTP ${response.status}`
              })
            }
          } catch (error) {
            cleanupResults.brokenCategoryImages.push({
              id: category.id,
              name: category.name,
              icon_url: category.icon_url,
              error: 'Network error'
            })
          }
        }
      }
    }

    // 6. If not dry run, clean up broken references
    if (!dryRun) {
      console.log('🧹 Performing cleanup...')

      // Remove broken media files from database
      for (const brokenFile of cleanupResults.brokenMediaFiles) {
        await supabaseAdmin
          .from('media_files')
          .delete()
          .eq('id', brokenFile.id)
        cleanupResults.cleanedReferences++
      }

      // Clear broken content references
      for (const brokenContent of cleanupResults.brokenContentReferences) {
        await supabaseAdmin
          .from('site_content')
          .update({ content_value: '' })
          .eq('id', brokenContent.id)
        cleanupResults.cleanedReferences++
      }

      // Clear broken product images
      for (const brokenProduct of cleanupResults.brokenProductImages) {
        await supabaseAdmin
          .from('products')
          .update({ image_url: null })
          .eq('id', brokenProduct.id)
        cleanupResults.cleanedReferences++
      }

      // Clear broken category icons
      for (const brokenCategory of cleanupResults.brokenCategoryImages) {
        await supabaseAdmin
          .from('project_categories')
          .update({ icon_url: null })
          .eq('id', brokenCategory.id)
        cleanupResults.cleanedReferences++
      }
    }

    const totalBrokenItems =
      cleanupResults.brokenMediaFiles.length +
      cleanupResults.brokenContentReferences.length +
      cleanupResults.brokenProductImages.length +
      cleanupResults.brokenCategoryImages.length

    console.log(`✅ Cleanup complete. Found ${totalBrokenItems} broken references`)

    return NextResponse.json({
      success: true,
      message: dryRun ? 'Dry run completed' : 'Cleanup completed',
      data: {
        ...cleanupResults,
        summary: {
          totalBrokenItems,
          validatedFiles: cleanupResults.validatedFiles,
          cleanedReferences: cleanupResults.cleanedReferences
        }
      }
    })

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cleanup images',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}