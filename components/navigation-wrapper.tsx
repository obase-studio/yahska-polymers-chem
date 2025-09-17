"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"

interface NavigationWrapperProps {
  categories: { id: string; name: string }[]
  projectCategories: { id: string; name: string }[]
  branding: { logoUrl: string | null; companyName: string }
}

export function NavigationWrapper({ categories, projectCategories, branding }: NavigationWrapperProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  // Don't render navigation for admin routes
  if (isAdminRoute) {
    return null
  }

  return (
    <Navigation
      categories={categories}
      projectCategories={projectCategories}
      branding={branding}
    />
  )
}