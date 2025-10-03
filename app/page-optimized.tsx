"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { LazySection } from "@/components/lazy-section";
import { LazyProjectCategories } from "@/components/lazy-project-categories";
import { LazyLogos } from "@/components/lazy-logos";
import { OptimizedCategoryImage } from "@/components/optimized-category-image";
import { ContentItem } from "@/lib/database-client";

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export default function OptimizedHomePage() {
  // Critical content state
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);

  // Fetch critical above-the-fold content first
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("/api/hero-data");
        const result = await response.json();

        if (result.success) {
          setContentItems(result.data.content);
          setCategories(result.data.categories);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setHeroLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Get content values
  const heroHeadline =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "headline"
    )?.content_value || "Leading Chemical Solutions Provider";

  const heroDescription =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "description"
    )?.content_value ||
    "Comprehensive chemical solutions across multiple industries with uncompromising quality standards.";

  const productCategoriesTitle =
    contentItems.find(
      (item) =>
        item.section === "product_categories" && item.content_key === "title"
    )?.content_value || "Our Product Categories";

  const productCategoriesDescription =
    contentItems.find(
      (item) =>
        item.section === "product_categories" &&
        item.content_key === "description"
    )?.content_value ||
    "Comprehensive chemical solutions across multiple industries with uncompromising quality standards.";

  const projectCategoriesTitle =
    contentItems.find(
      (item) =>
        item.section === "project_categories" && item.content_key === "title"
    )?.content_value || "Our Projects";

  const projectCategoriesDescription =
    contentItems.find(
      (item) =>
        item.section === "project_categories" &&
        item.content_key === "description"
    )?.content_value ||
    "Discover our successful project implementations across various industries and sectors.";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Critical, loads immediately */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              {heroLoading ? (
                <div className="space-y-4">
                  <div className="h-12 bg-muted animate-pulse rounded-lg" />
                  <div className="h-6 bg-muted animate-pulse rounded-lg" />
                  <div className="h-6 bg-muted animate-pulse rounded-lg w-3/4" />
                </div>
              ) : (
                <>
                  <h1
                    className="text-4xl lg:text-6xl text-foreground leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {heroHeadline}
                  </h1>
                  <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {heroDescription}
                  </p>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href="/products">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-background/80 hover:bg-muted border-primary/20 hover:border-primary/40"
                >
                  <Link href="/about">Learn About Us</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="aspect-square w-full max-w-md mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <CheckCircle className="h-24 w-24 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl text-foreground mb-2">
                      Quality Assured
                    </h3>
                    <p className="text-muted-foreground">
                      Industry-leading standards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section - Critical, loads immediately */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {productCategoriesTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {productCategoriesDescription}
            </p>
          </div>

          {heroLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 hover:border-primary/30 overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 relative">
                    <OptimizedCategoryImage
                      categoryId={category.id}
                      categoryName={category.name}
                      categoryImageUrl={category.image_url}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {category.description ||
                        `High-performance ${category.name.toLowerCase()} solutions for enhanced workability and superior results.`}
                    </CardDescription>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 justify-between border-muted group-hover:border-primary"
                    >
                      <Link href={`/products?category=${category.id}`}>
                        <span>View Products</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-muted px-8"
            >
              <Link href="/products">
                See All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Project Categories Section - Lazy loaded */}
      <LazySection
        threshold={0.1}
        rootMargin="200px"
        fallback={
          <div className="py-20 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="h-8 bg-muted animate-pulse rounded-lg mb-4 max-w-md mx-auto" />
                <div className="h-4 bg-muted animate-pulse rounded-lg max-w-2xl mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[4/3] bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className="text-3xl lg:text-4xl text-foreground mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {projectCategoriesTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {projectCategoriesDescription}
              </p>
            </div>

            <LazyProjectCategories />

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-muted px-8"
              >
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Logos Section - Lazy loaded */}
      <LazySection
        threshold={0.1}
        rootMargin="200px"
        fallback={
          <div className="py-16 bg-muted/30">
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading...</span>
            </div>
          </div>
        }
      >
        <LazyLogos />
      </LazySection>

      <Footer />
    </div>
  );
}
