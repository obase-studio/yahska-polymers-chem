"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, FileText } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"

interface ProductFormProps {
  categories: any[]
  product?: any
  isEdit?: boolean
}

export function ProductForm({ categories, product, isEdit = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
    image_url: product?.image_url || "",
    specification_pdf: product?.specification_pdf || "",
    applications: product?.applications ? JSON.parse(product.applications) : [],
    features: product?.features ? JSON.parse(product.features) : []
  })
  
  const [newApplication, setNewApplication] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const router = useRouter()

  const addApplication = () => {
    if (newApplication.trim()) {
      setFormData(prev => ({
        ...prev,
        applications: [...prev.applications, newApplication.trim()]
      }))
      setNewApplication("")
    }
  }

  const removeApplication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      applications: prev.applications.filter((_: string, i: number) => i !== index)
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_: string, i: number) => i !== index)
    }))
  }

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          specification_pdf: result.data.url
        }))
      } else {
        alert(result.error || 'Failed to upload PDF')
      }
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert('Error uploading PDF')
    } finally {
      setUploadingPdf(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/products")
        router.refresh()
      } else {
        console.error("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="e.g., ₹90/Kg"
            required
          />
        </div>
        <div className="space-y-2">
          <ImagePicker
            label="Product Image"
            value={formData.image_url}
            onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            placeholder="Select product image"
            folder="uploads"
          />
        </div>
      </div>

      {/* PDF Specification Upload */}
      <div className="space-y-4">
        <Label>Specification PDF</Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                disabled={uploadingPdf}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {uploadingPdf && (
                <div className="text-sm text-muted-foreground">Uploading...</div>
              )}
            </div>
            {formData.specification_pdf && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <a 
                  href={formData.specification_pdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Current PDF
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, specification_pdf: "" }))}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload PDF specification document (max 10MB)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter product description"
          rows={3}
          required
        />
      </div>

      {/* Applications */}
      <div className="space-y-4">
        <Label>Applications</Label>
        <div className="flex gap-2">
          <Input
            value={newApplication}
            onChange={(e) => setNewApplication(e.target.value)}
            placeholder="Add application"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addApplication())}
          />
          <Button type="button" onClick={addApplication} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.applications.map((app: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {app}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeApplication(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <Label>Key Features</Label>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add feature"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
          />
          <Button type="button" onClick={addFeature} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {feature}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFeature(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}