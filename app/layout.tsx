import type React from "react";
import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/contexts/ProductContext";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <ProductProvider>{children}</ProductProvider>
      </body>
    </html>
  );
}
