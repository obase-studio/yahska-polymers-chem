"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowRight,
  Mail,
  ExternalLink,
  Loader2,
  RefreshCw,
  Package,
  Zap,
  Building2,
  Wrench,
  CheckCircle,
  Factory,
  Award,
  Truck,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { ContentItem } from "@/lib/database-client";
import { useProductContext } from "@/contexts/ProductContext";

// Function to get specific content value
function getContentValue(
  contentItems: ContentItem[],
  key: string
): string | undefined {
  const item = contentItems.find((item) => item.content_key === key);
  return item?.content_value;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category_id: string;
  category_name: string;
  applications: string[];
  features: string[];
  usage: string;
  advantages: string;
  technical_specifications: string;
  image_url?: string;
  product_code: string;
  is_active: boolean;
  specification_pdf?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  sort_order: number;
}

export default function ProductsPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { selectedCategory, setSelectedCategory } = useProductContext();
  const searchParams = useSearchParams();

  // Function to handle datasheet download
  const handleDownloadDatasheet = (product: Product) => {
    if (!product.specification_pdf) {
      alert(
        "Datasheet is not available for this product. Please contact our sales team for more information."
      );
      return;
    }

    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = product.specification_pdf;
    link.download = `${product.name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_datasheet.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const productOverview =
    contentItems.find(
      (item) =>
        item.section === "product_overview" && item.content_key === "content"
    )?.content_value || "";

  const qualityStandards =
    contentItems.find(
      (item) =>
        item.section === "quality_standards" && item.content_key === "content"
    )?.content_value || "";

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      // Reset to "all" when no category parameter is present
      setSelectedCategory("all");
    }
  }, [searchParams, setSelectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, contentRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/content?page=products"),
        ]);

        const productsData = await productsRes.json();
        const contentData = await contentRes.json();

        if (productsData.success) {
          setProducts(productsData.data.products || []);
          setCategories(productsData.data.categories || []);
        } else {
          throw new Error(productsData.error || "Failed to fetch products");
        }

        if (contentData.success && contentData.data.content) {
          setContentItems(contentData.data.content);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/products");
      const result = await response.json();

      if (result.success) {
        setProducts(result.data.products);
        setCategories(result.data.categories);
      } else {
        setError(result.error || "Failed to refresh products");
      }
    } catch (err) {
      setError("Failed to refresh products");
      console.error("Error refreshing products:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Get filtered products
  const filteredProducts = products
    .filter((product) => product.is_active)
    .filter((product) => {
      // If there's a search term, search across all products regardless of category
      if (searchTerm !== "") {
        return (
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      // If no search term, filter by selected category
      return (
        selectedCategory === "all" || product.category_id === selectedCategory
      );
    });

  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <div className="h-10 w-64 mx-auto bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 mx-auto bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 mx-auto bg-muted rounded animate-pulse" />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div className="aspect-[3/2] bg-muted animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Get content values for hero section
  const heroHeadline =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "headline"
    )?.content_value || "Our Products";

  const heroDescription =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "description"
    )?.content_value ||
    "Discover our comprehensive range of high-quality construction chemicals and concrete admixtures designed for professional applications.";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-3xl lg:text-4xl text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {heroHeadline}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Left Sidebar - Categories */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="text-lg mb-4 text-foreground">
                  Product Categories
                </h3>

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
                    <Badge
                      variant="secondary"
                      className={
                        selectedCategory === "all"
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : ""
                      }
                    >
                      {products.filter((p) => p.is_active).length}
                    </Badge>
                  </button>

                  {categories.map((category) => {
                    const categoryProductCount = products.filter(
                      (p) => p.is_active && p.category_id === category.id
                    ).length;
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
                        <Badge
                          variant="secondary"
                          className={
                            selectedCategory === category.id
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : ""
                          }
                        >
                          {categoryProductCount}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
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
                        variant={
                          selectedCategory === "all" ? "default" : "outline"
                        }
                        onClick={() => setSelectedCategory("all")}
                        size="sm"
                      >
                        All ({products.filter((p) => p.is_active).length})
                      </Button>
                      {categories.map((category) => {
                        const count = products.filter(
                          (p) => p.is_active && p.category_id === category.id
                        ).length;
                        return (
                          <Button
                            key={category.id}
                            variant={
                              selectedCategory === category.id
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setSelectedCategory(category.id)}
                            size="sm"
                          >
                            {category.name} ({count})
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-foreground">
                    {searchTerm
                      ? `Search Results for "${searchTerm}"`
                      : selectedCategory === "all"
                      ? "All Products"
                      : getCategoryById(selectedCategory)?.name || "Products"}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""} found
                    {searchTerm && " across all categories"}
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
                  <h3 className="text-lg text-muted-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `Try adjusting your search terms or browse other categories.`
                      : `No products available in this category.`}
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
                  {filteredProducts.map((product) => {
                    // Get unique icon for each category based on name
                    const getCategoryIcon = (categoryName: string) => {
                      if (categoryName.toLowerCase().includes("admixture"))
                        return Package;
                      if (categoryName.toLowerCase().includes("accelerator"))
                        return Zap;
                      if (categoryName.toLowerCase().includes("waterproofing"))
                        return Building2;
                      if (categoryName.toLowerCase().includes("grout"))
                        return Wrench;
                      if (categoryName.toLowerCase().includes("curing"))
                        return CheckCircle;
                      if (categoryName.toLowerCase().includes("micro silica"))
                        return Factory;
                      if (categoryName.toLowerCase().includes("floor"))
                        return Building2;
                      if (categoryName.toLowerCase().includes("structural"))
                        return Building2;
                      if (categoryName.toLowerCase().includes("corrosion"))
                        return Award;
                      if (categoryName.toLowerCase().includes("release"))
                        return Truck;
                      return Package;
                    };
                    const CategoryIcon = getCategoryIcon(product.category_name);

                    return (
                      <Card
                        key={product.id}
                        className="group h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 hover:border-primary/30 overflow-hidden flex flex-col"
                      >
                        <div className="aspect-[3/2] relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 rounded-t-lg">
                          {/* Background overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300" />
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <CategoryIcon className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 z-10">
                            <Badge
                              variant="secondary"
                              className="bg-white/90 backdrop-blur-sm text-foreground border-border"
                            >
                              {product.category_name}
                            </Badge>
                          </div>

                          {/* Hover overlay with quick info */}
                          {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-sm font-medium">
                              Industrial Grade Quality
                            </p>
                          </div> */}
                        </div>

                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex-1 space-y-3 mb-2">
                            <div>
                              <h3 className="text-lg mb-2 line-clamp-2">
                                {product.name}
                              </h3>
                              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                                {product.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 mt-auto">
                            <Button
                              asChild
                              variant="outline"
                              className="w-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 justify-between border-muted group-hover:border-primary"
                              size="sm"
                            >
                              <Link
                                href={`/products/${product.id}`}
                                className="flex items-center justify-between w-full"
                              >
                                <span>View Details</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
