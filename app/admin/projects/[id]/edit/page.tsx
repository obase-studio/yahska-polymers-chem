"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ProjectForm } from "@/components/admin/project-form"

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

export default function EditProject() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}`)
        const data = await response.json()
        
        if (data.success) {
          setProject(data.data)
        } else {
          alert('Project not found')
          router.push('/admin/projects')
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        alert('Failed to load project')
        router.push('/admin/projects')
      } finally {
        setInitialLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId, router])

  const handleSubmit = async (projectData: any) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        router.push('/admin/projects')
      } else {
        const errorData = await response.json()
        alert(`Failed to update project: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Project not found</p>
          <Button asChild className="mt-4">
            <Link href="/admin/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm 
            initialData={project}
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        </CardContent>
      </Card>
    </div>
  )
}