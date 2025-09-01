"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Mail, Phone, ExternalLink, Loader2, RefreshCw, Package } from "lucide-react"
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

  const productOverview = contentItems.find(item => 
    item.section === 'product_overview' && item.content_key === 'content'
  )?.content_value || '';

  const qualityStandards = contentItems.find(item => 
    item.section === 'quality_standards' && item.content_key === 'content'
  )?.content_value || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, contentRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/content?page=products')
        ])
        
        const productsData = await productsRes.json()
        const contentData = await contentRes.json()
        
        if (productsData.success) {
          setProducts(productsData.data.products || [])
          setCategories(productsData.data.categories || [])
        } else {
          throw new Error(productsData.error || 'Failed to fetch products')
        }
        
        if (contentData.success && contentData.data.content) {
          setContentItems(contentData.data.content)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/products')
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
  const filteredProducts = products
    .filter(product => product.is_active)
    .filter(product => selectedCategory === "all" || product.category_id === selectedCategory)
    .filter(product => 
      searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    )
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

      {/* Main Content with Sidebar */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Left Sidebar - Categories */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Product Categories</h3>
                
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category List */}
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center justify-between ${
                      selectedCategory === "all" 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className="flex items-center">
                      <Package className="h-4 w-4 mr-3" />
                      All Products
                    </span>
                    <Badge variant="secondary" className={selectedCategory === "all" ? "bg-primary-foreground/20 text-primary-foreground" : ""}>
                      {products.filter(p => p.is_active).length}
                    </Badge>
                  </button>
                  
                  {categories.map((category) => {
                    const categoryProductCount = products.filter(p => p.is_active && p.category_id === category.id).length
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center justify-between ${
                          selectedCategory === category.id 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <span className="flex items-center">
                          <Package className="h-4 w-4 mr-3" />
                          {category.name}
                        </span>
                        <Badge variant="secondary" className={selectedCategory === category.id ? "bg-primary-foreground/20 text-primary-foreground" : ""}>
                          {categoryProductCount}
                        </Badge>
                      </button>
                    )
                  })}
                </div>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="w-full mt-6"
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Products
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Mobile Category Filter */}
              <div className="lg:hidden mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Mobile Category Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        onClick={() => setSelectedCategory("all")}
                        size="sm"
                      >
                        All ({products.filter(p => p.is_active).length})
                      </Button>
                      {categories.map((category) => {
                        const count = products.filter(p => p.is_active && p.category_id === category.id).length
                        return (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            onClick={() => setSelectedCategory(category.id)}
                            size="sm"
                          >
                            {category.name} ({count})
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedCategory === "all" 
                      ? "All Products" 
                      : getCategoryById(selectedCategory)?.name || "Products"
                    }
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    {searchTerm && ` for "${searchTerm}"`}
                  </p>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4 mb-6">
                  <p className="text-destructive text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? `Try adjusting your search terms or browse other categories.`
                      : `No products available in this category.`
                    }
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                            <Badge variant="secondary" className="mb-2">
                              {product.category_name}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4 line-clamp-3">
                          {product.description}
                        </CardDescription>
                        
                        {product.features && product.features.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-foreground mb-2">Key Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {product.features.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {product.features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{product.features.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-auto">
                          <Button asChild className="flex-1" size="sm">
                            <Link href={`/products/${product.id}`}>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/contact">
                              <Mail className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Need Technical Assistance?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our technical experts are ready to help you select the right products for your specific applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Contact Our Experts</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="tel:+918890913222">
                <Phone className="h-5 w-5 mr-2" />
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