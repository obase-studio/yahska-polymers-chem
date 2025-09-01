# Yahska Polymers Website - Layout & Flow Diagrams

## 🎨 Layout Architecture

This document provides visual representations of the website's layout structure, user flows, and data processing patterns.

## 📱 Responsive Layout System

### Breakpoint Strategy
```
Mobile First Approach:
┌─────────────────────────────────────────────────────┐
│  📱 Mobile (< 640px)     Primary Design Target      │
│  📟 Tablet (640-1024px)  Enhanced Features         │
│  🖥️  Desktop (> 1024px)   Full Feature Set          │
└─────────────────────────────────────────────────────┘
```

### Grid System
```css
/* Tailwind CSS Grid Classes Used */
grid-cols-1           /* Mobile: Single column */
md:grid-cols-2        /* Tablet: Two columns */  
lg:grid-cols-3        /* Desktop: Three columns */
xl:grid-cols-4        /* Large: Four columns */
```

## 🏠 Homepage Layout Structure

### Desktop Layout (>1024px)
```
┌─────────────────────────────────────────────────────────────────┐
│                      🧭 Navigation Bar                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎯 Hero Section                                                │
│  ┌─────────────────────────┬─────────────────────────────────┐  │
│  │                         │                                 │  │
│  │    Headline & CTA       │       Hero Image               │  │
│  │                         │                                 │  │
│  └─────────────────────────┴─────────────────────────────────┘  │
│                                                                 │
│  📊 Statistics Bar                                              │
│  ┌──────────┬──────────┬──────────┬──────────┐                  │
│  │   Stat 1 │   Stat 2 │   Stat 3 │   Stat 4 │                  │
│  └──────────┴──────────┴──────────┴──────────┘                  │
│                                                                 │
│  🧪 Featured Products                                           │
│  ┌─────────┬─────────┬─────────┬─────────┐                      │
│  │Product 1│Product 2│Product 3│Product 4│                      │
│  └─────────┴─────────┴─────────┴─────────┘                      │
│                                                                 │
│  🏭 Product Categories                                          │
│  ┌─────────┬─────────┬─────────┬─────────┐                      │
│  │Category1│Category2│Category3│Category4│                      │
│  └─────────┴─────────┴─────────┴─────────┘                      │
│                                                                 │
│  💬 Testimonials Carousel                                       │
│  ┌─────────────────────────────────────────┐                    │
│  │  "Testimonial content..."  - Client     │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
│  📞 Call-to-Action Section                                      │
│  ┌─────────────────────────────────────────┐                    │
│  │         Contact Us Today!               │                    │
│  │    [Get Quote] [Contact]                │                    │
│  └─────────────────────────────────────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│                        🦶 Footer                                │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (<640px)
```
┌─────────────────────────┐
│    🧭 Mobile Nav        │
│  🏢 LOGO          ☰    │
├─────────────────────────┤
│                         │
│   🎯 Hero Section       │
│  ┌─────────────────────┐│
│  │     Headline        ││
│  │   Description       ││
│  │      [CTA]          ││
│  └─────────────────────┘│
│                         │
│  📊 Stats (Stacked)     │
│  ┌─────────────────────┐│
│  │      Stat 1         ││
│  ├─────────────────────┤│
│  │      Stat 2         ││
│  ├─────────────────────┤│
│  │      Stat 3         ││
│  └─────────────────────┘│
│                         │
│  🧪 Products (Single)   │
│  ┌─────────────────────┐│
│  │     Product 1       ││
│  ├─────────────────────┤│
│  │     Product 2       ││
│  └─────────────────────┘│
│                         │
│  💬 Testimonials        │
│  ┌─────────────────────┐│
│  │   Testimonial 1     ││
│  └─────────────────────┘│
│                         │
├─────────────────────────┤
│      🦶 Footer          │
└─────────────────────────┘
```

## 🔄 User Journey Flows

### Visitor Conversion Flow
```
Entry Point
    ↓
