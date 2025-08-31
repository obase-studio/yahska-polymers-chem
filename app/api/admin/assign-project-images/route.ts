import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Mapping of project categories to available images in Supabase storage
const categoryImageMapping = {
  'bullet-train': [
    '/media/project-photos/bullet/1. BULLET TRAIN PROJECTS.webp',
    '/media/project-photos/bullet/2. Bullet train.webp'
  ],
  'metro-rail': [
    '/media/project-photos/metro-rail/2.Mumbai Metro J KUMAR.jpeg',
    '/media/project-photos/metro-rail/3.Ahmedabad-Gandhinagar-Metro.jpg',
    '/media/project-photos/metro-rail/4.SURAT METRO.webp',
    '/media/project-photos/metro-rail/5.JAIPUR METRO 1.webp',
    '/media/project-photos/metro-rail/6.RAILWAY.webp',
    '/media/project-photos/metro-rail/JAIPUR METRO.jpg'
  ],
  'roads': [
    '/media/project-photos/roads/7.Vadodara – Mumbai 8 lane PQC Expressway (1).jpeg',
    '/media/project-photos/roads/8.DELHI - VADODARA PQC 8 LINE.jpeg',
    '/media/project-photos/roads/9.Mumbai – Nagpur Samruddhi Mahamarg Expressway.jpeg',
    '/media/project-photos/roads/10.Bharuch Dahej Access Controlled Expressway.webp',
    '/media/project-photos/roads/11.Ahmedabad – Dholera 6 lane Expressway 1.jpeg',
    '/media/project-photos/roads/vadodara-mumbai-expressway_0_1200.jpg'
  ],
  'buildings-factories': [
    '/media/project-photos/buildings-factories/15.Tata Semiconductor Fab Facility, Dholera.jpeg',
    '/media/project-photos/buildings-factories/16.Coke Oven Plant at AMNS, Hazira 1.jpeg',
    '/media/project-photos/buildings-factories/17.Construction of Precast elements for Adani Power  Solar, Mundra 1.jpeg',
    '/media/project-photos/buildings-factories/18.Reliance Life Sciences, Nashik 2.jpeg',
    '/media/project-photos/buildings-factories/20.Fintech Towers at GIFT City, Ahmedabad 2.jpeg',
    '/media/project-photos/buildings-factories/02. Dholera Smart City - Drainage, CETP.jpeg'
  ],
  'others': [
    '/media/project-photos/others/21.Jamrani Dam, Uttarakhand 1.jpeg',
    '/media/project-photos/others/CANAL2.jpg',
    '/media/project-photos/others/FACTORY1.jpg',
    '/media/project-photos/others/04.Vadodara Airport (1).jpg'
  ]
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting project image assignment...')
    
    // Fetch all projects that don't have images
    const { data: projects, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id, name, category, image_url')
      .or('image_url.is.null,image_url.eq.')
    
    if (fetchError) {
      console.error('Error fetching projects:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
    }
    
    console.log(`📋 Found ${projects?.length || 0} projects without images`)
    
    let updateCount = 0
    const results = []
    
    for (const project of projects || []) {
      const categoryImages = categoryImageMapping[project.category as keyof typeof categoryImageMapping]
      
      if (categoryImages && categoryImages.length > 0) {
        // Assign a random image from the category
        const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)]
        
        // Update the project with the assigned image
        const { error: updateError } = await supabaseAdmin
          .from('projects')
          .update({ image_url: randomImage })
          .eq('id', project.id)
        
        if (updateError) {
          console.error(`Error updating project ${project.id}:`, updateError)
          results.push({
            project: project.name,
            status: 'error',
            message: updateError.message
          })
        } else {
          console.log(`✅ Assigned image to "${project.name}": ${randomImage}`)
          updateCount++
          results.push({
            project: project.name,
            status: 'success',
            image: randomImage
          })
        }
      } else {
        console.log(`⚠️  No images available for category "${project.category}" (${project.name})`)
        results.push({
          project: project.name,
          status: 'skipped',
          message: `No images available for category "${project.category}"`
        })
      }
    }
    
    console.log(`🎉 Successfully assigned images to ${updateCount} projects!`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully assigned images to ${updateCount} projects`,
      totalProjects: projects?.length || 0,
      updatedProjects: updateCount,
      results
    })
    
  } catch (error) {
    console.error('Error in assignProjectImages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}