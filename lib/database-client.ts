// Client-side safe version of database helpers
// This file doesn't import fs or better-sqlite3 directly

// Type definitions for database objects
export interface Product {
  id: number;
  name: string;
  description: string;
  price?: string;
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
}

export interface Category {
  id: string;
  name: string;
  description?: string;
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
  const safeParseJSON = (jsonData: any): string[] => {
    if (!jsonData) return [];
    
    // If it's already an array, return it
    if (Array.isArray(jsonData)) {
      return jsonData;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof jsonData === 'string') {
      try {
        // Clean up the JSON string by removing carriage returns and fixing formatting
        const cleanedString = jsonData.replace(/\r/g, '').replace(/\n/g, '');
        return JSON.parse(cleanedString);
      } catch (error) {
        console.warn('Failed to parse JSON field:', error);
        // If JSON parsing fails, try to extract array-like content manually
        if (jsonData.includes('[') && jsonData.includes(']')) {
          try {
            // Extract content between brackets and split by quotes
            const content = jsonData.match(/\[(.*)\]/)?.[1];
            if (content) {
              return content.split('","').map(item => item.replace(/"/g, '').trim());
            }
          } catch (e) {
            console.warn('Failed to manually parse array:', e);
          }
        }
        return [];
      }
    }
    
    return [];
  };

  return {
    ...product,
    applications: safeParseJSON(product.applications),
    features: safeParseJSON(product.features)
  };
}

// Helper function to get content value
export function getContentValue(contentItems: ContentItem[], key: string): string | undefined {
  const item = contentItems.find(item => item.content_key === key);
  return item?.content_value;
}
