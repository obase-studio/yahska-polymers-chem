import { EnhancedMediaManager } from "@/components/admin/enhanced-media-manager"
import { supabaseHelpers } from "@/lib/supabase-helpers"

export default async function MediaPage() {
  const mediaFiles = await supabaseHelpers.getAllMediaFiles()

  return <EnhancedMediaManager initialMediaFiles={mediaFiles} />
}