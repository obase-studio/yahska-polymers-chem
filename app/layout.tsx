import type React from "react";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/contexts/ProductContext";
import { supabaseHelpers } from "@/lib/supabase-helpers";
import { Navigation } from "@/components/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
});

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
  let branding = { logoUrl: null as string | null, companyName: "Yahska Polymers" };

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
        companyName: nameItem?.content_value?.trim() || "Yahska Polymers",
      };
    }
  } catch (error) {
    console.error("Failed to load navigation data:", error);
  }

  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <style>{`
          html {
            font-family: ${openSans.style.fontFamily};
            --font-heading: ${montserrat.style.fontFamily};
            --font-body: ${openSans.style.fontFamily};
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
          <Navigation
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
