"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Mail, Phone, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

const productCategories = [
  {
    id: "construction",
    name: "Construction Chemicals",
    description: "Advanced solutions for construction and infrastructure projects",
    products: [
      {
        id: "polycarboxylate-ether",
        name: "Polycarboxylate Ether (PC Liquid) PC SR",
        description:
          "State-of-the-art polycarboxylate ether-based superplasticizer for ultra-high performance concrete",
        price: "₹90/Kg",
        applications: [
          "Ultra-High Performance Concrete",
          "Bridge Construction",
          "Tunnel Projects",
          "High-Rise Buildings",
        ],
        features: ["Ultra-high water reduction", "Excellent slump retention", "Superior strength development"],
      },
      {
        id: "concrete-curing-compound",
        name: "Concrete Curing Compound",
        description:
          "Membrane-forming curing compound that ensures optimal concrete hydration and strength development",
        price: "₹40/Kg",
        applications: ["Road Construction", "Airport Runways", "Industrial Flooring", "Parking Structures"],
        features: ["Forms protective membrane", "Prevents moisture loss", "UV resistant formulation"],
      },
    ],
  },
  {
    id: "concrete",
    name: "Concrete Admixtures",
    description: "High-performance additives for enhanced concrete properties",
    products: [
      {
        id: "superplasticizer-snf",
        name: "Superplasticizer Concrete Admixture (SNF Based)",
        description:
          "High-performance superplasticizer based on Sulfonated Naphthalene Formaldehyde for enhanced concrete workability",
        price: "₹40/Kg",
        applications: ["Ready Mix Concrete Plants", "Precast Concrete Manufacturing", "High-Rise Construction"],
        features: [
          "Reduces water content by 15-25%",
          "Improves concrete workability",
          "Increases compressive strength",
        ],
      },
      {
        id: "concrete-admixture",
        name: "Concrete Admixture",
        description:
          "General purpose concrete admixture designed to improve workability and durability of concrete mixes",
        price: "₹32/Kg",
        applications: ["General Construction", "Residential Buildings", "Commercial Projects"],
        features: ["Improves workability", "Reduces segregation", "Cost-effective solution"],
      },
      {
        id: "hyper-plasticizer-pc",
        name: "Hyper Plasticizer (PC Base Admixture)",
        description: "Advanced polycarboxylate-based hyper plasticizer for superior concrete performance and strength",
        price: "₹60/Kg",
        applications: ["High-Strength Concrete", "Self-Compacting Concrete", "Precast Elements"],
        features: ["High water reduction (30-40%)", "Superior workability retention", "Enhanced early strength"],
      },
    ],
  },
  {
    id: "dispersing",
    name: "Dispersing Agents",
    description: "Specialized dispersing agents for various industrial applications",
    products: [
      {
        id: "sodium-ligno-sulphonate",
        name: "Sodium Ligno Sulphonate",
        description:
          "Natural polymer-based dispersing agent derived from wood pulp, ideal for concrete and industrial applications",
        price: "₹60/Kg",
        applications: ["Concrete Plasticizer", "Ceramic Binder Applications", "Dust Control Agent"],
        features: ["Natural polymer base", "Excellent dispersing properties", "Environmentally friendly"],
      },
      {
        id: "lignosulphonate-powder",
        name: "Lignosulphonate Powder",
        description: "Premium grade lignosulphonate powder for specialized high-performance applications",
        price: "₹90/Kg",
        applications: ["High-Performance Concrete", "Specialty Mortars", "Industrial Applications"],
        features: ["Premium quality grade", "Superior dispersing action", "High purity formulation"],
      },
      {
        id: "sodium-naphthalene-formaldehyde",
        name: "Sodium Naphthalene Formaldehyde",
        description: "High-quality dispersing agent specifically designed for textile and dyestuff applications",
        price: "₹100/Kg",
        applications: ["Textile Dyeing Process", "Pigment Dispersion", "Leather Processing"],
        features: ["Excellent dispersing properties", "High thermal stability", "Superior color fastness"],
      },
    ],
  },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = productCategories.filter((category) => {
    if (selectedCategory === "all") return true
    return category.id === selectedCategory
  })

  const filteredProducts = filteredCategories.flatMap((category) =>
    category.products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((product) => ({ ...product, category: category.name, categoryId: category.id })),
  )

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
              Premium chemical solutions for construction, concrete admixtures, and industrial applications with over 20
              years of manufacturing excellence.
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
              {productCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  {category.name}
                </Button>
              ))}
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
                Explore our comprehensive range of chemical solutions organized by industry application
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {productCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-primary">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{category.products.length} products available</p>
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
              ))}
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
                {productCategories.find((cat) => cat.id === selectedCategory)?.name}
              </h2>
              <p className="text-xl text-muted-foreground">
                {productCategories.find((cat) => cat.id === selectedCategory)?.description}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {product.category}
                      </Badge>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-primary">{product.price}</span>
                        <span className="text-sm text-muted-foreground ml-1">Ex-works</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="space-y-4 flex-grow">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Applications:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.applications.map((app, appIndex) => (
                          <Badge key={appIndex} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Key Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {product.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
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
            ))}
          </div>

          {filteredProducts.length === 0 && (
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
                <Phone className="mr-2 h-5 w-5" />
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
