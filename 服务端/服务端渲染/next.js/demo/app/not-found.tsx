import Link from 'next/link';

/**
 * 全局 404 未找到页面
 *
 * 当路由不存在时显示此页面，
 * 是所有未匹配路由的兜底页面。
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    页面未找到
                </h1>
                <p className="text-gray-600 mb-8">
                    你要查找的页面不存在或已被移动。
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        返回首页
                    </Link>

                    <div className="pt-6 border-t">
                        <p className="text-sm text-gray-500 mb-4">
                            热门页面：
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link
                                href="/blog"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
                            >
                                博客
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
                            >
                                关于
                            </Link>
                            <Link
                                href="/blog-admin"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
                            >
                                管理后台
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
