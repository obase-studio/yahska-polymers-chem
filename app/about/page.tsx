"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, Factory, Target, Eye } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { ContentItem } from "@/lib/database-client";

export default function AboutPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [lastKnownTimestamp, setLastKnownTimestamp] = useState<number>(0);
  const [videoData, setVideoData] = useState<any>(null);

  // Fetch content from API
  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setFetchError("");

        if (!mounted) return;

        const url = `/api/content?page=about&t=${Date.now()}`; // Add timestamp to prevent caching

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (!mounted) return;

        if (result.success && result.data && result.data.content) {
          setContentItems(result.data.content);
          setFetchError("");

          // Track the content timestamp for change detection
          if (result.lastUpdated) {
            setLastKnownTimestamp(result.lastUpdated);
          }
        } else {
          setFetchError("Invalid API response structure");
        }
      } catch (err) {
        if (mounted) {
          setFetchError(
            "Fetch error: " + (err instanceof Error ? err.message : String(err))
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []);
  // Simple polling mechanism to check for content updates
  useEffect(() => {
    if (lastKnownTimestamp === 0) return; // Don't poll until initial load

    const checkForUpdates = async () => {
      try {
        const response = await fetch("/api/sync/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: "about" }),
          cache: "no-store",
        });

        const result = await response.json();

        if (
          result.success &&
          result.lastUpdated &&
          result.lastUpdated > lastKnownTimestamp
        ) {
          console.log("About page - Content update detected, refreshing...", {
            old: lastKnownTimestamp,
            new: result.lastUpdated,
          });

          // Fetch full content
          const contentResponse = await fetch(
            `/api/content?page=about&t=${Date.now()}`,
            { cache: "no-store" }
          );
          const contentResult = await contentResponse.json();

          if (
            contentResult.success &&
            contentResult.data &&
            contentResult.data.content
          ) {
            setContentItems(contentResult.data.content);
            setLastKnownTimestamp(result.lastUpdated);
            setLastUpdated(new Date().toLocaleTimeString());
            console.log("About page - Content refreshed successfully!");
          }
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    // Check for updates every 2 seconds
    const interval = setInterval(checkForUpdates, 2000);

    return () => clearInterval(interval);
  }, [lastKnownTimestamp]);

  // Get content values from database
  const companyOverview =
    contentItems.find(
      (item) =>
        item.section === "company_overview" && item.content_key === "content"
    )?.content_value || "";

  // Get hero page title
  const pageTitle =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "page_title"
    )?.content_value || "About Yahska Polymers";

  // Get Our Story section title
  const ourStorySectionTitle =
    contentItems.find(
      (item) =>
        item.section === "our_story" && item.content_key === "section_title"
    )?.content_value || "Our Story";

  const experience =
    contentItems.find(
      (item) => item.section === "experience" && item.content_key === "content"
    )?.content_value || "";

  const ourStory =
    contentItems.find(
      (item) => item.section === "our_story" && item.content_key === "content"
    )?.content_value || "";

  // Get hero media type and content
  const heroType =
    contentItems.find(
      (item) => item.section === "hero" && item.content_key === "hero_type"
    )?.content_value || "image";

  const heroImageFromAPI = contentItems.find(
    (item) => item.section === "hero" && item.content_key === "hero_image"
  )?.content_value;

  const heroVideoUrl = contentItems.find(
    (item) => item.section === "hero" && item.content_key === "hero_video_url"
  )?.content_value;

  // Helper function to format content with proper paragraphs and lists
  const formatContent = (content: string) => {
    if (!content) return [];

    const parts = content.split("\n\n").filter((p) => p.trim());
    return parts.map((part, index) => {
      const trimmed = part.trim();

      // Handle "Why Choose Us" section with checkmarks
      if (trimmed.includes("Why Choose Us") || trimmed.includes("✅")) {
        const lines = trimmed.split("\n");
        const title =
          lines.find((line) => line.includes("Why Choose Us")) ||
          "Why Choose Us";
        const items = lines
          .filter((line) => line.includes("✅"))
          .map((line) => line.replace("✅", "").trim());
        return {
          type: "checklist",
          title: title.replace("Why Choose Us", "").trim(),
          items,
        };
      }

      // Handle bullet points with •
      if (trimmed.includes("•\t") || trimmed.includes("•")) {
        const lines = trimmed.split("\n");
        const firstLine = lines[0];
        const bullets = lines
          .filter((line) => line.includes("•"))
          .map((line) => line.replace("•\t", "").replace("•", "").trim());
        return {
          type: "bullets",
          title: firstLine.includes("•") ? "" : firstLine,
          items: bullets,
        };
      }

      // Regular paragraph
      return { type: "paragraph", content: trimmed.replace(/\n/g, " ") };
    });
  };

  // Format company overview content
  const formattedOverview = formatContent(companyOverview);

  // Extract intro paragraph (first paragraph of overview)
  const introParagraph =
    formattedOverview.find((item) => item.type === "paragraph")?.content || "";

  // Use dedicated "Our Story" content, fall back to experience if not available
  const storyContent = ourStory || experience || "";
  const formattedStory = formatContent(storyContent);
  // console.log(heroImageFromAPI);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="h-10 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-12 w-40 bg-muted rounded animate-pulse" />
              </div>
              <div className="aspect-video bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 mx-auto bg-muted rounded animate-pulse mb-10" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-muted rounded animate-pulse w-full"
                  style={{ width: `${80 - index * 5}%` }}
                />
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
      <section className="py-8 lg:py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Media section - appears first on mobile, second on desktop */}
            <div className="relative order-1 lg:order-2">
              {loading ? (
                <div className="aspect-video rounded-lg bg-muted/50 animate-pulse shadow-2xl"></div>
              ) : heroType === "video" && heroVideoUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                  {heroVideoUrl.includes("youtube.com") ||
                  heroVideoUrl.includes("youtu.be") ? (
                    <iframe
                      src={
                        heroVideoUrl.includes("youtube.com")
                          ? `https://www.youtube.com/embed/${
                              heroVideoUrl.split("v=")[1]?.split("&")[0]
                            }`
                          : `https://www.youtube.com/embed/${
                              heroVideoUrl.split("youtu.be/")[1]?.split("?")[0]
                            }`
                      }
                      title="Company Video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : heroVideoUrl.includes("vimeo.com") ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${
                        heroVideoUrl.split("vimeo.com/")[1]?.split("?")[0]
                      }`}
                      title="Company Video"
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video controls className="w-full h-full object-cover">
                      <source src={heroVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : heroImageFromAPI ? (
                <img
                  src={heroImageFromAPI}
                  alt="Yahska Polymers Manufacturing Facility"
                  className="rounded-lg shadow-2xl w-full h-auto"
                />
              ) : null}
            </div>

            {/* Text section - appears second on mobile, first on desktop */}
            <div className="order-2 lg:order-1">
              {loading ? (
                <div className="space-y-6">
                  <div className="h-10 bg-muted/50 rounded animate-pulse w-2/3"></div>
                  <div className="space-y-3">
                    <div className="h-6 bg-muted/50 rounded animate-pulse"></div>
                    <div className="h-6 bg-muted/50 rounded animate-pulse w-4/5"></div>
                    <div className="h-6 bg-muted/50 rounded animate-pulse w-3/5"></div>
                  </div>
                </div>
              ) : (
                <>
                  <h1
                    className="text-3xl lg:text-4xl text-foreground mb-6"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {pageTitle}
                  </h1>
                  {introParagraph && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {introParagraph}
                    </p>
                  )}
                </>
              )}
              {fetchError && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
                  <strong>Debug Info:</strong> {fetchError}
                  <button
                    onClick={() => window.location.reload()}
                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {ourStorySectionTitle}
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-muted/50 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted/50 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3"></div>
              </div>
            ) : storyContent ? (
              <div className="space-y-4 text-muted-foreground leading-relaxed text-left">
                {formattedStory.map((item, index) => (
                  <div key={index}>
                    {item.type === "paragraph" && <p>{item.content}</p>}
                    {item.type === "bullets" && (
                      <div>
                        {item.title && <p className="mb-2">{item.title}</p>}
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {item.items?.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.type === "checklist" && (
                      <div>
                        {item.title && <p className="mb-2">{item.title}</p>}
                        <div className="space-y-2">
                          {item.items?.map((checkItem, checkIndex) => (
                            <div
                              key={checkIndex}
                              className="flex items-start gap-2"
                            >
                              <span className="text-green-600">✓</span>
                              <span>{checkItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* {(lastUpdated || lastKnownTimestamp > 0) && (
        <div className="text-center py-2 bg-gray-50 text-xs text-gray-500">
          {lastUpdated
            ? `Content updated: ${lastUpdated}`
            : "Checking for updates..."}
          <span className="ml-4 text-green-600">● Live sync active</span>
        </div>
      )} */}

      <Footer />
    </div>
  );
}
