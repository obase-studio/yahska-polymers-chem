"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { ImagePicker } from "./image-picker";
import { getImageUrl } from "@/lib/image-utils";

interface ContentEditorWithMediaProps {
  page: string;
  section: {
    id: string;
    title: string;
    description: string;
    fields: Array<{
      key: string;
      label: string;
      type: "text" | "textarea" | "image" | "select";
      options?: Array<{ value: string; label: string }>;
      placeholder?: string;
      maxLength?: number;
      helperText?: string;
    }>;
  };
}

// Helper function to get recommended image dimensions based on field key
function getImageDimensions(fieldKey: string): string {
  switch (fieldKey) {
    case "logo":
      return "200x80px (5:2 ratio)";
    case "hero_image":
      return "1920x1080px (16:9 ratio)";
    case "hero_background":
      return "1920x1080px (16:9 ratio)";
    default:
      return "1200x800px (3:2 ratio)";
  }
}

// Helper function to get image guidelines based on field key
function getImageGuidelines(fieldKey: string): string {
  switch (fieldKey) {
    case "logo":
      return "Company logo for header. Should be clear on both light and dark backgrounds, optimized for web display.";
    case "hero_image":
      return "High-quality hero image for page banner. Should be visually appealing and support text overlay. Ensure good contrast for readability.";
    case "hero_background":
      return "Full-width background image for hero section. High resolution recommended for crisp display on all devices.";
    default:
      return "High-quality image optimized for web. Ensure appropriate file size for fast loading.";
  }
}

export function ContentEditorWithMedia({
  section,
  page,
}: ContentEditorWithMediaProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");

  useEffect(() => {
    loadContent();
  }, [section.id, page]);

  const loadContent = async () => {
    try {
      const response = await fetch(
        `/api/admin/content?page=${page}&section=${section.id}`
      );
      if (response.ok) {
        const content = await response.json();
        const contentMap: Record<string, string> = {};
        content.forEach((item: any) => {
          contentMap[item.content_key] = item.content_value || "";
        });
        setFormData(contentMap);
      }
    } catch (error) {
      console.error("Error loading content:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save text content
      const textPromises = Object.entries(formData).map(([key, value]) => {
        const payload = {
          page,
          section: section.id,
          content_key: key,
          content_value: value,
        };
        return fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      });

      const responses = await Promise.all(textPromises);
      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        const timestamp = new Date().toLocaleTimeString();
        setLastSaved(timestamp);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);

        // Notify sync system - critical for header/branding updates
        try {
          const syncResponse = await fetch("/api/sync/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page,
              contentType: "content",
            }),
            cache: "no-store",
          });
          const syncResult = await syncResponse.json();
          console.log("🔄 Sync notification result:", syncResult);

          // If this is header content with branding changes, provide user feedback
          if (page === "header" && syncResult.revalidation?.layoutRevalidated) {
            console.log(
              "🚀 Header branding updated - all pages refreshed for immediate visibility across all environments"
            );
          }
        } catch (e) {
          console.log("⚠️ Sync notification error:", e);
        }
      } else {
        alert("Some content failed to save. Please try again.");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert(
        "Error saving content: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {section.fields.map((field) => {
          const helperMessage =
            field.helperText && field.maxLength
              ? `${field.helperText} (Max ${field.maxLength} characters.)`
              : field.helperText ||
                (field.maxLength
                  ? `Maximum ${field.maxLength} characters.`
                  : "");

          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={`${section.id}-${field.key}`}>
                {field.label}
              </Label>

              {field.type === "text" && (
                <Input
                  id={`${section.id}-${field.key}`}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder || field.label}
                  maxLength={field.maxLength}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={`${section.id}-${field.key}`}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder || field.label}
                  maxLength={field.maxLength}
                  rows={4}
                />
              )}

              {helperMessage && (
                <p className="text-xs text-muted-foreground">{helperMessage}</p>
              )}

              {field.type === "image" && (
                <ImagePicker
                  label=""
                  value={formData[field.key] || ""}
                  onChange={(url) => handleFieldChange(field.key, url)}
                  placeholder={`Select ${field.label.toLowerCase()}`}
                  folder="content-images"
                  recommendedDimensions={getImageDimensions(field.key)}
                  imageGuidelines={getImageGuidelines(field.key)}
                />
              )}

              {field.type === "select" && (
                <Select
                  value={formData[field.key] || ""}
                  onValueChange={(value) => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          );
        })}

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={isLoading}
            className={isSaved ? "bg-green-600" : ""}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : isSaved ? "Saved!" : "Save Content"}
          </Button>

          {lastSaved && (
            <div className="text-sm text-muted-foreground">
              Last saved: {lastSaved}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => window.open(`/${page}`, "_blank")}
              >
                View Page
              </Button>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
