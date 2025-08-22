/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic production optimizations
  trailingSlash: true,
  
  // Image optimization (keep simple)
  images: {
    unoptimized: true,
  },

  // Development settings (keep simple)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
