"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentEditorWithMedia } from "@/components/admin/content-editor-with-media"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function ContentPage() {
  const [selectedPage, setSelectedPage] = useState("home")

  const getSectionsForPage = (page: string) => {
    if (page === 'home') {
      return [
        {
          id: 'hero',
          title: 'Hero Section',
          description: 'Main headline and hero content',
          fields: [
            { key: 'hero_image', label: 'Hero Background Image', type: 'image' as const },
            { key: 'headline', label: 'Main Headline', type: 'text' as const },
            { key: 'description', label: 'Hero Description', type: 'textarea' as const }
          ]
        },
        {
          id: 'company_overview',
          title: 'Company Overview',
          description: 'Homepage company description',
          fields: [
            { key: 'company_description', label: 'Company Description', type: 'textarea' as const }
          ]
        },
        {
          id: 'product_categories',
          title: 'Product Categories Intro',
          description: 'Intro text for product categories',
          fields: [
            { key: 'description', label: 'Description', type: 'textarea' as const }
          ]
        },
        {
          id: 'why_choose_us',
          title: 'Why Choose Us',
          description: 'Why choose us section text',
          fields: [
            { key: 'description', label: 'Description', type: 'textarea' as const }
          ]
        },
        {
          id: 'featured_clients',
          title: 'Featured Clients',
          description: 'Featured clients section text',
          fields: [
            { key: 'description', label: 'Description', type: 'textarea' as const }
          ]
        },
        {
          id: 'industries',
          title: 'Industries We Serve',
          description: 'Industries section text',
          fields: [
            { key: 'description', label: 'Description', type: 'textarea' as const }
          ]
        },
        {
          id: 'cta',
          title: 'Homepage CTA',
          description: 'Call to action content',
          fields: [
            { key: 'headline', label: 'CTA Headline', type: 'text' as const },
            { key: 'description', label: 'CTA Description', type: 'textarea' as const }
          ]
        }
      ]
    }

    if (page === 'about') {
      return [
        {
          id: 'hero',
          title: 'About Hero Section',
          description: 'Hero image and intro text for about page',
          fields: [
            { key: 'hero_image', label: 'About Hero Image', type: 'image' as const }
          ]
        },
        {
          id: 'company_overview',
          title: 'Company Overview',
          description: 'Main about text (first paragraph shows in hero)',
          fields: [
            { key: 'content', label: 'Overview Content', type: 'textarea' as const }
          ]
        },
        {
          id: 'mission_vision',
          title: 'Mission, Vision, Values',
          description: 'Company mission, vision and values',
          fields: [
            { key: 'mission', label: 'Mission', type: 'textarea' as const },
            { key: 'vision', label: 'Vision', type: 'textarea' as const },
            { key: 'values', label: 'Values', type: 'textarea' as const },
            { key: 'content', label: 'Overview (optional)', type: 'textarea' as const }
          ]
        },
        {
          id: 'our_story',
          title: 'Our Story',
          description: 'Company history and background story',
          fields: [
            { key: 'content', label: 'Our Story Content', type: 'textarea' as const }
          ]
        },
        {
          id: 'quality_commitment',
          title: 'Quality Commitment',
          description: 'Commitment paragraphs',
          fields: [
            { key: 'content', label: 'Quality Content', type: 'textarea' as const }
          ]
        },
        {
          id: 'company_details',
          title: 'Company Details',
          description: 'Key company facts',
          fields: [
            { key: 'established_year', label: 'Established Year', type: 'text' as const },
            { key: 'company_age', label: 'Company Age', type: 'text' as const },
            { key: 'legal_status', label: 'Legal Status', type: 'text' as const },
            { key: 'location', label: 'Location', type: 'text' as const },
            { key: 'business_type', label: 'Business Type', type: 'textarea' as const },
            { key: 'key_personnel', label: 'Key Personnel', type: 'textarea' as const }
          ]
        }
      ]
    }

    if (page === 'products') {
      return [
        {
          id: 'hero',
          title: 'Products Hero Section',
          description: 'Hero image for products page',
          fields: [
            { key: 'hero_image', label: 'Products Hero Image', type: 'image' as const }
          ]
        },
        {
          id: 'product_overview',
          title: 'Products Overview',
          description: 'Intro paragraph for products hero',
          fields: [
            { key: 'content', label: 'Overview Content', type: 'textarea' as const }
          ]
        },
        {
          id: 'categories',
          title: 'Categories Intro',
          description: 'Intro text for product categories section',
          fields: [
            { key: 'content', label: 'Categories Content', type: 'textarea' as const }
          ]
        },
        {
          id: 'quality_standards',
          title: 'Quality Standards',
          description: 'Quality note for products',
          fields: [
            { key: 'content', label: 'Quality Content', type: 'textarea' as const }
          ]
        }
      ]
    }

    if (page === 'projects') {
      return [
        {
          id: 'hero',
          title: 'Projects Hero Section',
          description: 'Hero image for projects page',
          fields: [
            { key: 'hero_image', label: 'Projects Hero Image', type: 'image' as const }
          ]
        },
        {
          id: 'project_overview',
          title: 'Projects Overview',
          description: 'Intro paragraph for projects hero',
          fields: [
            { key: 'content', label: 'Overview Content', type: 'textarea' as const }
          ]
        },
        {
          id: 'categories',
          title: 'Categories Intro',
          description: 'Intro text for project categories section',
          fields: [
            { key: 'content', label: 'Categories Content', type: 'textarea' as const }
          ]
        },
        {
          id: 'achievements',
          title: 'Achievements',
          description: 'Key achievements section content',
          fields: [
            { key: 'content', label: 'Achievements Content', type: 'textarea' as const }
          ]
        }
      ]
    }

    // contact
    return [
      {
        id: 'hero',
        title: 'Contact Hero Section',
        description: 'Contact page hero image and headline',
        fields: [
          { key: 'hero_image', label: 'Contact Hero Image', type: 'image' as const },
          { key: 'description', label: 'Hero Description', type: 'textarea' as const }
        ]
      },
      {
        id: 'contact_form',
        title: 'Form Intro',
        description: 'Description above contact form',
        fields: [
          { key: 'description', label: 'Form Description', type: 'textarea' as const }
        ]
      },
      {
        id: 'contact_info',
        title: 'Contact Info',
        description: 'Address block (use new lines)',
        fields: [
          { key: 'content', label: 'Address/Info', type: 'textarea' as const }
        ]
      },
      {
        id: 'business_hours',
        title: 'Business Hours',
        description: 'Working hours (use new lines)',
        fields: [
          { key: 'content', label: 'Business Hours', type: 'textarea' as const }
        ]
      },
      {
        id: 'office_locations',
        title: 'Office Locations',
        description: 'Locations text (optional)',
        fields: [
          { key: 'content', label: 'Office Locations', type: 'textarea' as const }
        ]
      },
      {
        id: 'cta',
        title: 'CTA',
        description: 'Footer call to action',
        fields: [
          { key: 'headline', label: 'CTA Headline', type: 'text' as const },
          { key: 'description', label: 'CTA Description', type: 'textarea' as const }
        ]
      }
    ]
  }

  const contentSections = getSectionsForPage(selectedPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">
          Edit website content and messaging
        </p>
      </div>

      {/* Page Selector */}
      <div>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="about">About</SelectItem>
            <SelectItem value="products">Products</SelectItem>
            <SelectItem value="projects">Projects</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {contentSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentEditorWithMedia section={section} page={selectedPage} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}