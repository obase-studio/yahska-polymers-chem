"use client";

import { useState, useEffect } from "react";
import { AutoScrollLogos } from "./auto-scroll-logos";
import { Loader2 } from "lucide-react";

interface LazyLogosProps {
  clientTitle?: string;
  clientDescription?: string;
  approvalTitle?: string;
  approvalDescription?: string;
}

export function LazyLogos({
  clientTitle,
  clientDescription,
  approvalTitle,
  approvalDescription,
}: LazyLogosProps) {
  const [clientLogos, setClientLogos] = useState<any[]>([]);
  const [approvalLogos, setApprovalLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch("/api/homepage-logos");
        const result = await response.json();

        if (result.success) {
          setClientLogos(result.data.clientLogos);
          setApprovalLogos(result.data.approvalLogos);
        }
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-muted/30">
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading logos...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Client Logos Ribbon */}
      <AutoScrollLogos
        logos={clientLogos}
        title={clientTitle || "Key Customers"}
        description={clientDescription || "Trusted by leading companies across industries"}
        className="bg-muted/30"
      />

      {/* Approval Logos Ribbon */}
      <AutoScrollLogos
        logos={approvalLogos}
        title={approvalTitle || "Certifications & Approvals"}
        description={approvalDescription || "Quality assured through industry-standard certifications"}
        className="bg-background"
      />
    </>
  );
}
