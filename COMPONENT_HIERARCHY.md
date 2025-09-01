# Yahska Polymers Website - Component Hierarchy & Relationships

## 🏗️ Component Architecture Overview

This document outlines the hierarchical structure of React components, their relationships, and how they work together to create the complete website experience.

## 📊 Component Tree Structure

### 🌐 Root Application Structure
```
app/
├── layout.tsx (Root Layout)
│   ├── ThemeProvider
│   ├── Metadata Configuration
│   └── Global Styles
│
└── Pages (App Router Structure)
    ├── page.tsx (Home)
    ├── about/page.tsx
    ├── products/page.tsx
    ├── projects/page.tsx  
    ├── clients/page.tsx
    ├── contact/page.tsx
    └── admin/ (Admin Routes)
```

### 🧩 Component Hierarchy by Category

## 1️⃣ Layout Components

### Navigation Component (`/components/navigation.tsx`)
```tsx
Navigation
├── Logo/Brand
├── Desktop Menu
│   ├── Home Link
│   ├── About Link  
│   ├── Products Dropdown
│   ├── Projects Link
│   ├── Clients Link
│   └── Contact Link
├── Mobile Menu (Hamburger)
│   └── Collapsible Menu Items
└── CTA Buttons
```

**Relationships:**
- Used by: All public pages
- Imports: UI components (Button, Sheet, etc.)
- State: Mobile menu open/closed, active navigation item

### Footer Component (`/components/footer.tsx`)
```tsx
Footer
├── Company Information Section
│   ├── Company Description
│   ├── Contact Details
│   └── Social Links
├── Quick Links Section
│   ├── Navigation Links
│   ├── Important Pages
│   └── Legal Links  
├── Contact Information Section
│   ├── Address Details
│   ├── Phone Numbers
│   └── Email Addresses
└── Copyright Section
```

**Relationships:**
- Used by: All public pages
- Imports: UI components (Separator), Icons
- Dependencies: Contact information data

## 2️⃣ Page Components

### Home Page (`/app/page.tsx`)
```tsx
HomePage
├── Navigation (imported)
├── Hero Section
│   ├── Dynamic Background Image
│   ├── Headline (from database)
│   ├── Description (from database)  
│   └── CTA Buttons
├── Company Overview Section
│   ├── Statistics Cards
│   ├── Company Description
│   └── Feature Highlights
├── Featured Products Section
│   ├── Product Cards
│   ├── Category Links
│   └── View All Button
├── Product Categories Section
│   ├── Category Grid
│   ├── Category Images
│   └── Category Descriptions
├── Testimonials Section
│   ├── Client Testimonials
│   ├── Testimonial Cards
│   └── Client Information
├── Call-to-Action Section
│   ├── Contact Buttons
│   └── Quick Contact Info
└── Footer (imported)
```

**Key Features:**
- Dynamic content loading from database
- Image fallback handling
- Real-time content synchronization
- Responsive grid layouts

### About Page (`/app/about/page.tsx`)
```tsx
AboutPage
├── Navigation
├── Hero Section
│   ├── Page Title
│   └── Introduction Text
├── Company Story Section
│   ├── Dynamic Content Rendering
│   ├── Formatted Text Blocks
│   ├── Bullet Points
│   └── Company Image
├── Key Highlights Section
│   ├── Achievement Cards
│   │   ├── ISO Certified
│   │   ├── Modern Facilities
│   │   ├── Expert Team
│   │   └── Customer Focus
│   └── Feature Icons
├── Quality Commitment Section (Conditional)
│   ├── Quality Content
│   ├── Formatted Lists
│   └── Commitment Cards
├── CTA Section
│   ├── Partnership Message
│   └── Action Buttons
├── Live Sync Indicator
└── Footer
```

**Special Features:**
- Content formatting engine for different text types
- Real-time content polling and updates
- Conditional rendering based on content availability
- Debug information display for content loading

### Products Page (`/app/products/page.tsx`)
```tsx
ProductsPage
├── Navigation
├── Hero Section
├── Search & Filter Section
│   ├── Search Input
│   ├── Category Dropdown
│   └── Filter Controls
├── Products Grid
│   ├── Product Cards
│   │   ├── Product Image
│   │   ├── Product Name
│   │   ├── Product Description
│   │   ├── Category Badge
│   │   ├── Price Information
│   │   └── View Details Button
│   └── Loading States
├── Pagination (if implemented)
└── Footer
```

