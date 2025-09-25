"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentEditorWithMedia } from "@/components/admin/content-editor-with-media";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function ContentPage() {
  const [selectedPage, setSelectedPage] = useState("home");

  const getSectionsForPage = (page: string) => {
    if (page === "header") {
      return [
        {
          id: "branding",
          title: "Header Branding",
          description: "Manage logo and company name shown in the site header",
          fields: [
            {
              key: "logo",
              label: "Company Logo",
              type: "image" as const,
            },
            {
              key: "company_name",
              label: "Company Name",
              type: "text" as const,
              placeholder: "Yahska Polymers",
              maxLength: 26,
              helperText: "Keep under 26 characters so it fits next to the logo on mobile.",
            },
          ],
        },
      ];
    }

    if (page === "home") {
      return [
        {
          id: "hero",
          title: "Hero Section",
          description:
            "Choose between image or video for hero section, main headline, and description",
          fields: [
            {
              key: "hero_type",
              label: "Hero Media Type",
              type: "select" as const,
              options: [
                { value: "image", label: "Image" },
                { value: "video", label: "Video" },
              ],
            },
            {
              key: "hero_image",
              label: "Hero Background Image",
              type: "image" as const,
            },
            {
              key: "hero_video_url",
              label: "Hero Video URL (YouTube, Vimeo, or direct video link)",
              type: "text" as const,
            },
            { key: "headline", label: "Main Headline", type: "text" as const },
            {
              key: "description",
              label: "Hero Description",
              type: "textarea" as const,
            },
          ],
        },
        {
          id: "product_categories",
          title: "Our Product Categories",
          description: "Section title and description for product categories",
          fields: [
            { key: "title", label: "Section Title", type: "text" as const },
            {
              key: "description",
              label: "Section Description",
              type: "textarea" as const,
            },
          ],
        },
        {
          id: "project_categories",
          title: "Our Project Categories",
          description: "Section title and description for project categories",
          fields: [
            { key: "title", label: "Section Title", type: "text" as const },
            {
              key: "description",
              label: "Section Description",
              type: "textarea" as const,
            },
          ],
        },
        {
          id: "key_customers",
          title: "Key Customers",
          description: "Section title and description for client logos",
          fields: [
            { key: "title", label: "Section Title", type: "text" as const },
            {
              key: "description",
              label: "Section Description",
              type: "textarea" as const,
            },
          ],
        },
        {
          id: "key_approvals",
          title: "Key Approvals & Certifications",
          description:
            "Section title and description for approval/certification logos",
          fields: [
            { key: "title", label: "Section Title", type: "text" as const },
            {
              key: "description",
              label: "Section Description",
              type: "textarea" as const,
            },
          ],
        },
      ];
    }

    if (page === "about") {
      return [
        {
          id: "hero",
          title: "About Hero Section",
          description:
            "Choose between image or video for hero section and intro text",
          fields: [
            {
              key: "hero_type",
              label: "Hero Media Type",
              type: "select" as const,
              options: [
                { value: "image", label: "Image" },
                { value: "video", label: "Video" },
              ],
            },
            {
              key: "hero_image",
              label: "About Hero Image",
              type: "image" as const,
            },
            {
              key: "hero_video_url",
              label: "Hero Video URL (YouTube, Vimeo, or direct video link)",
              type: "text" as const,
            },
          ],
        },
        {
          id: "company_overview",
          title: "Company Overview",
          description: "Main about text (first paragraph shows in hero)",
          fields: [
            {
              key: "content",
              label: "Overview Content",
              type: "textarea" as const,
            },
          ],
        },
        {
          id: "our_story",
          title: "Our Story",
          description: "Company history and background story",
          fields: [
            {
              key: "content",
              label: "Our Story Content",
              type: "textarea" as const,
            },
          ],
        },
      ];
    }

    if (page === "products") {
      return [
        {
          id: "hero",
          title: "Products Hero Section",
          description: "Main hero section displayed at the top of the products page",
          fields: [
            {
              key: "headline",
              label: "Hero Title",
              type: "text" as const,
              placeholder: "Our Products",
            },
            {
              key: "description",
              label: "Hero Description",
              type: "textarea" as const,
              placeholder: "Discover our comprehensive range of high-quality construction chemicals and concrete admixtures designed for professional applications.",
            },
          ],
        },
        {
          id: "product_overview",
          title: "Products Overview",
          description: "Intro paragraph for products page",
          fields: [
            {
              key: "content",
              label: "Overview Content",
              type: "textarea" as const,
            },
          ],
        },
      ];
    }

    if (page === "projects") {
      return [
        {
          id: "hero",
          title: "Projects Hero Section",
          description: "Main hero section displayed at the top of the projects page",
          fields: [
            {
              key: "headline",
              label: "Hero Title",
              type: "text" as const,
              placeholder: "Our Projects",
            },
            {
              key: "description",
              label: "Hero Description",
              type: "textarea" as const,
              placeholder: "Explore our portfolio of successful construction projects across infrastructure, railways, and industrial applications.",
            },
          ],
        },
        {
          id: "project_overview",
          title: "Projects Overview",
          description: "Intro paragraph for projects page",
          fields: [
            {
              key: "content",
              label: "Overview Content",
              type: "textarea" as const,
            },
          ],
        },
      ];
    }

    if (page === "clients") {
      return [
        {
          id: "hero",
          title: "Clients Hero Section",
          description: "Main headline and description for clients page",
          fields: [
            { key: "headline", label: "Page Headline", type: "text" as const },
            {
              key: "description",
              label: "Hero Description",
              type: "textarea" as const,
            },
          ],
        },
        {
          id: "client_section",
          title: "Client Section",
          description: "Description above client logos",
          fields: [
            { key: "title", label: "Section Title", type: "text" as const },
            {
              key: "description",
              label: "Section Description",
              type: "textarea" as const,
            },
          ],
        },
        {
          id: "approval_section",
          title: "Approvals Section",
          description: "Description above approval/certification logos",
          fields: [
            { key: "title", label: "Section Title", type: "text" as const },
            {
              key: "description",
              label: "Section Description",
              type: "textarea" as const,
            },
          ],
        },
      ];
    }

    if (page === "footer") {
      return [
        {
          id: "company_profile",
          title: "Company Profile Download",
          description: "Configure the download link for company profile PDF",
          fields: [
            {
              key: "download_url",
              label: "Company Profile PDF URL",
              type: "text" as const,
            },
          ],
        },
      ];
    }

    if (page === "contact") {
      return [
        {
          id: "hero",
          title: "Contact Hero Section",
          description: "Contact page headline and description",
          fields: [
            { key: "headline", label: "Page Headline", type: "text" as const },
            {
              key: "description",
              label: "Hero Description",
              type: "textarea" as const,
            },
          ],
        },
        {
          id: "locations",
          title: "Office Locations",
          description: "Company office addresses - add multiple locations as needed",
          fields: [
            {
              key: "content",
              label: "Office Locations",
              type: "textarea" as const,
              placeholder: "Add your office locations here. You can format them as needed, for example:\n\nUnit 1 - Changodar\nS. No 407, Khata No 1217, Bh Sarvodaya Hotel,\nMoraiya, Changodar, Ahmedabad – 382213\n\nUnit 2 - Vatva\nC-1/127, Phase I, Nr Tiger Surgical,\nGIDC Vatva, Ahmedabad – 382245",
            },
          ],
        },
        {
          id: "contact_details",
          title: "Contact Details",
          description: "Phone and email information",
          fields: [
            { key: "phone", label: "Phone Number", type: "text" as const },
            { key: "email", label: "Email Address", type: "text" as const },
          ],
        },
      ];
    }

    // Default return for unknown pages
    return [];
  };

  const contentSections = getSectionsForPage(selectedPage);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Content Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Edit website content and messaging
          </p>
        </div>
      </div>

      {/* Page Selector */}
      <Card className="border-2 shadow-sm bg-white">
        <CardHeader className="px-8 pt-8 pb-6">
          <CardTitle className="text-lg font-semibold">
            Select Page to Edit
          </CardTitle>
          <CardDescription>
            Choose which page content you want to modify
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-80 h-12">
              <SelectValue placeholder="Select Page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="header">Header</SelectItem>
              <SelectItem value="about">About</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="clients">Clients</SelectItem>
              <SelectItem value="footer">Footer</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        {contentSections.map((section) => (
          <Card key={section.id} className="border-2 shadow-sm bg-white">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="text-lg font-semibold">
                {section.title}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ContentEditorWithMedia section={section} page={selectedPage} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
