"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ExternalLink,
  ArrowRight,
  Building2,
  Train,
  Factory,
  Award,
  Users,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  client_name: string;
  completion_date: string;
  project_value: number;
  key_features: string[];
  challenges: string;
  solutions: string;
  image_url: string;
  gallery_images: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const projectCategories = [
  { id: "bullet-train", name: "High Speed Rail", icon: Train },
  { id: "metro-rail", name: "Metro & Rail", icon: Train },
  { id: "roads", name: "Roads & Highways", icon: MapPin },
  { id: "buildings-factories", name: "Buildings & Factories", icon: Building2 },
  { id: "others", name: "Other Projects", icon: Factory },
];

function ProjectsPageContent() {
  const [projectOverview, setProjectOverview] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const searchParams = useSearchParams();

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      // Reset to "all" when no category parameter is present
      setSelectedCategory("all");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, contentRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/content?page=projects"),
        ]);

        const projectsData = await projectsRes.json();
        const contentData = await contentRes.json();

        if (projectsData.success || projectsData.data) {
          setProjects(projectsData.data || []);
        } else {
          throw new Error(projectsData.error || "Failed to fetch projects");
        }

        if (contentData.success && contentData.data.content) {
          const items = contentData.data.content as Array<any>;
          setProjectOverview(
            items.find(
              (i) =>
                i.section === "project_overview" && i.content_key === "content"
            )?.content_value || ""
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/projects");
      const result = await response.json();

      if (result.success || result.data) {
        setProjects(result.data || []);
      } else {
        setError(result.error || "Failed to refresh projects");
      }
    } catch (err) {
      setError("Failed to refresh projects");
      console.error("Error refreshing projects:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bullet-train":
        return <Train className="h-4 w-4" />;
      case "metro-rail":
        return <Train className="h-4 w-4" />;
      case "roads":
        return <MapPin className="h-4 w-4" />;
      case "buildings-factories":
        return <Building2 className="h-4 w-4" />;
      case "others":
        return <Factory className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "bullet-train":
        return "High Speed Rail";
      case "metro-rail":
        return "Metro & Rail";
      case "roads":
        return "Roads & Highways";
      case "buildings-factories":
        return "Buildings & Factories";
      case "others":
        return "Other Projects";
      default:
        return (
          category.charAt(0).toUpperCase() +
          category.slice(1).replace(/-/g, " ")
        );
    }
  };

  // Get filtered projects
  const filteredProjects = projects
    .filter((project) => project.is_active)
    .filter((project) => {
      // If there's a search term, search across all projects regardless of category
      if (searchTerm !== "") {
        return (
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.client_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      // If no search term, filter by selected category
      return (
        selectedCategory === "all" || project.category === selectedCategory
      );
    });

  // Get project count by category
  const getCategoryProjectCount = (categoryId: string) => {
    if (categoryId === "all") return projects.filter((p) => p.is_active).length;
    return projects.filter((p) => p.is_active && p.category === categoryId)
      .length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <div className="h-10 w-72 mx-auto bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 mx-auto bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 mx-auto bg-muted rounded animate-pulse" />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-3/5 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl lg:text-5xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Project Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {projectOverview ||
                "Showcasing our expertise across diverse industrial and infrastructure projects with innovative chemical solutions."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Left Sidebar - Categories */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Project Categories
                </h3>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category List */}
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center justify-between ${
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span className="flex items-center">
                      <Building2 className="h-4 w-4 mr-3" />
                      All Projects
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        selectedCategory === "all"
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : ""
                      }
                    >
                      {getCategoryProjectCount("all")}
                    </Badge>
                  </button>

                  {projectCategories.map((category) => {
                    const categoryProjectCount = getCategoryProjectCount(
                      category.id
                    );
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center justify-between ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <span className="flex items-center">
                          <IconComponent className="h-4 w-4 mr-3" />
                          {category.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className={
                            selectedCategory === category.id
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : ""
                          }
                        >
                          {categoryProjectCount}
                        </Badge>
                      </button>
                    );
                  })}
                </div>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="w-full mt-6"
                >
                  {refreshing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Projects
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Mobile Category Filter */}
              <div className="lg:hidden mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Mobile Category Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={
                          selectedCategory === "all" ? "default" : "outline"
                        }
                        onClick={() => setSelectedCategory("all")}
                        size="sm"
                      >
                        All ({getCategoryProjectCount("all")})
                      </Button>
                      {projectCategories.map((category) => {
                        const count = getCategoryProjectCount(category.id);
                        return (
                          <Button
                            key={category.id}
                            variant={
                              selectedCategory === category.id
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setSelectedCategory(category.id)}
                            size="sm"
                          >
                            {category.name} ({count})
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {searchTerm
                      ? `Search Results for "${searchTerm}"`
                      : selectedCategory === "all"
                      ? "All Projects"
                      : getCategoryName(selectedCategory)}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {filteredProjects.length} project
                    {filteredProjects.length !== 1 ? "s" : ""} found
                    {searchTerm && " across all categories"}
                  </p>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4 mb-6">
                  <p className="text-destructive text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Projects Grid */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No projects found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `Try adjusting your search terms or browse other categories.`
                      : `No projects available in this category.`}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="group h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 hover:border-primary/30 overflow-hidden flex flex-col"
                    >
                      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 rounded-t-lg">
                        {/* Background overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300" />
                        {project.image_url ? (
                          <Image
                            src={project.image_url}
                            alt={project.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Building2 className="h-16 w-16 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 z-10">
                          <Badge
                            variant="secondary"
                            className="bg-white/90 backdrop-blur-sm text-foreground border-border"
                          >
                            {getCategoryName(project.category)}
                          </Badge>
                        </div>
                        {project.is_featured && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="default" className="bg-primary/90">
                              <Award className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}

                        {/* Hover overlay with quick info */}
                        {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-medium">
                            Professional Grade Solutions
                          </p>
                        </div> */}
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-bold text-lg mb-2 line-clamp-2">
                              {project.name}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                              {project.description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {project.client_name && (
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Client:
                                </span>
                                <span className="font-medium">
                                  {project.client_name}
                                </span>
                              </div>
                            )}

                            {project.location && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Location:
                                </span>
                                <span className="font-medium">
                                  {project.location}
                                </span>
                              </div>
                            )}

                            {project.completion_date && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">
                                  Completed:
                                </span>
                                <span className="font-medium">
                                  {new Date(
                                    project.completion_date
                                  ).getFullYear()}
                                </span>
                              </div>
                            )}
                          </div>

                          {project.key_features &&
                            project.key_features.length > 0 && (
                              <div className="pt-3 border-t">
                                <p className="text-sm font-medium mb-2">
                                  Key Features:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {project.key_features
                                    .slice(0, 3)
                                    .map((feature, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs bg-muted/50 text-muted-foreground border-0"
                                      >
                                        {feature}
                                      </Badge>
                                    ))}
                                  {project.key_features.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-muted/50 text-muted-foreground border-0"
                                    >
                                      +{project.key_features.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>

                        <Button
                          asChild
                          variant="outline"
                          className="w-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300 justify-between border-muted group-hover:border-primary mt-auto"
                          size="sm"
                        >
                          <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center justify-between w-full"
                          >
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      }
    >
      <ProjectsPageContent />
    </Suspense>
  );
}
