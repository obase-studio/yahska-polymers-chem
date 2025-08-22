"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Edit, Eye } from "lucide-react"
import Link from "next/link"

interface ContentDisplayProps {
  page: string
  section: string
  contentKey: string
  fallback?: string
  type?: 'text' | 'rich_text' | 'number' | 'image' | 'link'
  className?: string
  showEditButton?: boolean
  adminPath?: string
}

export function ContentDisplay({
  page,
  section,
  contentKey,
  fallback = "",
  type = 'text',
  className = "",
  showEditButton = false,
  adminPath = "/admin"
}: ContentDisplayProps) {
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/content?page=${page}&section=${section}`)
        
        if (response.ok) {
          const contentData = await response.json()
          const targetContent = contentData.find((item: any) => item.content_key === contentKey)
          
          if (targetContent) {
            setContent(targetContent.content_value)
          } else {
            setContent(fallback)
          }
        } else {
          setContent(fallback)
        }
      } catch (err) {
        console.error('Error fetching content:', err)
        setContent(fallback)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [page, section, contentKey, fallback])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (error) {
    return <span className={className}>{fallback}</span>
  }

  const renderContent = () => {
    switch (type) {
      case 'rich_text':
        return (
          <div 
            className={className}
            dangerouslySetInnerHTML={{ __html: content || fallback }}
          />
        )
      
      case 'image':
        if (!content && !fallback) return null
        return (
          <img 
            src={content || fallback} 
            alt={`${section} ${contentKey}`}
            className={className}
          />
        )
      
      case 'link':
        if (!content && !fallback) return null
        return (
          <a 
            href={content || fallback}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-primary hover:underline ${className}`}
          >
            {content || fallback}
          </a>
        )
      
      case 'number':
        return (
          <span className={className}>
            {content || fallback}
          </span>
        )
      
      default:
        return (
          <span className={className}>
            {content || fallback}
          </span>
        )
    }
  }

  return (
    <div className="relative group">
      {renderContent()}
      
      {showEditButton && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
          >
            <Link href={`${adminPath}/content`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

// Specialized content components for common use cases
export function HeroHeadline({ fallback = "Welcome to Yahska Polymers" }: { fallback?: string }) {
  return (
    <ContentDisplay
      page="home"
      section="hero"
      contentKey="headline"
      fallback={fallback}
      type="text"
      className="text-4xl lg:text-5xl font-black text-foreground"
      showEditButton={true}
    />
  )
}

export function HeroSubheadline({ fallback = "Leading Chemical Solutions for Industrial Excellence" }: { fallback?: string }) {
  return (
    <ContentDisplay
      page="home"
      section="hero"
      contentKey="subheadline"
      fallback={fallback}
      type="textarea"
      className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
      showEditButton={true}
    />
  )
}

export function CompanyStats({ 
  yearsFallback = "20+",
  clientsFallback = "500+",
  productsFallback = "100+",
  qualityFallback = "ISO 9001:2015"
}: {
  yearsFallback?: string
  clientsFallback?: string
  productsFallback?: string
  qualityFallback?: string
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div className="text-3xl font-bold text-primary mb-2">
          <ContentDisplay
            page="home"
            section="stats"
            contentKey="years_experience"
            fallback={yearsFallback}
            type="number"
            className="text-3xl font-bold text-primary"
          />
          +
        </div>
        <p className="text-muted-foreground">Years Experience</p>
      </div>
      <div>
        <div className="text-3xl font-bold text-primary mb-2">
          <ContentDisplay
            page="home"
            section="stats"
            contentKey="happy_clients"
            fallback={clientsFallback}
            type="number"
            className="text-3xl font-bold text-primary"
          />
          +
        </div>
        <p className="text-muted-foreground">Happy Clients</p>
      </div>
      <div>
        <div className="text-3xl font-bold text-primary mb-2">
          <ContentDisplay
            page="home"
            section="stats"
            contentKey="product_range"
            fallback={productsFallback}
            type="number"
            className="text-3xl font-bold text-primary"
          />
          +
        </div>
        <p className="text-muted-foreground">Product Range</p>
      </div>
      <div>
        <div className="text-3xl font-bold text-primary mb-2">
          <ContentDisplay
            page="home"
            section="stats"
            contentKey="quality_assured"
            fallback={qualityFallback}
            type="text"
            className="text-3xl font-bold text-primary"
          />
        </div>
        <p className="text-muted-foreground">Quality Assured</p>
      </div>
    </div>
  )
}

export function CompanyStory({ fallback = "Tell your company story here..." }: { fallback?: string }) {
  return (
    <ContentDisplay
      page="home"
      section="about"
      contentKey="company_story"
      fallback={fallback}
      type="rich_text"
      className="prose max-w-none text-muted-foreground leading-relaxed"
      showEditButton={true}
    />
  )
}

export function ContactInfo({
  addressFallback = "Enter your company address",
  phoneFallback = "+91 98250 12345",
  emailFallback = "info@yahskapolymers.com",
  hoursFallback = "Monday - Friday: 9:00 AM - 6:00 PM"
}: {
  addressFallback?: string
  phoneFallback?: string
  emailFallback?: string
  hoursFallback?: string
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Address</h4>
        <ContentDisplay
          page="home"
          section="contact"
          contentKey="address"
          fallback={addressFallback}
          type="textarea"
          className="text-muted-foreground"
          showEditButton={true}
        />
      </div>
      <div>
        <h4 className="font-semibold mb-2">Phone</h4>
        <ContentDisplay
          page="home"
          section="contact"
          contentKey="phone"
          fallback={phoneFallback}
          type="text"
          className="text-muted-foreground"
          showEditButton={true}
        />
      </div>
      <div>
        <h4 className="font-semibold mb-2">Email</h4>
        <ContentDisplay
          page="home"
          section="contact"
          contentKey="email"
          fallback={emailFallback}
          type="text"
          className="text-muted-foreground"
          showEditButton={true}
        />
      </div>
      <div>
        <h4 className="font-semibold mb-2">Business Hours</h4>
        <ContentDisplay
          page="home"
          section="contact"
          contentKey="business_hours"
          fallback={hoursFallback}
          type="textarea"
          className="text-muted-foreground"
          showEditButton={true}
        />
      </div>
    </div>
  )
}
