"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Users, Factory, Target, Eye } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ContentItem } from "@/lib/database-client"

export default function AboutPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string>('')
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [lastKnownTimestamp, setLastKnownTimestamp] = useState<number>(0)

  // Fetch content from API
  useEffect(() => {
    let mounted = true
    
    const fetchContent = async () => {
      try {
        setLoading(true)
        setFetchError('')
        
        // Wait for component to be mounted and hydrated
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (!mounted) return
        
        const url = `/api/content?page=about&t=${Date.now()}` // Add timestamp to prevent caching
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        
        if (!mounted) return
        
        if (result.success && result.data && result.data.content) {
          setContentItems(result.data.content)
          setFetchError('')
          
          // Track the content timestamp for change detection
          if (result.lastUpdated) {
            setLastKnownTimestamp(result.lastUpdated)
          }
        } else {
          setFetchError('Invalid API response structure')
        }
      } catch (err) {
        if (mounted) {
          setFetchError('Fetch error: ' + (err instanceof Error ? err.message : String(err)))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    
    fetchContent()
    
    return () => {
      mounted = false
    }
  }, [])

  // Simple polling mechanism to check for content updates
  useEffect(() => {
    if (lastKnownTimestamp === 0) return // Don't poll until initial load

    const checkForUpdates = async () => {
      try {
        const response = await fetch('/api/sync/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: 'about' }),
          cache: 'no-store'
        })
        
        const result = await response.json()
        
        if (result.success && result.lastUpdated && result.lastUpdated > lastKnownTimestamp) {
          console.log('About page - Content update detected, refreshing...', { 
            old: lastKnownTimestamp, 
            new: result.lastUpdated 
          })
          
          // Fetch full content
          const contentResponse = await fetch(`/api/content?page=about&t=${Date.now()}`, { cache: 'no-store' })
          const contentResult = await contentResponse.json()
          
          if (contentResult.success && contentResult.data && contentResult.data.content) {
            setContentItems(contentResult.data.content)
            setLastKnownTimestamp(result.lastUpdated)
            setLastUpdated(new Date().toLocaleTimeString())
            console.log('About page - Content refreshed successfully!')
          }
        }
      } catch (error) {
        console.error('Error checking for updates:', error)
      }
    }

    // Check for updates every 2 seconds
    const interval = setInterval(checkForUpdates, 2000)
    
    return () => clearInterval(interval)
  }, [lastKnownTimestamp])

  // Get content values from database
  const companyOverview = contentItems.find(item => 
    item.section === 'company_overview' && item.content_key === 'content'
  )?.content_value || '';
  
  const missionVision = contentItems.find(item => 
    item.section === 'mission_vision' && item.content_key === 'content'
  )?.content_value || '';
  
  const qualityCommitment = contentItems.find(item => 
    item.section === 'quality_commitment' && item.content_key === 'content'
  )?.content_value || '';

  const experience = contentItems.find(item => 
    item.section === 'experience' && item.content_key === 'content'
  )?.content_value || '';

  const ourStory = contentItems.find(item => 
    item.section === 'our_story' && item.content_key === 'content'
  )?.content_value || '';


  // Helper function to format content with proper paragraphs and lists
  const formatContent = (content: string) => {
    if (!content) return [];
    
    const parts = content.split('\n\n').filter(p => p.trim());
    return parts.map((part, index) => {
      const trimmed = part.trim();
      
      // Handle "Why Choose Us" section with checkmarks
      if (trimmed.includes('Why Choose Us') || trimmed.includes('✅')) {
        const lines = trimmed.split('\n');
        const title = lines.find(line => line.includes('Why Choose Us')) || 'Why Choose Us';
        const items = lines.filter(line => line.includes('✅')).map(line => line.replace('✅', '').trim());
        return { type: 'checklist', title: title.replace('Why Choose Us', '').trim(), items };
      }
      
      // Handle bullet points with •
      if (trimmed.includes('•\t') || trimmed.includes('•')) {
        const lines = trimmed.split('\n');
        const firstLine = lines[0];
        const bullets = lines.filter(line => line.includes('•')).map(line => 
          line.replace('•\t', '').replace('•', '').trim()
        );
        return { type: 'bullets', title: firstLine.includes('•') ? '' : firstLine, items: bullets };
      }
      
      // Regular paragraph
      return { type: 'paragraph', content: trimmed.replace(/\n/g, ' ') };
    });
  };

  // Format company overview content
  const formattedOverview = formatContent(companyOverview);
  
  // Extract intro paragraph (first paragraph of overview)
  const introParagraph = formattedOverview.find(item => item.type === 'paragraph')?.content || 
    'Two decades of excellence in chemical manufacturing, serving industries with innovative solutions and unwavering commitment to quality.';

  // Extract mission from mission_vision content or use default
  const mission = missionVision || 'Our mission is to provide innovative chemical solutions that enhance construction quality and efficiency while maintaining the highest standards of safety and environmental responsibility.';

  // Use dedicated "Our Story" content, fall back to experience if not available
  const storyContent = ourStory || experience || 'Our story content will be available soon.';
  const formattedStory = formatContent(storyContent);

  // Format quality commitment content
  const formattedCommitment = formatContent(qualityCommitment);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl lg:text-5xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              About Yahska Polymers
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {introParagraph}
            </p>
            {fetchError && (
              <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
                <strong>Debug Info:</strong> {fetchError}
                <button 
                  onClick={() => window.location.reload()} 
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {formattedStory.map((item, index) => (
                  <div key={index}>
                    {item.type === 'paragraph' && (
                      <p>{item.content}</p>
                    )}
                    {item.type === 'bullets' && (
                      <div>
                        {item.title && <p className="font-semibold mb-2">{item.title}</p>}
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {item.items?.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.type === 'checklist' && (
                      <div>
                        {item.title && <p className="font-semibold mb-2">{item.title}</p>}
                        <div className="space-y-2">
                          {item.items?.map((checkItem, checkIndex) => (
                            <div key={checkIndex} className="flex items-start gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              <span>{checkItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Yahska Polymers Manufacturing Facility"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Quality Commitment */}
      {qualityCommitment && (
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Our Quality Commitment
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                {formattedCommitment.map((item, index) => (
                  <div key={index}>
                    {item.type === 'paragraph' && (
                      <p className="text-lg">{item.content}</p>
                    )}
                    {item.type === 'bullets' && (
                      <div>
                        {item.title && <h3 className="font-semibold text-foreground text-xl mb-4">{item.title}</h3>}
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          {item.items?.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="text-lg">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.type === 'checklist' && (
                      <div>
                        {item.title && <h3 className="font-semibold text-foreground text-xl mb-4">{item.title}</h3>}
                        <div className="grid md:grid-cols-2 gap-4">
                          {item.items?.map((checkItem, checkIndex) => (
                            <div key={checkIndex} className="flex items-start gap-3 p-4 bg-background rounded-lg">
                              <span className="text-green-600 font-bold text-xl">✓</span>
                              <span className="text-lg">{checkItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {(lastUpdated || lastKnownTimestamp > 0) && (
        <div className="text-center py-2 bg-gray-50 text-xs text-gray-500">
          {lastUpdated ? `Content updated: ${lastUpdated}` : 'Checking for updates...'}
          <span className="ml-4 text-green-600">● Live sync active</span>
        </div>
      )}

      <Footer />
    </div>
  )
}