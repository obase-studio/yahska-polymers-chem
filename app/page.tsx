"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  Users,
  Globe,
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
}: CategoryImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [productImage, setProductImage] = useState<string | null>(null);

  const imageUrl = categoryImages[categoryId];

  // Try to fetch a product image for this category if no category image
  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${categoryId}&limit=1`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.products.length > 0) {
            const product = data.data.products[0];
            if (product.image_url) {
              setProductImage(product.image_url);
            }
          }
        }
      } catch (error) {
        console.log("No product image found for category:", categoryName);
      }
    };

    if (!imageUrl && !categoryImageUrl) {
      fetchProductImage();
    }
  }, [categoryId, categoryName, imageUrl, categoryImageUrl]);

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
  const finalImageUrl = categoryImageUrl || imageUrl || productImage;

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
        src={`${finalImageUrl}?retry=${retryCount}`}
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
  categoryId,
  categoryName,
  categoryImageUrl,
}: ProjectCategoryImageProps) {
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
        src={`${categoryImageUrl}?retry=${retryCount}`}
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
  const [categories, setCategories] = useState<any[]>([]);
  const [projectCategories, setProjectCategories] = useState<any[]>([]);
  const [clientLogos, setClientLogos] = useState<any[]>([]);
  const [approvalLogos, setApprovalLogos] = useState<any[]>([]);
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch content and images from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [homeResponse, categoriesResponse, projectCategoriesResponse] =
          await Promise.all([
            fetch("/api/content?page=home"),
            fetch("/api/admin/categories"),
            fetch("/api/admin/project-categories"),
          ]);

        const homeResult = await homeResponse.json();
        const categoriesResult = await categoriesResponse.json();
        const projectCategoriesResult = await projectCategoriesResponse.json();

        if (homeResult.success) {
          setContentItems(homeResult.data.content);
        }

        // Set categories
        if (categoriesResult.success && categoriesResult.data) {
          const activeCategories = categoriesResult.data
            .filter((cat: any) => cat.is_active)
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .slice(0, 4); // Show max 4 categories on homepage
          setCategories(activeCategories);
        }

        // Set project categories
        if (projectCategoriesResult.success && projectCategoriesResult.data) {
          const activeProjectCategories = projectCategoriesResult.data
            .filter((cat: any) => cat.is_active)
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .slice(0, 4); // Show max 4 project categories on homepage
          setProjectCategories(activeProjectCategories);
        }

        // Load category images
        const categoryImagePromises = [
          { category: "construction", section: "construction_image" },
          { category: "concrete", section: "concrete_image" },
          { category: "textile", section: "textile_image" },
          { category: "dyestuff", section: "dyestuff_image" },
        ].map(async ({ category, section }) => {
          const response = await fetch(
            `/api/admin/page-images?page=home&section=${section}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data?.media_files?.file_path) {
              return { category, url: data.media_files.file_path };
            }
          }
          return null;
        });

        const categoryResults = await Promise.all(categoryImagePromises);
        const categoryImageMap: Record<string, string> = {};
        categoryResults.forEach((result) => {
          if (result) {
            categoryImageMap[result.category] = result.url;
          }
        });
        setCategoryImages(categoryImageMap);

        // Fetch client logos
        try {
          const clientLogosResponse = await fetch("/api/client-logos");
          if (clientLogosResponse.ok) {
            const clientLogosData = await clientLogosResponse.json();
            console.log(
              "Client logos loaded successfully:",
              clientLogosData.length,
              "logos"
            );
            const filteredLogos = clientLogosData.filter(
              (logo: any) =>
                logo.filename !== "17.Raj Infrastructure – Pkg 13.jpg"
            );
            // Use URLs directly from API as they're already properly encoded
            setClientLogos(filteredLogos); // Show max 12 client logos
          }
        } catch (error) {
          console.error("Error fetching client logos:", error);
        }

        // Fetch approval logos
        try {
          const approvalLogosResponse = await fetch("/api/approval-logos");
          if (approvalLogosResponse.ok) {
            const approvalLogosData = await approvalLogosResponse.json();
            console.log(
              "Approval logos loaded successfully:",
              approvalLogosData.length,
              "logos"
            );

            // Use URLs directly from API as they should be properly encoded
            setApprovalLogos(approvalLogosData); // Show max 8 approval logos
          }
        } catch (error) {
          console.error("Error fetching approval logos:", error);
        }
      } catch (err) {
        console.error("Error fetching home content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Get content values from new structure
  const heroHeadline =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "headline"
    )?.content_value || "Leading Chemical Solutions for Industrial Excellence!";

  const heroDescription =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "description"
    )?.content_value ||
    "Yahska Polymers Pvt Ltd is a leading construction chemicals manufacturer based in Ahmedabad, proudly serving the Indian construction industry with innovative and reliable solutions for over two decades.";

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
    )?.content_value || "Our Product Categories";

  const productCategoriesDescription =
    contentItems.find(
      (item) =>
        item.section === "product_categories" &&
        item.content_key === "description"
    )?.content_value ||
    "Comprehensive chemical solutions across multiple industries with uncompromising quality standards";

  const projectCategoriesTitle =
    contentItems.find(
      (item) =>
        item.section === "project_categories" && item.content_key === "title"
    )?.content_value || "Our Project Categories";

  const projectCategoriesDescription =
    contentItems.find(
      (item) =>
        item.section === "project_categories" &&
        item.content_key === "description"
    )?.content_value ||
    "Diverse infrastructure and construction projects showcasing our expertise across major industry sectors";

  const keyCustomersTitle =
    contentItems.find(
      (item) => item.section === "key_customers" && item.content_key === "title"
    )?.content_value || "Key Customers";

  const keyCustomersDescription =
    contentItems.find(
      (item) =>
        item.section === "key_customers" && item.content_key === "description"
    )?.content_value ||
    "Leading companies that trust us for their chemical solutions";

  const keyApprovalsTitle =
    contentItems.find(
      (item) => item.section === "key_approvals" && item.content_key === "title"
    )?.content_value || "Key Approvals & Certifications";

  const keyApprovalsDescription =
    contentItems.find(
      (item) =>
        item.section === "key_approvals" && item.content_key === "description"
    )?.content_value ||
    "Recognized and approved by leading authorities across India";

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
                {heroDescription}
              </p>
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
              ) : (
                <img
                  src={
                    heroImageFromAPI ||
                    "https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/uploads/home.webp"
                  }
                  alt="Yahska Polymers Manufacturing Facility"
                  className="rounded-lg shadow-2xl"
                />
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
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {productCategoriesTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {productCategoriesDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              // Get unique icon for each category based on name
              const getCategoryIcon = (name: string) => {
                if (name.toLowerCase().includes("admixture")) return Package;
                if (name.toLowerCase().includes("accelerator")) return Zap;
                if (name.toLowerCase().includes("waterproofing"))
                  return Building2;
                if (name.toLowerCase().includes("grout")) return Wrench;
                if (name.toLowerCase().includes("curing")) return CheckCircle;
                if (name.toLowerCase().includes("micro silica")) return Factory;
                if (name.toLowerCase().includes("floor")) return Building2;
                if (name.toLowerCase().includes("structural")) return Building2;
                if (name.toLowerCase().includes("corrosion")) return Award;
                if (name.toLowerCase().includes("release")) return Truck;
                return Package;
              };
              const CategoryIcon = getCategoryIcon(category.name);

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
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {projectCategoriesTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {projectCategoriesDescription}
            </p>
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
                      categoryId={category.id}
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
        logos={clientLogos.slice(0, 12)}
        title={keyCustomersTitle}
        description={keyCustomersDescription}
        className="bg-muted/30"
      />

      {/* Approval Logos Ribbon */}
      <AutoScrollLogos
        logos={approvalLogos.slice(0, 8)}
        title={keyApprovalsTitle}
        description={keyApprovalsDescription}
        className="bg-background"
      />

      <Footer />
    </div>
  );
}
