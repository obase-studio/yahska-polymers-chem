"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AutoScrollLogos } from "@/components/auto-scroll-logos";

interface Logo {
  id: string;
  file_path: string;
  original_name: string;
  alt_text?: string;
}

export default function ClientsPage() {
  const [clientLogos, setClientLogos] = useState<Logo[]>([]);
  const [approvalLogos, setApprovalLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        setLoading(true);
        
        // Fetch client logos
        const clientLogosResponse = await fetch("/api/client-logos");
        if (clientLogosResponse.ok) {
          const clientLogosData = await clientLogosResponse.json();
          console.log('Client logos loaded successfully:', clientLogosData.length, 'logos');
          setClientLogos(clientLogosData); // Show all client logos on dedicated page
        }

        // Fetch approval logos
        const approvalLogosResponse = await fetch("/api/approval-logos");
        if (approvalLogosResponse.ok) {
          const approvalLogosData = await approvalLogosResponse.json();
          console.log('Approval logos loaded successfully:', approvalLogosData.length, 'logos');
          setApprovalLogos(approvalLogosData); // Show all approval logos on dedicated page
        }
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl lg:text-6xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Clients & Approvals
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Trusted by industry leaders and recognized by prestigious authorities, 
              we take pride in our extensive network of satisfied clients and official certifications.
            </p>
          </div>
        </div>
      </section>

      {/* Key Customers Section */}
      <AutoScrollLogos
        logos={clientLogos}
        title="Key Customers"
        description="Leading companies that trust us for their chemical solutions"
        className="bg-muted/30"
      />

      {/* Key Approvals Section */}
      <AutoScrollLogos
        logos={approvalLogos}
        title="Key Approvals & Certifications"
        description="Recognized and approved by leading authorities across India"
        className="bg-background"
      />

      {/* Additional Content Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Building Trust Through Excellence
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our extensive client portfolio spans across major infrastructure projects, 
                commercial buildings, and industrial facilities. Each partnership represents 
                our commitment to delivering superior chemical solutions that meet the highest 
                standards of quality and performance.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With certifications from leading authorities, we ensure that every product 
                meets stringent quality requirements and regulatory compliance standards.
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-background p-6 rounded-lg border border-border/50 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">Industries We Serve</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• High-Speed Rail & Metro Projects</li>
                  <li>• Commercial & Residential Buildings</li>
                  <li>• Industrial Manufacturing Facilities</li>
                  <li>• Infrastructure & Road Construction</li>
                  <li>• Water Treatment Plants</li>
                </ul>
              </div>
              <div className="bg-background p-6 rounded-lg border border-border/50 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground mb-3">Quality Assurance</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• ISO Certified Manufacturing</li>
                  <li>• Government Approved Products</li>
                  <li>• International Standard Compliance</li>
                  <li>• Regular Quality Audits</li>
                  <li>• Technical Support & Consultation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}