import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ProductProvider } from "@/contexts/ProductContext";
import { supabaseHelpers } from "@/lib/supabase-helpers";
import { NavigationWrapper } from "@/components/navigation-wrapper";

const headingFontStack = "'Montserrat', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const bodyFontStack = "'Open Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export const metadata: Metadata = {
  title: "Yahska Polymers - Construction Chemicals & Concrete Admixtures",
  description:
    "Leading manufacturer of construction chemicals, concrete admixtures, textile chemicals, and dyestuff chemicals. Quality products for industrial applications.",
  generator: "v0.app",
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
      </head>
      <body className="font-sans antialiased">
        <ProductProvider>
          <NavigationWrapper
            categories={categories}
            projectCategories={projectCategories}
            branding={branding}
          />
          {children}
        </ProductProvider>
      </body>
    </html>
  );
}
