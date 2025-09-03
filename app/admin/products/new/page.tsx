import { ProductForm } from "@/components/admin/product-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabaseHelpers } from "@/lib/supabase-helpers"

export default async function NewProductPage() {
  const categories = await supabaseHelpers.getAllCategories()

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
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground mt-2">
            Create a new product in your catalog
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 shadow-sm bg-white">
        <CardHeader className="px-8 pt-8 pb-6">
          <CardTitle className="text-xl font-semibold">Product Information</CardTitle>
          <CardDescription className="text-sm leading-relaxed mt-2">
            Fill in the details for your new product
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <ProductForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}