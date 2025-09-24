"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Building2,
  Palette,
  Factory,
  Wrench,
  Truck,
  Zap,
  Train,
  MapPin,
  Package,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { AutoScrollLogos } from "@/components/auto-scroll-logos";
import { ContentItem } from "@/lib/database-client";

// Enhanced Category Image Component
interface CategoryImageProps {
  categoryId: string;
  categoryName: string;
  categoryImageUrl?: string;
  categoryImages: Record<string, string>;
  categoryImagesReady: boolean;
}

// Project Category Image Component
interface ProjectCategoryImageProps {
  categoryId: string;
  categoryName: string;
  categoryImageUrl?: string;
}

function CategoryImage({
  categoryId,
  categoryName,
  categoryImageUrl,
  categoryImages,
  categoryImagesReady,
}: CategoryImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [productImage, setProductImage] = useState<string | null>(null);

  const imageUrl = categoryImages[categoryId];

  const finalImageUrl = useMemo(() => {
    // Always prioritize the category's own image_url since page_images is empty
    return categoryImageUrl || imageUrl || productImage;
  }, [categoryImageUrl, imageUrl, productImage]);

  // Try to fetch a product image for this category only after CMS images resolve
  useEffect(() => {
    if (categoryImageUrl || imageUrl) {
      if (productImage !== null) {
        setProductImage(null);
      }
      return;
    }

    if (!categoryImagesReady) {
      return;
    }

    let isMounted = true;

    const fetchProductImage = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${categoryId}&limit=1`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.products.length > 0) {
            const product = data.data.products[0];
            if (product.image_url && isMounted) {
              setProductImage(product.image_url);
            }
          }
        }
      } catch (error) {
        console.log("No product image found for category:", categoryName);
      }
    };

    fetchProductImage();

    return () => {
      isMounted = false;
    };
  }, [
    categoryId,
    categoryName,
    categoryImageUrl,
    imageUrl,
    categoryImagesReady,
  ]);

  useEffect(() => {
    if (!finalImageUrl) {
      return;
    }
    setLoading(true);
    setError(false);
    setRetryCount(0);
  }, [finalImageUrl]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRetry = () => {
    if (retryCount < 2) {
      setError(false);
      setLoading(true);
      setRetryCount((prev) => prev + 1);
    }
  };

  // Get the appropriate icon for the category
  const getCategoryIcon = (name: string) => {
    if (name.toLowerCase().includes("construction")) return Building2;
    if (name.toLowerCase().includes("concrete")) return Factory;
    if (name.toLowerCase().includes("textile")) return Palette;
    if (name.toLowerCase().includes("dyestuff")) return Award;
    if (name.toLowerCase().includes("admixture")) return Zap;
    if (name.toLowerCase().includes("accelerator")) return Zap;
    if (name.toLowerCase().includes("waterproofing")) return Building2;
    if (name.toLowerCase().includes("grout")) return Wrench;
    if (name.toLowerCase().includes("curing")) return CheckCircle;
    if (name.toLowerCase().includes("micro silica")) return Factory;
    if (name.toLowerCase().includes("floor")) return Building2;
    if (name.toLowerCase().includes("structural")) return Building2;
    if (name.toLowerCase().includes("corrosion")) return Award;
    if (name.toLowerCase().includes("release")) return Truck;
    return Package;
  };

  const CategoryIcon = getCategoryIcon(categoryName);
  // Priority: categoryImageUrl (from database) > imageUrl (from old system) > productImage (fallback)
  if (!finalImageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <CategoryIcon className="h-8 w-8 text-primary" />
          </div>
          <p className="text-foreground font-medium text-sm mb-1">
            {categoryName}
          </p>
          <p className="text-muted-foreground text-xs">
            Professional Solutions
          </p>
        </div>
      </div>
    );
  }

  if (error && retryCount >= 2) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <CategoryIcon className="h-8 w-8 text-primary" />
          </div>
          <p className="text-foreground font-medium text-sm mb-1">
            {categoryName}
          </p>
          <p className="text-muted-foreground text-xs mb-2">
            Professional Solutions
          </p>
          <button
            onClick={handleRetry}
            className="text-xs text-primary hover:underline bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const retrySeparator = finalImageUrl.includes("?") ? "&" : "?";
  const imageSrc = `${finalImageUrl}${retrySeparator}retry=${retryCount}`;

  return (
    <div className="relative w-full h-full group">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 z-10">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={categoryName}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

function ProjectCategoryImage({
  categoryName,
  categoryImageUrl,
}: Omit<ProjectCategoryImageProps, 'categoryId'>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const handleRetry = () => {
    if (retryCount < 2) {
      setError(false);
      setLoading(true);
      setRetryCount((prev) => prev + 1);
    }
  };

  // Get the appropriate icon for the project category
  const getProjectCategoryIcon = (name: string) => {
    if (
      name.toLowerCase().includes("rail") ||
      name.toLowerCase().includes("metro")
    )
      return Train;
    if (
      name.toLowerCase().includes("road") ||
      name.toLowerCase().includes("highway")
    )
      return MapPin;
    if (
      name.toLowerCase().includes("building") ||
      name.toLowerCase().includes("factory")
    )
      return Building2;
    if (name.toLowerCase().includes("bridge")) return Building2;
    if (name.toLowerCase().includes("tunnel")) return Building2;
    return Factory;
  };

  const ProjectCategoryIcon = getProjectCategoryIcon(categoryName);

  if (!categoryImageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <ProjectCategoryIcon className="h-8 w-8 text-primary" />
          </div>
          <p className="text-foreground font-medium text-sm mb-1">
            {categoryName}
          </p>
          <p className="text-muted-foreground text-xs">
            Infrastructure Projects
          </p>
        </div>
      </div>
    );
  }

  if (error && retryCount >= 2) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <ProjectCategoryIcon className="h-8 w-8 text-primary" />
          </div>
          <p className="text-foreground font-medium text-sm mb-1">
            {categoryName}
          </p>
          <p className="text-muted-foreground text-xs mb-2">
            Infrastructure Projects
          </p>
          <button
            onClick={handleRetry}
            className="text-xs text-primary hover:underline bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const retrySeparator = categoryImageUrl.includes("?") ? "&" : "?";
  const imageSrc = `${categoryImageUrl}${retrySeparator}retry=${retryCount}`;

  return (
    <div className="relative w-full h-full group">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 z-10">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={categoryName}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export default function HomePage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(
    {}
  );
  const [categoryImagesReady, setCategoryImagesReady] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [projectCategories, setProjectCategories] = useState<any[]>([]);
  const [clientLogos, setClientLogos] = useState<any[]>([]);
  const [approvalLogos, setApprovalLogos] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  // Fetch all homepage data from optimized endpoint
  useEffect(() => {
    const fetchHomepageData = async () => {
      setLoading(true);
      setCategoryImagesReady(false);

      try {
        const response = await fetch("/api/homepage-data");
        const result = await response.json();

        if (result.success) {
          const {
            content,
            categories,
            projectCategories,
            clientLogos,
            approvalLogos,
            categoryImages
          } = result.data;

          // Set all data at once
          setContentItems(content);
          setCategories(categories);
          setProjectCategories(projectCategories);
          setClientLogos(clientLogos);
          setApprovalLogos(approvalLogos);
          setCategoryImages(categoryImages);
          setCategoryImagesReady(true);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);


  // Get content values from new structure
  const heroHeadline =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "headline"
    )?.content_value || "";

  const heroDescription =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "description"
    )?.content_value || "";

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

  const productCategoriesTitle =
    contentItems.find(
      (item) =>
        item.section === "product_categories" && item.content_key === "title"
    )?.content_value || "";

  const productCategoriesDescription =
    contentItems.find(
      (item) =>
        item.section === "product_categories" &&
        item.content_key === "description"
    )?.content_value || "";

  const projectCategoriesTitle =
    contentItems.find(
      (item) =>
        item.section === "project_categories" && item.content_key === "title"
    )?.content_value || "";

  const projectCategoriesDescription =
    contentItems.find(
      (item) =>
        item.section === "project_categories" &&
        item.content_key === "description"
    )?.content_value || "";

  const keyCustomersTitle =
    contentItems.find(
      (item) => item.section === "key_customers" && item.content_key === "title"
    )?.content_value || "";

  const keyCustomersDescription =
    contentItems.find(
      (item) =>
        item.section === "key_customers" && item.content_key === "description"
    )?.content_value || "";

  const keyApprovalsTitle =
    contentItems.find(
      (item) => item.section === "key_approvals" && item.content_key === "title"
    )?.content_value || "";

  const keyApprovalsDescription =
    contentItems.find(
      (item) =>
        item.section === "key_approvals" && item.content_key === "description"
    )?.content_value || "";

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-accent/5 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {heroHeadline && (
                <h1
                  className="text-4xl lg:text-6xl font-black text-foreground mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {heroHeadline}
                </h1>
              )}
              {heroDescription && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {heroDescription}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link href="/products">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {/* <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get Quote</Link>
                </Button> */}
              </div>
            </div>
            <div className="relative">
              {heroType === "video" && heroVideoUrl ? (
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
                              heroVideoUrl.split("youtu.be/")[1]?.split("?")[0]
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
                <img
                  src={heroImageFromAPI}
                  alt="Yahska Polymers Manufacturing Facility"
                  className="rounded-lg shadow-2xl object-cover w-full"
                />
              ) : (
                <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 shadow-2xl" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-muted/50">
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
      </section> */}

      {/* Products Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {productCategoriesTitle && (
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {productCategoriesTitle}
              </h2>
            )}
            {productCategoriesDescription && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {productCategoriesDescription}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => {

              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 hover:border-primary/30 overflow-hidden flex flex-col"
                >
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 relative">
                    <CategoryImage
                      categoryId={category.id}
                      categoryName={category.name}
                      categoryImageUrl={category.image_url}
                      categoryImages={categoryImages}
                      categoryImagesReady={categoryImagesReady}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {/* Hover overlay with quick info */}
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium">
                        Industrial Grade Quality
                      </p>
                    </div> */}
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="mb-4 flex-grow">
                      <CardTitle className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {category.description ||
                          `Professional grade ${category.name.toLowerCase()} solutions designed for demanding industrial applications and construction projects.`}
                      </CardDescription>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 justify-between border-muted group-hover:border-primary mt-auto"
                    >
                      <Link href={`/products?category=${category.id}`}>
                        <span>View Products</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* See All Products Button */}
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border-muted px-8"
            >
              <Link href="/products">
                <span>See All Products</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Project Categories Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {projectCategoriesTitle && (
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {projectCategoriesTitle}
              </h2>
            )}
            {projectCategoriesDescription && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {projectCategoriesDescription}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projectCategories.map((category) => {
              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 hover:border-primary/30 overflow-hidden flex flex-col"
                >
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 relative">
                    <ProjectCategoryImage
                      categoryName={category.name}
                      categoryImageUrl={category.icon_url}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="mb-4 flex-grow">
                      <CardTitle className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {category.description ||
                          `Professional ${category.name.toLowerCase()} solutions for infrastructure projects and construction applications.`}
                      </CardDescription>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 justify-between border-muted group-hover:border-primary mt-auto"
                    >
                      <Link href={`/projects?category=${category.id}`}>
                        <span>View Projects</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

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

      {/* Client Logos Ribbon */}
      <AutoScrollLogos
        logos={clientLogos}
        title={keyCustomersTitle}
        description={keyCustomersDescription}
        className="bg-muted/30"
      />

      {/* Approval Logos Ribbon */}
      <AutoScrollLogos
        logos={approvalLogos}
        title={keyApprovalsTitle}
        description={keyApprovalsDescription}
        className="bg-background"
      />

      <Footer />
    </div>
  );
}
