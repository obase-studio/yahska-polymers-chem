import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ProductProvider } from "@/contexts/ProductContext";
import { supabaseHelpers } from "@/lib/supabase-helpers";
import { NavigationWrapper } from "@/components/navigation-wrapper";
import { PerformanceMonitor } from "@/components/performance-monitor";

const headingFontStack = "'Montserrat', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const bodyFontStack = "'Open Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export const metadata: Metadata = {
  title: "Yahska Polymers - Construction Chemicals & Concrete Admixtures",
  description:
    "Leading manufacturer of construction chemicals, concrete admixtures, textile chemicals, and dyestuff chemicals. Quality products for industrial applications.",
  generator: "v0.app",
  keywords: "construction chemicals, concrete admixtures, textile chemicals, dyestuff chemicals, industrial chemicals, building materials",
  authors: [{ name: "Yahska Polymers" }],
  creator: "Yahska Polymers",
  publisher: "Yahska Polymers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yahskapolymers.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Yahska Polymers - Construction Chemicals & Concrete Admixtures',
    description: 'Leading manufacturer of construction chemicals, concrete admixtures, textile chemicals, and dyestuff chemicals.',
    siteName: 'Yahska Polymers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yahska Polymers - Construction Chemicals & Concrete Admixtures',
    description: 'Leading manufacturer of construction chemicals, concrete admixtures, textile chemicals, and dyestuff chemicals.',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: { id: string; name: string }[] = [];
  let projectCategories: { id: string; name: string }[] = [];
  let branding = { logoUrl: null as string | null, companyName: "" };

  try {
    const [categoryData, projectCategoryData, headerContent] = await Promise.all([
      supabaseHelpers.getAllCategories(),
      supabaseHelpers.getAllProjectCategories(),
      supabaseHelpers.getContent("header"),
    ]);

    categories = (categoryData || []).map((cat: any) => ({ id: cat.id, name: cat.name }));
    projectCategories = (projectCategoryData || []).map((cat: any) => ({ id: cat.id, name: cat.name }));

    if (Array.isArray(headerContent)) {
      const logoItem = headerContent.find(
        (item: any) => item.section === "branding" && item.content_key === "logo"
      );
      const nameItem = headerContent.find(
        (item: any) => item.section === "branding" && item.content_key === "company_name"
      );
      branding = {
        logoUrl: logoItem?.content_value || null,
        companyName: nameItem?.content_value?.trim() || "",
      };
    }
  } catch (error) {
    console.error("Failed to load navigation data:", error);
  }

  return (
    <html lang="en">
      <head>
        <style>{`
          html {
            font-family: ${bodyFontStack};
            --font-heading: ${headingFontStack};
            --font-body: ${bodyFontStack};
          }
        `}</style>
        <link
          rel="preload"
          href="https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media/uploads/home.webp"
          as="image"
          type="image/webp"
        />
        <link rel="dns-prefetch" href="https://jlbwwbnatmmkcizqprdx.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <PerformanceMonitor>
          <ProductProvider>
            <NavigationWrapper
              categories={categories}
              projectCategories={projectCategories}
              branding={branding}
            />
            {children}
          </ProductProvider>
        </PerformanceMonitor>
      </body>
    </html>
  );
}
