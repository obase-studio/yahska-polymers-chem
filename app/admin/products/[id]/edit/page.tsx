"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch('/api/admin/categories')
        ])

        const productData = await productResponse.json()
        const categoriesData = await categoriesResponse.json()

        if (productData.success) {
          setProduct(productData.data)
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  const handleSaveSuccess = () => {
    const timestamp = new Date().toLocaleTimeString()
    setLastSaved(timestamp)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button asChild>
            <Link href="/admin/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground mt-2">
            Update product information and details
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 shadow-sm bg-white">
        <CardHeader className="px-8 pt-8 pb-6">
          <CardTitle className="text-xl font-semibold">Product Information</CardTitle>
          <CardDescription className="text-sm leading-relaxed mt-2">
            Edit the details for "{product.name}"
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <ProductForm
            categories={categories}
            product={product}
            isEdit={true}
            isSaved={isSaved}
            lastSaved={lastSaved}
            onSaveSuccess={handleSaveSuccess}
          />
        </CardContent>
      </Card>
    </div>
  )
}