"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"

interface SimplifiedProjectFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  loading: boolean
  onCancel?: () => void
}

interface ProjectCategoryOption {
  value: string
  label: string
}

export function SimplifiedProjectForm({ initialData, onSubmit, loading, onCancel }: SimplifiedProjectFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    project_info_details: initialData?.project_info_details || "",
    category: initialData?.category || "",
    key_features: initialData?.key_features ? 
      (typeof initialData.key_features === 'string' ? initialData.key_features : initialData.key_features.join(', ')) : "",
    image_url: initialData?.image_url || "",
  })
  const [categories, setCategories] = useState<ProjectCategoryOption[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch('/api/admin/project-categories')
        const result = await response.json()

        if (result.success && Array.isArray(result.data)) {
          const formatted: ProjectCategoryOption[] = result.data.map((category: any) => ({
            value: category.id,
            label: category.name,
          }))
          // Sort alphabetically by label for predictable ordering when sort_order is absent
          formatted.sort((a, b) => a.label.localeCompare(b.label))
          setCategories(formatted)
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error('Failed to load project categories:', error)
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (categories.length === 0) {
      return
    }

    setFormData((prev) => {
      if (prev.category && categories.some((cat) => cat.value === prev.category)) {
        return prev
      }

      return {
        ...prev,
        category: categories[0].value,
      }
    })
  }, [categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert key_features back to array format for backend
    const submitData = {
      ...formData,
      key_features: formData.key_features
        .split(',')
        .map((f: string) => f.trim())
        .filter((f: string) => f.length > 0)
    }
    
    onSubmit(submitData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter project name"
              className="h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Project Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              disabled={categoriesLoading || categories.length === 0}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter project description"
            rows={4}
            className="resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project_info_details" className="text-sm font-medium">Project Information Details</Label>
          <Textarea
            id="project_info_details"
            value={formData.project_info_details}
            onChange={(e) => handleInputChange("project_info_details", e.target.value)}
            placeholder="Enter supporting project information to show below the description"
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="key_features" className="text-sm font-medium">Key Features & Highlights</Label>
          <Textarea
            id="key_features"
            value={formData.key_features}
            onChange={(e) => handleInputChange("key_features", e.target.value)}
            placeholder="Enter key features and highlights separated by commas (e.g., High durability, Weather resistant, Fast setting)"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple features with commas. These will be displayed as badges on the project card.
          </p>
        </div>

        <div className="space-y-2">
          <ImagePicker
            label="Project Image"
            value={formData.image_url}
            onChange={(url) => handleInputChange("image_url", url)}
            placeholder="Select project image"
            folder="projects"
            recommendedDimensions="1200x800px (3:2 ratio)"
            imageGuidelines="High-resolution project photo showing the completed work or construction progress. Images should be clear and professional for showcase purposes."
          />
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
