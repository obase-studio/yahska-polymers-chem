"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  FileText,
} from "lucide-react";
import { ImagePicker } from "@/components/admin/image-picker";

interface ProductFormProps {
  categories: any[];
  product?: any;
  isEdit?: boolean;
}

export function ProductForm({
  categories,
  product,
  isEdit = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category_id: product?.category_id || "",
    image_url: product?.image_url || "",
    specification_pdf: product?.specification_pdf || "",
    applications: product?.applications
      ? typeof product.applications === "string" &&
        product.applications.startsWith("[")
        ? JSON.parse(product.applications)
        : Array.isArray(product.applications)
        ? product.applications
        : []
      : [],
    features: product?.features
      ? typeof product.features === "string" && product.features.startsWith("[")
        ? JSON.parse(product.features)
        : Array.isArray(product.features)
        ? product.features
        : []
      : [],
  });

  const [newApplication, setNewApplication] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const router = useRouter();

  const addApplication = () => {
    if (newApplication.trim()) {
      setFormData((prev) => ({
        ...prev,
        applications: [...prev.applications, newApplication.trim()],
      }));
      setNewApplication("");
    }
  };

  const removeApplication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      applications: prev.applications.filter(
        (_: string, i: number) => i !== index
      ),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_: string, i: number) => i !== index),
    }));
  };

  const handlePdfUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          specification_pdf: result.data.url,
        }));
      } else {
        alert(result.error || "Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Error uploading PDF");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const errorData = await response.json();
        console.log("Failed to save product:", errorData);
        alert(`Failed to save product: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.log("Error saving product:", error);
      alert(
        `Error saving product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Product Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter product name"
              className="h-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category_id: value }))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Enter detailed product description"
            rows={4}
            className="resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <ImagePicker
            label="Product Image"
            value={formData.image_url}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, image_url: url }))
            }
            placeholder="Select product image"
            folder="uploads"
            recommendedDimensions="1200x800px (3:2 ratio)"
            imageGuidelines="High-quality image showing the product clearly. 3:2 aspect ratio recommended for optimal display on product cards and detail pages."
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Specification PDF</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div className="flex justify-center">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  disabled={uploadingPdf}
                  className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              {uploadingPdf && (
                <div className="text-sm text-muted-foreground text-center mt-2">
                  Uploading PDF...
                </div>
              )}
            </div>
            {formData.specification_pdf && (
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <a
                    href={formData.specification_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    View Current PDF
                  </a>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      specification_pdf: "",
                    }))
                  }
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Upload PDF specification document (max 10MB)
          </p>
        </div>

        {/* Applications & Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Applications</Label>
              <p className="text-xs text-muted-foreground">Where can this product be used?</p>
            </div>
            <div className="flex gap-2">
              <Input
                value={newApplication}
                onChange={(e) => setNewApplication(e.target.value)}
                placeholder="Add application (e.g., Concrete mixing)"
                className="h-10"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addApplication())
                }
              />
              <Button
                type="button"
                onClick={addApplication}
                size="sm"
                className="px-3 h-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.applications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.applications.map((app: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2 py-1 px-3"
                  >
                    {app}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeApplication(index)}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No applications added yet
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Key Features</Label>
              <p className="text-xs text-muted-foreground">What makes this product special?</p>
            </div>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature (e.g., High durability)"
                className="h-10"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
              />
              <Button
                type="button"
                onClick={addFeature}
                size="sm"
                className="px-3 h-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.features.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2 py-1 px-3"
                  >
                    {feature}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeFeature(index)}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No features added yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="sm:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="sm:w-auto">
          {isLoading
            ? "Saving..."
            : isEdit
            ? "Update Product"
            : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
