/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Stop the dev watcher from rebuilding when Playwright (or local tooling)
  // writes debug logs / screenshots into the project root.
  webpack: (config, { dev }) => {
    if (dev) {
      const ignored = [
        '**/node_modules/**',
        '**/.next/**',
        '**/.git/**',
        '**/.playwright-mcp/**',
        '**/.serena/**',
        '**/.email-previews/**',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.log',
      ]
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig
