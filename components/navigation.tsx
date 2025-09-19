"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface ProjectCategory {
  id: string;
  name: string;
}

interface NavigationProps {
  categories: Category[];
  projectCategories: ProjectCategory[];
  branding: {
    logoUrl: string | null;
    companyName: string;
  };
}

export function Navigation({
  categories,
  projectCategories,
  branding,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const { setSelectedCategory } = useProductContext();
  const { logoUrl, companyName } = branding;
  const router = useRouter();

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileProductsOpen(false);
    setMobileProjectsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => {
      if (prev) {
        setMobileProductsOpen(false);
        setMobileProjectsOpen(false);
      }
      return !prev;
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setDropdownOpen(false);
    if (isOpen) {
      closeMobileMenu();
    }
    const target =
      categoryId === "all"
        ? "/products"
        : `/products?category=${categoryId}`;
    router.push(target);
  };

  const goToProjectCategory = (categoryId: string | "all") => {
    setProjectDropdownOpen(false);
    if (isOpen) {
      closeMobileMenu();
    }
    const target =
      categoryId === "all"
        ? "/projects"
        : `/projects?category=${categoryId}`;
    router.push(target);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Yahska Polymers logo"
                  className="h-9 w-auto"
                />
              )}
              <div className="text-2xl font-bold text-primary">
                {companyName}
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
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                  {categories.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => handleCategorySelect("all")}
                    className="cursor-pointer font-semibold text-primary hover:text-primary/80"
                  >
                    See All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu
                open={projectDropdownOpen}
                onOpenChange={setProjectDropdownOpen}
              >
                <DropdownMenuTrigger className="flex items-center text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Projects
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {projectCategories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => goToProjectCategory(category.id)}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                  {projectCategories.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => goToProjectCategory("all")}
                    className="cursor-pointer font-semibold text-primary hover:text-primary/80"
                  >
                    See All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen((prev) => !prev)}
                  aria-expanded={mobileProductsOpen}
                  aria-controls="mobile-products-list"
                  className="w-full flex items-center justify-between text-foreground hover:text-primary hover:bg-muted px-3 py-3 rounded-md text-base font-medium transition-all duration-200"
                >
                  <span>Products</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileProductsOpen && (
                  <div
                    id="mobile-products-list"
                    className="pl-4 space-y-1"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href="/products"
                        className="text-muted-foreground hover:text-primary hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                        onClick={() => {
                          handleCategorySelect(category.id);
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
                          handleCategorySelect("all");
                        }}
                      >
                        See All Products
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setMobileProjectsOpen((prev) => !prev)}
                  aria-expanded={mobileProjectsOpen}
                  aria-controls="mobile-projects-list"
                  className="w-full flex items-center justify-between text-foreground hover:text-primary hover:bg-muted px-3 py-3 rounded-md text-base font-medium transition-all duration-200"
                >
                  <span>Projects</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileProjectsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileProjectsOpen && (
                  <div
                    id="mobile-projects-list"
                    className="pl-4 space-y-1"
                  >
                    {projectCategories.map((category) => (
                      <Link
                        key={category.id}
                        href="/projects"
                        className="text-muted-foreground hover:text-primary hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                        onClick={() => {
                          goToProjectCategory(category.id);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                    {projectCategories.length > 0 && (
                      <Link
                        href="/projects"
                        className="text-primary hover:text-primary/80 font-semibold hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                        onClick={() => {
                          goToProjectCategory("all");
                        }}
                      >
                        See All Projects
                      </Link>
                    )}
                  </div>
                )}
              </div>
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
