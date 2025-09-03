"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Save, X } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"

interface SimplifiedProjectFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  loading: boolean
  onCancel?: () => void
}

export function SimplifiedProjectForm({ initialData, onSubmit, loading, onCancel }: SimplifiedProjectFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "others",
    key_features: initialData?.key_features ? 
      (typeof initialData.key_features === 'string' ? initialData.key_features : initialData.key_features.join(', ')) : "",
    image_url: initialData?.image_url || "",
  })

  const categories = [
    { value: "bullet-train", label: "High Speed Rail" },
    { value: "metro-rail", label: "Metro & Rail" },
    { value: "roads", label: "Roads & Highways" },
    { value: "buildings-factories", label: "Buildings & Factories" },
    { value: "others", label: "Other Projects" },
  ]

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
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="border-2 shadow-sm bg-white">
          <CardHeader className="px-8 pt-8 pb-6">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              Project Information
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed mt-2">
              Enter the basic details about the project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
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
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a category" />
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
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="border-2 shadow-sm bg-white">
          <CardHeader className="px-8 pt-8 pb-6">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              Project Image
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed mt-2">
              Upload a representative image for this project
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-2">
              <ImagePicker
                label="Project Image"
                value={formData.image_url}
                onChange={(url) => handleInputChange("image_url", url)}
                placeholder="Select project image"
                folder="projects"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <Card className="border-2 shadow-sm bg-white">
          <CardContent className="px-8 py-8">
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
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
