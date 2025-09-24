"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Award, Shield, CheckCircle } from "lucide-react";
import { Footer } from "@/components/footer";

interface ApprovalLogo {
  id: number;
  name: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
}

export default function CertificationsPage() {
  const [approvalLogos, setApprovalLogos] = useState<ApprovalLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovalLogos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/approval-logos");

        if (!response.ok) {
          throw new Error("Failed to fetch approval logos");
        }

        const data = await response.json();

        if (data.success && data.data) {
          setApprovalLogos(
            data.data.sort(
              (a: ApprovalLogo, b: ApprovalLogo) => a.sort_order - b.sort_order
            )
          );
        } else {
          console.log(data.error);
          // throw new Error(data.error || "Failed to load certifications");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching approval logos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalLogos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading certifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-12 w-12 text-primary" />
              <Award className="h-12 w-12 text-primary" />
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1
              className="text-4xl lg:text-5xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Certifications & Approvals
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our commitment to quality is validated by prestigious
              certifications and approvals from leading authorities across
              India. These recognitions demonstrate our adherence to the highest
              standards in manufacturing and quality assurance.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {approvalLogos.length}+
              </div>
              <div className="text-muted-foreground">Certifications</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">ISO</div>
              <div className="text-muted-foreground">Certified</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">20+</div>
              <div className="text-muted-foreground">Years Trusted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Certifications
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recognized and approved by leading regulatory bodies and industry
              authorities
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-destructive text-sm mb-2">
                  Failed to load certifications
                </p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : approvalLogos.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No certifications available
              </h3>
              <p className="text-muted-foreground">
                Certification information is currently being updated.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {approvalLogos.map((approval) => (
                <Card
                  key={approval.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-border/50 hover:border-primary/30"
                >
                  <CardContent className="p-6 text-center">
                    <div className="aspect-square bg-white rounded-lg p-4 mb-4 flex items-center justify-center border border-border/20">
                      <img
                        src={approval.image_url}
                        alt={approval.alt_text || approval.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        Certified
                      </Badge>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2">
                        {approval.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>


      <Footer />
    </div>
  );
}
