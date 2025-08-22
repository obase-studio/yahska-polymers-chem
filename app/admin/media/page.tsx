import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MediaUpload } from "@/components/admin/media-upload"
import { MediaGallery } from "@/components/admin/media-gallery"
import { dbHelpers } from "@/lib/database"

export default async function MediaPage() {
  const mediaFiles = dbHelpers.getAllMediaFiles()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media Management</h1>
        <p className="text-muted-foreground">
          Upload and manage images, documents, and other media files
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Media</CardTitle>
          <CardDescription>
            Add new images and files to your media library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaUpload />
        </CardContent>
      </Card>

      {/* Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>
            {mediaFiles.length} files in your media library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaGallery mediaFiles={mediaFiles} />
        </CardContent>
      </Card>
    </div>
  )
}