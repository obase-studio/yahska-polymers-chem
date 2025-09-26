'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, Zap, Building2, Wrench, CheckCircle, Factory, Award, Truck } from 'lucide-react';

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
  image_url?: string;
  product_code: string;
  is_active: boolean;
  specification_pdf?: string;
}

interface OptimizedProductCardProps {
  product: Product;
}

// Memoized component to prevent unnecessary re-renders
export const OptimizedProductCard = memo(function OptimizedProductCard({ product }: OptimizedProductCardProps) {
  // Get unique icon for each category based on name
  const getCategoryIcon = React.useCallback((categoryName: string) => {
    if (categoryName.toLowerCase().includes('admixture')) return Package;
    if (categoryName.toLowerCase().includes('accelerator')) return Zap;
    if (categoryName.toLowerCase().includes('waterproofing')) return Building2;
    if (categoryName.toLowerCase().includes('grout')) return Wrench;
    if (categoryName.toLowerCase().includes('curing')) return CheckCircle;
    if (categoryName.toLowerCase().includes('micro silica')) return Factory;
    if (categoryName.toLowerCase().includes('floor')) return Building2;
    if (categoryName.toLowerCase().includes('structural')) return Building2;
    if (categoryName.toLowerCase().includes('corrosion')) return Award;
    if (categoryName.toLowerCase().includes('release')) return Truck;
    return Package;
  }, []);

  const CategoryIcon = getCategoryIcon(product.category_name);

  return (
    <Card className="group h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 hover:border-primary/30 overflow-hidden flex flex-col">
      <div className="aspect-[3/2] relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 rounded-t-lg">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300 z-10" />
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full z-20 relative">
            <CategoryIcon className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-4 left-4 z-30">
          <Badge
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm text-foreground border-border"
          >
            {product.category_name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex-1 space-y-3 mb-2">
          <div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
              {product.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <Button
            asChild
            variant="outline"
            className="w-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 justify-between border-muted group-hover:border-primary"
            size="sm"
          >
            <Link
              href={`/products/${product.id}`}
              className="flex items-center justify-between w-full"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// Comparison function for React.memo
OptimizedProductCard.displayName = 'OptimizedProductCard';