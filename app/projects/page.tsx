"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Building2, Train, Road, Factory, Award, Users } from "lucide-react"
import Image from "next/image"
import { Footer } from "@/components/footer"

interface ProjectPhoto {
  id: number
  filename: string
  original_name: string
  file_path: string
  alt_text: string
  category: string
}

interface ClientLogo {
  id: number
  filename: string
  original_name: string
  file_path: string
  alt_text: string
}

export default function ProjectsPage() {
  const [projectPhotos, setProjectPhotos] = useState<ProjectPhoto[]>([])
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true)
        
        // Fetch project photos
        const photosResponse = await fetch('/api/admin/media?category=project-photos')
        const photosResult = await photosResponse.json()
        
        if (photosResult.success) {
          setProjectPhotos(photosResult.data)
        }
        
        // Fetch client logos
        const logosResponse = await fetch('/api/admin/media?category=client-logos')
        const logosResult = await logosResponse.json()
        
        if (logosResult.success) {
          setClientLogos(logosResult.data)
        }
        
      } catch (error) {
        console.error('Error fetching media:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  // Filter project photos
  const filteredPhotos = projectPhotos.filter(photo => {
    const matchesSearch = photo.alt_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.original_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || 
                           photo.file_path.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'metro-rail': 'Metro Rail Projects',
      'road-projects': 'Road Projects',
      'buildings-factories': 'Buildings & Factories',
      'bullet': 'Bullet Train Projects',
      'others': 'Other Projects'
    }
    return categoryMap[category] || category
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'metro-rail':
        return <Train className="h-5 w-5" />
      case 'road-projects':
        return <Road className="h-5 w-5" />
      case 'buildings-factories':
        return <Building2 className="h-5 w-5" />
      case 'bullet':
        return <Train className="h-5 w-5" />
      default:
        return <Factory className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl lg:text-5xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Project Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our extensive portfolio of successful projects across infrastructure, construction, and industrial sectors. 
              From metro rail systems to industrial facilities, we've delivered excellence across India.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="projects" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto">
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Project Portfolio
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Client Partners
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-8">
              {/* Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="metro-rail">Metro Rail Projects</SelectItem>
                    <SelectItem value="road-projects">Road Projects</SelectItem>
                    <SelectItem value="buildings-factories">Buildings & Factories</SelectItem>
                    <SelectItem value="bullet">Bullet Train Projects</SelectItem>
                    <SelectItem value="others">Other Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Project Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPhotos.map((photo) => {
                  const category = photo.file_path.split('/').pop()?.split('/')[0] || 'others'
                  const categoryName = getCategoryDisplayName(category)
                  
                  return (
                    <Card key={photo.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                      <div className="aspect-video bg-muted overflow-hidden">
                        <Image
                          src={photo.file_path}
                          alt={photo.alt_text}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {getCategoryIcon(category)}
                          <Badge variant="secondary" className="text-xs">
                            {categoryName}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {photo.alt_text}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {photo.original_name}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredPhotos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No projects found matching your criteria.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Industry Leaders</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  We're proud to work with leading companies across construction, infrastructure, and industrial sectors.
                </p>
              </div>

              {/* Client Logos Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {clientLogos.map((logo) => (
                  <Card key={logo.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square flex items-center justify-center">
                      <Image
                        src={logo.file_path}
                        alt={logo.alt_text}
                        width={120}
                        height={120}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {logo.alt_text.replace('Client logo: ', '')}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {projectPhotos.length}+
              </div>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {clientLogos.length}+
              </div>
              <p className="text-muted-foreground">Client Partners</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <p className="text-muted-foreground">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let's discuss how our chemical solutions can enhance your construction and infrastructure projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">
                Get Started Today
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <a href="/products">
                View Our Products
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
