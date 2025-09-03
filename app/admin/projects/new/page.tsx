"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { SimplifiedProjectForm } from "@/components/admin/simplified-project-form"

export default function NewProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (projectData: any) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        router.push('/admin/projects')
      } else {
        const errorData = await response.json()
        alert(`Failed to create project: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
          <p className="text-muted-foreground mt-2">
            Create a new project in your portfolio
          </p>
        </div>
      </div>

      <SimplifiedProjectForm 
        onSubmit={handleSubmit} 
        loading={loading} 
        onCancel={() => router.push('/admin/projects')}
      />
    </div>
  )
}