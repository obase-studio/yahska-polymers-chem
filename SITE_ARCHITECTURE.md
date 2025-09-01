# Yahska Polymers Website - Site Architecture

## 📋 Table of Contents
1. [Overview](#overview)
2. [Site Structure](#site-structure)
3. [Frontend Pages](#frontend-pages)
4. [Admin Panel](#admin-panel)
5. [API Endpoints](#api-endpoints)
6. [Components Architecture](#components-architecture)
7. [Database Schema](#database-schema)
8. [Technology Stack](#technology-stack)
9. [Content Management](#content-management)
10. [Media Management](#media-management)

## 🏗️ Overview

Yahska Polymers website is a comprehensive chemical manufacturing company website built with Next.js 15, featuring both public-facing pages and a complete admin management system. The site supports dynamic content management, media handling, and real-time content synchronization.

## 📐 Site Structure

```
Yahska Polymers Website
├── Public Frontend (Customer-facing)
│   ├── Home Page
│   ├── About Us
│   ├── Products & Categories  
│   ├── Projects Portfolio
│   ├── Client Testimonials
│   └── Contact Us
│
├── Admin Panel (Management Interface)
│   ├── Dashboard & Analytics
│   ├── Content Management System
│   ├── Media Management
│   ├── Product Management
│   ├── Project Management
│   ├── Client Management
│   └── SEO Management
│
└── API Layer (Data & Business Logic)
    ├── Content API
    ├── Media API
    ├── Product API
    ├── Project API
    └── Admin API
```

## 🌐 Frontend Pages

### 1. Home Page (`/`)
**Purpose**: Main landing page showcasing company overview and key offerings
**Key Features**:
- Dynamic hero section with configurable background image
- Company overview with statistics
- Featured products carousel
- Product categories showcase
- Client testimonials
- Call-to-action sections

**Components Used**:
- `Navigation` - Main site navigation
- `Footer` - Site footer with contact info
- Dynamic content loading from database
- Image optimization with fallback support

### 2. About Us (`/about`)
**Purpose**: Company information and background
**Key Features**:
- Company story and history
- Key highlights and achievements
- Quality commitment
- Dynamic content management
- Real-time content synchronization

**Content Sections**:
- Company overview
- Our story
- Quality commitment
- Key highlights with icons

### 3. Products (`/products`)
**Purpose**: Product catalog and categories
**Key Features**:
- Product search and filtering
- Category-based organization
- Product detail pages
- Dynamic product listings

**Sub-pages**:
- `/products/[id]` - Individual product details

### 4. Projects (`/projects`)
**Purpose**: Portfolio of completed projects
**Key Features**:
- Project filtering by category
- Search functionality
- Featured projects highlighting
- Client information display
- Project detail pages

**Sub-pages**:
- `/projects/[id]` - Individual project details with gallery

### 5. Clients (`/clients`)
**Purpose**: Client testimonials and success stories
**Key Features**:
- Client testimonials showcase
- Success stories
- Client logos and information

### 6. Contact (`/contact`)
**Purpose**: Contact information and inquiry form
**Key Features**:
- Contact form with validation
- Business information
- Multiple office locations
- Contact details (phone, email, addresses)

## 🔧 Admin Panel

### 1. Admin Dashboard (`/admin/dashboard`)
**Purpose**: Central management hub with overview analytics
**Features**:
- Statistics overview (products, testimonials, media files)
- Quick action shortcuts
- System status information
- Recent activity tracking

### 2. Content Management (`/admin/content`)
**Purpose**: Dynamic content editing for all pages
**Features**:
- Page-by-page content editing
- Rich text editing with media picker
- Image upload and management
- Content versioning
- Real-time preview

**Supported Pages**:
- Home page sections
- About page content
- Products page content
- Projects page content
- Contact page content

### 3. Media Management (`/admin/media`)
**Purpose**: Centralized media library management
**Features**:
- File upload (local files and URLs)
- Image categorization
- Media gallery with search
- File metadata management
- Supabase Storage integration

### 4. Product Management (`/admin/products`)
**Purpose**: Product catalog management
**Features**:
- Add/edit/delete products
- Product categorization
- Image management
- SEO optimization
- Bulk operations

### 5. Client Management (`/admin/clients`)
**Purpose**: Client testimonial and information management
**Features**:
- Testimonial management
- Client information editing
- Success story management

### 6. SEO Management (`/admin/seo`)
**Purpose**: Search engine optimization settings
**Features**:
- Meta tag management
- Page-specific SEO settings
- Open Graph configuration
- Schema markup

## 🔗 API Endpoints

### Public API
```
GET /api/content?page={page}        # Get page content
GET /api/products                   # Get products list
GET /api/products/[id]             # Get product details
GET /api/projects                   # Get projects list
GET /api/projects/[id]             # Get project details
POST /api/sync/content             # Content synchronization
```

### Admin API
```
# Authentication
POST /api/admin/auth/login         # Admin login
POST /api/admin/auth/logout        # Admin logout

# Content Management
GET/POST /api/admin/content        # Content CRUD operations

# Media Management
GET/POST /api/admin/media          # Media file operations
POST /api/admin/media/upload       # File upload
GET/PUT/DELETE /api/admin/media/[id] # Media file operations

# Product Management
GET/POST /api/admin/products       # Product CRUD operations
GET/PUT/DELETE /api/admin/products/[id] # Individual product operations

# Category Management
GET/POST /api/admin/categories     # Category operations
GET/PUT/DELETE /api/admin/categories/[id] # Individual category operations

# SEO Management
GET/POST /api/admin/seo           # SEO settings management

# Utility APIs
POST /api/admin/assign-project-images # Project image assignment
GET/POST /api/admin/page-images    # Page-specific images
POST /api/admin/upload-pdf         # PDF upload handling
```

## 🧩 Components Architecture

### UI Components (`/components/ui/`)
**Purpose**: Reusable design system components
- `button.tsx` - Button variants and styles
- `card.tsx` - Card layouts
- `input.tsx` - Form inputs
- `select.tsx` - Dropdown selections
- `textarea.tsx` - Text areas
- `dialog.tsx` - Modal dialogs
- `badge.tsx` - Status badges
- `tabs.tsx` - Tabbed interfaces

### Layout Components
- `navigation.tsx` - Main site navigation
- `footer.tsx` - Site footer
- `theme-provider.tsx` - Theme management

### Admin Components (`/components/admin/`)
**Purpose**: Admin-specific functionality
- `enhanced-dashboard.tsx` - Main admin dashboard
- `content-editor-with-media.tsx` - Rich content editor
- `enhanced-media-manager.tsx` - Media management interface
- `media-picker-modal.tsx` - Media selection modal
- `product-form.tsx` - Product creation/editing
- `seo-form.tsx` - SEO settings form

### Specialized Components
- `advanced-content-operations.tsx` - Advanced CMS operations
- `enhanced-content-manager.tsx` - Content management interface
- `clients-list.tsx` - Client management
- `delete-product-button.tsx` - Product deletion with confirmation

## 🗄️ Database Schema

### Core Tables (Supabase PostgreSQL)

#### site_content
```sql
- id (uuid, primary key)
- page (varchar) - Page identifier
- section (varchar) - Section within page
- content_key (varchar) - Specific content field
- content_value (text) - Actual content
- created_at (timestamp)
- updated_at (timestamp)
```

#### media_files
```sql
- id (uuid, primary key)
- filename (varchar) - Stored filename
- original_name (varchar) - Original upload name
- file_path (varchar) - Storage path/URL
- file_size (integer) - File size in bytes
- mime_type (varchar) - File MIME type
- alt_text (varchar) - Accessibility text
- uploaded_at (timestamp)
```

#### products
```sql
- id (uuid, primary key)
- name (varchar) - Product name
- description (text) - Product description
- category_id (uuid) - Foreign key to categories
- price (decimal) - Product price
- image_url (varchar) - Product image
- is_active (boolean) - Active status
- created_at (timestamp)
- updated_at (timestamp)
```

#### projects
```sql
- id (uuid, primary key)
- name (varchar) - Project name
- description (text) - Project description
- category (varchar) - Project category
- client_name (varchar) - Client information
- location (varchar) - Project location
- completion_date (date) - Completion date
- project_value (decimal) - Project value
- key_features (jsonb) - Array of features
- challenges (text) - Project challenges
- solutions (text) - Solutions provided
- image_url (varchar) - Main project image
- gallery_images (jsonb) - Array of gallery images
- is_featured (boolean) - Featured status
- is_active (boolean) - Active status
- sort_order (integer) - Display order
```

#### testimonials
```sql
- id (uuid, primary key)
- client_name (varchar) - Client name
- client_company (varchar) - Client company
- testimonial_text (text) - Testimonial content
- rating (integer) - Rating out of 5
- is_featured (boolean) - Featured status
- created_at (timestamp)
```

## 💻 Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Shadcn/ui** - UI component library

### Backend
- **Next.js API Routes** - Server-side API
- **Supabase** - PostgreSQL database and storage
- **Supabase Storage** - File storage service

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Code repository

## 📝 Content Management

### Dynamic Content System
The website uses a flexible content management system where all text content is stored in the database and can be edited through the admin panel.

**Content Structure**:
```
Page → Section → Content Key → Content Value
```

**Example**:
```
home → hero → headline → "Leading Chemical Solutions Provider"
home → hero → description → "Two decades of excellence..."
about → company_overview → content → "Founded in 2000..."
```

### Content Synchronization
- Real-time content updates without page refresh
- Polling mechanism to check for content changes
- Automatic content refresh on detection of updates

## 📸 Media Management

### File Upload System
- **Local File Upload**: Direct file upload from user's device
- **URL Import**: Import images from external URLs
- **Supabase Storage Integration**: All files stored in Supabase Storage
- **File Type Support**: Images (JPG, PNG, GIF, WebP), PDFs, documents

### Media Organization
- Categorized storage (uploads, products, projects, etc.)
- Metadata management (filename, size, type, alt text)
- Media picker integration in content editor
- Automatic image optimization and resizing

### Image Handling
- Fallback image support for broken/missing images
- Responsive image loading
- Alt text for accessibility
- Image gallery functionality for projects

## 🔄 Data Flow

### Content Loading Flow
```
1. User visits page
2. Page component loads
3. useEffect triggers content fetch
4. API call to /api/content?page={page}
5. Database query for page content
6. Content returned and displayed
7. Real-time sync checks for updates
```

### Admin Content Management Flow
```
1. Admin logs into admin panel
2. Navigates to Content Management
3. Selects page and section to edit
4. Content editor loads with media picker
5. Admin makes changes and saves
6. API call to /api/admin/content
7. Database updated with new content
8. Frontend automatically refreshes content
```

### Media Upload Flow
```
1. User selects file or enters URL
2. File validation and processing
3. Upload to Supabase Storage
4. Database record creation in media_files
5. File URL returned for use
6. Media available in picker modal
```

## 🔐 Security Features

### Authentication
- Admin session management
- Protected admin routes
- Secure API endpoints

### Data Validation
- Input sanitization
- File type validation
- Size limits on uploads
- SQL injection prevention

### Access Control
- Admin-only access to management features
- API route protection
- Database security rules

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

### Mobile-First Approach
- All components built mobile-first
- Progressive enhancement for larger screens
- Touch-friendly interface design

## 🔍 SEO Optimization

### Technical SEO
- Server-side rendering with Next.js
- Automatic sitemap generation
- Meta tag management
- Open Graph tags
- Structured data markup

### Content SEO
- Dynamic meta descriptions
- Keyword optimization
- Image alt texts
- Internal linking structure

---

This architecture document provides a comprehensive overview of the Yahska Polymers website structure, explaining how all components work together to create a full-featured chemical manufacturing company website with robust content management capabilities.