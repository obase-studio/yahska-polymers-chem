"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  Search,
  Image,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Tags,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Projects", href: "/admin/projects", icon: Building2 },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "SEO", href: "/admin/seo", icon: Search },
  { name: "Media", href: "/admin/media", icon: Image },
]

export function AdminNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 w-full bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 z-50 w-64 h-full bg-card border-r border-border transform transition-transform duration-200 ease-in-out",
        "lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-primary">Yahska Admin</h1>
                <p className="text-sm text-muted-foreground">Content Management</p>
              </div>
              <Link 
                href="/" 
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
                title="View Website"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content spacer for mobile */}
      <div className="lg:hidden h-16" />
    </>
  )
}