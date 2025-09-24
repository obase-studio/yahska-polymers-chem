"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Building2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { ImagePicker } from "@/components/admin/image-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  sort_order: number;
  is_active: boolean;
  project_count?: number;
}

export default function ProjectCategoriesPage() {
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] =
    useState<ProjectCategory | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    icon_url: "",
    sort_order: 1,
  });

  // Load project categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/project-categories");
      const result = await response.json();
      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load project categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCategory
        ? `/api/admin/project-categories/${encodeURIComponent(editingCategory.id)}`
        : "/api/admin/project-categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await loadCategories();
        resetForm();
        setShowAddDialog(false);
        setEditingCategory(null);
      } else {
        alert(result.error || "Failed to save project category");
      }
    } catch (error) {
      console.error("Error saving project category:", error);
      alert("Error saving project category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/project-categories/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (result.success) {
        await loadCategories();
      } else {
        alert(result.error || "Failed to delete project category");
      }
    } catch (error) {
      console.error("Error deleting project category:", error);
      alert("Error deleting project category");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (category: ProjectCategory) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/project-categories/${encodeURIComponent(category.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: category.name,
            description: category.description,
            sort_order: category.sort_order,
            is_active: !category.is_active,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        await loadCategories();
      } else {
        alert(result.error || "Failed to update project category");
      }
    } catch (error) {
      console.error("Error updating project category:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: ProjectCategory) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      icon_url: category.icon_url || "",
      sort_order: category.sort_order,
    });
    setShowAddDialog(true);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      icon_url: "",
      sort_order: 1,
    });
    setEditingCategory(null);
  };


  if (loading && categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Project Categories</h1>
            <p className="text-muted-foreground">
              Manage project categories and their settings
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading project categories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Project Categories
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage project categories and their settings
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory
                  ? "Edit Project Category"
                  : "Add New Project Category"}
              </DialogTitle>
              <DialogDescription>
                Create or modify project category information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Category Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., High Speed Rail"
                  className="mt-1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of this project category"
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              <div className="space-y-2">
                <ImagePicker
                  label="Category Icon"
                  value={formData.icon_url}
                  onChange={(url) =>
                    setFormData({ ...formData, icon_url: url })
                  }
                  placeholder="Select category icon"
                  folder="project-categories"
                  recommendedDimensions="400x400px (1:1 ratio)"
                  imageGuidelines="Square icon representing the project category. Should be simple, clear, and work well at various sizes for navigation and category displays."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order" className="text-sm font-medium">
                  Display Order
                </Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="1"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value) || 1,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="border-2 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {category.icon_url ? (
                      <img
                        src={category.icon_url}
                        alt={category.name}
                        className="w-6 h-6 object-cover rounded"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{category.name}</div>
                    {/* <Badge
                      variant={category.is_active ? "default" : "secondary"}
                      className="mt-2 px-3 py-1"
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge> */}
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed mt-4 ml-1">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="mb-6">
                <div className="text-sm text-muted-foreground bg-muted/30 px-4 py-3 rounded-lg">
                  Order: {category.sort_order}
                  {/* {category.project_count !== undefined && (
                    <span className="ml-2">
                      • Projects: {category.project_count}
                    </span>
                  )} */}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(category)}
                  disabled={loading}
                  className="h-8"
                >
                  {category.is_active ? "Deactivate" : "Activate"}
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(category)}
                  className="h-8"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <ProjectCategoryDeleteButton
                  disabled={loading}
                  onConfirm={() => handleDelete(category.id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <Card className="border-2 shadow-sm bg-white">
          <CardContent className="py-16 px-8 text-center">
            <Building2 className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-3">
              No Project Categories
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first project category
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProjectCategoryDeleteButton({
  onConfirm,
  disabled,
}: {
  onConfirm: () => Promise<void>
  disabled?: boolean
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="text-destructive hover:text-destructive h-8"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project Category</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the project category and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
