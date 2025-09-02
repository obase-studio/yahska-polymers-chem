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
      
      {/* Breadcrumb */}
      <section className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-foreground">
              Projects
            </Link>
            <span>/</span>
            <span className="text-foreground">{project.name}</span>
          </nav>
        </div>
      </section>

      {/* Project Header */}
      <section className="py-12 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getCategoryIcon(project.category)}
                  {getCategoryName(project.category)}
                </Badge>
                {project.is_featured && (
                  <Badge variant="default">Featured Project</Badge>
                )}
              </div>
              <h1
                className="text-4xl lg:text-5xl font-black text-foreground mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {project.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
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

              {/* Project Info Text Block */}
              <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-2">Project Information</h4>
                <p className="text-sm text-muted-foreground">
                  Project information will be updated soon.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              {project.image_url ? (
                <div className="w-full h-full relative min-h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={project.image_url}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Building2 className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Project Image</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Coming Soon</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Key Features */}
            {project.key_features && project.key_features.length > 0 && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="text-primary">Key Features</CardTitle>
                  <p className="text-muted-foreground text-sm">What makes this project special</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.key_features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Project Information */}
            <Card className="py-6">
              <CardHeader>
                <CardTitle className="text-primary">Project Information</CardTitle>
                <p className="text-muted-foreground text-sm">Essential project details</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.client_name && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-foreground">Client: </span>
                        <span className="text-muted-foreground">{project.client_name}</span>
                      </div>
                    </div>
                  )}
                  
                  {project.location && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-foreground">Location: </span>
                        <span className="text-muted-foreground">{project.location}</span>
                      </div>
                    </div>
                  )}
                  
                  {project.completion_date && (
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-foreground">Completed: </span>
                        <span className="text-muted-foreground">
                          {new Date(project.completion_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-foreground">Category: </span>
                      <span className="text-muted-foreground">{getCategoryName(project.category)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Challenges */}
            {project.challenges && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">
                    Challenges
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Project challenges addressed
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.challenges}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Solutions */}
            {project.solutions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Solutions</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    How we solved the challenges
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.solutions}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Gallery Images */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Project Gallery
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Additional project images
                  </p>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Need a Similar Project?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our project management and technical teams can help you deliver
            complex infrastructure projects on time and within budget.
          </p>
          <div className="text-center">
            <p className="text-lg opacity-90">
              For similar project inquiries, please <Link href="/contact" className="underline hover:text-primary-foreground/80">contact us</Link>
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}