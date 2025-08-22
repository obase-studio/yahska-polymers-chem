// Simple test to add sample data to the admin panel

async function testAdminPanel() {
  const baseUrl = 'http://localhost:3001'
  
  try {
    // Test login first
    console.log('1. Testing login...')
    const loginResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' })
    })
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`)
    }
    
    console.log('✅ Login successful!')
    
    // Get cookie for subsequent requests
    const cookies = loginResponse.headers.get('set-cookie')
    
    // Test adding a sample product
    console.log('2. Adding sample product...')
    const productData = {
      name: "Test Superplasticizer",
      description: "High-performance concrete admixture for testing",
      price: "₹75/Kg",
      category_id: "concrete",
      applications: ["Testing", "Development", "Quality Assurance"],
      features: ["High performance", "Easy to use", "Cost effective"],
      image_url: "/placeholder.svg"
    }
    
    const productResponse = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(productData)
    })
    
    if (productResponse.ok) {
      console.log('✅ Sample product added successfully!')
    } else {
      console.log('❌ Failed to add product:', await productResponse.text())
    }
    
    // Test SEO settings
    console.log('3. Testing SEO settings...')
    const seoData = {
      page: 'home',
      title: 'Updated Homepage Title - Yahska Polymers',
      description: 'Updated meta description for homepage',
      keywords: 'construction chemicals, concrete admixtures, yahska'
    }
    
    const seoResponse = await fetch(`${baseUrl}/api/admin/seo`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(seoData)
    })
    
    if (seoResponse.ok) {
      console.log('✅ SEO settings updated successfully!')
    } else {
      console.log('❌ Failed to update SEO:', await seoResponse.text())
    }
    
    // Test content management
    console.log('4. Testing content management...')
    const contentData = {
      page: 'home',
      section: 'hero',
      content_key: 'headline',
      content_value: 'Welcome to Yahska Polymers - Updated via Admin Panel!'
    }
    
    const contentResponse = await fetch(`${baseUrl}/api/admin/content`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(contentData)
    })
    
    if (contentResponse.ok) {
      console.log('✅ Content updated successfully!')
    } else {
      console.log('❌ Failed to update content:', await contentResponse.text())
    }
    
    console.log('\n🎉 Admin panel testing completed!')
    console.log('📱 Access the admin panel at: http://localhost:3001/admin/dashboard')
    console.log('🔑 Login credentials: admin / admin')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testAdminPanel()