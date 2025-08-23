"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Building2, Train, Factory, Award, Users, MapPin } from "lucide-react"
import Image from "next/image"
import { Footer } from "@/components/footer"

// Fetch content via API to avoid server-only imports

interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text: string
  category: string
  subcategory: string
  uploaded_at: string
}

export default function ProjectsPage() {
  const [projectOverview, setProjectOverview] = useState("")
  const [projectCategories, setProjectCategories] = useState("")
  const [projectAchievements, setProjectAchievements] = useState("")
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchMediaFiles()
    fetchContent()
  }, [])

  const fetchMediaFiles = async () => {
    try {
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const data = await response.json()
        setMediaFiles(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching media files:', error)
    } finally {
      setLoading(false)
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
      case 'metro-rail':
        return <Train className="h-5 w-5" />
      case 'road-projects':
        return <MapPin className="h-5 w-5" />
      case 'buildings-factories':
        return <Building2 className="h-5 w-5" />
      case 'industrial':
        return <Factory className="h-5 w-5" />
      case 'awards':
        return <Award className="h-5 w-5" />
      case 'client-logos':
        return <Users className="h-5 w-5" />
      default:
        return <Building2 className="h-5 w-5" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'metro-rail':
        return 'Metro & Rail Projects'
      case 'road-projects':
        return 'Road Projects'
      case 'buildings-factories':
        return 'Buildings & Factories'
      case 'industrial':
        return 'Industrial Projects'
      case 'awards':
        return 'Awards & Recognition'
      case 'client-logos':
        return 'Client Logos'
      default:
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
    }
  }

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const projectFiles = filteredFiles.filter(file => file.category !== 'client-logos')
  const clientLogos = filteredFiles.filter(file => file.category === 'client-logos')

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
                <SelectItem value="metro-rail">Metro & Rail</SelectItem>
                <SelectItem value="road-projects">Road Projects</SelectItem>
                <SelectItem value="buildings-factories">Buildings & Factories</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="awards">Awards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={file.file_path}
                      alt={file.alt_text || file.original_name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getCategoryIcon(file.category)}
                        {getCategoryName(file.category)}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{file.alt_text || file.original_name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {new Date(file.uploaded_at).toLocaleDateString()}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Client Logos */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Clients</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {clientLogos.map((file) => (
                <Card key={file.id} className="p-4 text-center hover:shadow-md transition-shadow">
                  <div className="aspect-square relative mb-3">
                    <Image
                      src={file.file_path}
                      alt={file.alt_text || file.original_name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {file.alt_text || file.original_name}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
