"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, EyeOff, Image as ImageIcon, Link as LinkIcon, Undo2, History } from "lucide-react"
import { useRouter } from "next/navigation"

interface ContentEditorProps {
  section: {
    id: string
    title: string
    description: string
    fields: Array<{
      key: string
      label: string
      type: 'text' | 'textarea' | 'rich_text' | 'number' | 'select' | 'image' | 'link' | 'boolean'
      options?: string[]
      placeholder?: string
      help?: string
    }>
  }
}

export function ContentEditor({ section }: ContentEditorProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [contentHistory, setContentHistory] = useState<Record<string, any>[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load existing content
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/admin/content?page=home&section=${section.id}`)
        if (response.ok) {
          const content = await response.json()
          const contentMap: Record<string, any> = {}
          content.forEach((item: any) => {
            contentMap[item.content_key] = item.content_value || ""
          })
          setFormData(contentMap)
          
          // Load content history
          loadContentHistory()
        }
      } catch (error) {
        console.error("Error loading content:", error)
      }
    }

    loadContent()
  }, [section.id])

  const loadContentHistory = async () => {
    try {
      const response = await fetch(`/api/admin/content/history?page=home&section=${section.id}`)
      if (response.ok) {
        const history = await response.json()
        setContentHistory(history.data || [])
      }
    } catch (error) {
      console.error("Error loading content history:", error)
    }
  }

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
      
      // Reload content history
      loadContentHistory()
      
      // Refresh the page to show updated content
      router.refresh()
    } catch (error) {
      console.error("Error saving content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (key: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'content')

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        handleFieldChange(key, result.data.file_path)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const renderField = (field: any) => {
    const fieldId = `${section.id}-${field.key}`
    const value = formData[field.key] || ""

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.label}
          />
        )

      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.label}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.label}
            rows={4}
          />
        )

      case 'rich_text':
        return (
          <div className="space-y-2">
            <Textarea
              id={fieldId}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder || field.label}
              rows={8}
              className="font-mono text-sm"
            />
            <div className="text-xs text-muted-foreground">
              Supports basic HTML tags: &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;
            </div>
          </div>
        )

      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.key, val)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'image':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id={fieldId}
                value={value}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                placeholder="Image URL or path"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`${fieldId}-upload`)?.click()}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <input
              id={`${fieldId}-upload`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(field.key, file)
              }}
            />
            {value && (
              <div className="mt-2">
                <img src={value} alt="Preview" className="max-w-xs h-auto rounded border" />
              </div>
            )}
          </div>
        )

      case 'link':
        return (
          <div className="space-y-2">
            <Input
              id={fieldId}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder || "https://example.com"}
            />
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <LinkIcon className="h-3 w-3" />
                Test Link
              </a>
            )}
          </div>
        )

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              id={fieldId}
              type="checkbox"
              checked={value === "true" || value === true}
              onChange={(e) => handleFieldChange(field.key, e.target.checked.toString())}
              className="rounded border-gray-300"
            />
            <Label htmlFor={fieldId} className="text-sm">
              {field.help || "Enable this option"}
            </Label>
          </div>
        )

      default:
        return (
          <Input
            id={fieldId}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder || field.label}
          />
        )
    }
  }

  const restoreFromHistory = (historyItem: any) => {
    if (confirm('Are you sure you want to restore this version? Current changes will be lost.')) {
      setFormData(historyItem.content_data)
    }
  }

  return (
    <div className="space-y-6">
      {/* Preview Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>

        {/* Content History */}
        {contentHistory.length > 0 && (
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {contentHistory.length} version{contentHistory.length !== 1 ? 's' : ''} available
            </span>
          </div>
        )}
      </div>

      {/* Content History */}
      {contentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Content History</CardTitle>
            <CardDescription>Previous versions of this content section</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contentHistory.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="text-sm">
                    <span className="font-medium">{new Date(item.updated_at).toLocaleString()}</span>
                    <span className="text-muted-foreground ml-2">by {item.updated_by || 'Admin'}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => restoreFromHistory(item)}
                  >
                    <Undo2 className="h-4 w-4 mr-1" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {section.fields.map((field) => (
          <div key={field.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${section.id}-${field.key}`} className="text-base font-medium">
                {field.label}
              </Label>
              <Badge variant="outline" className="text-xs">
                {field.type}
              </Badge>
            </div>
            
            {renderField(field)}
            
            {field.help && (
              <p className="text-sm text-muted-foreground">{field.help}</p>
            )}
          </div>
        ))}

        <div className="flex items-center gap-4 pt-4 border-t">
          <Button type="submit" disabled={isLoading} className={isSaved ? "bg-green-600" : ""}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save Content"}
          </Button>
          
          {isSaved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              ✓ Content saved successfully
            </span>
          )}
        </div>
      </form>

      {/* Content Preview */}
      {showPreview && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Content Preview</CardTitle>
            <CardDescription>How this content will appear on the website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {section.fields.map((field) => {
                const value = formData[field.key]
                if (!value) return null

                return (
                  <div key={field.key} className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {field.label}:
                    </h4>
                    <div className="p-3 bg-muted rounded">
                      {field.type === 'image' ? (
                        <img src={value} alt={field.label} className="max-w-xs h-auto rounded" />
                      ) : field.type === 'rich_text' ? (
                        <div dangerouslySetInnerHTML={{ __html: value }} />
                      ) : (
                        <p>{value}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}