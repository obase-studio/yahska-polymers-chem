# CSV Data Import Templates for Yahska Polymers

This directory contains organized CSV templates for bulk importing data into your Supabase database.

## Import Order (IMPORTANT!)

Due to foreign key relationships, import CSVs in this exact order:

1. **01_product_categories.csv** - Product categories first
2. **03_project_categories.csv** - Project categories  
3. **09_company_info.csv** - Company information
4. **07_media_files.csv** - Media files 
5. **02_products.csv** - Products (references categories)
6. **08_product_images.csv** - Product images (references products)
7. **04_projects.csv** - Projects (references project categories)
8. **05_clients.csv** - Client information
9. **06_approvals.csv** - Approvals and certifications
10. **10_seo_settings.csv** - SEO settings for pages

## File Descriptions

### Core Data Files
- **01_product_categories.csv**: 12 product categories (Accelerators, Admixtures, etc.)
- **02_products.csv**: Sample products with full specifications, applications, and features
- **03_project_categories.csv**: 5 project categories (Bullet Train, Metro, Roads, etc.)
- **04_projects.csv**: Major infrastructure projects with details and image references

### Relationship Files  
- **08_product_images.csv**: Links product images to specific products
- **07_media_files.csv**: Media asset management with categorization

### Business Data
- **05_clients.csv**: Major clients like L&T, Tata Projects, J Kumar with project values
- **06_approvals.csv**: Government approvals from DMRC, MMRDA, NHSRCL, etc.

### System Data
- **09_company_info.csv**: Company profile information and statistics  
- **10_seo_settings.csv**: SEO metadata for all main pages

## Data Structure Notes

### JSON Fields
Products and Projects use JSON arrays for structured data:
- **applications**: `["Bridge Construction", "Marine Structures"]`
- **features**: `["Prevents Corrosion", "Long-lasting Protection"]`  
- **key_features**: `["350 km/h Speed", "Earthquake Resistant"]`
- **gallery_images**: `["/image1.jpg", "/image2.jpg"]`

### Boolean Fields
Use 1 for true, 0 for false:
- **is_active**: 1 (active) or 0 (inactive)
- **is_featured**: 1 (featured) or 0 (not featured)

### Image Paths
All image paths should start with `/` and reference the public directory:
- Products: `/images/products/product-name.jpg`
- Projects: `/images/projects/project-name.jpg`
- Clients: `/images/clients/client-name.png`
- Approvals: `/images/approvals/authority-name.png`

## Import Methods

### Option 1: Supabase Dashboard
1. Go to your Supabase project → Table Editor
2. Select the table to import to
3. Click "Insert" → "Import from CSV"
4. Upload the CSV file and map columns

### Option 2: Bulk Import Script
A bulk import script will be created to handle all CSVs automatically.

### Option 3: API Import
Use the admin API endpoints to programmatically import data.

## Customization

### Adding Your Data
1. Replace sample data with your actual products, projects, and clients
2. Update image paths to match your actual media files  
3. Modify categories and fields as needed
4. Ensure all referenced images exist in your media directory

### Excel Integration
For the Products Catalogue Excel file:
1. Export relevant sheets to CSV format
2. Match column headers to the CSV template format
3. Convert Excel data to match the required structure (JSON arrays, etc.)

## Validation Checklist

Before importing:
- [ ] All image files exist at specified paths
- [ ] JSON arrays are properly formatted with square brackets and quotes
- [ ] Foreign key references exist (category_id, project categories, etc.)
- [ ] Email addresses and URLs are valid
- [ ] Date formats are consistent (YYYY-MM-DD)
- [ ] Boolean values are 1 or 0
- [ ] No duplicate IDs or entries

## Image Guidelines

See `00_IMAGE_GUIDELINES.md` for detailed image specifications including:
- Recommended dimensions and ratios
- File size limits  
- Naming conventions
- Directory structure
- Quality standards

## Support

For questions about the CSV import process or data structure, refer to:
- Database schema documentation
- Supabase documentation
- Application API documentation