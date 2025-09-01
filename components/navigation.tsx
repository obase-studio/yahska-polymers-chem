"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useProductContext } from "@/contexts/ProductContext";

interface Category {
  id: string;
  name: string;
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { setSelectedCategory } = useProductContext();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Function to close dropdown when category is selected
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setDropdownOpen(false); // Close the dropdown
  };

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        const result = await response.json();

        if (result.success && result.data) {
          // Filter active categories and sort by sort_order
          const activeCategories = result.data
            .filter((cat: any) => cat.is_active)
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .slice(0, 8); // Show max 8 categories in dropdown

          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to static categories
        setCategories([
          { id: "admixtures", name: "Admixtures" },
          { id: "accelerators", name: "Accelerators" },
          { id: "waterproofing", name: "Waterproofing" },
          { id: "grouts", name: "Grouts" },
        ]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-primary">
                Yahska Polymers
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/about"
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                About Us
              </Link>

              {/* Products Dropdown */}
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className="flex items-center text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id}>
                      <Link
                        href="/products"
                        className="w-full"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {categories.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem>
                    <Link
                      href="/products"
                      className="w-full font-semibold text-primary hover:text-primary/80"
                      onClick={() => handleCategorySelect("all")}
                    >
                      See All
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/projects"
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Projects
              </Link>
              <Link
                href="/clients"
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Clients
              </Link>
              <Link
                href="/contact"
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-foreground hover:text-primary"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border shadow-lg">
              <Link
                href="/about"
                className="text-foreground hover:text-primary hover:bg-muted block px-3 py-3 rounded-md text-base font-medium transition-all duration-200"
                onClick={toggleMenu}
              >
                About Us
              </Link>

              <div className="space-y-1">
                <Link
                  href="/products"
                  className="text-foreground hover:text-primary hover:bg-muted block px-3 py-3 rounded-md text-base font-medium transition-all duration-200"
                  onClick={toggleMenu}
                >
                  Products
                </Link>
                <div className="pl-4 space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href="/products"
                      className="text-muted-foreground hover:text-primary hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        toggleMenu();
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                  {categories.length > 0 && (
                    <Link
                      href="/products"
                      className="text-primary hover:text-primary/80 font-semibold hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                      onClick={() => {
                        setSelectedCategory("all");
                        toggleMenu();
                      }}
                    >
                      See All
                    </Link>
                  )}
                </div>
              </div>

              <Link
                href="/projects"
                className="text-foreground hover:text-primary hover:bg-muted block px-3 py-3 rounded-md text-base font-medium transition-all duration-200"
                onClick={toggleMenu}
              >
                Projects
              </Link>
              <Link
                href="/clients"
                className="text-foreground hover:text-primary hover:bg-muted block px-3 py-3 rounded-md text-base font-medium transition-all duration-200"
                onClick={toggleMenu}
              >
                Clients
              </Link>
              <Link
                href="/contact"
                className="text-foreground hover:text-primary hover:bg-muted block px-3 py-3 rounded-md text-base font-medium transition-all duration-200"
                onClick={toggleMenu}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
