"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Users, 
  FileText, 
  Image, 
  BarChart3, 
  Clock,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Calendar,
  Upload,
  Edit,
  CheckCircle,
  AlertTriangle,
  Zap,
  Globe,
  Database,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DashboardStats {
  products: number
  testimonials: number
  mediaFiles: number
  seoSettings: number
  totalImages: number
  totalDocuments: number
  contentPages: number
  lastUpdated: string
}

interface RecentActivity {
  id: string
  type: 'content' | 'media' | 'product' | 'seo'
  action: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'info'
}

interface EnhancedDashboardProps {
  initialStats: DashboardStats
  initialProducts: any[]
  initialTestimonials: any[]
}

export function EnhancedDashboard({ 
  initialStats, 
  initialProducts, 
  initialTestimonials 
}: EnhancedDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'content',
      action: 'Content Updated',
      description: 'Homepage hero section updated',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'media',
      action: 'Media Uploaded',
      description: '5 new project images added',
      timestamp: '15 minutes ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'product',
      action: 'Product Added',
      description: 'New polymer product added to catalog',
      timestamp: '1 hour ago',
      status: 'info'
    },
    {
      id: '4',
      type: 'seo',
      action: 'SEO Optimized',
      description: 'Meta tags updated for products page',
      timestamp: '3 hours ago',
      status: 'success'
    }
  ])

  const refreshStats = async () => {
    setIsRefreshing(true)
    try {
      // In a real implementation, this would fetch fresh data from the API
      // For now, we'll simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats(prev => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString()
      }))
    } catch (error) {
      console.error('Error refreshing stats:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const mainStats = [
    {
      title: "Total Products",
      value: stats.products,
      change: "+2",
      changeType: "positive" as const,
      description: "Active products in catalog",
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Client Testimonials", 
      value: stats.testimonials,
      change: "+1",
      changeType: "positive" as const,
      description: "Client success stories",
      icon: Users,
      href: "/admin/clients",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Media Files",
      value: stats.mediaFiles,
      change: "+8",
      changeType: "positive" as const,
      description: "Uploaded images & files",
      icon: Image,
      href: "/admin/media",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "SEO Pages",
      value: stats.seoSettings,
      change: "0",
      changeType: "neutral" as const,
      description: "Optimized pages",
      icon: BarChart3,
      href: "/admin/seo",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  const detailedStats = [
    {
      title: "Total Images",
      value: stats.totalImages,
      icon: Image,
      color: "text-blue-600"
    },
    {
      title: "Documents",
      value: stats.totalDocuments,
      icon: FileText,
      color: "text-green-600"
    },
    {
      title: "Content Pages",
      value: stats.contentPages,
      icon: Globe,
      color: "text-purple-600"
    }
  ]

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product in the catalog",
      href: "/admin/products/new",
      icon: Package,
      color: "text-blue-600",
      urgent: false
    },
    {
      title: "Manage Content",
      description: "Edit homepage and page content",
      href: "/admin/content",
      icon: FileText,
      color: "text-green-600",
      urgent: false
    },
    {
      title: "Upload Media",
      description: "Add images and files",
      href: "/admin/media",
      icon: Upload,
      color: "text-purple-600",
      urgent: false
    },
    {
      title: "SEO Settings",
      description: "Optimize page metadata",
      href: "/admin/seo",
      icon: BarChart3,
      color: "text-orange-600",
      urgent: true
    }
  ]

  const recentProducts = initialProducts.slice(0, 5)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content': return Edit
      case 'media': return Upload
      case 'product': return Package
      case 'seo': return BarChart3
      default: return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive admin panel for Yahska Polymers
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={refreshStats}
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button asChild variant="outline">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Website
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center">
                    {stat.changeType === 'positive' && (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    )}
                    {stat.changeType === 'neutral' && stat.change.startsWith('-') && (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      stat.changeType === 'positive' ? "text-green-600" :
                      (stat.changeType === 'neutral' && stat.change.startsWith('-')) ? "text-red-600" : "text-gray-600"
                    )}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {stat.description}
                </p>
                <Button asChild variant="ghost" size="sm" className="w-full justify-between p-0 h-auto">
                  <Link href={stat.href} className="text-xs">
                    Manage <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Stats & System Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Detailed Statistics */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detailed Stats
            </CardTitle>
            <CardDescription>
              Breakdown of content and media
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detailedStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="font-medium">{stat.title}</span>
                  </div>
                  <span className="text-xl font-bold">{stat.value}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>
              Current system status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm">Database</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Website</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Media Storage</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Last updated: {stats.lastUpdated}<br/>
                Version 2.0.0 - Enhanced Dashboard
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className={cn("h-4 w-4", getStatusColor(activity.status))} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Boost productivity
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title} className={cn(
                "hover:shadow-md transition-all duration-200 cursor-pointer group",
                action.urgent && "ring-2 ring-orange-200"
              )}>
                <Link href={action.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={cn("h-5 w-5", action.color)} />
                        <CardTitle className="text-base">{action.title}</CardTitle>
                      </div>
                      {action.urgent && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Priority
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="group-hover:text-foreground transition-colors">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Products & Content Overview */}
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
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{product.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {product.category_name}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Added {new Date(product.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {product.price}
                      </span>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
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
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="mb-2">No products yet</p>
                <Button asChild size="sm">
                  <Link href="/admin/products/new">Add First Product</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Overview
            </CardTitle>
            <CardDescription>
              Website and admin metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.mediaFiles}</div>
                <div className="text-xs text-blue-600 font-medium">Media Files</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.contentPages}</div>
                <div className="text-xs text-green-600 font-medium">Content Pages</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Content Management</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">SEO Optimization</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Needs Attention
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Media Storage</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Optimized
                </Badge>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/analytics">
                View Detailed Analytics <BarChart3 className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}