┌─────────────────┐
│   Home Page     │ ←─ Landing from search/ads
└─────────────────┘
    ↓
┌─────────────────┐
│ Browse Content  │ ← About Us / Products / Projects
└─────────────────┘
    ↓
┌─────────────────┐
│ Build Interest  │ ← View testimonials / case studies
└─────────────────┘
    ↓
┌─────────────────┐
│ Contact Action  │ ← Fill form / Call / Email
└─────────────────┘
    ↓
┌─────────────────┐
│  Conversion     │ ← Lead generated
└─────────────────┘
```

### Product Discovery Flow
```
Products Page Entry
    ↓
┌─────────────────┐
│ Category Filter │ ← Select industry/application
└─────────────────┘
    ↓
┌─────────────────┐
│ Product Search  │ ← Search by name/description
└─────────────────┘
    ↓
┌─────────────────┐
│ Product Results │ ← Filtered product grid
└─────────────────┘
    ↓
┌─────────────────┐
│ Product Detail  │ ← Individual product page
└─────────────────┘
    ↓
┌─────────────────┐
│ Inquiry Action  │ ← Contact for pricing/info
└─────────────────┘
```

### Project Portfolio Flow
```
Projects Page Entry
    ↓
┌─────────────────┐
│ Project Gallery │ ← Browse all projects
└─────────────────┘
    ↓
┌─────────────────┐
│ Filter by Type  │ ← Rail/Road/Building/Factory
└─────────────────┘
    ↓
┌─────────────────┐
│ Project Details │ ← Specific project page
└─────────────────┘
    ↓
┌─────────────────┐
│ Case Study      │ ← Challenges & solutions
└─────────────────┘
    ↓
┌─────────────────┐
│ Contact for     │ ← Similar project inquiry
│ Similar Project │
└─────────────────┘
```

## 🔧 Admin Panel Layout

### Admin Dashboard Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                    🔧 Admin Header                              │
│  Admin Panel | Dashboard                      [Logout] [View]   │
├───────────────────┬─────────────────────────────────────────────┤
│                   │                                             │
│  📋 Sidebar Nav   │           📊 Main Dashboard                 │
│                   │                                             │
│  • Dashboard      │  ┌─────────────────────────────────────┐    │
│  • Content        │  │         Quick Stats                 │    │
│  • Media          │  │  Products │ Clients │ Media │ SEO   │    │
│  • Products       │  │    52     │   18    │  127  │  5    │    │
│  • Projects       │  └─────────────────────────────────────┘    │
│  • Clients        │                                             │
│  • Categories     │  ┌─────────────────────────────────────┐    │
│  • SEO            │  │          Quick Actions              │    │
│                   │  │  [Add Product] [Edit Content]      │    │
│                   │  │  [Upload Media] [SEO Settings]     │    │
│                   │  └─────────────────────────────────────┘    │
│                   │                                             │
│                   │  ┌─────────────────────────────────────┐    │
│                   │  │         Recent Activity             │    │
│                   │  │  • New product added 2h ago        │    │
│                   │  │  • Content updated 4h ago          │    │
│                   │  │  • Media uploaded 1d ago           │    │
│                   │  └─────────────────────────────────────┘    │
│                   │                                             │
└───────────────────┴─────────────────────────────────────────────┘
```

