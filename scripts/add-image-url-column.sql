-- Add image_url column to product_categories table
-- Run this in your Supabase SQL Editor

-- Add image_url column to product_categories table
ALTER TABLE product_categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'product_categories' 
AND column_name = 'image_url';
