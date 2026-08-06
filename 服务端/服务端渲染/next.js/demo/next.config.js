/** @type {import('next').NextConfig} */
const nextConfig = {
    // React 严格模式，提供更好的开发体验
    reactStrictMode: true,

    // 图片优化配置
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
        ],
        // 优化图片以获得更好的性能
        formats: ['image/avif', 'image/webp'],
        // 用于响应式图片的设备尺寸
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        // 不同断点下的图片尺寸
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // 压缩输出以获得更好的性能
    compress: true,

    // 启用 SWC 压缩（比 Terser 更快）
    swcMinify: true,

    // 生产环境的 source maps（生产环境中出于安全考虑禁用）
    productionBrowserSourceMaps: false,

    // 优化字体
    optimizeFonts: true,

    // 实验性特性（按需启用）
    experimental: {
        // 如有需要，启用 server components 的外部包
        // serverComponentsExternalPackages: [],
    },

    // 用于安全和性能的响应头
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
