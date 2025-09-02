"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Try to make an authenticated request to verify session
      const response = await fetch('/api/admin/auth/verify', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        // Redirect to login if not on login page
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
    } catch (error) {
      setIsAuthenticated(false)
      // Redirect to login if not on login page
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    }
  }

  // Show loading spinner while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show login page or redirect if not authenticated
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null // Will redirect to login
  }

  // Show children if authenticated or on login page
  return <>{children}</>
}