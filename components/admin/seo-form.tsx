"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

interface SEOFormProps {
  page: string
  currentSEO?: any
}

export function SEOForm({ page, currentSEO }: SEOFormProps) {
  const [formData, setFormData] = useState({
    title: currentSEO?.title || "",
    description: currentSEO?.description || "",
    keywords: currentSEO?.keywords || "",
    og_title: currentSEO?.og_title || "",
    og_description: currentSEO?.og_description || "",
    og_image: currentSEO?.og_image || "",
    canonical_url: currentSEO?.canonical_url || ""
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, ...formData }),
      })

      if (response.ok) {
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
      }
    } catch (error) {
      console.error("Error saving SEO settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`title-${page}`}>Meta Title</Label>
          <Input
            id={`title-${page}`}
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Page title for search results"
          />
          <p className="text-xs text-muted-foreground">
            {formData.title.length}/60 characters (recommended)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`keywords-${page}`}>Keywords</Label>
          <Input
            id={`keywords-${page}`}
            value={formData.keywords}
            onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${page}`}>Meta Description</Label>
        <Textarea
          id={`description-${page}`}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Page description for search results"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {formData.description.length}/160 characters (recommended)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`og_title-${page}`}>Open Graph Title</Label>
          <Input
            id={`og_title-${page}`}
            value={formData.og_title}
            onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
            placeholder="Title for social sharing"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`og_image-${page}`}>Open Graph Image</Label>
          <Input
            id={`og_image-${page}`}
            value={formData.og_image}
            onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
            placeholder="Image URL for social sharing"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`og_description-${page}`}>Open Graph Description</Label>
        <Textarea
          id={`og_description-${page}`}
          value={formData.og_description}
          onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
          placeholder="Description for social sharing"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`canonical_url-${page}`}>Canonical URL</Label>
        <Input
          id={`canonical_url-${page}`}
          value={formData.canonical_url}
          onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
          placeholder="https://yahskapolymers.com/..."
        />
      </div>

      <Button type="submit" disabled={isLoading} className={isSaved ? "bg-green-600" : ""}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save SEO Settings"}
      </Button>
    </form>
  )
}