import { unstable_cache } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { LazySection } from "@/components/lazy-section";
import { LazyProjectCategories } from "@/components/lazy-project-categories";
import { LazyLogos } from "@/components/lazy-logos";
import { supabaseHelpers } from "@/lib/supabase-helpers";
import type { ContentItem } from "@/lib/database-client";

interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active?: boolean;
}

interface ProjectCategory {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
  sort_order: number;
  is_active?: boolean;
}

const getHomepageContent = unstable_cache(async () => {
  const content = await supabaseHelpers.getContent("home");
  return Array.isArray(content) ? (content as ContentItem[]) : [];
}, ["homepage-content"], {
  tags: ["content"],
  revalidate: 300,
});

const getHomepageCategories = unstable_cache(async () => {
  const categories = await supabaseHelpers.getAllCategories();
  return Array.isArray(categories)
    ? (categories as ProductCategory[])
        .filter((category) => category.is_active !== false)
        .sort(
          (a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER)
        )
    : [];
}, ["homepage-categories"], {
  tags: ["categories", "navigation"],
  revalidate: 300,
});

const getHomepageProjectCategories = unstable_cache(async () => {
  const categories = await supabaseHelpers.getAllProjectCategories();
  return Array.isArray(categories)
    ? (categories as ProjectCategory[])
        .filter((category) => category.is_active !== false)
        .sort(
          (a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER)
        )
        .slice(0, 4)
    : [];
}, ["homepage-project-categories"], {
  tags: ["project-categories", "projects"],
  revalidate: 300,
});

const getHomepageLogos = unstable_cache(async () => {
  return await supabaseHelpers.getHomepageLogos();
}, ["homepage-logos"], {
  tags: ["media"],
  revalidate: 900,
});

const getFooterContent = unstable_cache(async () => {
  const footerContent = await supabaseHelpers.getContent("footer");
  return Array.isArray(footerContent) ? (footerContent as ContentItem[]) : [];
}, ["footer-content"], {
  tags: ["content"],
  revalidate: 300,
});

function getContentValue(
  contentItems: ContentItem[],
  section: string,
  key: string,
  fallback: string
) {
  return (
    contentItems.find(
      (item) => item.section === section && item.content_key === key
    )?.content_value ?? fallback
  );
}

function getHeroVideoEmbedUrl(url: string) {
  try {
    if (url.includes("youtube.com")) {
      const parsed = new URL(url);
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (url.includes("youtu.be")) {
      const parsed = new URL(url);
      const videoId = parsed.pathname.replace("/", "");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (url.includes("vimeo.com")) {
      const parsed = new URL(url);
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
  } catch (error) {
    console.error("Failed to parse hero video URL", error);
  }

  return null;
}

export default async function HomePage() {
  const [contentItems, categories, projectCategories, logos, footerContent] =
    await Promise.all([
      getHomepageContent(),
      getHomepageCategories(),
      getHomepageProjectCategories(),
      getHomepageLogos(),
      getFooterContent(),
    ]);

  const { clientLogos = [], approvalLogos = [] } = logos ?? {
    clientLogos: [],
    approvalLogos: [],
  };

  const heroHeadline = getContentValue(
    contentItems,
    "hero",
    "headline",
    "Leading Chemical Solutions Provider"
  );

  const heroDescription = getContentValue(
    contentItems,
    "hero",
    "description",
    "Comprehensive chemical solutions across multiple industries with uncompromising quality standards."
  );

  const productCategoriesTitle = getContentValue(
    contentItems,
    "product_categories",
    "title",
    "Our Product Categories"
  );

  const productCategoriesDescription = getContentValue(
    contentItems,
    "product_categories",
    "description",
    "Comprehensive chemical solutions across multiple industries with uncompromising quality standards."
  );

  const projectCategoriesTitle = getContentValue(
    contentItems,
    "project_categories",
    "title",
    "Our Projects"
  );

  const projectCategoriesDescription = getContentValue(
    contentItems,
    "project_categories",
    "description",
    "Discover our successful project implementations across various industries and sectors."
  );

  const keyCustomersTitle = getContentValue(
    contentItems,
    "key_customers",
    "title",
    "Key Customers"
  );

  const keyCustomersDescription = getContentValue(
    contentItems,
    "key_customers",
    "description",
    "Trusted by leading companies across industries"
  );

  const keyApprovalsTitle = getContentValue(
    contentItems,
    "key_approvals",
    "title",
    "Certifications & Approvals"
  );

  const keyApprovalsDescription = getContentValue(
    contentItems,
    "key_approvals",
    "description",
    "Quality assured through industry-standard certifications"
  );

  const heroType = getContentValue(contentItems, "hero", "hero_type", "image");
  const heroImageUrl = getContentValue(contentItems, "hero", "hero_image", "");
  const heroVideoUrl = getContentValue(
    contentItems,
    "hero",
    "hero_video_url",
    ""
  );

  const heroVideoEmbedUrl = heroType === "video" ? getHeroVideoEmbedUrl(heroVideoUrl) : null;

  const displayedCategories = categories.slice(0, 8);

  const footerCategories = categories
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 6)
    .map((category) => ({ id: category.id, name: category.name }));

  const companyProfileUrl = footerContent.find(
    (item) =>
      item.section === "company_profile" && item.content_key === "download_url"
  )?.content_value;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-8 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="block order-1 lg:order-2">
              <div className="relative">
                {heroType === "video" && heroVideoEmbedUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                      src={heroVideoEmbedUrl}
                      title="Company Video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : heroType === "video" && heroVideoUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                    <video controls className="w-full h-full object-cover">
                      <source src={heroVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : heroImageUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl relative">
                    <Image
                      src={heroImageUrl}
                      alt="Yahska Polymers Manufacturing Facility"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-muted/50 flex items-center justify-center shadow-2xl">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="space-y-6">
                <h1
                  className="text-3xl lg:text-4xl text-foreground leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {heroHeadline}
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {heroDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedCategories.length > 0 ? (
              displayedCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-white cursor-pointer">
                    <CardContent className="p-6 h-full flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-lg text-gray-900 uppercase tracking-wide group-hover:text-orange-600 transition-colors duration-300">
                          {category.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              [...Array(8)].map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  className="aspect-square bg-muted animate-pulse rounded-lg"
                />
              ))
            )}
          </div>

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
                className="text-3xl lg:text-4xl text-foreground mb-6 font-normal"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {projectCategoriesTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {projectCategoriesDescription}
              </p>
            </div>

            {projectCategories.length > 0 ? (
              <LazyProjectCategories initialCategories={projectCategories} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={`project-skeleton-${index}`}
                    className="aspect-square bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            )}

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
          initialClientLogos={clientLogos}
          initialApprovalLogos={approvalLogos}
        />
      </LazySection>

      <Footer
        categories={footerCategories}
        companyProfileUrl={companyProfileUrl}
        disableFetch
      />
    </div>
  );
}
