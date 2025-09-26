'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    <span className="ml-2 text-muted-foreground">Loading...</span>
  </div>
);

// Admin Components - Lazy loaded
export const DynamicSimpleDashboard = dynamic(
  () => import('@/components/admin/simple-dashboard').then(mod => ({ default: mod.SimpleDashboard })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicContentEditor = dynamic(
  () => import('@/components/admin/content-editor-with-media').then(mod => ({ default: mod.ContentEditorWithMedia })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicMediaManager = dynamic(
  () => import('@/components/admin/enhanced-media-manager').then(mod => ({ default: mod.EnhancedMediaManager })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicProductForm = dynamic(
  () => import('@/components/admin/product-form').then(mod => ({ default: mod.ProductForm })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicProjectForm = dynamic(
  () => import('@/components/admin/simplified-project-form').then(mod => ({ default: mod.SimplifiedProjectForm })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Chart Components - Heavy dependencies
// Note: Import individual chart components as needed from recharts directly

// TinyMCE Editor - Very heavy component
export const DynamicTinyMCE = dynamic(
  () => import('@tinymce/tinymce-react').then(mod => ({ default: mod.Editor })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading Rich Text Editor...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);