import { ReactNode } from 'react';

interface ParallelRoutesLayoutProps {
    children: ReactNode;
    analytics: ReactNode;
    dashboard: ReactNode;
}

/**
 * Parallel Routes 布局
 *
 * Parallel Routes 允许你在同一个布局中同时渲染多个页面。
 * 适用场景：
 * - 包含多个独立区块的仪表盘布局
 * - 基于用户角色的条件布局
 * - 同时加载多个相互独立的内容区块
 */
export default function ParallelRoutesLayout({
    children,
    analytics,
    dashboard,
}: ParallelRoutesLayoutProps) {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    Parallel Routes 演示
                </h1>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>第 6 天：Parallel Routes</strong>
                        <br />
                        本布局通过{' '}
                        <code className="bg-gray-100 px-1 rounded">
                            @folder
                        </code>{' '}
                        语法演示 Parallel Routes。
                        多个路由片段会在同一个布局中同时渲染。
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">
                        @analytics 插槽
                    </h2>
                    {analytics}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                        @dashboard 插槽
                    </h2>
                    {dashboard}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    主内容（children）
                </h2>
                {children}
            </div>
        </div>
    );
}
