// Client-side safe version of database helpers
// This file doesn't import fs or better-sqlite3 directly

// Type definitions for database objects
export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: string;
  category_name?: string;
  applications: string[];
  features: string[];
  image_url?: string;
  is_active: boolean;
  usage?: string;
  advantages?: string;
  technical_specifications?: string;
  packaging_info?: string;
  safety_information?: string;
  product_code?: string;
  specification_pdf?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface ContentItem {
  id: number;
  page: string;
  section: string;
  content_key: string;
  content_value: string;
  updated_at: string;
}

// Helper function to parse JSON fields from products
export function parseProductData(product: any): Product {
  const normalizeArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    }
    return [];
  };

  const { price: _price, ...productWithoutPrice } = product;

  return {
    ...productWithoutPrice,
    applications: normalizeArray(product.applications),
    features: normalizeArray(product.features),
  };
}

// Helper function to get content value
export function getContentValue(
  contentItems: ContentItem[],
  key: string
): string | undefined {
  const item = contentItems.find((item) => item.content_key === key);
  return item?.content_value;
}
