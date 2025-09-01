"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Award, Users, Globe, CheckCircle, Building2, Palette, Factory, Wrench, Truck, Zap, Train, MapPin } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ContentItem } from "@/lib/database-client"

export default function HomePage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  // Fetch content and images from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const [homeResponse, aboutResponse] = await Promise.all([
          fetch('/api/content?page=home'),
          fetch('/api/content?page=about')
        ])
        
        const homeResult = await homeResponse.json()
        const aboutResult = await aboutResponse.json()
        
        if (homeResult.success) {
          let allContent = homeResult.data.content
          
          // Add About page content for "Our Story"
          if (aboutResult.success && aboutResult.data.content) {
            const ourStoryItem = aboutResult.data.content.find((item: any) => 
              item.section === 'our_story' && item.content_key === 'content'
            )
            if (ourStoryItem) {
              allContent = [...allContent, ourStoryItem]
            }
          }
          
          setContentItems(allContent)
          
          // Load hero image
          const heroImageResponse = await fetch('/api/admin/page-images?page=home&section=hero_image')
          if (heroImageResponse.ok) {
            const heroImageData = await heroImageResponse.json()
            if (heroImageData?.media_files?.file_path) {
              setHeroImage(heroImageData.media_files.file_path)
            }
          }
          
          // Load category images
          const categoryImagePromises = [
            { category: 'construction', section: 'construction_image' },
            { category: 'concrete', section: 'concrete_image' },
            { category: 'textile', section: 'textile_image' },
            { category: 'dyestuff', section: 'dyestuff_image' }
          ].map(async ({ category, section }) => {
            const response = await fetch(`/api/admin/page-images?page=home&section=${section}`)
            if (response.ok) {
              const data = await response.json()
              if (data?.media_files?.file_path) {
                return { category, url: data.media_files.file_path }
              }
            }
            return null
          })
          
          const categoryResults = await Promise.all(categoryImagePromises)
          const categoryImageMap: Record<string, string> = {}
          categoryResults.forEach(result => {
            if (result) {
              categoryImageMap[result.category] = result.url
            }
          })
          setCategoryImages(categoryImageMap)
        }
      } catch (err) {
        console.error('Error fetching home content:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchContent()
  }, [])

  // Get content values
  const heroHeadline = contentItems.find(item => 
    item.section === 'hero' && item.content_key === 'headline'
  )?.content_value || (loading ? 'Loading...' : 'Leading Chemical Solutions for Industrial Excellence');
  
  const companyDescription = contentItems.find(item => 
    item.section === 'company_overview' && item.content_key === 'company_description'
  )?.content_value || '';
  
  const productCategoriesDescription = contentItems.find(item => 
    item.section === 'product_categories' && item.content_key === 'description'
  )?.content_value || '';
  
  const whyChooseUsDescription = contentItems.find(item => 
    item.section === 'why_choose_us' && item.content_key === 'description'
  )?.content_value || '';
  
  const featuredClientsDescription = contentItems.find(item => 
    item.section === 'featured_clients' && item.content_key === 'description'
  )?.content_value || '';
  
  const industriesDescription = contentItems.find(item => 
    item.section === 'industries' && item.content_key === 'description'
  )?.content_value || '';
  
  const ctaHeadline = contentItems.find(item => 
    item.section === 'cta' && item.content_key === 'headline'
  )?.content_value || '';
  
  const ctaDescription = contentItems.find(item => 
    item.section === 'cta' && item.content_key === 'description'
  )?.content_value || '';

  // Get full "Our Story" content from About page
  const getFullStoryDescription = () => {
    const ourStoryContent = contentItems.find(item => 
      item.section === 'our_story' && item.content_key === 'content'
    )?.content_value;

    if (ourStoryContent) {
      // Extract the first paragraph which is the main introduction
      const firstParagraph = ourStoryContent.split('\n')[0];
      return firstParagraph;
    }
    
    return companyDescription || 'Leading construction chemicals manufacturer based in Ahmedabad, proudly serving the Indian construction industry with innovative and reliable solutions for over two decades.';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-accent/5 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                className="text-4xl lg:text-6xl font-black text-foreground mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {heroHeadline}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {getFullStoryDescription()}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/products">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get Quote</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Yahska Polymers Manufacturing Facility"
                  className="rounded-lg shadow-2xl"
                />
              ) : (
                <div className="aspect-video bg-muted rounded-lg shadow-2xl flex items-center justify-center">
                  <p className="text-muted-foreground">Loading hero image...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">20+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Product Range</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Quality Assured</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Product Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {productCategoriesDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                {categoryImages.construction ? (
                  <img
                    src={categoryImages.construction}
                    alt="Construction Chemicals"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Construction Chemicals</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-primary">Construction Chemicals</CardTitle>
                <CardDescription>Advanced solutions for construction and infrastructure projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Waterproofing compounds
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Repair mortars
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Protective coatings
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                {categoryImages.concrete ? (
                  <img
                    src={categoryImages.concrete}
                    alt="Concrete Admixtures"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Concrete Admixtures</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-primary">Concrete Admixtures</CardTitle>
                <CardDescription>High-performance additives for enhanced concrete properties</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Superplasticizers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Retarding agents
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Accelerating agents
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                {categoryImages.textile ? (
                  <img
                    src={categoryImages.textile}
                    alt="Textile Chemicals"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Textile Chemicals</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-primary">Textile Chemicals</CardTitle>
                <CardDescription>Specialized chemicals for textile processing and finishing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Dispersing agents
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Leveling agents
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Wetting agents
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                {categoryImages.dyestuff ? (
                  <img
                    src={categoryImages.dyestuff}
                    alt="Dyestuff Chemicals"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Dyestuff Chemicals</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-primary">Dyestuff Chemicals</CardTitle>
                <CardDescription>Premium chemicals for dyeing and color applications</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Color enhancers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Fixing agents
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Stabilizers
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Why Choose Yahska Polymers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {whyChooseUsDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Excellence</h3>
              <p className="text-muted-foreground">
                ISO certified manufacturing processes ensuring consistent quality and reliability in every product
                batch.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
              <p className="text-muted-foreground">
                Dedicated technical team providing comprehensive support from product selection to application guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Reach</h3>
              <p className="text-muted-foreground">
                Serving clients across multiple countries with reliable supply chain and logistics network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Client Partnership Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Featured Client Partnership
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {featuredClientsDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary">Larsen & Toubro</CardTitle>
                <CardDescription>Infrastructure & Construction</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Supplying high-performance concrete admixtures for major infrastructure projects across India,
                  ensuring durability and strength in challenging construction environments.
                </p>
                <div className="flex items-center text-sm text-accent">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  5+ Years Partnership
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary">Tata Steel</CardTitle>
                <CardDescription>Steel & Manufacturing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Providing specialized construction chemicals for industrial facilities and manufacturing plants,
                  meeting stringent quality requirements for heavy industry applications.
                </p>
                <div className="flex items-center text-sm text-accent">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  8+ Years Partnership
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary">Reliance Industries</CardTitle>
                <CardDescription>Petrochemicals & Textiles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Delivering premium textile chemicals and dyestuff solutions for large-scale manufacturing operations,
                  ensuring consistent quality and performance standards.
                </p>
                <div className="flex items-center text-sm text-accent">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  10+ Years Partnership
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Categories Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Project Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Diverse infrastructure and construction projects showcasing our expertise across major industry sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Train className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">High Speed Rail</h3>
                <p className="text-muted-foreground text-sm">Bullet train and rapid transit infrastructure projects</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Train className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Metro & Rail</h3>
                <p className="text-muted-foreground text-sm">Urban metro systems and railway infrastructure</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Roads & Highways</h3>
                <p className="text-muted-foreground text-sm">Expressways, highways and road infrastructure</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Buildings & Factories</h3>
                <p className="text-muted-foreground text-sm">Commercial buildings and industrial facilities</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            {ctaHeadline}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Contact Us Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}