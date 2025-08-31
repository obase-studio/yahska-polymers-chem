"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Image as ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { MediaPickerModal } from "./media-picker-modal"
import { getImageUrl } from "@/lib/image-utils"

interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text: string
  uploaded_at: string
}

interface ContentEditorWithMediaProps {
  page: string
  section: {
    id: string
    title: string
    description: string
    fields: Array<{
      key: string
      label: string
      type: 'text' | 'textarea' | 'image'
    }>
  }
}

export function ContentEditorWithMedia({ section, page }: ContentEditorWithMediaProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [pageImages, setPageImages] = useState<Record<string, MediaFile | null>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>('')
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [currentImageField, setCurrentImageField] = useState<string | null>(null)

  useEffect(() => {
    loadContent()
    loadPageImages()
  }, [section.id, page])

  const loadContent = async () => {
    try {
      const response = await fetch(`/api/admin/content?page=${page}&section=${section.id}`)
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

  const loadPageImages = async () => {
    // Load images for image fields
    const imageFields = section.fields.filter(field => field.type === 'image')
    if (imageFields.length === 0) return

    try {
      const promises = imageFields.map(async (field) => {
        const response = await fetch(`/api/admin/page-images?page=${page}&section=${field.key}`)
        if (response.ok) {
          const imageData = await response.json()
          return { key: field.key, image: imageData?.media_files || null }
        }
        return { key: field.key, image: null }
      })

      const results = await Promise.all(promises)
      const imageMap: Record<string, MediaFile | null> = {}
      results.forEach(({ key, image }) => {
        imageMap[key] = image
      })
      setPageImages(imageMap)
    } catch (error) {
      console.error("Error loading page images:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Save text content
      const textPromises = Object.entries(formData).map(([key, value]) => {
        const payload = {
          page,
          section: section.id,
          content_key: key,
          content_value: value
        }
        return fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      })

      const responses = await Promise.all(textPromises)
      const allSuccessful = responses.every(response => response.ok)
      
      if (allSuccessful) {
        const timestamp = new Date().toLocaleTimeString()
        setLastSaved(timestamp)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
        
        // Notify sync system
        try {
          await fetch('/api/sync/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page }),
            cache: 'no-store'
          })
        } catch (e) {
          console.log('Sync notification attempt completed')
        }
      } else {
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

  const handleImageSelect = async (file: MediaFile) => {
    if (!currentImageField) return

    try {
      const response = await fetch('/api/admin/page-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          section: currentImageField,
          media_file_id: file.id
        })
      })

      if (response.ok) {
        setPageImages(prev => ({
          ...prev,
          [currentImageField]: file
        }))
        setCurrentImageField(null)
        setShowMediaPicker(false)
      }
    } catch (error) {
      console.error('Error setting page image:', error)
    }
  }

  const handleRemoveImage = async (fieldKey: string) => {
    try {
      const response = await fetch(`/api/admin/page-images?page=${page}&section=${fieldKey}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPageImages(prev => ({
          ...prev,
          [fieldKey]: null
        }))
      }
    } catch (error) {
      console.error('Error removing page image:', error)
    }
  }

  return (
    <>
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

            {field.type === 'image' && (
              <div className="space-y-3">
                {pageImages[field.key] ? (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Image
                            src={getImageUrl(pageImages[field.key]!.file_path)}
                            alt={pageImages[field.key]!.alt_text || pageImages[field.key]!.original_name}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => handleRemoveImage(field.key)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{pageImages[field.key]!.original_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pageImages[field.key]!.alt_text}
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              setCurrentImageField(field.key)
                              setShowMediaPicker(true)
                            }}
                          >
                            Change Image
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">No image selected</p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentImageField(field.key)
                          setShowMediaPicker(true)
                        }}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Browse Media
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
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

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => {
          setShowMediaPicker(false)
          setCurrentImageField(null)
        }}
        onSelect={handleImageSelect}
        title="Select Image"
        imagesOnly={true}
      />
    </>
  )
}