### Content Management Interface
```
┌─────────────────────────────────────────────────────────────────┐
│                   📝 Content Management                         │
├─────────────────────────────────────────────────────────────────┤
│  Page: [Home ▼]    Section: [Hero Section ▼]                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┬─────────────────────────────────┐  │
│  │                         │                                 │  │
│  │    📝 Content Editor    │      📸 Media Picker           │  │
│  │                         │                                 │  │
│  │  Headline:              │  ┌─────────────────────────────┐ │  │
│  │  [Text Input Field]     │  │     Media Gallery           │ │  │
│  │                         │  │  ┌─────┬─────┬─────┬─────┐ │ │  │
│  │  Description:           │  │  │ Img │ Img │ Img │ Img │ │ │  │
│  │  [Textarea Field]       │  │  └─────┴─────┴─────┴─────┘ │ │  │
│  │                         │  │                             │ │  │
│  │  Background Image:      │  │  [Upload New] [URL Import]  │ │  │
│  │  [Current: hero.jpg]    │  └─────────────────────────────┘ │  │
│  │  [Select Image]         │                                 │  │
│  │                         │                                 │  │
│  │  [💾 Save] [👁️ Preview]  │      [Select] [Cancel]          │  │
│  │                         │                                 │  │
│  └─────────────────────────┴─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Architecture

### Content Management Data Flow
```
Admin Editor
     ↓
Form Submission
     ↓
POST /api/admin/content
     ↓
Database Update (Supabase)
     ↓
Real-time Sync Check
     ↓
Frontend Refresh
     ↓
Updated Content Display
```

### Media Upload Data Flow
```
File Selection
     ↓
Client-side Validation
     ↓
FormData Creation
     ↓
POST /api/admin/media/upload
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

### Page Load Data Flow
```
Page Request
     ↓
Server-side Rendering
     ↓
Database Query (Content)
     ↓
HTML Generation
     ↓
Client Hydration
     ↓
Real-time Sync Setup
     ↓
Dynamic Content Updates
```

## 🔄 Real-time Content Sync Flow

### Sync Architecture
```
Content Update
     ↓
Database Timestamp Update
     ↓
Client Polling (2s interval)
     ↓
GET /api/sync/content
     ↓
Timestamp Comparison
     ↓
Content Refresh (if newer)
     ↓
DOM Update
     ↓
User Sees Updated Content
```

### Sync Implementation
```typescript
useEffect(() => {
  const checkForUpdates = async () => {
    const response = await fetch('/api/sync/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'about' }),
      cache: 'no-store'
    });
    
    const result = await response.json();
    
    if (result.success && result.lastUpdated > lastKnownTimestamp) {
      // Content changed - refresh it
      fetchContent();
      setLastKnownTimestamp(result.lastUpdated);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

  const interval = setInterval(checkForUpdates, 2000);
  return () => clearInterval(interval);
}, [lastKnownTimestamp]);
```

## 🎨 Component Layout Patterns

### Card-based Layout Pattern
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {item.content}
      </CardContent>
    </Card>
  ))}
</div>
```

### Hero Section Pattern
```jsx
<section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="text-content">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          {headline}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {description}
        </p>
        <div className="flex gap-4">
          <Button size="lg">Primary CTA</Button>
          <Button variant="outline" size="lg">Secondary CTA</Button>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Hero" className="rounded-lg shadow-lg" />
      </div>
    </div>
  </div>
</section>
```

### Navigation Pattern
```jsx
<nav className="sticky top-0 z-50 bg-background/95 backdrop-blur">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <Logo />
      <DesktopMenu className="hidden md:flex" />
      <MobileMenuButton className="md:hidden" />
    </div>
  </div>
</nav>
```

## 📱 Mobile-First Responsive Patterns

### Container Sizes
```css
/* Mobile First Containers */
.container {
  max-width: 100%;           /* Mobile: Full width */
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;        /* Tablet: Fixed width */
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;       /* Desktop: Larger width */
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;       /* Large: Maximum width */
  }
}
```

### Typography Scale
```css
/* Responsive Typography */
.heading-primary {
  font-size: 2rem;          /* Mobile: 32px */
}

@media (min-width: 768px) {
  .heading-primary {
    font-size: 2.5rem;      /* Tablet: 40px */
  }
}

@media (min-width: 1024px) {
  .heading-primary {
    font-size: 3rem;        /* Desktop: 48px */
  }
}
```

This layout and flow documentation provides a comprehensive understanding of how the visual elements, user interactions, and data processing work together to create the complete Yahska Polymers website experience.