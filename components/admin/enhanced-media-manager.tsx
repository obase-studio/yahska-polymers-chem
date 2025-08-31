"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Upload, 
  Image as ImageIcon, 
  File, 
  Trash2, 
  Eye, 
  Copy, 
  Download,
  FolderOpen,
  Grid3x3,
  List,
  Filter,
  RefreshCw,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Square,
  CheckSquare,
  Move,
  Archive,
  Tag,
  MoreHorizontal
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
  category?: string
  subcategory?: string
  uploaded_at: string
}

interface EnhancedMediaManagerProps {
  initialMediaFiles?: MediaFile[]
}

const MEDIA_CATEGORIES = [
  { value: "all", label: "All Media", icon: FolderOpen },
  { value: "project-photos", label: "Project Photos", icon: ImageIcon },
  { value: "client-logos", label: "Client Logos", icon: ImageIcon },
  { value: "approval-logos", label: "Approval Logos", icon: ImageIcon },
  { value: "homepage", label: "Homepage Images", icon: ImageIcon },
  { value: "product-images", label: "Product Images", icon: ImageIcon },
]

const PROJECT_SUBCATEGORIES = [
  "metro-rail",
  "road-projects", 
  "buildings-factories",
  "bullet",
  "others"
]

export function EnhancedMediaManager({ initialMediaFiles = [] }: EnhancedMediaManagerProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialMediaFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set())
  const [bulkActionMode, setBulkActionMode] = useState(false)
  const [isProcessingBulk, setIsProcessingBulk] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Load media files
  const loadMediaFiles = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    if (initialMediaFiles.length === 0) {
      loadMediaFiles()
    }
  }, [initialMediaFiles, loadMediaFiles])

  // Filter media files
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || 
                           file.file_path.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  // File upload handling
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
          const uploadedFile = await response.json()
          setMediaFiles(prev => [...prev, uploadedFile])
        }

        // Update progress
        const progress = ((index + 1) / files.length) * 100
        setUploadProgress(progress)
      })

      await Promise.all(uploadPromises)
      await loadMediaFiles() // Refresh the list
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Delete file
  const deleteFile = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMediaFiles(prev => prev.filter(file => file.id !== fileId))
        if (selectedFile && selectedFile.id === fileId) {
          setSelectedFile(null)
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  // Copy file path
  const copyFilePath = (filePath: string) => {
    navigator.clipboard.writeText(filePath)
  }

  // Download file
  const downloadFile = (file: MediaFile) => {
    const link = document.createElement('a')
    link.href = file.file_path
    link.download = file.original_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  // Bulk operations
  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      return newSet
    })
  }

  const selectAllFiles = () => {
    setSelectedFiles(new Set(filteredFiles.map(file => file.id)))
  }

  const deselectAllFiles = () => {
    setSelectedFiles(new Set())
  }

  const bulkDelete = async () => {
    if (selectedFiles.size === 0) return
    
    const confirmed = confirm(`Are you sure you want to delete ${selectedFiles.size} selected files?`)
    if (!confirmed) return

    setIsProcessingBulk(true)
    try {
      const deletePromises = Array.from(selectedFiles).map(fileId => 
        fetch(`/api/admin/media/${fileId}`, { method: 'DELETE' })
      )
      
      await Promise.all(deletePromises)
      
      // Remove deleted files from state
      setMediaFiles(prev => prev.filter(file => !selectedFiles.has(file.id)))
      setSelectedFiles(new Set())
      
      if (selectedFile && selectedFiles.has(selectedFile.id)) {
        setSelectedFile(null)
      }
    } catch (error) {
      console.error('Bulk delete error:', error)
    } finally {
      setIsProcessingBulk(false)
    }
  }

  const bulkMove = async (newCategory: string) => {
    if (selectedFiles.size === 0) return

    setIsProcessingBulk(true)
    try {
      const movePromises = Array.from(selectedFiles).map(fileId => 
        fetch(`/api/admin/media/${fileId}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: newCategory })
        })
      )
      
      await Promise.all(movePromises)
      await loadMediaFiles() // Refresh to show updated categories
      setSelectedFiles(new Set())
    } catch (error) {
      console.error('Bulk move error:', error)
    } finally {
      setIsProcessingBulk(false)
    }
  }

  const bulkDownload = () => {
    const selectedMediaFiles = mediaFiles.filter(file => selectedFiles.has(file.id))
    selectedMediaFiles.forEach(file => downloadFile(file))
  }

  // Sorting functionality
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.original_name.localeCompare(b.original_name)
        break
      case 'date':
        comparison = new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()
        break
      case 'size':
        comparison = a.file_size - b.file_size
        break
      case 'type':
        comparison = a.mime_type.localeCompare(b.mime_type)
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading media files...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Media Management</h1>
          <p className="text-muted-foreground">Upload, organize and manage all your media files</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadMediaFiles}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            variant="outline"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Media Files
          </CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supported formats: Images, Documents, Videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Category Selection for Upload */}
            <div className="flex items-center gap-4">
              <Label>Upload Category:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_CATEGORIES.filter(cat => cat.value !== 'all').map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload Input */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-12 w-12 text-gray-400" />
                <span className="text-lg font-medium">
                  {isUploading ? "Uploading..." : "Click to upload or drag files here"}
                </span>
                <span className="text-sm text-muted-foreground">
                  PNG, JPG, PDF, DOC up to 10MB each
                </span>
              </Label>
              
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

      {/* Bulk Actions Toolbar */}
      {selectedFiles.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedFiles.size} files selected
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={selectAllFiles}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={deselectAllFiles}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Deselect All
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select onValueChange={bulkMove}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Move to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_CATEGORIES.filter(cat => cat.value !== 'all').map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <Move className="h-4 w-4 mr-2" />
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={bulkDownload}
                  disabled={isProcessingBulk}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={bulkDelete}
                  disabled={isProcessingBulk}
                >
                  {isProcessingBulk ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-4">
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
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
        </div>
        
        {/* Advanced Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'size' | 'type') => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm">Bulk Actions:</Label>
              <Button
                size="sm"
                variant={bulkActionMode ? "default" : "outline"}
                onClick={() => setBulkActionMode(!bulkActionMode)}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                {bulkActionMode ? "Exit Selection" : "Select Mode"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <File className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{mediaFiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">
                  {mediaFiles.filter(f => f.mime_type.startsWith('image/')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Filtered</p>
                <p className="text-2xl font-bold">{filteredFiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Selected</p>
                <p className="text-2xl font-bold">{selectedFiles.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedFiles.length} of {mediaFiles.length} media files
          {selectedFiles.size > 0 && ` • ${selectedFiles.size} selected`}
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {selectedCategory === "all" ? "All Categories" : 
             MEDIA_CATEGORIES.find(c => c.value === selectedCategory)?.label}
          </span>
        </div>
      </div>

      {/* Media Grid/List */}
      {sortedFiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No media files found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        )}>
          {sortedFiles.map((file) => {
            const isImage = isImageFile(file.mime_type, file.original_name)
            const category = getCategoryFromPath(file.file_path)
            const isSelected = selectedFiles.has(file.id)
            const imageUrl = getImageUrl(file.file_path)
            const thumbnailUrl = getThumbnailUrl(file.file_path)
            
            return (
              <Card key={file.id} className={cn(
                "group hover:shadow-lg transition-all duration-300",
                isSelected && "ring-2 ring-blue-500"
              )}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {(bulkActionMode || selectedFiles.size > 0) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFileSelection(file.id)}
                          className="h-6 w-6 p-0"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedFile(file)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyFilePath(file.file_path)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadFile(file)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteFile(file.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  {/* Media Preview */}
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                    {isImage ? (
                      <Image
                        src={thumbnailUrl}
                        alt={file.alt_text || file.original_name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to original URL if thumbnail fails
                          e.currentTarget.src = imageUrl
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <File className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-xs">{file.mime_type}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm truncate" title={file.original_name}>
                      {file.original_name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {file.alt_text}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Media Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Media Display */}
                <div className="flex justify-center">
                  {isImageFile(selectedFile.mime_type, selectedFile.original_name) ? (
                    <Image
                      src={getImageUrl(selectedFile.file_path)}
                      alt={selectedFile.alt_text || selectedFile.original_name}
                      width={600}
                      height={400}
                      className="max-w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <File className="h-24 w-24 mx-auto mb-4" />
                      <p>Preview not available for this file type</p>
                      <p className="text-sm mt-2">{selectedFile.mime_type}</p>
                    </div>
                  )}
                </div>
                
                {/* File Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Filename:</span>
                    <p className="text-muted-foreground">{selectedFile.original_name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{getCategoryFromPath(selectedFile.file_path)}</p>
                  </div>
                  <div>
                    <span className="font-medium">File Size:</span>
                    <p className="text-muted-foreground">{formatFileSize(selectedFile.file_size)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Uploaded:</span>
                    <p className="text-muted-foreground">
                      {new Date(selectedFile.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground">{selectedFile.alt_text}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">File Path:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                        {selectedFile.file_path}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyFilePath(selectedFile.file_path)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => downloadFile(selectedFile)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={selectedFile.file_path} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-2 h-4 w-4" />
                      Open
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteFile(selectedFile.id)
                      setSelectedFile(null)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}