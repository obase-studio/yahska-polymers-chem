"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Image as ImageIcon, 
  File, 
  X,
  CheckCircle,
  Upload,
  Grid3x3,
  List,
  Filter
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getImageUrl, getThumbnailUrl, isImageFile, formatFileSize } from "@/lib/image-utils"

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

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (file: MediaFile) => void
  title?: string
  imagesOnly?: boolean
}

const MEDIA_CATEGORIES = [
  { value: "all", label: "All Media" },
  { value: "project-photos", label: "Project Photos" },
  { value: "client-logos", label: "Client Logos" },
  { value: "approval-logos", label: "Approval Logos" },
  { value: "homepage", label: "Homepage Images" },
  { value: "product-images", label: "Product Images" },
]

export function MediaPickerModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  title = "Select Media File",
  imagesOnly = false
}: MediaPickerModalProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [showUploadTab, setShowUploadTab] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [urlInput, setUrlInput] = useState("")

  // Load media files when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMediaFiles()
    }
  }, [isOpen])

  const loadMediaFiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const files = await response.json()
        setMediaFiles(files)
      }
    } catch (error) {
      console.error('Error loading media files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter media files
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || 
                           file.file_path.includes(selectedCategory)
    
    const matchesType = !imagesOnly || isImageFile(file.mime_type, file.original_name)
    
    return matchesSearch && matchesCategory && matchesType
  })

  // Get category from path
  const getCategoryFromPath = (filePath: string) => {
    if (filePath.includes('client-logos')) return 'Client Logos'
    if (filePath.includes('approval-logos')) return 'Approval Logos'
    if (filePath.includes('project-photos/metro-rail')) return 'Metro Rail'
    if (filePath.includes('project-photos/road-projects')) return 'Road Projects'
    if (filePath.includes('project-photos/buildings-factories')) return 'Buildings & Factories'
    if (filePath.includes('project-photos/bullet')) return 'Bullet Train'
    if (filePath.includes('project-photos/others')) return 'Other Projects'
    if (filePath.includes('homepage')) return 'Homepage'
    if (filePath.includes('product-images')) return 'Product Images'
    return 'Other'
  }

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile)
      onClose()
    }
  }

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', selectedCategory === 'all' ? 'uploads' : selectedCategory)

        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          const newFile = result.file
          setMediaFiles(prev => [newFile, ...prev])
          
          // Auto-select the uploaded file if only one file was uploaded
          if (files.length === 1) {
            setSelectedFile(newFile)
          }
        }

        // Update progress
        const progress = ((index + 1) / files.length) * 100
        setUploadProgress(progress)
      })

      await Promise.all(uploadPromises)
      setShowUploadTab(false)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading files. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle URL upload
  const handleUrlUpload = async () => {
    if (!urlInput.trim()) return

    setIsUploading(true)
    setUploadProgress(50)

    try {
      const formData = new FormData()
      formData.append('url', urlInput.trim())
      formData.append('category', selectedCategory === 'all' ? 'uploads' : selectedCategory)

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        const newFile = result.file
        setMediaFiles(prev => [newFile, ...prev])
        setSelectedFile(newFile)
        setUrlInput("")
        setShowUploadTab(false)
        setUploadProgress(100)
      } else {
        const error = await response.json()
        alert(`Upload failed: ${error.error}`)
      }
    } catch (error) {
      console.error('URL upload error:', error)
      alert('Error uploading from URL. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {imagesOnly ? 'Select an image file' : 'Select a media file'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={showUploadTab ? "default" : "outline"}
              size="sm" 
              onClick={() => setShowUploadTab(!showUploadTab)}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {showUploadTab ? "Browse Existing" : "Upload New"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search media files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {filteredFiles.length} files available
            </p>
            {selectedFile && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                <span className="text-sm font-medium">{selectedFile.original_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Media Grid / Upload Interface */}
        <div className="flex-1 overflow-y-auto p-6">
          {showUploadTab ? (
            /* Upload Interface */
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-2">Upload New Media</h4>
                <p className="text-sm text-muted-foreground">Upload files from your computer or paste a URL</p>
              </div>

              {/* File Upload */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h5 className="font-medium">Upload from Computer</h5>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Input
                        type="file"
                        multiple
                        accept={imagesOnly ? "image/*" : "image/*,video/*,.pdf,.doc,.docx"}
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-12 w-12 text-gray-400" />
                        <span className="text-lg font-medium">
                          {isUploading ? "Uploading..." : "Click to upload or drag files here"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {imagesOnly ? "PNG, JPG, GIF, WebP" : "Images, Videos, Documents"} up to 10MB each
                        </span>
                      </label>
                      
                      {isUploading && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{uploadProgress.toFixed(0)}% uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* URL Upload */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h5 className="font-medium">Upload from URL</h5>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        disabled={isUploading}
                      />
                      <Button 
                        onClick={handleUrlUpload}
                        disabled={!urlInput.trim() || isUploading}
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Existing Media Grid */
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading media files...</p>
                  </div>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No media files found</p>
                  <Button variant="outline" onClick={loadMediaFiles}>
                    <Upload className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ) : (
            <div className={cn(
              "grid gap-4",
              viewMode === 'grid' 
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
                : "grid-cols-1"
            )}>
              {filteredFiles.map((file) => {
                const isImage = isImageFile(file.mime_type, file.original_name)
                const category = getCategoryFromPath(file.file_path)
                const isSelected = selectedFile?.id === file.id
                const thumbnailUrl = getThumbnailUrl(file.file_path)
                
                return (
                  <Card
                    key={file.id}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all duration-200 relative",
                      isSelected && "ring-2 ring-blue-500 shadow-md"
                    )}
                    onClick={() => setSelectedFile(file)}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-blue-600 rounded-full p-1">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-3">
                      {/* Media Preview */}
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                        {isImage ? (
                          <Image
                            src={thumbnailUrl}
                            alt={file.alt_text || file.original_name}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <File className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-xs">{file.mime_type}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className="space-y-1">
                        <h4 className="font-medium text-xs truncate" title={file.original_name}>
                          {file.original_name}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatFileSize(file.file_size)}</span>
                          <span className="text-xs px-1 py-0.5 bg-gray-100 rounded">
                            {category}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              {selectedCategory === "all" ? "All Categories" : 
               MEDIA_CATEGORIES.find(c => c.value === selectedCategory)?.label}
            </span>
            {imagesOnly && <span>• Images only</span>}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSelect} 
              disabled={!selectedFile}
            >
              Select File
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}