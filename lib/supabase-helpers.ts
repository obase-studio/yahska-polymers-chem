import { supabase, supabaseAdmin } from "./supabase";
import {
  parseProductData,
  Product,
  Category,
  ContentItem,
} from "./database-client";

// Supabase database helper functions
export const supabaseHelpers = {
  // Content management
  getContent: async (page: string, section?: string) => {
    let query = supabase.from("site_content").select("*").eq("page", page);

    if (section) {
      query = query.eq("section", section);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  setContent: async (
    page: string,
    section: string,
    contentKey: string,
    contentValue: string
  ) => {
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .upsert(
        {
          page,
          section,
          content_key: contentKey,
          content_value: contentValue,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "page,section,content_key",
        }
      )
      .select();

    if (error) throw error;
    return data;
  },

  deleteContent: async (page: string, section: string, contentKey?: string) => {
    let query = supabaseAdmin
      .from("site_content")
      .delete()
      .eq("page", page)
      .eq("section", section);

    if (contentKey) {
      query = query.eq("content_key", contentKey);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Products
  getAllProducts: async () => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_categories (
          name
        )
      `
      )
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return (
      data?.map((product: any) => ({
        ...parseProductData(product),
        category_name: product.product_categories?.name,
      })) || []
    );
  },

  getProductById: async (id: number) => {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_categories!products_category_id_fkey(name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      // If no rows found, return null instead of throwing error
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    if (!data) return null;

    // Add category_name to the product data
    const productWithCategory = {
      ...data,
      category_name: data.product_categories?.name || data.category_id,
    };

    return parseProductData(productWithCategory);
  },

  updateProduct: async (id: number, product: any) => {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        applications: product.applications || [],
        features: product.features || [],
        image_url: product.image_url,
        usage: product.usage,
        advantages: product.advantages,
        technical_specifications: product.technical_specifications,
        packaging_info: product.packaging_info,
        safety_information: product.safety_information,
        product_code: product.product_code,
        specification_pdf: product.specification_pdf,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  },

  deleteProduct: async (id: number) => {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  },

  createProduct: async (product: any) => {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        applications: product.applications || [],
        features: product.features || [],
        image_url: product.image_url,
        usage: product.usage,
        advantages: product.advantages,
        technical_specifications: product.technical_specifications,
        packaging_info: product.packaging_info,
        safety_information: product.safety_information,
        product_code: product.product_code,
        specification_pdf: product.specification_pdf,
      })
      .select();

    if (error) throw error;
    return data;
  },

  // Categories
  getAllCategories: async () => {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  },

  getAllCategoriesWithCounts: async () => {
    const { data, error } = await supabase
      .from("product_categories")
      .select(
        `
        *,
        products (count)
      `
      )
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;

    return (
      data?.map((category: any) => ({
        ...category,
        product_count: category.products?.length || 0,
      })) || []
    );
  },

  getCategoryById: async (id: string) => {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // If no rows found, return null instead of throwing error
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },

  createCategory: async (category: any) => {
    const { data, error } = await supabase
      .from("product_categories")
      .insert({
        id: category.id,
        name: category.name,
        description: category.description,
        sort_order: category.sort_order,
        is_active: true,
      })
      .select();

    if (error) throw error;
    return data;
  },

  updateCategory: async (id: string, category: any) => {
    const { data, error } = await supabase
      .from("product_categories")
      .update({
        name: category.name,
        description: category.description,
        sort_order: category.sort_order,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  },

  deleteCategory: async (id: string) => {
    console.log("supabaseHelpers.deleteCategory - Input:", { id });

    const { data, error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", id);

    console.log("supabaseHelpers.deleteCategory - Result:", { data, error });

    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }
    return data;
  },

  getProductCountByCategory: async (categoryId: string) => {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", categoryId);

    if (error) throw error;
    return count || 0;
  },

  // Client testimonials
  getAllTestimonials: async () => {
    const { data, error } = await supabase
      .from("client_testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .order("id");

    if (error) throw error;
    return data || [];
  },

  // Media files
  getAllMediaFiles: async () => {
    const { data, error } = await supabase
      .from("media_files")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Page images - store as special content entries
  getPageImage: async (page: string, section: string = "hero") => {
    const { data, error } = await supabase
      .from("site_content")
      .select("content_value")
      .eq("page", page)
      .eq("section", section)
      .eq("content_key", "image_id")
      .single();

    if (error && error.code !== "PGRST116") return null; // Ignore "not found" errors

    if (data?.content_value) {
      // Get the media file details
      const { data: mediaFile, error: mediaError } = await supabase
        .from("media_files")
        .select("*")
        .eq("id", parseInt(data.content_value))
        .single();

      if (!mediaError && mediaFile) {
        return { media_files: mediaFile };
      }
    }

    return null;
  },

  setPageImage: async (page: string, section: string, mediaFileId: number) => {
    // Store the media file ID as content
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .upsert({
        page,
        section,
        content_key: "image_id",
        content_value: mediaFileId.toString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    // Return the media file details
    const { data: mediaFile } = await supabase
      .from("media_files")
      .select("*")
      .eq("id", mediaFileId)
      .single();

    return { media_files: mediaFile };
  },

  removePageImage: async (page: string, section: string) => {
    const { error } = await supabaseAdmin
      .from("site_content")
      .delete()
      .eq("page", page)
      .eq("section", section)
      .eq("content_key", "image_id");

    if (error) throw error;
    return true;
  },

  // SEO settings
  getAllSEOSettings: async () => {
    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .order("page");

    if (error) throw error;
    return data || [];
  },

  setSEOSettings: async (page: string, seoData: any) => {
    const { data, error } = await supabase
      .from("seo_settings")
      .upsert({
        page,
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        og_title: seoData.og_title,
        og_description: seoData.og_description,
        og_image: seoData.og_image,
        canonical_url: seoData.canonical_url,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return data;
  },

  // Media files operations
  deleteMediaFile: async (id: number) => {
    const { data, error } = await supabase
      .from("media_files")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  },

  saveMediaFile: async (fileData: any) => {
    const { data, error } = await supabase
      .from("media_files")
      .insert({
        filename: fileData.filename,
        original_name: fileData.originalName,
        file_path: fileData.filePath,
        file_size: fileData.fileSize,
        mime_type: fileData.mimeType,
        alt_text: fileData.altText || null,
      })
      .select();

    if (error) throw error;
    return data;
  },

  // Seed data methods (for development/testing)
  createClient: async (clientData: any) => {
    const { data, error } = await supabase
      .from("clients")
      .insert(clientData)
      .select();

    if (error) throw error;
    return data;
  },

  createApproval: async (approvalData: any) => {
    const { data, error } = await supabase
      .from("approvals")
      .insert(approvalData)
      .select();

    if (error) throw error;
    return data;
  },

  createProject: async (projectData: any) => {
    const { data, error } = await supabase
      .from("projects")
      .insert(projectData)
      .select();

    if (error) throw error;
    return data;
  },

  // Admin authentication
  getAdminByUsername: async (username: string) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      // If no rows found, return null instead of throwing error
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },

  // Company info
  getAllCompanyInfo: async () => {
    const { data, error } = await supabase
      .from("company_info")
      .select("*")
      .eq("is_active", true)
      .order("category");

    if (error) throw error;
    return data || [];
  },

  // Projects
  getAllProjects: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_categories (
          name
        )
      `
      )
      .eq("is_active", true)
      .order("sort_order")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Clients
  getAllClients: async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  },

  // Approvals
  getAllApprovals: async () => {
    const { data, error } = await supabase
      .from("approvals")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  },

  // Project Categories
  getAllProjectCategories: async () => {
    const { data, error } = await supabase
      .from("project_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return data || [];
  },

  getProjectCategoryById: async (id: string) => {
    const { data, error } = await supabase
      .from("project_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // If no rows found, return null instead of throwing error
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data;
  },

  createProjectCategory: async (category: any) => {
    const { data, error } = await supabase
      .from("project_categories")
      .insert({
        id: category.id,
        name: category.name,
        description: category.description,
        sort_order: category.sort_order,
        is_active: true,
      })
      .select();

    if (error) throw error;
    return data;
  },

  updateProjectCategory: async (id: string, category: any) => {
    console.log("supabaseHelpers.updateProjectCategory - Input:", {
      id,
      category,
    });

    const updatePayload = {
      name: category.name,
      description: category.description,
      sort_order: category.sort_order,
      is_active: category.is_active !== undefined ? category.is_active : true,
    };

    console.log(
      "supabaseHelpers.updateProjectCategory - Update payload:",
      updatePayload
    );

    const { data, error } = await supabase
      .from("project_categories")
      .update(updatePayload)
      .eq("id", id)
      .select();

    console.log("supabaseHelpers.updateProjectCategory - Result:", {
      data,
      error,
    });

    if (error) {
      console.error("Supabase update error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw error;
    }
    return data;
  },

  deleteProjectCategory: async (id: string) => {
    const { data, error } = await supabase
      .from("project_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  },

  getProjectCountByCategory: async (categoryId: string) => {
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("category", categoryId);

    if (error) throw error;
    return count || 0;
  },
};

// For backward compatibility, you can also export as dbHelpers
export const dbHelpers = supabaseHelpers;
