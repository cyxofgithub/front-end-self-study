import type { Metadata } from 'next';

// 基础路由示例：/about
// 这是一个 Server Component（App Router 中的默认形式）
export const metadata: Metadata = {
    title: '关于 - Next.js 演示项目',
    description:
        '了解这个覆盖第 1-7 天概念的 Next.js 演示项目',
};

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                关于本演示项目
            </h1>

            <div className="prose prose-lg">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                        这个项目是什么？
                    </h2>
                    <p className="text-gray-700 mb-4">
                        这是一个内容全面的 Next.js 演示项目，旨在帮助你掌握
                        Next.js 学习路线中第 1-3 天的基础知识。
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-green-600">
                        第 1 天：项目搭建
                    </h2>
                    <p className="text-gray-700 mb-4">
                        学习如何使用 TypeScript 和 App Router 初始化一个
                        Next.js 项目。理解核心文件结构，包括：
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                app/layout.tsx
                            </code>{' '}
                            - 根布局组件
                        </li>
                        <li>
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                app/page.tsx
                            </code>{' '}
                            - 首页组件
                        </li>
                        <li>基于文件的路由系统</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                        第 2 天：路由系统
                    </h2>
                    <p className="text-gray-700 mb-4">
                        探索 Next.js 的路由能力，包括：
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>基础路由（如本 /about 页面）</li>
                        <li>动态路由（/blog/[id]）</li>
                        <li>
                            导航组件（Link、useRouter、usePathname）
                        </li>
                        <li>路由状态（loading.tsx、error.tsx）</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                        第 3 天：渲染模式
                    </h2>
                    <p className="text-gray-700 mb-4">
                        理解不同的渲染策略：
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>
                            <strong>SSR</strong> - 服务端渲染（博客详情页）
                        </li>
                        <li>
                            <strong>SSG</strong> - 静态站点生成（博客列表页）
                        </li>
                        <li>
                            <strong>ISR</strong> - 增量静态再生成（isr-demo
                            页面）
                        </li>
                        <li>
                            <strong>CSR</strong> - 客户端渲染（csr-demo 页面）
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
