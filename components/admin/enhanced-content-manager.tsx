"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Save, 
  Search, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  FileText,
  Loader2,
  RefreshCw
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

interface PageConfig {
  id: string
  title: string
  description: string
  sections: SectionConfig[]
}

interface SectionConfig {
  id: string
  title: string
  description: string
  fields: FieldConfig[]
}

interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'textarea' | 'rich_text'
  placeholder?: string
  maxLength?: number
}

const pageConfigs: PageConfig[] = [
  {
    id: 'home',
    title: 'Homepage',
    description: 'Main landing page content',
    sections: [
      {
        id: 'hero',
        title: 'Hero Section',
        description: 'Main banner and headline content',
        fields: [
          { key: 'headline', label: 'Main Headline', type: 'text', maxLength: 120 },
          { key: 'subheading', label: 'Subheading', type: 'textarea', maxLength: 300 }
        ]
      },
      {
        id: 'company_overview',
        title: 'Company Overview',
        description: 'About the company section',
        fields: [
          { key: 'company_description', label: 'Company Description', type: 'textarea', maxLength: 500 }
        ]
      },
      {
        id: 'product_categories',
        title: 'Product Categories',
        description: 'Product overview section',
        fields: [
          { key: 'description', label: 'Categories Description', type: 'textarea', maxLength: 300 }
        ]
      },
      {
        id: 'why_choose_us',
        title: 'Why Choose Us',
        description: 'Value propositions',
        fields: [
          { key: 'description', label: 'Why Choose Us Description', type: 'textarea', maxLength: 300 }
        ]
      },
      {
        id: 'featured_clients',
        title: 'Featured Clients',
        description: 'Client showcase section',
        fields: [
          { key: 'description', label: 'Client Description', type: 'textarea', maxLength: 300 }
        ]
      },
      {
        id: 'industries',
        title: 'Industries We Serve',
        description: 'Industries section',
        fields: [
          { key: 'description', label: 'Industries Description', type: 'textarea', maxLength: 300 }
        ]
      },
      {
        id: 'cta',
        title: 'Call to Action',
        description: 'Bottom CTA section',
        fields: [
          { key: 'headline', label: 'CTA Headline', type: 'text', maxLength: 80 },
          { key: 'description', label: 'CTA Description', type: 'textarea', maxLength: 200 }
        ]
      }
    ]
  },
  {
    id: 'products',
    title: 'Products Page',
    description: 'Products page content',
    sections: [
      {
        id: 'hero',
        title: 'Products Hero',
        description: 'Products page header',
        fields: [
          { key: 'headline', label: 'Page Headline', type: 'text' },
          { key: 'description', label: 'Page Description', type: 'textarea' }
        ]
      }
    ]
  },
  {
    id: 'projects',
    title: 'Projects Page',
    description: 'Projects showcase page',
    sections: [
      {
        id: 'project_overview',
        title: 'Project Overview',
        description: 'Projects introduction',
        fields: [
          { key: 'content', label: 'Overview Content', type: 'textarea' }
        ]
      }
    ]
  }
]

