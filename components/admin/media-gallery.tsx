"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Image, File, Copy, Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

interface MediaGalleryProps {
  mediaFiles: any[]
}

export function MediaGallery({ mediaFiles }: MediaGalleryProps) {
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [editingAlt, setEditingAlt] = useState<number | null>(null)
  const [altText, setAltText] = useState("")
  const router = useRouter()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  const updateAltText = async (fileId: number) => {
    try {
      const response = await fetch(`/api/admin/media/${fileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ alt_text: altText })
      })

      if (response.ok) {
        setEditingAlt(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating alt text:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImage = (mimeType: string) => mimeType.startsWith('image/')

  if (mediaFiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
          <Image className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No media files yet</h3>
        <p className="text-muted-foreground">
          Upload your first image or document to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mediaFiles.map((file: any) => (
          <Card key={file.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* File Preview */}
              <div className="aspect-square bg-muted/50 flex items-center justify-center">
                {isImage(file.mime_type) ? (
                  <img
                    src={file.file_path}
                    alt={file.alt_text || file.original_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <File className="h-16 w-16 text-muted-foreground" />
                )}
              </div>

              {/* File Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-sm truncate" title={file.original_name}>
                    {file.original_name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file_size)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {file.mime_type.split('/')[1].toUpperCase()}
                  </Badge>
                </div>

                {/* Alt Text */}
                {isImage(file.mime_type) && (
                  <div className="space-y-2">
                    {editingAlt === file.id ? (
                      <div className="flex gap-1">
                        <Input
                          value={altText}
                          onChange={(e) => setAltText(e.target.value)}
                          placeholder="Alt text"
                          className="text-xs h-8"
                        />
                        <Button
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => updateAltText(file.id)}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate">
                          {file.alt_text || "No alt text"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setEditingAlt(file.id)
                            setAltText(file.alt_text || "")
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => copyToClipboard(file.file_path)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}