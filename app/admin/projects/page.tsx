"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Building2, Calendar, Users, MapPin } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchProjects()
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
      <div className="container mx-auto py-6">
        <div className="text-center text-sm">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
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
          <Card className="border-2 shadow-sm bg-white">
            <CardContent className="text-center py-16 px-8">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <p className="text-muted-foreground mb-6">No projects found</p>
              <Button asChild>
                <Link href="/admin/projects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="border-2 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardHeader className="px-8 pt-8 pb-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
                      <div className="flex gap-2">
                        {project.is_featured && (
                          <Badge variant="default" className="px-3 py-1">Featured</Badge>
                        )}
                        <Badge variant={project.is_active ? "secondary" : "outline"} className="px-3 py-1">
                          {project.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1">
                          {getCategoryName(project.category)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteDialog
                      triggerLabel="Delete"
                      onConfirm={() => deleteProject(project.id)}
                      icon={<Trash2 className="h-4 w-4 mr-1" />}
                      description="This action will permanently delete the project and cannot be undone."
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
                  {project.client_name && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{project.client_name}</span>
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
                {project.key_features && project.key_features.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3">Key Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.key_features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                          {feature}
                        </Badge>
                      ))}
                      {project.key_features.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
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

interface DeleteDialogProps {
  triggerLabel: string
  onConfirm: () => Promise<void>
  icon?: ReactNode
  description: string
}

function DeleteDialog({ triggerLabel, onConfirm, icon, description }: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          {icon}
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
