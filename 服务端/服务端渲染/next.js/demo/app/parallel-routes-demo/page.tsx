import Link from 'next/link';

/**
 * Parallel Routes 演示页面
 *
 * 本页面与 layout.tsx 配合，演示 Parallel Routes。
 * @analytics 和 @dashboard 插槽会被同时渲染。
 */
export const metadata = {
    title: 'Parallel Routes 演示 - Next.js 第 6 天',
    description: '学习 Next.js App Router 中的 Parallel Routes',
};

export default function ParallelRoutesDemoPage() {
    return (
        <div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                <h2 className="font-semibold text-blue-800 mb-2">
                    Parallel Routes 的工作原理：
                </h2>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>
                        使用{' '}
                        <code className="bg-blue-100 px-1 rounded">
                            @folder
                        </code>{' '}
                        语法定义插槽
                    </li>
                    <li>
                        每个插槽会作为 prop 传递给布局组件
                    </li>
                    <li>插槽可以拥有自己的 loading 和 error 状态</li>
                    <li>
                        适用于条件布局和相互独立的内容区块
                    </li>
                </ul>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">适用场景：</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                        <li>包含多个独立区块的仪表盘</li>
                        <li>基于登录状态的条件布局</li>
                        <li>
                            为不同用户角色加载不同内容
                        </li>
                        <li>每个区块拥有独立的错误边界</li>
                    </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded">
                    <h3 className="font-semibold mb-2">文件结构：</h3>
                    <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
                        <code>{`parallel-routes-demo/
├── layout.tsx          # 以 props 形式接收 @analytics 和 @dashboard
├── page.tsx           # 主页面内容
├── @analytics/
│   └── page.tsx       # analytics 插槽内容
└── @dashboard/
    └── page.tsx       # dashboard 插槽内容`}</code>
                    </pre>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    ← 返回首页
                </Link>
            </div>
        </div>
    );
}
