import { SimpleDashboard } from "@/components/admin/simple-dashboard"
import { supabaseHelpers } from "@/lib/supabase-helpers"

export default async function AdminDashboard() {
  // Get basic stats from database
  const products = await supabaseHelpers.getAllProducts()
  const testimonials = await supabaseHelpers.getAllTestimonials()
  const mediaFiles = await supabaseHelpers.getAllMediaFiles()

  const stats = {
    products: products.length,
    testimonials: testimonials.length,
    mediaFiles: mediaFiles.length,
    contentPages: 5 // Home, About, Products, Projects, Contact
  }

  return (
    <SimpleDashboard 
      stats={stats}
      recentProducts={products}
    />
  )
}