"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Trash2, Eye, Copy, ExternalLink, File, ImageIcon, Loader2, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useState as useImageState } from "react"

// Enhanced Image Component with Error Handling
interface EnhancedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  filename?: string
}

function EnhancedImage({ src, alt, width, height, className, filename }: EnhancedImageProps) {
  const [loading, setLoading] = useImageState(true)
  const [error, setError] = useImageState(false)
  
  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }
  
  const handleError = () => {
    setLoading(false)
    setError(true)
  }
  
  if (error) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-muted text-muted-foreground p-4`}>
        <ImageIcon className="h-8 w-8 mb-2" />
        <p className="text-xs text-center">{filename || 'Image failed to load'}</p>
      </div>
    )
  }
  
  return (
    <div className="relative">
      {loading && (
        <div className={`${className} absolute inset-0 flex items-center justify-center bg-muted`}>
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
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
  alt_text: string
  uploaded_at: string
}

interface MediaGalleryProps {
  mediaFiles: MediaFile[]
}

// Media categories for filtering
const MEDIA_CATEGORIES = [
  { value: "all", label: "All Media" },
  { value: "client-logos", label: "Client Logos" },
  { value: "approval-logos", label: "Approval Authority Logos" },
  { value: "project-photos-metro-rail", label: "Metro Rail Projects" },
  { value: "project-photos-road-projects", label: "Road Projects" },
  { value: "project-photos-buildings-factories", label: "Buildings & Factories" },
  { value: "project-photos-bullet", label: "Bullet Train Projects" },
  { value: "project-photos-others", label: "Other Projects" }
]

export function MediaGallery({ mediaFiles }: MediaGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  // Filter media files based on search and category
  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || 
                           file.file_path.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  // Get category from file path
  const getCategoryFromPath = (filePath: string) => {
    if (filePath.includes('client-logos')) return 'Client Logos'
    if (filePath.includes('approval-logos')) return 'Approval Authority Logos'
    if (filePath.includes('project-photos/metro-rail')) return 'Metro Rail Projects'
    if (filePath.includes('project-photos/road-projects')) return 'Road Projects'
    if (filePath.includes('project-photos/buildings-factories')) return 'Buildings & Factories'
    if (filePath.includes('project-photos/bullet')) return 'Bullet Train Projects'
    if (filePath.includes('project-photos/others')) return 'Other Projects'
    return 'Other'
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Copy file path to clipboard
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

  // Delete file (placeholder for future implementation)
  const deleteFile = (fileId: number) => {
    if (confirm('Are you sure you want to delete this file?')) {
      // TODO: Implement delete functionality
      console.log('Delete file:', fileId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
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
            <SelectValue placeholder="Select category" />
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

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredFiles.length} of {mediaFiles.length} media files
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {selectedCategory === "all" ? "All Categories" : 
             MEDIA_CATEGORIES.find(c => c.value === selectedCategory)?.label}
          </span>
        </div>
      </div>

      {/* Media Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No media files found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => {
            const isImage = file.mime_type.startsWith('image/')
            const category = getCategoryFromPath(file.file_path)
            
            return (
              <Card key={file.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {category}
                    </Badge>
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
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  {/* Media Preview */}
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                    {isImage ? (
                      <EnhancedImage
                        src={file.file_path}
                        alt={file.alt_text || file.original_name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                        filename={file.original_name}
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

      {/* Media Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Media Preview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Media Display */}
                <div className="flex justify-center">
                  {selectedFile.mime_type.startsWith('image/') ? (
                    <EnhancedImage
                      src={selectedFile.file_path}
                      alt={selectedFile.alt_text || selectedFile.original_name}
                      width={600}
                      height={400}
                      className="max-w-full h-auto rounded-lg"
                      filename={selectedFile.original_name}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <File className="h-24 w-24 mx-auto mb-4" />
                      <p>Preview not available for this file type</p>
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
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteFile(selectedFile.id)}
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