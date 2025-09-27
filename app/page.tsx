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
import { ArrowRight, CheckCircle, Loader2, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
  const [lastKnownTimestamp, setLastKnownTimestamp] = useState<number>(0);

  // Fetch critical above-the-fold content first
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`/api/content?page=home&t=${Date.now()}`, {
          cache: "no-store",
        });
        const result = await response.json();

        if (result.success) {
          console.log("Homepage - Initial content loaded:", {
            contentCount: result.data.content?.length || 0,
            hasHeroImage: result.data.content?.some(
              (item: any) => item.content_key === "hero_image"
            ),
            hasHeroType: result.data.content?.some(
              (item: any) => item.content_key === "hero_type"
            ),
            lastUpdated: result.lastUpdated,
          });
          setContentItems(result.data.content);
          if (result.lastUpdated) {
            setLastKnownTimestamp(result.lastUpdated);
          }
        }

        // Also fetch categories
        const catResponse = await fetch(`/api/products?t=${Date.now()}`, {
          cache: "no-store",
        });
        const catResult = await catResponse.json();
        if (catResult.success && catResult.data.categories) {
          setCategories(catResult.data.categories);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setHeroLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Real-time sync mechanism for immediate updates
  useEffect(() => {
    if (lastKnownTimestamp === 0) return;

    const checkForUpdates = async () => {
      try {
        const response = await fetch("/api/sync/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: "home" }),
          cache: "no-store",
        });

        const result = await response.json();

        if (
          result.success &&
          result.lastUpdated &&
          result.lastUpdated > lastKnownTimestamp
        ) {
          console.log("Homepage - Content update detected, refreshing...", {
            old: lastKnownTimestamp,
            new: result.lastUpdated,
            page: "home",
          });

          // Fetch updated content
          const contentResponse = await fetch(
            `/api/content?page=home&t=${Date.now()}`,
            { cache: "no-store" }
          );
          const contentResult = await contentResponse.json();

          if (
            contentResult.success &&
            contentResult.data &&
            contentResult.data.content
          ) {
            console.log("Homepage - Content updated via polling:", {
              contentCount: contentResult.data.content?.length || 0,
              hasHeroImage: contentResult.data.content?.some(
                (item: any) => item.content_key === "hero_image"
              ),
              hasHeroType: contentResult.data.content?.some(
                (item: any) => item.content_key === "hero_type"
              ),
            });
            setContentItems(contentResult.data.content);
            setLastKnownTimestamp(result.lastUpdated);
          }
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    // Check for updates every 30 seconds (reduced frequency)
    const interval = setInterval(checkForUpdates, 30000);
    return () => clearInterval(interval);
  }, [lastKnownTimestamp]);

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

  const keyCustomersTitle =
    contentItems.find(
      (item) => item.section === "key_customers" && item.content_key === "title"
    )?.content_value || "Key Customers";

  const keyCustomersDescription =
    contentItems.find(
      (item) =>
        item.section === "key_customers" && item.content_key === "description"
    )?.content_value || "Trusted by leading companies across industries";

  const keyApprovalsTitle =
    contentItems.find(
      (item) => item.section === "key_approvals" && item.content_key === "title"
    )?.content_value || "Certifications & Approvals";

  const keyApprovalsDescription =
    contentItems.find(
      (item) =>
        item.section === "key_approvals" && item.content_key === "description"
    )?.content_value ||
    "Quality assured through industry-standard certifications";

  // Get hero media type and content
  const heroType =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "hero_type"
    )?.content_value || "image";

  const heroImageFromAPI = contentItems.find(
    (item) => item.section === "hero" && item.content_key === "hero_image"
  )?.content_value;

  const heroVideoUrl = contentItems.find(
    (item) => item.section === "hero" && item.content_key === "hero_video_url"
  )?.content_value;

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
                    className="text-3xl lg:text-4xl font-black text-foreground leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {heroHeadline}
                  </h1>
                  <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {heroDescription}
                  </p>
                </>
              )}

              <div className="flex justify-center lg:justify-start">
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
              </div>
            </div>

            <div className="block mt-8 lg:mt-0">
              <div className="relative">
                {heroLoading ? (
                  <div className="aspect-video rounded-lg bg-muted/50 animate-pulse shadow-2xl"></div>
                ) : heroType === "video" && heroVideoUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                    {heroVideoUrl.includes("youtube.com") ||
                    heroVideoUrl.includes("youtu.be") ? (
                      <iframe
                        src={
                          heroVideoUrl.includes("youtube.com")
                            ? `https://www.youtube.com/embed/${
                                heroVideoUrl.split("v=")[1]?.split("&")[0]
                              }`
                            : `https://www.youtube.com/embed/${
                                heroVideoUrl
                                  .split("youtu.be/")[1]
                                  ?.split("?")[0]
                              }`
                        }
                        title="Company Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : heroVideoUrl.includes("vimeo.com") ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${
                          heroVideoUrl.split("vimeo.com/")[1]?.split("?")[0]
                        }`}
                        title="Company Video"
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video controls className="w-full h-full object-cover">
                        <source src={heroVideoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ) : heroImageFromAPI ? (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={heroImageFromAPI}
                      alt="Yahska Polymers - Leading Construction Chemicals Manufacturer"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-muted/20 border-2 border-dashed border-muted-foreground/25 flex items-center justify-center shadow-lg">
                    <div className="text-center p-8">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Hero Image Placeholder
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Add image or video in CMS
                      </p>
                    </div>
                  </div>
                )}
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
              className="text-3xl lg:text-4xl font-black text-foreground mb-6"
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
                  className="aspect-square bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => (
                <Card
                  key={category.id}
                  className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 hover:border-primary/30 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 relative">
                    <OptimizedCategoryImage
                      categoryId={category.id}
                      categoryName={category.name}
                      categoryImageUrl={category.image_url}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
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
              className="bg-primary hover:bg-primary/90 text-white px-8"
            >
              <Link href="/products">
                View All
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
                    className="aspect-square bg-muted animate-pulse rounded-lg"
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
                className="text-3xl lg:text-4xl font-black text-foreground mb-6"
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
                className="bg-primary hover:bg-primary/90 text-white px-8"
              >
                <Link href="/projects">
                  View All
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
        <LazyLogos
          clientTitle={keyCustomersTitle}
          clientDescription={keyCustomersDescription}
          approvalTitle={keyApprovalsTitle}
          approvalDescription={keyApprovalsDescription}
        />
      </LazySection>

      <Footer />
    </div>
  );
}
