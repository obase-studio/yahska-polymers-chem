"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Building2,
  Palette,
  Factory,
  Award,
  Package,
  Zap,
  Wrench,
  CheckCircle,
  Truck,
} from "lucide-react";

interface OptimizedCategoryImageProps {
  categoryId: string;
  categoryName: string;
  categoryImageUrl?: string;
  className?: string;
}

export function OptimizedCategoryImage({
  categoryId,
  categoryName,
  categoryImageUrl,
  className = "",
}: OptimizedCategoryImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get the appropriate icon for the category
  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("construction")) return Building2;
    if (lowerName.includes("concrete")) return Factory;
    if (lowerName.includes("textile")) return Palette;
    if (lowerName.includes("dyestuff")) return Award;
    if (lowerName.includes("admixture")) return Zap;
    if (lowerName.includes("accelerator")) return Zap;
    if (lowerName.includes("waterproofing")) return Building2;
    if (lowerName.includes("grout")) return Wrench;
    if (lowerName.includes("curing")) return CheckCircle;
    if (lowerName.includes("micro silica")) return Factory;
    if (lowerName.includes("floor")) return Building2;
    if (lowerName.includes("structural")) return Building2;
    if (lowerName.includes("corrosion")) return Award;
    if (lowerName.includes("release")) return Truck;
    return Package;
  };

  const CategoryIcon = useMemo(() => getCategoryIcon(categoryName), [categoryName]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Reset states when categoryImageUrl changes
  useEffect(() => {
    if (categoryImageUrl) {
      setIsLoading(true);
      setImageError(false);
    }
  }, [categoryImageUrl]);

  // Fallback content
  const FallbackContent = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="text-center p-4">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
          <CategoryIcon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-foreground font-medium text-sm mb-1">
          {categoryName}
        </p>
        <p className="text-muted-foreground text-xs">
          Professional Solutions
        </p>
      </div>
    </div>
  );

  // If no image URL, show fallback immediately
  if (!categoryImageUrl) {
    return <FallbackContent />;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {imageError && <FallbackContent />}

      {/* Actual image */}
      {!imageError && (
        <Image
          src={categoryImageUrl}
          alt={`${categoryName} category`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false} // Not priority since these are below hero section
        />
      )}
    </div>
  );
}