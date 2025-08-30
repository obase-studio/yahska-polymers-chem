import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

export default async function ProductsPage() {
  const products = await supabaseHelpers.getAllProducts()
  const categories = await supabaseHelpers.getAllCategories()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and pricing
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Categories Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category: any) => {
          const categoryProducts = products.filter((p: any) => p.category_id === category.id)
          return (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{categoryProducts.length}</span>
                  <span className="text-sm text-muted-foreground">products</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            {products.length} products in your catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <Badge variant="secondary">{product.category_name}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-primary">{product.price}</span>
                      {product.applications && product.applications.length > 0 && (
                        <div className="flex gap-1">
                          {product.applications.slice(0, 2).map((app: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                          {product.applications.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.applications.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/products/${product.id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first product to the catalog.
              </p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Product
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}