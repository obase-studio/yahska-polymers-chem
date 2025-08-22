"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, File, Image } from "lucide-react"
import { useRouter } from "next/navigation"

export function MediaUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("")
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadStatus("")

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      setUploadStatus(`Successfully uploaded ${files.length} file(s)`)
      router.refresh()
      
      // Clear the input
      e.target.value = ""
    } catch (error) {
      setUploadStatus(`Upload failed: ${error}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-muted/50 p-4 rounded-full">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-lg font-medium mb-2">Upload Media Files</div>
              <div className="text-muted-foreground mb-4">
                Choose images, documents, or other files to upload
              </div>
              <Button type="button" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Choose Files"}
              </Button>
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>
        </div>
      </div>

      {uploadStatus && (
        <div className={`p-3 rounded-md text-sm ${
          uploadStatus.includes("Successfully") 
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {uploadStatus}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p>Supported formats: Images (JPG, PNG, GIF, WebP), Documents (PDF, DOC, DOCX, TXT)</p>
        <p>Maximum file size: 10MB per file</p>
      </div>
    </div>
  )
}