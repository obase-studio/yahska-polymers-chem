import { SimpleDashboard } from "@/components/admin/simple-dashboard";
import { supabaseHelpers } from "@/lib/supabase-helpers";

export default async function AdminDashboard() {
  // Get basic stats from database
  const products = await supabaseHelpers.getAllProducts();
  const mediaFiles = await supabaseHelpers.getAllMediaFiles();

  // Get projects count using supabaseHelpers instead of API call
  let projectsCount = 0;
  try {
    const projects = await supabaseHelpers.getAllProjects();
    projectsCount = projects.length;
  } catch (error) {
    console.error("Error fetching projects:", error);
  }

  const stats = {
    products: products.length,
    projects: projectsCount,
    mediaFiles: mediaFiles.length,
    contentPages: 4, // Home, About, Contact, Certifications
  };

  return <SimpleDashboard stats={stats} />;
}
