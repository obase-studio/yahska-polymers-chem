"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"
import { GalleryImagePicker } from "@/components/admin/gallery-image-picker"

interface ProjectFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  loading: boolean
}

export function ProjectForm({ initialData, onSubmit, loading }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    project_info_details: initialData?.project_info_details || "",
    category: initialData?.category || "others",
    location: initialData?.location || "",
    completion_date: initialData?.completion_date ? initialData.completion_date.split('T')[0] : "",
    project_value: initialData?.project_value || 0,
    challenges: initialData?.challenges || "",
    solutions: initialData?.solutions || "",
    image_url: initialData?.image_url || "",
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true,
    sort_order: initialData?.sort_order || 0,
    key_features: initialData?.key_features || [],
    gallery_images: initialData?.gallery_images || [],
  })
  
  const [newFeature, setNewFeature] = useState("")

  const categories = [
    { value: "bullet-train", label: "High Speed Rail" },
    { value: "metro-rail", label: "Metro & Rail" },
    { value: "roads", label: "Roads & Highways" },
    { value: "buildings-factories", label: "Buildings & Factories" },
    { value: "others", label: "Other Projects" },
  ]

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        key_features: [...prev.key_features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      key_features: prev.key_features.filter((_: string, i: number) => i !== index)
    }))
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter project description"
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project_info_details">Project Information Details</Label>
          <Textarea
            id="project_info_details"
            value={formData.project_info_details}
            onChange={(e) => handleInputChange("project_info_details", e.target.value)}
            placeholder="Add supporting project information to display below the main description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter project location"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="completion_date">Completion Date</Label>
            <Input
              id="completion_date"
              type="date"
              value={formData.completion_date}
              onChange={(e) => handleInputChange("completion_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_value">Project Value (₹)</Label>
            <Input
              id="project_value"
              type="number"
              min="0"
              value={formData.project_value}
              onChange={(e) => handleInputChange("project_value", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              min="0"
              value={formData.sort_order}
              onChange={(e) => handleInputChange("sort_order", parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Key Features</h3>
        
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add key feature"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
          />
          <Button type="button" onClick={addFeature} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.key_features.map((feature: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Details</h3>
        
        <div className="space-y-2">
          <Label htmlFor="challenges">Challenges</Label>
          <Textarea
            id="challenges"
            value={formData.challenges}
            onChange={(e) => handleInputChange("challenges", e.target.value)}
            placeholder="Describe project challenges"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="solutions">Solutions</Label>
          <Textarea
            id="solutions"
            value={formData.solutions}
            onChange={(e) => handleInputChange("solutions", e.target.value)}
            placeholder="Describe solutions provided"
            rows={3}
          />
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Media</h3>
        
        <div className="space-y-2">
          <ImagePicker
            label="Main Project Image"
            value={formData.image_url}
            onChange={(url) => handleInputChange("image_url", url)}
            placeholder="Select main project image"
            folder="project-photos"
          />
        </div>

        <GalleryImagePicker
          label="Gallery Images"
          value={formData.gallery_images}
          onChange={(images) => handleInputChange("gallery_images", images)}
          folder="project-photos"
          maxImages={8}
        />
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status</h3>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
