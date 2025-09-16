"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/footer";
import { AutoScrollLogos } from "@/components/auto-scroll-logos";
import { ContentItem } from "@/lib/database-client";

interface Logo {
  id: string;
  file_path: string;
  original_name: string;
  alt_text?: string;
}

export default function ClientsPage() {
  const [clientLogos, setClientLogos] = useState<Logo[]>([]);
  const [approvalLogos, setApprovalLogos] = useState<Logo[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        // Fetch content for clients page
        const [contentResponse, clientLogosResponse, approvalLogosResponse] =
          await Promise.all([
            fetch("/api/content?page=clients"),
            fetch("/api/client-logos"),
            fetch("/api/approval-logos"),
          ]);

        if (contentResponse.ok) {
          const contentResult = await contentResponse.json();
          if (contentResult.success) {
            setContentItems(contentResult.data.content);
          }
        }

        // Fetch client logos
        if (clientLogosResponse.ok) {
          const clientLogosData = await clientLogosResponse.json();
          console.log(
            "Client logos loaded successfully:",
            clientLogosData.length,
            "logos",
            clientLogosData
          );
          // Filter out the specific file
          const filteredLogos = clientLogosData.filter(
            (logo: any) =>
              logo.filename !== "17.Raj Infrastructure – Pkg 13.jpg"
          );
          setClientLogos(filteredLogos); // Show filtered client logos on dedicated page
        }

        // Fetch approval logos
        if (approvalLogosResponse.ok) {
          const approvalLogosData = await approvalLogosResponse.json();
          console.log(
            "Approval logos loaded successfully:",
            approvalLogosData.length,
            "logos",
            approvalLogosData
          );
          setApprovalLogos(approvalLogosData); // Show all approval logos on dedicated page
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Get content values
  const heroHeadline =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "headline"
    )?.content_value || "Our Clients & Approvals";

  const heroDescription =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "description"
    )?.content_value ||
    "Trusted by industry leaders and recognized by prestigious authorities, we take pride in our extensive network of satisfied clients and official certifications.";

  const clientSectionTitle =
    contentItems.find(
      (item) =>
        item.section === "client_section" && item.content_key === "title"
    )?.content_value || "Key Customers";

  const clientSectionDescription =
    contentItems.find(
      (item) =>
        item.section === "client_section" && item.content_key === "description"
    )?.content_value ||
    "Leading companies that trust us for their chemical solutions";

  const approvalSectionTitle =
    contentItems.find(
      (item) =>
        item.section === "approval_section" && item.content_key === "title"
    )?.content_value || "Key Approvals & Certifications";

  const approvalSectionDescription =
    contentItems.find(
      (item) =>
        item.section === "approval_section" &&
        item.content_key === "description"
    )?.content_value ||
    "Recognized and approved by leading authorities across India";

  return (
    <div className="min-h-screen bg-background">

      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl lg:text-6xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {heroHeadline}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Key Customers Section */}
      <AutoScrollLogos
        logos={clientLogos}
        title={clientSectionTitle}
        description={clientSectionDescription}
        className="bg-muted/30"
      />

      {/* Key Approvals Section */}
      <AutoScrollLogos
        logos={approvalLogos}
        title={approvalSectionTitle}
        description={approvalSectionDescription}
        className="bg-background"
      />

      <Footer />
    </div>
  );
}
