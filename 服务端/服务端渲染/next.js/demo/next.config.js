/** @type {import('next').NextConfig} */
const nextConfig = {
    // React strict mode for better development experience
    reactStrictMode: true,

    // Image optimization configuration
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
        ],
        // Optimize images for better performance
        formats: ['image/avif', 'image/webp'],
        // Device sizes for responsive images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        // Image sizes for different breakpoints
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Compress output for better performance
    compress: true,

    // Enable SWC minification (faster than Terser)
    swcMinify: true,

    // Production source maps (disable in production for security)
    productionBrowserSourceMaps: false,

    // Optimize fonts
    optimizeFonts: true,

    // Experimental features (if needed)
    experimental: {
        // Enable server components external packages if needed
        // serverComponentsExternalPackages: [],
    },

    // Headers for security and performance
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
