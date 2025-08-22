"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

interface ContentEditorProps {
  section: {
    id: string
    title: string
    description: string
    fields: Array<{
      key: string
      label: string
      type: 'text' | 'textarea' | 'rich_text'
    }>
  }
}

export function ContentEditor({ section }: ContentEditorProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Load existing content
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/admin/content?page=home&section=${section.id}`)
        if (response.ok) {
          const content = await response.json()
          const contentMap: Record<string, string> = {}
          content.forEach((item: any) => {
            contentMap[item.content_key] = item.content_value || ""
          })
          setFormData(contentMap)
        }
      } catch (error) {
        console.error("Error loading content:", error)
      }
    }

    loadContent()
  }, [section.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const promises = Object.entries(formData).map(([key, value]) =>
        fetch("/api/admin/content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: "home",
            section: section.id,
            content_key: key,
            content_value: value
          }),
        })
      )

      await Promise.all(promises)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error("Error saving content:", error)
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
          
          {(field.type === 'textarea' || field.type === 'rich_text') && (
            <Textarea
              id={`${section.id}-${field.key}`}
              value={formData[field.key] || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.label}
              rows={field.type === 'rich_text' ? 6 : 3}
            />
          )}
        </div>
      ))}

      <Button type="submit" disabled={isLoading} className={isSaved ? "bg-green-600" : ""}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save Content"}
      </Button>
    </form>
  )
}