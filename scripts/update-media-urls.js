#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jlbwwbnatmmkcizqprdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYnd3Ym5hdG1ta2NpenFwcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ4Nzg4MiwiZXhwIjoyMDcyMDYzODgyfQ.VRsTCJYa_lrRmhaNTInT9FnozS4B-imm0NCPr20ynkw';

const supabase = createClient(supabaseUrl, supabaseKey);
const STORAGE_BASE_URL = 'https://jlbwwbnatmmkcizqprdx.supabase.co/storage/v1/object/public/yahska-media';

async function updateMediaUrls() {
  console.log('🔄 Updating media file URLs to use Supabase Storage...\n');
  
  // Get all media files with local paths
  const { data: mediaFiles, error: fetchError } = await supabase
    .from('media_files')
    .select('id, filename, file_path')
    .like('file_path', '/media/%');
    
  if (fetchError) {
    console.error('❌ Error fetching media files:', fetchError);
    return;
  }
  
  console.log(`📁 Found ${mediaFiles.length} files with local paths to update\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of mediaFiles) {
    const oldPath = file.file_path;
    // Convert /media/client-logos/image.jpg to https://supabase.co/storage/.../client-logos/image.jpg
    const newPath = `${STORAGE_BASE_URL}${oldPath.replace('/media/', '/')}`;
    
    console.log(`📝 Updating: ${file.filename}`);
    console.log(`   Old: ${oldPath}`);
    console.log(`   New: ${newPath}`);
    
    const { error: updateError } = await supabase
      .from('media_files')
      .update({ file_path: newPath })
      .eq('id', file.id);
    
    if (updateError) {
      console.log(`   ❌ Error: ${updateError.message}`);
      errorCount++;
    } else {
      console.log(`   ✅ Updated successfully`);
      successCount++;
    }
    console.log('');
  }
  
  console.log('=== SUMMARY ===');
  console.log(`✅ Successfully updated: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  
  if (successCount > 0) {
    console.log('\n🎉 Media files now use Supabase Storage URLs!');
    console.log('Your images should now load from Supabase Storage instead of local files.');
  }
}

updateMediaUrls().catch(console.error);