export function EnhancedContentManager() {
  const [contentData, setContentData] = useState<Record<string, Record<string, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    loadAllContent()
  }, [])

  const loadAllContent = async () => {
    setIsLoading(true)
    try {
      const promises = pageConfigs.map(async (pageConfig) => {
        const response = await fetch(`/api/admin/content?page=${pageConfig.id}`)
        if (response.ok) {
          const content = await response.json()
          return { pageId: pageConfig.id, content }
        }
        return { pageId: pageConfig.id, content: [] }
      })

      const results = await Promise.all(promises)
      const newContentData: Record<string, Record<string, string>> = {}

      results.forEach(({ pageId, content }) => {
        newContentData[pageId] = {}
        content.forEach((item: ContentItem) => {
          const key = `${item.section}.${item.content_key}`
          newContentData[pageId][key] = item.content_value || ''
        })
      })

      setContentData(newContentData)
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = async (pageId: string, sectionId: string, contentKey: string, value: string) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: pageId,
          section: sectionId,
          content_key: contentKey,
          content_value: value
        })
      })

      if (response.ok) {
        const timestamp = new Date().toLocaleTimeString()
        setLastSaved(prev => ({ ...prev, [`${pageId}.${sectionId}.${contentKey}`]: timestamp }))
        
        // Update local state
        setContentData(prev => ({
          ...prev,
          [pageId]: {
            ...prev[pageId],
            [`${sectionId}.${contentKey}`]: value
          }
        }))
        
        return true
      }
      return false
    } catch (error) {
      console.error('Save error:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (pageId: string, sectionId: string, fieldKey: string, value: string) => {
    const key = `${sectionId}.${fieldKey}`
    setContentData(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId] || {},
        [key]: value
      }
    }))
  }

  const getFieldValue = (pageId: string, sectionId: string, fieldKey: string) => {
    const key = `${sectionId}.${fieldKey}`
    return contentData[pageId]?.[key] || ''
  }

  const getSaveStatus = (pageId: string, sectionId: string, fieldKey: string) => {
    const key = `${pageId}.${sectionId}.${fieldKey}`
    return lastSaved[key]
  }

  const filteredPages = pageConfigs.filter(page => 
    searchTerm === '' || 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.sections.some(section => 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.fields.some(field => 
        field.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading content...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage website content across all pages</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadAllContent}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button asChild variant="outline">
            <a href="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Website
            </a>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search content sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{pageConfigs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Content Sections</p>
                <p className="text-2xl font-bold">{pageConfigs.reduce((acc, page) => acc + page.sections.length, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Recent Saves</p>
                <p className="text-2xl font-bold">{Object.keys(lastSaved).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className={cn("h-8 w-8", isSaving ? "text-yellow-600" : "text-green-600")} />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-2xl font-bold">{isSaving ? "Saving..." : "Ready"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {filteredPages.map((page) => (
            <TabsTrigger key={page.id} value={page.id} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {page.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredPages.map((page) => (
          <TabsContent key={page.id} value={page.id} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{page.title}</h2>
                <p className="text-muted-foreground">{page.description}</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href={`/${page.id === 'home' ? '' : page.id}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Page
                </a>
              </Button>
            </div>

            <div className="grid gap-6">
              {page.sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {section.title}
                      <Badge variant="secondary">{section.fields.length} fields</Badge>
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.fields.map((field) => {
                      const fieldValue = getFieldValue(page.id, section.id, field.key)
                      const saveStatus = getSaveStatus(page.id, section.id, field.key)
                      
                      return (
                        <div key={field.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`${page.id}-${section.id}-${field.key}`}>
                              {field.label}
                            </Label>
                            {saveStatus && (
                              <div className="flex items-center text-sm text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Saved at {saveStatus}
                              </div>
                            )}
                          </div>
                          
                          {field.type === 'text' && (
                            <div className="flex gap-2">
                              <Input
                                id={`${page.id}-${section.id}-${field.key}`}
                                value={fieldValue}
                                onChange={(e) => handleFieldChange(page.id, section.id, field.key, e.target.value)}
                                placeholder={field.placeholder || field.label}
                                maxLength={field.maxLength}
                              />
                              <Button
                                onClick={() => saveContent(page.id, section.id, field.key, fieldValue)}
                                disabled={isSaving}
                                size="sm"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          
                          {field.type === 'textarea' && (
                            <div className="space-y-2">
                              <Textarea
                                id={`${page.id}-${section.id}-${field.key}`}
                                value={fieldValue}
                                onChange={(e) => handleFieldChange(page.id, section.id, field.key, e.target.value)}
                                placeholder={field.placeholder || field.label}
                                rows={4}
                                maxLength={field.maxLength}
                              />
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                  {field.maxLength && `${fieldValue.length}/${field.maxLength} characters`}
                                </div>
                                <Button
                                  onClick={() => saveContent(page.id, section.id, field.key, fieldValue)}
                                  disabled={isSaving}
                                  size="sm"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}