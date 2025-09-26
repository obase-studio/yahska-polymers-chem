"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Save, X, FileText } from "lucide-react"
import { MediaPickerModal } from "@/components/admin/media-picker-modal"
import Image from "next/image"
import { getImageUrl } from "@/lib/image-utils"

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  uploaded_at: string;
}

interface SimplifiedProjectFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  loading: boolean
  isSaved?: boolean
  lastSaved?: string
  onCancel?: () => void
}

interface ProjectCategoryOption {
  value: string
  label: string
}

export function SimplifiedProjectForm({ initialData, onSubmit, loading, isSaved, lastSaved, onCancel }: SimplifiedProjectFormProps) {
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
  const [showMediaPicker, setShowMediaPicker] = useState(false)

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

  const handleImageSelect = (file: MediaFile) => {
    setFormData((prev) => ({ ...prev, image_url: file.file_path }))
    setShowMediaPicker(false)
  }

  return (
    <>
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
          <Label className="text-sm font-medium">Project Image</Label>
          <div className="space-y-3">
            {/* Image Guidelines */}
            <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded border-l-2 border-primary/20">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span className="font-medium">Recommended Dimensions:</span>
                <span>1200x800px (3:2 ratio)</span>
              </div>
              <div className="text-xs">
                High-resolution project photo showing the completed work or construction progress. Images should be clear and professional for showcase purposes.
              </div>
            </div>
            {formData.image_url ? (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Image
                        src={getImageUrl(formData.image_url)}
                        alt="Project image"
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Project Image</h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => setShowMediaPicker(true)}
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
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No image selected
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowMediaPicker(true)}
                  >
                    Select Image
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          type="submit"
          disabled={loading}
          className={isSaved ? "bg-green-600" : ""}
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : isSaved ? "Saved!" : initialData ? "Update Project" : "Create Project"}
        </Button>

        <div className="flex items-center gap-3">
          {lastSaved && (
            <div className="text-sm text-muted-foreground">
              Last saved: {lastSaved}
            </div>
          )}
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>
      </form>

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleImageSelect}
        title="Select Project Image"
        imagesOnly={true}
      />
    </>
  )
}
