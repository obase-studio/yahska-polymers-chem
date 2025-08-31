"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Save,
  Eye,
  FileText,
  Database,
  Globe,
  Zap,
  Filter,
  ArrowUpDown,
  Calendar,
  Hash,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentItem {
  id: string
  page: string
  section: string
  content_key: string
  content_value: string
  updated_at: string
}

interface AdvancedContentOperationsProps {
  contentItems: ContentItem[]
  onContentUpdate?: (items: ContentItem[]) => void
}

export function AdvancedContentOperations({ 
  contentItems, 
  onContentUpdate 
}: AdvancedContentOperationsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPage, setSelectedPage] = useState("all")
  const [sortBy, setSortBy] = useState<'page' | 'section' | 'updated' | 'length'>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Filter and sort content items
  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.content_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.section.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPage = selectedPage === 'all' || item.page === selectedPage
    return matchesSearch && matchesPage
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'page':
        comparison = a.page.localeCompare(b.page)
        break
      case 'section':
        comparison = a.section.localeCompare(b.section)
        break
      case 'updated':
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        break
      case 'length':
        comparison = a.content_value.length - b.content_value.length
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Get unique pages
  const pages = [...new Set(contentItems.map(item => item.page))]

  // Export content as JSON
  const exportContent = async () => {
    setIsExporting(true)
    try {
      const selectedContent = selectedItems.size > 0 
        ? contentItems.filter(item => selectedItems.has(item.id))
        : contentItems

      const exportData = {
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        content: selectedContent
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `content-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Import content from JSON
  const importContent = async (file: File) => {
    setIsImporting(true)
    try {
      const text = await file.text()
      const importData = JSON.parse(text)
      
      if (importData.content && Array.isArray(importData.content)) {
        const confirmed = confirm(`Import ${importData.content.length} content items? This will update existing content.`)
        if (confirmed && onContentUpdate) {
          onContentUpdate(importData.content)
        }
      } else {
        alert('Invalid content format')
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('Error importing content')
    } finally {
      setIsImporting(false)
    }
  }

  // Generate content statistics
  const stats = {
    totalItems: contentItems.length,
    pages: pages.length,
    sections: [...new Set(contentItems.map(item => item.section))].length,
    totalCharacters: contentItems.reduce((sum, item) => sum + item.content_value.length, 0),
    recentlyUpdated: contentItems.filter(item => {
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 1)
      return new Date(item.updated_at) > dayAgo
    }).length
  }

  // Bulk operations
  const selectAllItems = () => {
    setSelectedItems(new Set(sortedItems.map(item => item.id)))
  }

  const deselectAllItems = () => {
    setSelectedItems(new Set())
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Content Operations</h2>
          <p className="text-muted-foreground">
            Bulk operations, export/import, and advanced content management
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportContent}
            disabled={isExporting}
            variant="outline"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export
          </Button>
          <Input
            type="file"
            accept=".json"
            onChange={(e) => e.target.files?.[0] && importContent(e.target.files[0])}
            className="hidden"
            id="import-content"
          />
          <Button
            onClick={() => document.getElementById('import-content')?.click()}
            disabled={isImporting}
            variant="outline"
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Import
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pages</p>
                <p className="text-2xl font-bold">{stats.pages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Hash className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Sections</p>
                <p className="text-2xl font-bold">{stats.sections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Characters</p>
                <p className="text-2xl font-bold">{stats.totalCharacters.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Recent</p>
                <p className="text-2xl font-bold">{stats.recentlyUpdated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Selection Toolbar */}
      {selectedItems.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedItems.size} items selected
                </Badge>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={selectAllItems}>
                    Select All Visible ({sortedItems.length})
                  </Button>
                  <Button size="sm" variant="outline" onClick={deselectAllItems}>
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportContent}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
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
              placeholder="Search content items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              {pages.map((page) => (
                <SelectItem key={page} value={page}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
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
              <Select value={sortBy} onValueChange={(value: 'page' | 'section' | 'updated' | 'length') => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="section">Section</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="length">Length</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {sortedItems.length} of {contentItems.length} items
            </Badge>
          </div>
        </div>
      </div>

      {/* Content Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Items
          </CardTitle>
          <CardDescription>
            Manage and edit website content items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content items found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedItems.map((item) => {
                const isSelected = selectedItems.has(item.id)
                const contentPreview = item.content_value.length > 100 
                  ? item.content_value.substring(0, 100) + '...'
                  : item.content_value

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors",
                      isSelected && "border-blue-500 bg-blue-50"
                    )}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleItemSelection(item.id)}
                      className="h-6 w-6 p-0"
                    >
                      {isSelected ? (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      ) : (
                        <div className="h-4 w-4 border rounded" />
                      )}
                    </Button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.page}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {item.section}
                        </Badge>
                        <span className="text-sm font-medium">{item.content_key}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {contentPreview}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{item.content_value.length} characters</span>
                        <span>Updated {new Date(item.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}