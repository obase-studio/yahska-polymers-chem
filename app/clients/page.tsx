"use client";

import { useState, useEffect } from "react";
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
import { Building2, MapPin, Users, Star, Quote, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";

interface MediaFile {
  id: number;
  original_name: string;
  file_path: string;
  alt_text?: string;
}

const clientCategories = [
  {
    name: "Construction & Infrastructure",
    count: 150,
    description: "Leading construction companies and infrastructure developers",
    color: "bg-blue-100 text-blue-800",
  },
  {
    name: "Textile Manufacturing",
    count: 120,
    description: "Textile mills and garment manufacturers across India",
    color: "bg-green-100 text-green-800",
  },
  {
    name: "Chemical Processing",
    count: 80,
    description: "Chemical plants and processing facilities",
    color: "bg-purple-100 text-purple-800",
  },
  {
    name: "Concrete Producers",
    count: 200,
    description: "Ready-mix concrete plants and precast manufacturers",
    color: "bg-orange-100 text-orange-800",
  },
];

const featuredClients = [
  {
    name: "Gujarat Construction Corp",
    industry: "Construction",
    location: "Ahmedabad, Gujarat",
    partnership: "8 years",
    description:
      "Leading construction company specializing in residential and commercial projects",
    projects: [
      "Metro Rail Project",
      "Smart City Development",
      "Industrial Complexes",
    ],
    logo: "/placeholder.svg?height=80&width=120&text=GCC",
  },
  {
    name: "Textile Mills India",
    industry: "Textile",
    location: "Surat, Gujarat",
    partnership: "12 years",
    description: "One of India's largest textile manufacturing groups",
    projects: [
      "Dyeing Operations",
      "Finishing Processes",
      "Quality Enhancement",
    ],
    logo: "/placeholder.svg?height=80&width=120&text=TMI",
  },
  {
    name: "Concrete Solutions Ltd",
    industry: "Concrete",
    location: "Mumbai, Maharashtra",
    partnership: "6 years",
    description:
      "Premium ready-mix concrete supplier for major infrastructure projects",
    projects: [
      "Highway Construction",
      "Bridge Projects",
      "High-rise Buildings",
    ],
    logo: "/placeholder.svg?height=80&width=120&text=CSL",
  },
  {
    name: "Industrial Chemicals Co",
    industry: "Chemical",
    location: "Vadodara, Gujarat",
    partnership: "10 years",
    description:
      "Specialty chemical manufacturer for various industrial applications",
    projects: ["Process Optimization", "Quality Improvement", "Cost Reduction"],
    logo: "/placeholder.svg?height=80&width=120&text=ICC",
  },
  {
    name: "Metro Infrastructure",
    industry: "Infrastructure",
    location: "Delhi, NCR",
    partnership: "5 years",
    description: "Major infrastructure development company for urban projects",
    projects: [
      "Metro Stations",
      "Underground Construction",
      "Waterproofing Solutions",
    ],
    logo: "/placeholder.svg?height=80&width=120&text=MI",
  },
  {
    name: "Dyestuff Manufacturers",
    industry: "Dyestuff",
    location: "Chennai, Tamil Nadu",
    partnership: "7 years",
    description: "Leading manufacturer of synthetic dyes and pigments",
    projects: [
      "Color Consistency",
      "Process Enhancement",
      "Environmental Compliance",
    ],
    logo: "/placeholder.svg?height=80&width=120&text=DM",
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    position: "Project Manager",
    company: "Gujarat Construction Corp",
    content:
      "Yahska Polymers has been our trusted partner for construction chemicals. Their products consistently deliver excellent results, and their technical support is outstanding.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    position: "Production Head",
    company: "Textile Mills India",
    content:
      "The quality of textile chemicals from Yahska Polymers has significantly improved our dyeing processes. We've seen remarkable consistency in our final products.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    position: "Technical Director",
    company: "Concrete Solutions Ltd",
    content:
      "Their concrete admixtures have helped us achieve superior strength and durability in our projects. The technical expertise they provide is invaluable.",
    rating: 5,
  },
];

export default function ClientsPage() {
  const [clientLogos, setClientLogos] = useState<MediaFile[]>([]);
  const [approvalLogos, setApprovalLogos] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalsLoading, setApprovalsLoading] = useState(true);

  useEffect(() => {
    const fetchClientLogos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/client-logos");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const logos = await response.json();

        const fixedLogos = logos.map((logo: any) => {
          let filePath = decodeURIComponent(logo.file_path || "");

          // Normalize folder name
          filePath = filePath
            .replace(/client%20logos/gi, "Client Logos")
            .replace(/client-logos/gi, "Client Logos");
          if (
            filePath.includes("17.Raj Infrastructure – Pkg 13.jpg") ||
            filePath.includes("17.Raj Infrastructure — Pkg 13.jpg")
          ) {
            filePath = filePath.replace(
              /17\.Raj Infrastructure\s*[–—]\s*Pkg 13\.jpg/i,
              "17.Raj-Infrastructure.jpg"
            );
          }

          return {
            ...logo,
            file_path: encodeURI(filePath),
          };
        });
        setClientLogos(fixedLogos);
      } catch (error) {
        console.error("Error fetching client logos:", error);
        // Fallback: try the admin endpoint
        try {
          const fallbackResponse = await fetch("/api/admin/media");
          if (fallbackResponse.ok) {
            const mediaFiles = await fallbackResponse.json();
            const logos = mediaFiles
              .filter((file: MediaFile) =>
                file.file_path.includes("client-logos")
              )
              .sort((a: MediaFile, b: MediaFile) =>
                a.original_name.localeCompare(b.original_name)
              );
            setClientLogos(logos);
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchApprovalLogos = async () => {
      try {
        setApprovalsLoading(true);
        const response = await fetch("/api/approval-logos");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const logos = await response.json();

        const fixedLogos = logos.map((logo: any) => {
          let filePath = decodeURIComponent(logo.file_path || "");

          // Normalize folder name
          filePath = filePath
            .replace(/approval%20logos/gi, "approvals")
            .replace(/approval-logos/gi, "approvals");

          return {
            ...logo,
            file_path: encodeURI(filePath),
          };
        });
        setApprovalLogos(fixedLogos);
      } catch (error) {
        console.error("Error fetching approval logos:", error);
        // Fallback: try the admin endpoint
        try {
          const fallbackResponse = await fetch("/api/admin/media");
          if (fallbackResponse.ok) {
            const mediaFiles = await fallbackResponse.json();
            const logos = mediaFiles
              .filter((file: MediaFile) =>
                file.file_path.includes("approval-logos")
              )
              .sort((a: MediaFile, b: MediaFile) =>
                a.original_name.localeCompare(b.original_name)
              );
            setApprovalLogos(logos);
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      } finally {
        setApprovalsLoading(false);
      }
    };

    fetchClientLogos();
    fetchApprovalLogos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl lg:text-5xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Valued Clients
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Trusted by over 500+ companies across India for their chemical
              solution needs. Building lasting partnerships through quality
              products and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Client Statistics */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">States Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Client Retention</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">20+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Categories */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Industries We Serve
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our diverse client base spans across multiple industries, each
              with unique requirements and challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clientCategories.map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Building2 className="h-8 w-8 text-primary" />
                    <Badge className={category.color}>
                      {category.count}+ clients
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Client Logos Grid */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Trusted Partners
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leading companies across industries that trust us for their
              chemical solution needs
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading client logos...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {clientLogos.map((logo) => (
                <Card
                  key={logo.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border border-border/50"
                >
                  <CardContent className="p-6 flex items-center justify-center h-24">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={logo.file_path}
                        alt={
                          logo.alt_text ||
                          logo.original_name.replace(
                            /\.(jpg|jpeg|png|webp)$/i,
                            ""
                          )
                        }
                        className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          console.log(
                            "Image failed to load:",
                            logo.file_path,
                            e
                          );
                          // Fallback to company name text
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="text-xs text-center text-muted-foreground p-2">${logo.original_name.replace(
                              /\.(jpg|jpeg|png|webp)$/i,
                              ""
                            )}</div>`;
                          }
                        }}
                        onLoad={() =>
                          console.log(
                            "Image loaded successfully:",
                            logo.original_name
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Statistics below logos */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {clientLogos.length}+
              </div>
              <div className="text-muted-foreground text-sm">
                Trusted Partners
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground text-sm">States Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground text-sm">
                Client Retention
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">20+</div>
              <div className="text-muted-foreground text-sm">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approvals Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Approvals & Certifications
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recognized and approved by leading government bodies and
              regulatory authorities across India
            </p>
          </div>

          {approvalsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Loading approval logos...
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {approvalLogos.map((approval) => (
                <Card
                  key={approval.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border border-border/50"
                >
                  <CardContent className="p-6 flex items-center justify-center h-24">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={approval.file_path}
                        alt={
                          approval.alt_text ||
                          approval.original_name.replace(
                            /\.(jpg|jpeg|png|webp|svg)$/i,
                            ""
                          )
                        }
                        className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          console.log(
                            "Approval image failed to load:",
                            approval.file_path,
                            e
                          );
                          // Fallback to approval name text
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="text-xs text-center text-muted-foreground p-2">${approval.original_name.replace(
                              /\.(jpg|jpeg|png|webp|svg)$/i,
                              ""
                            )}</div>`;
                          }
                        }}
                        onLoad={() =>
                          console.log(
                            "Approval image loaded successfully:",
                            approval.original_name
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Approvals Statistics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {approvalLogos.length}+
              </div>
              <div className="text-muted-foreground text-sm">
                Government Approvals
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">8+</div>
              <div className="text-muted-foreground text-sm">
                Metro Authorities
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground text-sm">
                Railway Divisions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground text-sm">
                Compliance Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real feedback from industry leaders who trust Yahska Polymers for
              their chemical solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 py-6"
              >
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/20" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-border pt-4">
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.position}
                    </div>
                    <div className="text-sm text-primary font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Presence */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Pan-India Presence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Serving clients across major industrial hubs in India with
              reliable supply chain and logistics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                state: "Gujarat",
                clients: "180+",
                cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
              },
              {
                state: "Maharashtra",
                clients: "120+",
                cities: ["Mumbai", "Pune", "Nashik", "Aurangabad"],
              },
              {
                state: "Tamil Nadu",
                clients: "90+",
                cities: ["Chennai", "Coimbatore", "Tirupur", "Salem"],
              },
              {
                state: "Karnataka",
                clients: "70+",
                cities: ["Bangalore", "Mysore", "Hubli", "Belgaum"],
              },
            ].map((region, index) => (
              <Card key={index} className="py-6">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">
                    {region.state}
                  </CardTitle>
                  <CardDescription>
                    {region.clients} active clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">
                      Major Cities:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {region.cities.map((city, cityIndex) => (
                        <Badge
                          key={cityIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {city}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Join Our Growing Family of Satisfied Clients
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Experience the quality and service that has made us the preferred
            choice for leading companies across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                <Users className="mr-2 h-5 w-5" />
                Become Our Client
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/products">Explore Our Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