### Projects Page (`/app/projects/page.tsx`)
```tsx
ProjectsPage
├── Navigation
├── Hero Section
├── Search & Filter Section
│   ├── Search Input
│   ├── Category Select
│   └── Filter Results
├── Project Gallery
│   ├── Project Cards
│   │   ├── Project Image
│   │   ├── Category Badge
│   │   ├── Featured Badge (conditional)
│   │   ├── Project Details
│   │   │   ├── Client Information
│   │   │   ├── Location
│   │   │   └── Completion Date
│   │   ├── Key Features Tags
│   │   └── View Details Link
│   └── Loading States
├── Client Section
│   ├── Unique Client Names
│   └── Client Cards
└── Footer
```

### Project Detail Page (`/app/projects/[id]/page.tsx`)
```tsx
ProjectDetailPage
├── Navigation
├── Project Hero Section
│   ├── Project Image
│   ├── Project Title
│   ├── Category Badge
│   └── Client Information
├── Project Overview
│   ├── Description
│   ├── Key Details Grid
│   │   ├── Client Name
│   │   ├── Location
│   │   ├── Completion Date
│   │   ├── Project Value (if available)
│   │   └── Category
│   └── Back Button
├── Key Features Section
│   └── Feature Tags
├── Challenges & Solutions Section
│   ├── Challenges Description
│   └── Solutions Description
├── Project Gallery (if available)
│   └── Image Gallery
├── Related Projects (if implemented)
└── Footer
```

## 3️⃣ Admin Panel Components

### Admin Dashboard (`/app/admin/dashboard/page.tsx`)
```tsx
AdminDashboard
├── SimpleDashboard Component
│   ├── Header Section
│   │   ├── Welcome Message
│   │   ├── Current Date/Time
│   │   └── Quick Actions
│   ├── Statistics Grid
│   │   ├── Products Count Card
│   │   ├── Testimonials Count Card
│   │   ├── Media Files Count Card
│   │   └── Content Pages Card
│   ├── Quick Actions Section
│   │   ├── Content Management Links
│   │   ├── Media Management Links
│   │   ├── Product Management Links
│   │   └── SEO Management Links
│   └── Recent Activity Section
│       ├── Recent Products List
│       ├── System Status
│       └── Admin Information
└── Navigation Sidebar
```

### Enhanced Media Manager (`/components/admin/enhanced-media-manager.tsx`)
```tsx
EnhancedMediaManager
├── Header Section
│   ├── Title & Description
│   ├── Upload Statistics
│   └── Search Controls
├── Upload Interface
│   ├── File Upload Area
│   │   ├── Drag & Drop Zone  
│   │   ├── File Selection Button
│   │   └── Upload Progress
│   ├── URL Import Section
│   │   ├── URL Input Field
│   │   ├── Import Button
│   │   └── Import Status
│   └── Category Selection
├── Media Gallery
│   ├── Search & Filter Bar
│   ├── Category Filter
│   ├── Media Grid
│   │   ├── Image Thumbnails
│   │   ├── File Information
│   │   │   ├── Filename
│   │   │   ├── File Size
│   │   │   ├── Upload Date
│   │   │   └── MIME Type
│   │   ├── Action Buttons
│   │   │   ├── View/Edit
│   │   │   ├── Copy URL
│   │   │   └── Delete
│   │   └── Selection Checkboxes
│   └── Bulk Actions
├── Loading States
├── Error Handling
└── Success Notifications
```

### Content Editor with Media (`/components/admin/content-editor-with-media.tsx`)
```tsx
ContentEditorWithMedia
├── Editor Header
│   ├── Section Title
│   └── Field Labels
├── Field Editors
│   ├── Text Input Fields
│   ├── Textarea Fields  
│   ├── Image Selection Fields
│   │   ├── Current Image Display
│   │   ├── Media Picker Button
│   │   └── Remove Image Option
│   └── Rich Text Editor (if applicable)
├── Media Picker Integration
│   ├── MediaPickerModal
│   ├── Image Selection Grid
│   └── URL Input Option
├── Preview Section (optional)
├── Save Controls
│   ├── Save Button
│   ├── Reset Button
│   └── Save Status
└── Error Handling
```

### Media Picker Modal (`/components/admin/media-picker-modal.tsx`)
```tsx
MediaPickerModal
├── Modal Header
│   ├── Title
│   └── Close Button
├── Upload Options
│   ├── File Upload Tab
│   │   ├── File Selection
│   │   ├── Upload Progress
│   │   └── Upload Button
│   ├── URL Import Tab
│   │   ├── URL Input
│   │   ├── Preview
│   │   └── Import Button
│   └── Category Selection
├── Media Gallery
│   ├── Search Function
│   ├── Category Filter
│   ├── Media Grid
│   │   ├── Image Thumbnails
│   │   ├── Selection Radio Buttons
│   │   └── Image Information
│   └── Pagination
├── Selected Image Preview
├── Modal Actions
│   ├── Select Button
│   ├── Cancel Button
│   └── Upload New Button
└── Loading & Error States
```

