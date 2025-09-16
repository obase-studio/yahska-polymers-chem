"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const [categories, setCategories] = useState<any[]>([]);
  const [companyProfileUrl, setCompanyProfileUrl] = useState<string>("");

  // Function to format URL properly
  const formatUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `/api/admin/categories?t=${Date.now()}`,
          { cache: "no-store" }
        );
        const result = await response.json();

        if (result.success && result.data) {
          const activeCategories = result.data
            .filter((cat: any) => cat.is_active)
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .slice(0, 6); // Show max 6 categories in footer

          setCategories(activeCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    const fetchCompanyProfileUrl = async () => {
      try {
        const response = await fetch(
          `/api/content?page=footer&t=${Date.now()}`,
          { cache: "no-store" }
        );
        const result = await response.json();

        if (result.success && result.data.content) {
          const items = result.data.content as Array<any>;
          const profileItem = items.find(
            (item) =>
              item.section === "company_profile" &&
              item.content_key === "download_url"
          );
          setCompanyProfileUrl(profileItem?.content_value || "");
        } else {
          setCompanyProfileUrl("");
        }
      } catch (error) {
        console.error("Error fetching company profile URL:", error);
        setCompanyProfileUrl("");
      }
    };

    fetchCategories();
    fetchCompanyProfileUrl();
  }, []);

  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Our Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                {companyProfileUrl ? (
                  <Link
                    href={formatUrl(companyProfileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Download Company Profile
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Contact admin@yahskapolymers.com for the latest version of company profile."
                      )
                    }
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                  >
                    Download Company Profile
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Our Products</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products?category=all"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-semibold"
                >
                  View All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Our Projects</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/projects?category=bullet-train"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  High Speed Rail
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=metro-rail"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Metro & Rail
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=roads"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Roads & Highways
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=buildings-factories"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Buildings & Factories
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=others"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Other Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=all"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-semibold"
                >
                  View All Projects
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12" />

        <Separator className="mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © 2024 Yahska Polymers Private Limited. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-4 text-sm">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
