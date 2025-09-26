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
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { MediaPickerModal } from "@/components/admin/media-picker-modal";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  uploaded_at: string;
}
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

interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  product_count?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    image_url: "",
    sort_order: 1,
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadCategories();
        resetForm();
        setShowAddDialog(false);
      } else {
        alert("Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      image_url: "",
      sort_order: categories.length + 1,
    });
    setEditingCategory(null);
  };

  const startEdit = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      image_url: category.image_url || "",
      sort_order: category.sort_order,
    });
    setEditingCategory(category);
    setShowAddDialog(true);
  };

  const startAdd = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const handleImageSelect = (file: MediaFile) => {
    setFormData((prev) => ({ ...prev, image_url: file.file_path }));
    setShowMediaPicker(false);
  };


  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
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
            Product Categories
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage product categories and organization
          </p>
        </div>
        <Button onClick={startAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const getCategoryIcon = () => {
            if (category.name.toLowerCase().includes("admixture")) return "🔧";
            if (category.name.toLowerCase().includes("accelerator"))
              return "⚡";
            return "📦";
          };

          return (
            <Card
              key={category.id}
              className="border-2 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <CardHeader className="pb-6 px-8 pt-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <CardTitle className="text-lg flex items-center gap-4 font-semibold">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        ) : (
                          <span className="text-xl">{getCategoryIcon()}</span>
                        )}
                      </div>
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed ml-1">
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="mb-6 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded">
                  Order: {category.sort_order}
                </div>
                <div className="flex items-center justify-between">
                  {/* <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {category.product_count || 0}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      product{(category.product_count || 0) !== 1 ? "s" : ""}
                    </span>
                  </div> */}
                  
                  <div className="flex gap-3 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(category)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <DeleteConfirmationButton
                      disabled={loading}
                      onConfirm={() => handleDelete(category.id)}
                    />
                  </div>
                </div>
                
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category information below."
                : "Create a new product category."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-id" className="text-sm font-medium">
                  Category ID
                </Label>
                <Input
                  id="category-id"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, id: e.target.value }))
                  }
                  placeholder="e.g., grouts"
                  className="mt-1"
                  required
                  disabled={!!editingCategory}
                />
                <p className="text-xs text-muted-foreground">
                  Lowercase, no spaces (used in URLs)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort-order" className="text-sm font-medium">
                  Sort Order
                </Label>
                <Input
                  id="sort-order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sort_order: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-name" className="text-sm font-medium">
                Category Name
              </Label>
              <Input
                id="category-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Grouts"
                className="mt-1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category-description"
                className="text-sm font-medium"
              >
                Description
              </Label>
              <Textarea
                id="category-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe this category..."
                rows={3}
                className="mt-1 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Category Image</Label>
              <div className="space-y-3">
                {/* Image Guidelines */}
                <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded border-l-2 border-primary/20">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    <span className="font-medium">Recommended Dimensions:</span>
                    <span>400x400px (1:1 ratio)</span>
                  </div>
                  <div className="text-xs">
                    Square icon or logo representing the category. Should be clear and recognizable at small sizes for use in category cards and navigation menus.
                  </div>
                </div>
                {formData.image_url ? (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Image
                            src={getImageUrl(formData.image_url)}
                            alt="Category image"
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Category Image</h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => setShowMediaPicker(true)}
                          >
                            Change Image
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        No image selected
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowMediaPicker(true)}
                      >
                        Select Image
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleImageSelect}
        title="Select Category Image"
        imagesOnly={true}
      />
    </div>
  );
}

function DeleteConfirmationButton({
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
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the category and cannot be undone.
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
