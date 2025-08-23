"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

interface ContentEditorProps {
  page: string
  section: {
    id: string
    title: string
    description: string
    fields: Array<{
      key: string
      label: string
      type: 'text' | 'textarea'
    }>
  }
}

export function ContentEditor({ section, page }: ContentEditorProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('')

  useEffect(() => {
    // Load existing content
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/admin/content?page=${page}&section=${section.id}`)
        if (response.ok) {
          const content = await response.json()
          console.log('Content editor - Loaded content for', page, section.id, ':', content)
          const contentMap: Record<string, string> = {}
          content.forEach((item: any) => {
            contentMap[item.content_key] = item.content_value || ""
          })
          setFormData(contentMap)
          console.log('Content editor - Form data:', contentMap)
        }
      } catch (error) {
        console.error("Error loading content:", error)
      }
    }

    loadContent()
  }, [section.id, page])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const promises = Object.entries(formData).map(([key, value]) => {
        const payload = {
          page,
          section: section.id,
          content_key: key,
          content_value: value
        };
        console.log('Saving content:', payload);
        return fetch("/api/admin/content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      })

      const responses = await Promise.all(promises)
      
      // Check if all saves were successful
      const allSuccessful = responses.every(response => response.ok)
      
      if (allSuccessful) {
        console.log('All content saved successfully')
        const timestamp = new Date().toLocaleTimeString()
        setLastSaved(timestamp)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
        
        // Notify sync system that content was updated
        try {
          await fetch('/api/sync/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page }),
            cache: 'no-store'
          })
          console.log('Admin - Sync notification sent')
        } catch (e) {
          console.log('Admin - Sync notification attempt completed')
        }
      } else {
        console.error('Some saves failed')
        alert('Some content failed to save. Please try again.')
      }
    } catch (error) {
      console.error("Error saving content:", error)
      alert('Error saving content: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {section.fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={`${section.id}-${field.key}`}>{field.label}</Label>
          
          {field.type === 'text' && (
            <Input
              id={`${section.id}-${field.key}`}
              value={formData[field.key] || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.label}
            />
          )}
          
          {field.type === 'textarea' && (
            <Textarea
              id={`${section.id}-${field.key}`}
              value={formData[field.key] || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.label}
              rows={4}
            />
          )}
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Button type="submit" disabled={isLoading} className={isSaved ? "bg-green-600" : ""}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save Content"}
        </Button>
        
        {lastSaved && (
          <div className="text-sm text-muted-foreground">
            Last saved: {lastSaved}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => window.open(`/${page}`, '_blank')}
            >
              View Page
            </Button>
          </div>
        )}
      </div>
    </form>
  )
}