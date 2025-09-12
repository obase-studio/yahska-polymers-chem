-- Migration script to add image fields to category tables
-- Run this in your Supabase SQL Editor

-- Add image_url column to product_categories table
ALTER TABLE product_categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add icon_url column to project_categories table (if it doesn't exist)
ALTER TABLE project_categories 
ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Verify the columns were added
SELECT 
    table_name,
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name IN ('product_categories', 'project_categories')
AND column_name IN ('image_url', 'icon_url')
ORDER BY table_name, column_name;

-- Test query to see current data
SELECT id, name, image_url FROM product_categories LIMIT 5;
SELECT id, name, icon_url FROM project_categories LIMIT 5;
