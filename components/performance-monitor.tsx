'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export function PerformanceMonitor({ children }: PerformanceMonitorProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Only run performance monitoring in production
    if (process.env.NODE_ENV !== 'production') return;

    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          console.log(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
      }
    });

    // Track Core Web Vitals
    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    } catch (e) {
      // Fallback for browsers that don't support PerformanceObserver
      console.warn('PerformanceObserver not supported');
    }

    // Track page load time
    const startTime = performance.now();

    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      console.log(`Page ${pathname} loaded in ${loadTime.toFixed(2)}ms`);
    };

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('load', handleLoad);
    };
  }, [pathname]);

  // Resource hints and performance optimizations
  useEffect(() => {
    // Preload critical resources for next likely navigation
    const criticalRoutes = ['/products', '/projects', '/contact', '/about'];

    criticalRoutes.forEach(route => {
      if (route !== pathname) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      }
    });

    // Cleanup prefetch links when component unmounts
    return () => {
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      prefetchLinks.forEach(link => link.remove());
    };
  }, [pathname]);

  return <>{children}</>;
}