import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Users, 
  FileText, 
  Image, 
  BarChart3, 
  Clock,
  ArrowRight,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { supabaseHelpers } from "@/lib/supabase-helpers"

export default async function AdminDashboard() {
  // Get stats from database
  const products = await supabaseHelpers.getAllProducts()
  const testimonials = await supabaseHelpers.getAllTestimonials()
  const mediaFiles = await supabaseHelpers.getAllMediaFiles()
  const seoSettings = await supabaseHelpers.getAllSEOSettings()

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      description: "Active products in catalog",
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600"
    },
    {
      title: "Client Testimonials", 
      value: testimonials.length,
      description: "Client success stories",
      icon: Users,
      href: "/admin/clients",
      color: "text-green-600"
    },
    {
      title: "Media Files",
      value: mediaFiles.length,
      description: "Uploaded images & files",
      icon: Image,
      href: "/admin/media",
      color: "text-purple-600"
    },
    {
      title: "SEO Pages",
      value: seoSettings.length,
      description: "Optimized pages",
      icon: BarChart3,
      href: "/admin/seo",
      color: "text-orange-600"
    }
  ]

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product in the catalog",
      href: "/admin/products/new",
      icon: Package
    },
    {
      title: "Manage Content",
      description: "Edit homepage and page content",
      href: "/admin/content",
      icon: FileText
    },
    {
      title: "Upload Media",
      description: "Add images and files",
      href: "/admin/media",
      icon: Image
    },
    {
      title: "SEO Settings",
      description: "Optimize page metadata",
      href: "/admin/seo",
      icon: BarChart3
    }
  ]

  const recentProducts = products.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to the Yahska Polymers admin panel
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Website
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Button asChild variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                  <Link href={stat.href} className="text-xs">
                    Manage <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <Link href={action.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Products
            </CardTitle>
            <CardDescription>
              Latest products added to the catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentProducts.length > 0 ? (
              <div className="space-y-3">
                {recentProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category_name}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.price}
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/admin/products">
                    View All Products <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No products yet</p>
                <Button asChild size="sm" className="mt-2">
                  <Link href="/admin/products/new">Add First Product</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>
              Admin panel status and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Admin User</span>
              <span className="text-sm font-medium">admin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Login</span>
              <span className="text-sm text-muted-foreground">Just now</span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Admin panel version 1.0.0<br/>
                Built with Next.js & SQLite
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}