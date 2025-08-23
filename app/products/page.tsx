"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Mail, Phone, ExternalLink, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ContentItem } from "@/lib/database-client"

// Function to get specific content value
function getContentValue(contentItems: ContentItem[], key: string): string | undefined {
  const item = contentItems.find(item => item.content_key === key);
  return item?.content_value;
}

interface Product {
  id: number
  name: string
  description: string
  category_id: string
  category_name: string
  applications: string[]
  features: string[]
  usage: string
  advantages: string
  technical_specifications: string
  product_code: string
  is_active: boolean
}

interface Category {
  id: string
  name: string
  description: string
  sort_order: number
}

export default function ProductsPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?page=products')
        const result = await response.json()
        
        if (result.success) {
          setContentItems(result.data.content)
        }
      } catch (err) {
        console.error('Error fetching content:', err)
      }
    }
    
    fetchContent()
  }, [])

  // Get content values
  const productOverview = contentItems.find(item => 
    item.section === 'product_overview' && item.content_key === 'content'
  )?.content_value || '';
  
  const productCategories = contentItems.find(item => 
    item.section === 'categories' && item.content_key === 'content'
  )?.content_value || '';
  
  const qualityStandards = contentItems.find(item => 
    item.section === 'quality_standards' && item.content_key === 'content'
  )?.content_value || '';

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory)
        }
        if (searchTerm) {
          params.append('search', searchTerm)
        }
        
        // Add cache busting to ensure fresh data
        params.append('_t', Date.now().toString())
        const response = await fetch(`/api/products?${params.toString()}`, {
          cache: 'no-store'
        })
        const result = await response.json()
        
        if (result.success) {
          setProducts(result.data.products)
          setCategories(result.data.categories)
        } else {
          setError(result.error || 'Failed to fetch products')
        }
      } catch (err) {
        setError('Failed to fetch products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchTerm])

  // Force refresh function
  const handleRefresh = async () => {
    setRefreshing(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      // Add cache busting to ensure fresh data
      params.append('_t', Date.now().toString())
      const response = await fetch(`/api/products?${params.toString()}`, {
        cache: 'no-store'
      })
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data.products)
        setCategories(result.data.categories)
      } else {
        setError(result.error || 'Failed to refresh products')
      }
    } catch (err) {
      setError('Failed to refresh products')
      console.error('Error refreshing products:', err)
    } finally {
      setRefreshing(false)
    }
  }

  // Get filtered products
  const filteredProducts = products.filter(product => product.is_active)

  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id)
  }

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
              Our Product Range
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {productOverview || 'Premium chemical solutions for construction, concrete admixtures, and industrial applications with over 20 years of manufacturing excellence.'}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  {category.name}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={handleRefresh}
                size="sm"
                disabled={refreshing}
                className="ml-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Overview */}
      {selectedCategory === "all" && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Product Categories
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {productCategories || 'Explore our comprehensive range of chemical solutions organized by industry application'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => {
                const categoryProducts = products.filter(p => p.category_id === category.id && p.is_active)
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-primary">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{categoryProducts.length} products available</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="w-full"
                      >
                        View Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Product Listings */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory !== "all" && (
            <div className="mb-12">
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {getCategoryById(selectedCategory)?.name}
              </h2>
              <p className="text-xl text-muted-foreground">
                {getCategoryById(selectedCategory)?.description}
              </p>
            </div>
          )}

          {searchTerm && (
            <div className="mb-8">
              <p className="text-muted-foreground">
                Found {filteredProducts.length} products matching "{searchTerm}"
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-destructive text-lg mb-4">Error loading products</p>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                return (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    <CardHeader className="flex-shrink-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            {product.category_name || getCategoryById(product.category_id)?.name}
                          </Badge>
                          {product.product_code && (
                            <div className="mt-2">
                              <span className="text-sm text-muted-foreground">Code: {product.product_code}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <CardDescription className="mt-3">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow">
                      <div className="space-y-4 flex-grow">
                        {product.applications && product.applications.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-2">Applications:</h4>
                            <div className="flex flex-wrap gap-1">
                              {product.applications.slice(0, 3).map((app: string, appIndex: number) => (
                                <Badge key={appIndex} variant="outline" className="text-xs">
                                  {app}
                                </Badge>
                              ))}
                              {product.applications.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{product.applications.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {product.features && product.features.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-2">Key Features:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {product.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                                <li key={featureIndex} className="flex items-center">
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                              {product.features.length > 3 && (
                                <li className="text-xs text-muted-foreground">
                                  +{product.features.length - 3} more features
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {product.usage && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-2">Usage:</h4>
                            <p className="text-sm text-muted-foreground">
                              {product.usage.length > 100 
                                ? `${product.usage.substring(0, 100)}...` 
                                : product.usage
                              }
                            </p>
                          </div>
                        )}

                        {product.advantages && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-2">Advantages:</h4>
                            <p className="text-sm text-muted-foreground">
                              {product.advantages.length > 100 
                                ? `${product.advantages.substring(0, 100)}...` 
                                : product.advantages
                              }
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 mt-auto border-t border-border flex gap-2">
                        <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Link href={`/products/${product.id}`}>
                            View Details
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                          Request Quote
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your search criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Need Custom Solutions?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our technical experts can help you find the right chemical solution for your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Contact Our Experts
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="tel:+919825012345">
                <Phone className="mr-2 h-5 w-4" />
                Call Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}