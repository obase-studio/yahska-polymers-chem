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
import { ContentItem } from "@/lib/database-client";

// Enhanced Category Image Component
interface CategoryImageProps {
  categoryId: string;
  categoryName: string;
  categoryImages: Record<string, string>;
}

function CategoryImage({ categoryId, categoryName, categoryImages }: CategoryImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const imageUrl = categoryImages[categoryId];
  
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
      setRetryCount(prev => prev + 1);
    }
  };
  
  if (!imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">{categoryName}</p>
        </div>
      </div>
    );
  }
  
  if (error && retryCount >= 2) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground text-xs mb-2">{categoryName}</p>
          <button 
            onClick={handleRetry}
            className="text-xs text-primary hover:underline"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <img
        src={`${imageUrl}?retry=${retryCount}`}
        alt={categoryName}
        className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}

export default function HomePage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(
    {}
  );
  const [categories, setCategories] = useState<any[]>([]);
  const [clientLogos, setClientLogos] = useState<any[]>([]);
  const [approvalLogos, setApprovalLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch content and images from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [homeResponse, aboutResponse, categoriesResponse] = await Promise.all([
          fetch("/api/content?page=home"),
          fetch("/api/content?page=about"),
          fetch("/api/admin/categories"),
        ]);

        const homeResult = await homeResponse.json();
        const aboutResult = await aboutResponse.json();
        const categoriesResult = await categoriesResponse.json();

        if (homeResult.success) {
          let allContent = homeResult.data.content;

          // Add About page content for "Our Story"
          if (aboutResult.success && aboutResult.data.content) {
            const ourStoryItem = aboutResult.data.content.find(
              (item: any) =>
                item.section === "our_story" && item.content_key === "content"
            );
            if (ourStoryItem) {
              allContent = [...allContent, ourStoryItem];
            }
          }

          setContentItems(allContent);
        }

        // Set categories
        if (categoriesResult.success && categoriesResult.data) {
          const activeCategories = categoriesResult.data
            .filter((cat: any) => cat.is_active)
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .slice(0, 4); // Show max 4 categories on homepage
          setCategories(activeCategories);

          // Preload hero image first
          const heroImageUrl =
            "https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/uploads/home.webp";
          const img = new Image();
          img.onload = () => {
            setHeroImage(heroImageUrl);
          };
          img.src = heroImageUrl;

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
              console.log('Client logos loaded successfully:', clientLogosData.length, 'logos');
              
              // Use URLs directly from API as they're already properly encoded
              setClientLogos(clientLogosData.slice(0, 12)); // Show max 12 client logos
            }
          } catch (error) {
            console.error("Error fetching client logos:", error);
          }

          // Fetch approval logos
          try {
            const approvalLogosResponse = await fetch("/api/approval-logos");
            if (approvalLogosResponse.ok) {
              const approvalLogosData = await approvalLogosResponse.json();
              console.log('Approval logos loaded successfully:', approvalLogosData.length, 'logos');
              
              // Use URLs directly from API as they should be properly encoded
              setApprovalLogos(approvalLogosData.slice(0, 8)); // Show max 8 approval logos
            }
          } catch (error) {
            console.error("Error fetching approval logos:", error);
          }
        }
      } catch (err) {
        console.error("Error fetching home content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Get content values
  const heroHeadline =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "headline"
    )?.content_value || "Leading Chemical Solutions for Industrial Excellence";

  const companyDescription =
    contentItems.find(
      (item) =>
        item.section === "company_overview" &&
        item.content_key === "company_description"
    )?.content_value || "";

  const productCategoriesDescription =
    contentItems.find(
      (item) =>
        item.section === "product_categories" &&
        item.content_key === "description"
    )?.content_value || "";

  const whyChooseUsDescription =
    contentItems.find(
      (item) =>
        item.section === "why_choose_us" && item.content_key === "description"
    )?.content_value || "";

  const featuredClientsDescription =
    contentItems.find(
      (item) =>
        item.section === "featured_clients" &&
        item.content_key === "description"
    )?.content_value || "";

  const industriesDescription =
    contentItems.find(
      (item) =>
        item.section === "industries" && item.content_key === "description"
    )?.content_value || "";

  const ctaHeadline =
    contentItems.find(
      (item) => item.section === "cta" && item.content_key === "headline"
    )?.content_value || "";

  const ctaDescription =
    contentItems.find(
      (item) => item.section === "cta" && item.content_key === "description"
    )?.content_value || "";

  // Get full "Our Story" content from About page
  const getFullStoryDescription = () => {
    const ourStoryContent = contentItems.find(
      (item) => item.section === "our_story" && item.content_key === "content"
    )?.content_value;

    if (ourStoryContent) {
      // Extract the first paragraph which is the main introduction
      const firstParagraph = ourStoryContent.split("\n")[0];
      return firstParagraph;
    }

    return (
      companyDescription ||
      "Yahska Polymers Pvt Ltd is a leading construction chemicals manufacturer based in Ahmedabad, proudly serving the Indian construction industry with innovative and reliable solutions for over two decades. As one of the leading names in the field, our mission is simple—to build stronger, safer, and more sustainable structures through chemistry that performs."
    );
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
              <img
                src={
                  heroImage ||
                  "https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/uploads/home.webp"
                }
                alt="Yahska Polymers Manufacturing Facility"
                className="rounded-lg shadow-2xl"
              />
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
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                  <CategoryImage
                    categoryId={category.id}
                    categoryName={category.name}
                    categoryImages={categoryImages}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-primary">
                    {category.name}
                  </CardTitle>
                  <CardDescription>
                    {category.description || `Quality ${category.name.toLowerCase()} for industrial applications`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/products?category=${category.id}`}>
                        View Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
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
                ISO certified manufacturing processes ensuring consistent
                quality and reliability in every product batch.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
              <p className="text-muted-foreground">
                Dedicated technical team providing comprehensive support from
                product selection to application guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Reach</h3>
              <p className="text-muted-foreground">
                Serving clients across multiple countries with reliable supply
                chain and logistics network.
              </p>
            </div>
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
              Diverse infrastructure and construction projects showcasing our
              expertise across major industry sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Train className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">High Speed Rail</h3>
                <p className="text-muted-foreground text-sm">
                  Bullet train and rapid transit infrastructure projects
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Train className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Metro & Rail</h3>
                <p className="text-muted-foreground text-sm">
                  Urban metro systems and railway infrastructure
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Roads & Highways</h3>
                <p className="text-muted-foreground text-sm">
                  Expressways, highways and road infrastructure
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Buildings & Factories
                </h3>
                <p className="text-muted-foreground text-sm">
                  Commercial buildings and industrial facilities
                </p>
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
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
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

      {/* Client Logos Ribbon */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Key Customers
            </h3>
            <p className="text-sm text-muted-foreground">
              Leading companies that trust us for their chemical solutions
            </p>
          </div>
          {clientLogos.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex items-center gap-6 pb-4" style={{ width: 'fit-content', minWidth: '100%' }}>
                {clientLogos.map((logo) => (
                  <Card
                    key={logo.id}
                    className="flex-shrink-0 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border border-border/50"
                  >
                    <CardContent className="p-6 flex items-center justify-center h-24">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={logo.file_path}
                          alt={
                            logo.alt_text ||
                            logo.original_name.replace(
                              /\.(jpg|jpeg|png|webp)$/i,
                              ""
                            )
                          }
                          className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                          onError={(e) => {
                            console.log(
                              "Image failed to load:",
                              logo.file_path,
                              e
                            );
                            // Fallback to company name text
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="text-xs text-center text-muted-foreground p-2">${logo.original_name.replace(
                                /\.(jpg|jpeg|png|webp)$/i,
                                ""
                              )}</div>`;
                            }
                          }}
                          onLoad={() =>
                            console.log(
                              "Image loaded successfully:",
                              logo.original_name
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Loading client logos...</p>
            </div>
          )}
        </div>
      </section>

      {/* Approval Logos Ribbon */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Key Approvals & Certifications
            </h3>
            <p className="text-sm text-muted-foreground">
              Recognized and approved by leading authorities across India
            </p>
          </div>
          {approvalLogos.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex items-center gap-6 pb-4" style={{ width: 'fit-content', minWidth: '100%' }}>
                {approvalLogos.map((approval) => (
                  <Card
                    key={approval.id}
                    className="flex-shrink-0 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border border-border/50"
                  >
                    <CardContent className="p-6 flex items-center justify-center h-24">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={approval.file_path}
                          alt={
                            approval.alt_text ||
                            approval.original_name.replace(
                              /\.(jpg|jpeg|png|webp|svg)$/i,
                              ""
                            )
                          }
                          className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                          onError={(e) => {
                            console.log(
                              "Approval image failed to load:",
                              approval.file_path,
                              e
                            );
                            // Fallback to approval name text
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="text-xs text-center text-muted-foreground p-2">${approval.original_name.replace(
                                /\.(jpg|jpeg|png|webp|svg)$/i,
                                ""
                              )}</div>`;
                            }
                          }}
                          onLoad={() =>
                            console.log(
                              "Approval image loaded successfully:",
                              approval.original_name
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Loading approval logos...</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
