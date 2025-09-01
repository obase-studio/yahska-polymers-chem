"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

interface Product {
  id: number;
  name: string;
  description: string;
  category_id: string;
  category_name: string;
  applications: string[];
  features: string[];
  usage: string;
  advantages: string;
  technical_specifications: string;
  product_code: string;
  is_active: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();

        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.error || "Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product details");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Safely get array fields
  const getArrayField = (field: string[] | null) => {
    return Array.isArray(field) ? field : [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="text-center py-20">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="text-center py-20">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "The requested product could not be found."}
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const applications = getArrayField(product.applications);
  const features = getArrayField(product.features);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <section className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Header */}
      <section className="py-12 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Badge variant="secondary" className="mb-4">
                {product.category_name}
              </Badge>
              <h1
                className="text-4xl lg:text-5xl font-black text-foreground mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              {product.product_code && (
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground">
                    Product Code:{" "}
                  </span>
                  <span className="font-mono text-primary font-semibold">
                    {product.product_code}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Mail className="mr-2 h-5 w-5" />
                  Request Quote
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Expert
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-8">
              <h3 className="text-lg font-semibold mb-4">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{product.category_name}</span>
                </div>
                {product.product_code && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Code:</span>
                    <span className="font-mono text-primary">
                      {product.product_code}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applications:</span>
                  <span className="font-medium">{applications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Key Features:</span>
                  <span className="font-medium">{features.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Applications */}
            {applications.length > 0 && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="text-primary">Applications</CardTitle>
                  <CardDescription>
                    Where and how this product can be used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {applications.map((app: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{app}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Key Features */}
            {features.length > 0 && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="text-primary">Key Features</CardTitle>
                  <CardDescription>
                    What makes this product special
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Usage Instructions */}
            {product.usage && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">
                    Usage Instructions
                  </CardTitle>
                  <CardDescription>
                    How to properly use this product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.usage}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Advantages */}
            {product.advantages && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Advantages</CardTitle>
                  <CardDescription>
                    Benefits of using this product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.advantages}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Technical Specifications */}
            {product.technical_specifications && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Technical Specifications
                  </CardTitle>
                  <CardDescription>
                    Detailed technical information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.technical_specifications}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Need More Information?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our technical experts can provide detailed specifications,
            application guidance, and custom solutions for your specific
            requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Contact Our Experts
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="tel:+919825012345">
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
