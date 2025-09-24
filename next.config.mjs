/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Disable caching for dynamic content
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },

  // Image optimization
  images: {
    unoptimized: false, // Enable optimization for better performance
    domains: ['jlbwwbnatmmkcizqprdx.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jlbwwbnatmmkcizqprdx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 0, // Disable image caching for immediate updates
  },

  // Development settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // Disable static generation for dynamic content
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
