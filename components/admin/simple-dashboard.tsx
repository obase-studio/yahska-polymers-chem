"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  FileText,
  Image,
  ExternalLink,
  ArrowRight,
  Edit,
  Upload,
  Building2,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface SimpleDashboardProps {
  stats: {
    products: number;
    projects: number;
    mediaFiles: number;
    contentPages: number;
  };
}

export function SimpleDashboard({ stats }: SimpleDashboardProps) {
  const mainStats = [
    {
      title: "Products",
      value: stats.products,
      description: "Total products in catalog",
      icon: Package,
      href: "/admin/products",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Media Files",
      value: stats.mediaFiles,
      description: "Images and documents",
      icon: Image,
      href: "/admin/media",
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Projects",
      value: stats.projects,
      description: "Showcase projects",
      icon: Building2,
      href: "/admin/projects",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Content Pages",
      value: stats.contentPages,
      description: "Website pages",
      icon: FileText,
      href: "/admin/content",
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Edit Website Content",
      description: "Update homepage, about, and page content",
      href: "/admin/content",
      icon: Edit,
      primary: true,
    },
    {
      title: "Add Projects",
      description: "Create a new project for the showcase",
      href: "/admin/projects/new",
      icon: Building2,
      primary: false,
    },
    {
      title: "Manage Media",
      description: "Upload and organize images",
      href: "/admin/media",
      icon: Upload,
      primary: false,
    },
    {
      title: "Cleanup Images",
      description: "Remove broken image references",
      href: "/admin/cleanup-images",
      icon: Trash2,
      primary: false,
    },
    {
      title: "Add Products",
      description: "Add new products to catalog",
      href: "/admin/products",
      icon: Package,
      primary: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your website content
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Website
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {mainStats.slice(0, 3).map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-2 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl text-foreground">{stat.value}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="ml-4">
                    <Link href={stat.href}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl mb-6">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="border-2 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <Link href={action.href} className="block">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm">{action.title}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground ml-4" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
