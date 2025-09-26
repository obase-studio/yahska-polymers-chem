"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Trash2, Search, AlertTriangle, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CleanupResults {
  brokenMediaFiles: any[]
  brokenContentReferences: any[]
  brokenProductImages: any[]
  brokenProjectImages: any[]
  brokenCategoryImages: any[]
  validatedFiles: number
  cleanedReferences: number
  summary: {
    totalBrokenItems: number
    validatedFiles: number
    cleanedReferences: number
  }
}

export default function CleanupImagesPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CleanupResults | null>(null)
  const [lastAction, setLastAction] = useState<'scan' | 'cleanup' | null>(null)

  const runCleanup = async (dryRun: boolean) => {
    setLoading(true)
    setLastAction(dryRun ? 'scan' : 'cleanup')

    try {
      const response = await fetch('/api/admin/cleanup-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dryRun }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.data)
      } else {
        console.error('Cleanup error:', data.error)
        alert('Failed to run cleanup: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to run cleanup')
    } finally {
      setLoading(false)
    }
  }

  const renderBrokenItems = (items: any[], title: string, type: string) => {
    if (items.length === 0) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {title}
            <Badge variant="destructive">{items.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <div key={index} className="p-2 border rounded text-sm">
                <div className="font-medium">{item.name || item.filename || item.content_key}</div>
                <div className="text-muted-foreground text-xs">
                  {type === 'media' && item.file_path}
                  {type === 'content' && `${item.page} > ${item.section} (${item.content_value})`}
                  {type === 'product' && item.image_url}
                  {type === 'category' && item.icon_url}
                </div>
                <div className="text-destructive text-xs">{item.error}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Image Cleanup Tool</h1>
        <p className="text-muted-foreground mt-2">
          Scan for and clean up broken or missing image references across the CMS
        </p>
      </div>

      <div className="grid gap-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Scan for broken images or clean them up permanently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => runCleanup(true)}
                disabled={loading}
                variant="outline"
              >
                {loading && lastAction === 'scan' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Scan for Issues
              </Button>

              <Button
                onClick={() => runCleanup(false)}
                disabled={loading || !results}
                variant="destructive"
              >
                {loading && lastAction === 'cleanup' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Clean Up Broken References
              </Button>
            </div>

            {!results && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Run a scan first to identify broken image references before cleaning up.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {lastAction === 'scan' ? 'Scan Results' : 'Cleanup Results'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results.summary.validatedFiles}
                  </div>
                  <div className="text-sm text-green-700">Valid Files</div>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {results.summary.totalBrokenItems}
                  </div>
                  <div className="text-sm text-red-700">Broken References</div>
                </div>

                {lastAction === 'cleanup' && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.summary.cleanedReferences}
                    </div>
                    <div className="text-sm text-blue-700">Cleaned Up</div>
                  </div>
                )}
              </div>

              {results.summary.totalBrokenItems > 0 && (
                <Tabs defaultValue="media" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="media">
                      Media Files ({results.brokenMediaFiles.length})
                    </TabsTrigger>
                    <TabsTrigger value="content">
                      Content ({results.brokenContentReferences.length})
                    </TabsTrigger>
                    <TabsTrigger value="products">
                      Products ({results.brokenProductImages.length})
                    </TabsTrigger>
                    <TabsTrigger value="categories">
                      Categories ({results.brokenCategoryImages.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="media" className="mt-4">
                    {renderBrokenItems(results.brokenMediaFiles, "Broken Media Files", "media")}
                  </TabsContent>

                  <TabsContent value="content" className="mt-4">
                    {renderBrokenItems(results.brokenContentReferences, "Broken Content References", "content")}
                  </TabsContent>

                  <TabsContent value="products" className="mt-4">
                    {renderBrokenItems(results.brokenProductImages, "Broken Product Images", "product")}
                  </TabsContent>

                  <TabsContent value="categories" className="mt-4">
                    {renderBrokenItems(results.brokenCategoryImages, "Broken Category Icons", "category")}
                  </TabsContent>
                </Tabs>
              )}

              {results.summary.totalBrokenItems === 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No broken image references found! All images are working properly.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}