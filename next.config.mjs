/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization (keep simple)
  images: {
    unoptimized: true,
  },

  // Development settings
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
