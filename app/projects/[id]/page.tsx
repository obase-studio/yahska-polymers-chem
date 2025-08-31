"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  Building2, 
  Train, 
  Factory,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

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

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Project not found")
        } else {
          setError("Failed to load project details")
        }
        return
      }
      
      const data = await response.json()
      if (data.success) {
        setProject(data.data)
      } else {
        setError(data.error || "Failed to load project")
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setError("Failed to load project details")
    } finally {
      setLoading(false)
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
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
            
            {project.is_featured && (
              <Badge variant="default">Featured Project</Badge>
            )}
            
            <Badge variant="secondary" className="flex items-center gap-1">
              {getCategoryIcon(project.category)}
              {getCategoryName(project.category)}
            </Badge>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            {project.name}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {project.client_name && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Client: {project.client_name}</span>
              </div>
            )}
            
            {project.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
            )}
            
            {project.completion_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Completed: {new Date(project.completion_date).getFullYear()}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Images */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              {project.image_url && (
                <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={project.image_url}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Gallery Images */}
              {project.gallery_images && project.gallery_images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery_images.map((imageUrl, index) => (
                      <div key={index} className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={imageUrl}
                          alt={`${project.name} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
              
              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {project.challenges && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          Challenges
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.challenges}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {project.solutions && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Solutions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {project.solutions}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Column - Project Details */}
            <div className="space-y-6">
              
              {/* Key Features */}
              {project.key_features && project.key_features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.key_features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.client_name && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Client</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{project.client_name}</p>
                    </div>
                  )}
                  
                  {project.location && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Location</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{project.location}</p>
                    </div>
                  )}
                  
                  {project.completion_date && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Completion Date</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {new Date(project.completion_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Category</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">{getCategoryName(project.category)}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Contact CTA */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Interested in Similar Projects?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get in touch to discuss your project requirements
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}