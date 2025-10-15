"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { OptimizedCategoryImage } from "./optimized-category-image";

interface ProjectCategory {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
}

interface LazyProjectCategoriesProps {
  initialCategories?: ProjectCategory[];
}

export function LazyProjectCategories({
  initialCategories = [],
}: LazyProjectCategoriesProps) {
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>(
    initialCategories
  );
  const [loading, setLoading] = useState(initialCategories.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProjectCategories(initialCategories);
    setLoading(initialCategories.length === 0);
  }, [initialCategories]);

  useEffect(() => {
    if (initialCategories.length > 0) {
      return;
    }

    const fetchProjectCategories = async () => {
      try {
        const response = await fetch("/api/project-categories-homepage");
        const result = await response.json();

        if (result.success) {
          setProjectCategories(result.data.projectCategories);
        } else {
          setError("Failed to load project categories");
        }
      } catch (err) {
        setError("Failed to load project categories");
        console.error("Error fetching project categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectCategories();
  }, [initialCategories.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-muted rounded-lg animate-pulse flex items-center justify-center"
          >
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {projectCategories.map((category) => (
        <Card
          key={category.id}
          className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 hover:border-primary/30 overflow-hidden flex flex-col"
        >
          <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 relative">
            <OptimizedCategoryImage
              categoryId={category.id}
              categoryName={category.name}
              categoryImageUrl={category.icon_url}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
          <CardContent className="p-6 flex flex-col flex-grow">
            <div className="mb-4 flex-grow">
              <CardTitle className="text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300 font-normal">
                {category.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {category.description ||
                  `Professional ${category.name.toLowerCase()} solutions for infrastructure projects and construction applications.`}
              </CardDescription>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 justify-between border-muted group-hover:border-primary mt-auto"
            >
              <Link href={`/projects?category=${category.id}`}>
                <span>View Projects</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
