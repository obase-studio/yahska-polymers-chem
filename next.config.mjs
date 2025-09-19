/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization (keep simple)
  images: {
    unoptimized: true,
    domains: ['jlbwwbnatmmkcizqprdx.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jlbwwbnatmmkcizqprdx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Development settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
