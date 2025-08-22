"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-primary">Yahska Polymers</div>
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
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors duration-200">
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/products?category=construction">Construction Chemicals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/products?category=concrete">Concrete Admixtures</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/products?category=textile">Textile Chemicals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/products?category=dyestuff">Dyestuff Chemicals</Link>
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

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu} className="text-foreground hover:text-primary">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                  <Link
                    href="/products?category=construction"
                    className="text-muted-foreground hover:text-primary hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Construction Chemicals
                  </Link>
                  <Link
                    href="/products?category=concrete"
                    className="text-muted-foreground hover:text-primary hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Concrete Admixtures
                  </Link>
                  <Link
                    href="/products?category=textile"
                    className="text-muted-foreground hover:text-primary hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Textile Chemicals
                  </Link>
                  <Link
                    href="/products?category=dyestuff"
                    className="text-muted-foreground hover:text-primary hover:bg-muted block px-3 py-2 rounded-md text-sm transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Dyestuff Chemicals
                  </Link>
                </div>
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

              <div className="px-3 py-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-medium">
                  <Link href="/contact" onClick={toggleMenu}>
                    Get Quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
