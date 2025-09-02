"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Image, Search, Loader2, Check, X, FolderOpen, ImageIcon, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced Image component with loading and error states
interface ImageWithFallbackProps {
  src: string
  alt: string
  filename: string
  className?: string
}

function ImageWithFallback({ src, alt, filename, className }: ImageWithFallbackProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 2

  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setError(false)
      setLoading(true)
      setRetryCount(prev => prev + 1)
    }
  }

  if (error && retryCount >= maxRetries) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-muted text-muted-foreground p-2", className)}>
        <ImageIcon className="h-8 w-8 mb-2" />
        <p className="text-xs text-center truncate w-full">{filename}</p>
        <button 
          onClick={handleRetry}
          className="text-xs text-primary hover:underline mt-1"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <img
        src={`${src}?retry=${retryCount}`}
        alt={alt}
        className={cn(className, loading ? "opacity-0" : "opacity-100")}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  )
}

interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text?: string
  uploaded_at: string
}

interface ImagePickerProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  folder?: string // For filtering images by folder
  className?: string
}

export function ImagePicker({ 
  value, 
  onChange, 
  label = "Image", 
  placeholder = "Select an image",
  folder,
  className 
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<string>(value || "")
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  // Fetch existing media files
  const fetchMediaFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const files = await response.json()
        setMediaFiles(files)
        filterFiles(files, searchQuery, folder)
      }
    } catch (error) {
      console.error('Error fetching media files:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter files based on search and folder
  const filterFiles = (files: MediaFile[], search: string, folderFilter?: string) => {
    let filtered = files.filter(file => 
      file.mime_type.startsWith('image/') // Only show image files
    )

    if (folderFilter) {
      filtered = filtered.filter(file => 
        file.file_path.toLowerCase().includes(folderFilter.toLowerCase())
      )
    }

    if (search) {
      filtered = filtered.filter(file =>
        file.original_name.toLowerCase().includes(search.toLowerCase()) ||
        file.alt_text?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sort by upload date (newest first)
    filtered.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
    
    setFilteredFiles(filtered)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterFiles(mediaFiles, query, folder)
  }

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (folder) {
        formData.append('folder', folder)
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh media files list
          await fetchMediaFiles()
          // Auto-select the newly uploaded image
          setSelectedImage(result.data.file_path)
          setTimeout(() => setUploadProgress(0), 1000)
        } else {
          alert(result.error || 'Failed to upload image')
        }
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  // Handle image selection
  const handleImageSelect = (url: string) => {
    setSelectedImage(url)
  }

  // Handle confirm selection
  const handleConfirm = () => {
    onChange(selectedImage)
    setIsOpen(false)
  }

  // Get folder categories for filtering
  const getFolderCategories = () => {
    const folders = new Set<string>()
    mediaFiles.forEach(file => {
      const pathParts = file.file_path.split('/')
      const folderPart = pathParts[pathParts.length - 2] // Get folder name
      if (folderPart && folderPart !== 'yahska-media') {
        folders.add(folderPart)
      }
    })
    return Array.from(folders).sort()
  }

  useEffect(() => {
    if (isOpen) {
      fetchMediaFiles()
    }
  }, [isOpen])

  useEffect(() => {
    filterFiles(mediaFiles, searchQuery, folder)
  }, [mediaFiles, searchQuery, folder])

  const getDisplayFileName = (url: string) => {
    if (!url) return placeholder
    const parts = url.split('/')
    return parts[parts.length - 1] || placeholder
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <div className="flex items-center gap-2">
        {value && (
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded border overflow-hidden bg-muted">
              <ImageWithFallback
                src={value}
                alt="Selected image"
                filename={getDisplayFileName(value)}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-muted-foreground truncate max-w-48">
              {getDisplayFileName(value)}
            </span>
          </div>
        )}
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Image className="h-4 w-4 mr-2" />
              {value ? 'Change Image' : 'Select Image'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Select or Upload Image</DialogTitle>
              <DialogDescription>
                Choose from existing images or upload a new one from your computer
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>

              <TabsContent value="gallery" className="space-y-4">
                {/* Search and Filter */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {!folder && (
                    <div className="flex gap-2 flex-wrap">
                      {getFolderCategories().slice(0, 4).map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          <FolderOpen className="h-3 w-3 mr-1" />
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Grid */}
                <ScrollArea className="h-96">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
                      {filteredFiles.map((file) => (
                        <Card 
                          key={file.id}
                          className={cn(
                            "cursor-pointer transition-all hover:scale-105 relative",
                            selectedImage === file.file_path ? "ring-2 ring-primary" : ""
                          )}
                          onClick={() => handleImageSelect(file.file_path)}
                        >
                          <CardContent className="p-2">
                            <div className="aspect-square relative bg-muted rounded overflow-hidden">
                              <ImageWithFallback
                                src={file.file_path}
                                alt={file.alt_text || file.original_name}
                                filename={file.original_name}
                                className="w-full h-full object-cover"
                              />
                              {selectedImage === file.file_path && (
                                <div className="absolute inset-0 bg-primary/20 rounded flex items-center justify-center">
                                  <Check className="h-6 w-6 text-primary" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-center mt-1 truncate">
                              {file.original_name}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {!loading && filteredFiles.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="mb-2">No images found</p>
                      {folder && <p className="text-sm mb-4">in folder: {folder}</p>}
                      <div className="flex gap-2 justify-center">
                        {searchQuery && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSearch("")}
                          >
                            Clear search
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={fetchMediaFiles}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <div className="space-y-2">
                      <Label htmlFor="file-upload" className="text-lg font-medium">
                        Upload Image
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Select an image file from your computer (max 10MB)
                      </p>
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="mt-4"
                      />
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                {selectedImage && (
                  <span>Selected: {getDisplayFileName(selectedImage)}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirm} 
                  disabled={!selectedImage}
                  className="min-w-20"
                >
                  Select
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}