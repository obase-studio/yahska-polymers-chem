"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Building2, Calendar, Users, MapPin } from "lucide-react"

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

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/projects')
      const data = await response.json()
      
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchProjects() // Refresh the list
      } else {
        alert('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
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

  useEffect(() => {
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No projects found</p>
              <Button asChild className="mt-4">
                <Link href="/admin/projects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <div className="flex gap-2">
                        {project.is_featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        <Badge variant={project.is_active ? "secondary" : "outline"}>
                          {project.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {getCategoryName(project.category)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {project.client_name && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.client_name}</span>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.completion_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Completed: {new Date(project.completion_date).getFullYear()}</span>
                    </div>
                  )}
                </div>
                {project.key_features && project.key_features.length > 0 && (
                  <div className="mt-4">
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}