## 4️⃣ UI Component Library

### Base UI Components (`/components/ui/`)
```tsx
UI Components Hierarchy:
├── button.tsx
│   ├── Primary Button
│   ├── Secondary Button
│   ├── Outline Button
│   ├── Ghost Button
│   └── Destructive Button
├── card.tsx
│   ├── Card Container
│   ├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   ├── CardContent
│   └── CardFooter
├── input.tsx
│   ├── Text Input
│   ├── Email Input
│   ├── Password Input
│   └── Search Input
├── select.tsx
│   ├── Select Trigger
│   ├── Select Content
│   ├── Select Item
│   └── Select Value Display
├── dialog.tsx
│   ├── Dialog Root
│   ├── Dialog Trigger
│   ├── Dialog Content
│   ├── Dialog Header
│   ├── Dialog Title
│   ├── Dialog Description
│   └── Dialog Footer
├── tabs.tsx
│   ├── Tabs Root
│   ├── TabsList
│   ├── TabsTrigger
│   └── TabsContent
└── [Additional UI Components...]
```

## 5️⃣ Component Relationships & Data Flow

### Data Flow Architecture
```
Database (Supabase)
        ↓
API Routes (/api/*)
        ↓
Page Components
        ↓
Child Components
        ↓
UI Components
```

### State Management Flow
```
Server State (Database)
        ↓
API Endpoints
        ↓
React useState/useEffect
        ↓
Component Props
        ↓
Child Component State
```

### Content Management Flow
```
Admin Content Editor
        ↓
API Call (/api/admin/content)
        ↓
Database Update
        ↓
Real-time Sync Check
        ↓
Frontend Content Refresh
        ↓
Updated Display
```

### Media Management Flow  
```
File Upload Interface
        ↓
File Processing
        ↓
Supabase Storage Upload
        ↓
Database Record Creation
        ↓
Media Library Update
        ↓
Media Picker Integration
```

## 6️⃣ Component Communication Patterns

### Parent-Child Communication
```tsx
// Parent passes data down to child
<ProductCard 
  product={productData}
  onSelect={handleProductSelect}
  isSelected={selectedId === product.id}
/>

// Child communicates back via callbacks  
const ProductCard = ({ product, onSelect, isSelected }) => {
  return (
    <Card onClick={() => onSelect(product.id)}>
      {/* Card content */}
    </Card>
  );
};
```

### State Lifting Pattern
```tsx
// Parent manages shared state
const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <>
      <SearchFilter 
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchTerm}
      />
      <ProductGrid 
        category={selectedCategory}
        searchTerm={searchTerm}
      />
    </>
  );
};
```

### Context Pattern (Theme Provider)
```tsx
// Theme context provides global theming
<ThemeProvider>
  <App />
</ThemeProvider>

// Components consume theme context
const Button = () => {
  const { theme } = useTheme();
  return <button className={theme.buttonClasses} />;
};
```

## 7️⃣ Component Lifecycle & Effects

### Data Fetching Pattern
```tsx
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };
};
```

### Real-time Sync Pattern (About Page)
```tsx
const AboutPage = () => {
  const [lastKnownTimestamp, setLastKnownTimestamp] = useState(0);
  
  useEffect(() => {
    const checkForUpdates = async () => {
      // Poll for content changes
      const response = await fetch('/api/sync/content');
      const result = await response.json();
      
      if (result.lastUpdated > lastKnownTimestamp) {
        // Refresh content
        fetchContent();
        setLastKnownTimestamp(result.lastUpdated);
      }
    };
    
    const interval = setInterval(checkForUpdates, 2000);
    return () => clearInterval(interval);
  }, [lastKnownTimestamp]);
};
```

## 8️⃣ Error Handling & Loading States

### Error Boundary Pattern
```tsx
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return fallback || <div>Something went wrong!</div>;
  }
  
  return children;
};
```

### Loading State Management
```tsx
const ComponentWithLoading = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;
  
  return <DataDisplay data={data} />;
};
```

## 9️⃣ Responsive Component Patterns

### Responsive Layout Components
```tsx
const ResponsiveGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

const ResponsiveNavigation = () => (
  <>
    {/* Desktop Navigation */}
    <nav className="hidden md:flex">
      <DesktopMenu />
    </nav>
    
    {/* Mobile Navigation */}
    <nav className="md:hidden">
      <MobileMenu />
    </nav>
  </>
);
```

This component hierarchy documentation provides a comprehensive understanding of how all the pieces fit together to create the complete Yahska Polymers website experience, from individual UI components to complex page layouts and admin interfaces.