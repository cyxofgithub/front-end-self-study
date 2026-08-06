import Link from 'next/link';

// 首页 - 默认为 Server Component
export default function Home() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    欢迎来到 Next.js 演示项目
                </h1>
                <p className="text-xl text-gray-600">
                    Next.js 完整学习路线：第 1-7 天
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-blue-600">
                        第 1 天：项目搭建
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        学习如何初始化 Next.js 项目，理解{' '}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                            layout.tsx
                        </code>{' '}
                        和{' '}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                            page.tsx
                        </code>
                        等核心文件，并搭建 App Router。
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-green-600">
                        第 2 天：路由系统
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        探索基于文件的路由、动态路由、导航组件，以及
                        loading 和 error boundary 等路由状态。
                    </p>
                    <Link
                        href="/about"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        → 关于页面
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-purple-600">
                        第 3 天：渲染模式
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        理解 Server Components 与 Client Components，并实现
                        SSR、SSG、ISR、CSR 四种渲染模式。
                    </p>
                    <div className="space-y-1 text-sm">
                        <Link
                            href="/blog"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → 博客列表（SSG）
                        </Link>
                        <Link
                            href="/isr-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → ISR 演示
                        </Link>
                        <Link
                            href="/fetch-cache-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → Fetch 缓存对比
                        </Link>
                        <Link
                            href="/csr-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → CSR 演示
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-orange-600">
                        第 4 天：服务端能力
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        学习 Server Actions、API Routes 和 Middleware，用于处理
                        服务端逻辑和身份认证。
                    </p>
                    <div className="space-y-1 text-sm">
                        <Link
                            href="/blog-admin"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → 博客管理（Server Actions）
                        </Link>
                        <Link
                            href="/api-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → API 演示
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-pink-600">
                        第 5 天：性能优化
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        通过图片优化、字体优化、metadata 和代码分割来优化你的应用。
                    </p>
                    <div className="space-y-1 text-sm">
                        <Link
                            href="/image-optimization-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → 图片优化
                        </Link>
                        <Link
                            href="/code-splitting-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → 代码分割
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-indigo-600">
                        第 6 天：进阶特性
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        掌握进阶特性：并行路由、拦截路由、缓存重验证和错误处理。
                    </p>
                    <div className="space-y-1 text-sm">
                        <Link
                            href="/parallel-routes-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → 并行路由
                        </Link>
                        <Link
                            href="/cache-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → 缓存重验证
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    🎉 完整学习路线
                </h2>
                <p className="text-gray-700 mb-4">
                    本演示项目覆盖了 Next.js 学习路线的全部 7 天内容：
                </p>
                <div className="grid md:grid-cols-7 gap-2 text-sm">
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-blue-600">第 1 天</div>
                        <div className="text-xs text-gray-600">项目搭建</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-green-600">
                            第 2 天
                        </div>
                        <div className="text-xs text-gray-600">路由</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-purple-600">
                            第 3 天
                        </div>
                        <div className="text-xs text-gray-600">渲染</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-orange-600">
                            第 4 天
                        </div>
                        <div className="text-xs text-gray-600">服务端</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-pink-600">第 5 天</div>
                        <div className="text-xs text-gray-600">性能</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-indigo-600">
                            第 6 天
                        </div>
                        <div className="text-xs text-gray-600">进阶</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-teal-600">第 7 天</div>
                        <div className="text-xs text-gray-600">部署</div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                    <strong>提示：</strong>这是一个 Server Component。它在服务端运行，
                    渲染完成后才发送给客户端，从而提升性能和 SEO。
                </p>
            </div>
        </div>
    );
}
