"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Building2,
  Train,
  Factory,
  CheckCircle,
  AlertTriangle,
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
  client_name?: string;
  completion_date: string;
  project_info_details?: string;
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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
      fetchContent();
    }
  }, [params.id]);

  const fetchProject = async (id: string) => {
    try {
      setError(""); // Clear any previous errors
      const response = await fetch(`/api/projects/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Project not found");
        } else {
          setError("Failed to load project details");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProject(data.data);
        setError(""); // Clear error if project loads successfully
      } else {
        setError(data.error || "Failed to load project");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?page=project_details");
      const result = await response.json();
      if (result.success && result.data && result.data.content) {
        setContentItems(result.data.content);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
    // Don't set loading to false here since it's independent of project loading
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bullet-train":
        return <Train className="h-5 w-5" />;
      case "metro-rail":
        return <Train className="h-5 w-5" />;
      case "roads":
        return <MapPin className="h-5 w-5" />;
      case "buildings-factories":
        return <Building2 className="h-5 w-5" />;
      case "others":
        return <Factory className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading project details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only show error if loading is complete and there's an actual error
  if (!loading && error && !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If no project data after loading, show not found
  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The requested project could not be found.
            </p>
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get content values from CMS
  const keyFeaturesSectionTitle =
    contentItems.find(
      (item) =>
        item.section === "key_features_section" &&
        item.content_key === "section_title"
    )?.content_value || "Key Features";

  const keyFeaturesSectionDescription =
    contentItems.find(
      (item) =>
        item.section === "key_features_section" &&
        item.content_key === "section_description"
    )?.content_value || "";

  const projectInfoDetails = project.project_info_details?.trim() || "";

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <section className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-foreground">
              Projects
            </Link>
            <span>/</span>
            <span className="text-foreground">{project.name}</span>
          </nav>
        </div>
      </section>

      {/* Back to Projects Button */}
      <section className="py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="outline" size="sm">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Section - Standard Background */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Project Info */}
            <div className="space-y-6">
              {/* Project Category Badge */}
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getCategoryIcon(project.category)}
                  {getCategoryName(project.category)}
                </Badge>
                {project.is_featured && (
                  <Badge variant="default">Featured Project</Badge>
                )}
              </div>

              {/* Project Title */}
              <h1
                className="text-3xl lg:text-4xl text-foreground mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {project.name}
              </h1>

              {/* Subtitle/Caption - Project Information */}
              <div className="space-y-4">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Project Image - Mobile Only (between description and project_info_details) */}
                <div className="flex justify-center lg:hidden my-8">
                  {project.image_url ? (
                    <div className="w-full max-w-md">
                      <div className="aspect-[4/3] relative rounded-lg overflow-hidden shadow-2xl">
                        <Image
                          src={project.image_url}
                          alt={project.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-md">
                      <div className="aspect-[4/3] bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                        <div className="text-center">
                          <Building2 className="w-16 h-16 text-white/60 mx-auto mb-4" />
                          <p className="text-white/70">Project Image</p>
                          <p className="text-xs text-white/50 mt-1">
                            Coming Soon
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Information Display */}
                <div className="space-y-3 text-lg text-muted-foreground">
                  {project.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5" />
                      <span>{project.location}</span>
                    </div>
                  )}

                  {project.completion_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      <span>
                        Completed:{" "}
                        {new Date(project.completion_date).getFullYear()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Additional Project Information from CMS */}
                {projectInfoDetails && (
                  <div className="mt-6 space-y-2">
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {projectInfoDetails}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Project Image - Desktop Only */}
            <div className="hidden lg:flex justify-center">
              {project.image_url ? (
                <div className="w-full max-w-md lg:max-w-lg">
                  <div className="aspect-[4/3] relative rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={project.image_url}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-md lg:max-w-lg">
                  <div className="aspect-[4/3] bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                    <div className="text-center">
                      <Building2 className="w-16 h-16 text-white/60 mx-auto mb-4" />
                      <p className="text-white/70">Project Image</p>
                      <p className="text-xs text-white/50 mt-1">Coming Soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {project.key_features && project.key_features.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="text-primary">
                    {keyFeaturesSectionTitle}
                  </CardTitle>
                  {keyFeaturesSectionDescription && (
                    <CardDescription>
                      {keyFeaturesSectionDescription}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.key_features.map(
                      (feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Additional Project Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Challenges */}
            {project.challenges && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="text-primary">Challenges</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Project challenges addressed
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.challenges}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Solutions */}
            {project.solutions && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="text-primary">Solutions</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    How we solved the challenges
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.solutions}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Gallery Images */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <Card className="lg:col-span-2 py-6">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Project Gallery
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Additional project images
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery_images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="aspect-[3/2] relative overflow-hidden rounded-lg bg-muted"
                      >
                        <Image
                          src={imageUrl}
                          alt={`${project.name} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
