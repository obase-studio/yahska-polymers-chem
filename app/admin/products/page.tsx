import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, Package, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { supabaseHelpers } from "@/lib/supabase-helpers";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function ProductsPage() {
  const products = await supabaseHelpers.getAllProducts();
  const categories = await supabaseHelpers.getAllCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and detailed specifications
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Products List */}
      <Card className="border-2 shadow-sm bg-white">
        <CardHeader className="pb-6 px-8 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                All Products
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {products.length} product{products.length !== 1 ? "s" : ""} in
                your catalog
              </CardDescription>
            </div>
            {/* <Button variant="outline" asChild className="ml-6">
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-8 pb-8">
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product: any) => (
                <Card
                  key={product.id}
                  className="border-2 shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-3 truncate">
                              {product.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-sm px-4 py-2"
                            >
                              {product.category_name}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        {product.applications && product.applications.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {product.applications
                              .slice(0, 3)
                              .map((app: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs px-2 py-1"
                                >
                                  {app}
                                </Badge>
                              ))}
                            {product.applications.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-1"
                              >
                                +{product.applications.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-6 flex-shrink-0">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/products/${product.id}`}
                            target="_blank"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No products yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by adding your first product to the catalog. You can
            manage descriptions and categories.
              </p>
              <Button asChild size="lg">
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
  );
}
