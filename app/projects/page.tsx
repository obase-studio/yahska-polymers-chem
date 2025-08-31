"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Building2, Train, Factory, Award, Users, MapPin } from "lucide-react"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

// Fetch content via API to avoid server-only imports

interface Project {
  id: number
  name: string
  description: string
  category: string
  location: string
  client_name: string
  completion_date: string
  project_value: number
  key_features: string[]
  challenges: string
  solutions: string
  image_url: string
  gallery_images: string[]
  is_featured: boolean
  is_active: boolean
  sort_order: number
}

export default function ProjectsPage() {
  const [projectOverview, setProjectOverview] = useState("")
  const [projectCategories, setProjectCategories] = useState("")
  const [projectAchievements, setProjectAchievements] = useState("")
  
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchProjects()
    fetchCategories()
    fetchContent()
  }, [selectedCategory, searchTerm])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.set('category', selectedCategory)
      if (searchTerm) params.set('search', searchTerm)
      
      const response = await fetch(`/api/projects?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCategories(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content?page=projects')
      const data = await res.json()
      if (data.success) {
        const items = data.data.content as Array<any>
        setProjectOverview(items.find((i) => i.section === 'project_overview' && i.content_key === 'content')?.content_value || '')
        setProjectCategories(items.find((i) => i.section === 'categories' && i.content_key === 'content')?.content_value || '')
        setProjectAchievements(items.find((i) => i.section === 'achievements' && i.content_key === 'content')?.content_value || '')
      }
    } catch (e) {
      // ignore
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bullet-train':
        return <Train className="h-5 w-5" />
      case 'metro-rail':
        return <Train className="h-5 w-5" />
      case 'roads':
        return <MapPin className="h-5 w-5" />
      case 'buildings-factories':
        return <Building2 className="h-5 w-5" />
      case 'others':
        return <Factory className="h-5 w-5" />
      default:
        return <Building2 className="h-5 w-5" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'bullet-train':
        return 'High Speed Rail'
      case 'metro-rail':
        return 'Metro & Rail'
      case 'roads':
        return 'Roads & Highways'
      case 'buildings-factories':
        return 'Buildings & Factories'
      case 'others':
        return 'Other Projects'
      default:
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>
            Our Project Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {projectOverview || 'Showcasing our expertise across diverse industrial and infrastructure projects'}
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="bullet-train">High Speed Rail</SelectItem>
                <SelectItem value="metro-rail">Metro & Rail</SelectItem>
                <SelectItem value="roads">Roads & Highways</SelectItem>
                <SelectItem value="buildings-factories">Buildings & Factories</SelectItem>
                <SelectItem value="others">Other Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
            {projects.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found matching your criteria.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getCategoryIcon(project.category)}
                        {getCategoryName(project.category)}
                      </Badge>
                    </div>
                    {project.is_featured && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="default" className="bg-primary/90">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{project.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                          {project.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {project.client_name && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Client:</span>
                            <span className="font-medium">{project.client_name}</span>
                          </div>
                        )}
                        
                        {project.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{project.location}</span>
                          </div>
                        )}
                        
                        {project.completion_date && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Completed:</span>
                            <span className="font-medium">
                              {new Date(project.completion_date).getFullYear()}
                            </span>
                          </div>
                        )}
                      </div>

                      {project.key_features && project.key_features.length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="text-sm font-medium mb-2">Key Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.key_features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {project.key_features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.key_features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-colors">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Client Section - Show unique client names from projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Our Clients</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...new Set(projects.filter(p => p.client_name).map(p => p.client_name))].slice(0, 12).map((clientName, index) => (
                  <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center h-16 mb-2">
                      <Users className="h-8 w-8 text-primary/60" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {clientName}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
