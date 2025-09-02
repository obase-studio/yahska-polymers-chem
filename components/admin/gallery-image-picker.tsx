"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { X, Plus, Images } from "lucide-react"
import { ImagePicker } from "./image-picker"

interface GalleryImagePickerProps {
  value: string[]
  onChange: (images: string[]) => void
  label?: string
  folder?: string
  maxImages?: number
  className?: string
}

export function GalleryImagePicker({ 
  value = [], 
  onChange, 
  label = "Gallery Images",
  folder,
  maxImages = 10,
  className 
}: GalleryImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  const addImage = (url: string) => {
    if (url && !value.includes(url) && value.length < maxImages) {
      onChange([...value, url])
      setSelectedImage("")
      setIsOpen(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const getImagePreview = (url: string, index: number) => {
    const filename = url.split('/').pop() || `Image ${index + 1}`
    return filename.length > 20 ? `${filename.substring(0, 17)}...` : filename
  }

  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      
      <div className="space-y-3">
        {/* Add Image Button */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              disabled={value.length >= maxImages}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image ({value.length}/{maxImages})
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
              <DialogDescription>
                Select an image to add to the gallery
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <ImagePicker
                value={selectedImage}
                onChange={setSelectedImage}
                folder={folder}
                placeholder="Select gallery image"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => addImage(selectedImage)} 
                disabled={!selectedImage || value.includes(selectedImage)}
              >
                {value.includes(selectedImage) ? "Already Added" : "Add Image"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Current Images */}
        {value.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {value.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="flex items-center gap-2 p-2 bg-muted rounded border">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-12 h-12 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        Gallery Image {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {getImagePreview(image, index)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {value.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Images className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No gallery images added</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Add Image" to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}