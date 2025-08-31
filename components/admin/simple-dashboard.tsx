"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Users, 
  FileText, 
  Image, 
  ExternalLink,
  ArrowRight,
  Edit,
  Upload,
  Settings
} from "lucide-react"
import Link from "next/link"

interface SimpleDashboardProps {
  stats: {
    products: number
    testimonials: number
    mediaFiles: number
    contentPages: number
  }
  recentProducts: any[]
}

export function SimpleDashboard({ stats, recentProducts }: SimpleDashboardProps) {
  const mainStats = [
    {
      title: "Products",
      value: stats.products,
      description: "Total products in catalog",
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600"
    },
    {
      title: "Media Files", 
      value: stats.mediaFiles,
      description: "Images and documents",
      icon: Image,
      href: "/admin/media",
      color: "text-green-600"
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      description: "Client testimonials",
      icon: Users,
      href: "/admin/clients",
      color: "text-purple-600"
    },
    {
      title: "Content Pages",
      value: stats.contentPages,
      description: "Website pages",
      icon: FileText,
      href: "/admin/content",
      color: "text-orange-600"
    }
  ]

  const quickActions = [
    {
      title: "Edit Website Content",
      description: "Update homepage, about, and page content",
      href: "/admin/content",
      icon: Edit,
      primary: true
    },
    {
      title: "Manage Media",
      description: "Upload and organize images",
      href: "/admin/media",
      icon: Upload,
      primary: false
    },
    {
      title: "Add Products",
      description: "Add new products to catalog",
      href: "/admin/products",
      icon: Package,
      primary: false
    },
    {
      title: "SEO Settings",
      description: "Update meta tags and SEO",
      href: "/admin/seo",
      icon: Settings,
      primary: false
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your website content and settings
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Website
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => {
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
                <p className="text-xs text-muted-foreground mb-3">
                  {stat.description}
                </p>
                <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
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
                      <Icon className={`h-5 w-5 ${action.primary ? 'text-blue-600' : 'text-muted-foreground'}`} />
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

      {/* Content Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products Overview
            </CardTitle>
            <CardDescription>
              Recent products in your catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentProducts.length > 0 ? (
              <div className="space-y-3">
                {recentProducts.slice(0, 3).map((product: any) => (
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

        {/* Website Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Website Status
            </CardTitle>
            <CardDescription>
              Current website information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Content Pages</span>
              <span className="text-sm font-medium">{stats.contentPages} pages</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Media Files</span>
              <span className="text-sm font-medium">{stats.mediaFiles} files</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Products</span>
              <span className="text-sm font-medium">{stats.products} items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Client Testimonials</span>
              <span className="text-sm font-medium">{stats.testimonials} testimonials</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href="/admin/content">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href="/" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}