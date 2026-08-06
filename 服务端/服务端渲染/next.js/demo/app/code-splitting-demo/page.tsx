'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

/**
 * 代码分割（Code Splitting）演示页面
 * 演示 Next.js 中的 dynamic import 和代码分割
 */

// dynamic import 且禁用 SSR - 组件只在客户端加载
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
    ssr: false,
    loading: () => (
        <div className="text-center py-8">正在加载重组件...</div>
    ),
});

// 带自定义加载组件的 dynamic import
const ChartComponent = dynamic(() => import('./ChartComponent'), {
    loading: () => (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded">
            <div className="text-gray-600">正在加载图表...</div>
        </div>
    ),
});

// 仅在需要时才加载的 dynamic import
const ModalComponent = dynamic(() => import('./ModalComponent'), {
    ssr: false,
});

export default function CodeSplittingDemoPage() {
    const [showHeavy, setShowHeavy] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                代码分割演示
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Next.js 会自动分割你的代码，但你也可以使用 dynamic
                import 按需加载组件，从而减小初始包体积。
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
                <h2 className="font-semibold text-blue-800 mb-2">
                    代码分割的好处：
                </h2>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                    <li>
                        <strong>更小的初始包</strong> - 初始只加载必需的代码
                    </li>
                    <li>
                        <strong>更快的页面加载</strong> - 缩短可交互时间（TTI）
                    </li>
                    <li>
                        <strong>更好的性能</strong> - 重组件仅在需要时才加载
                    </li>
                    <li>
                        <strong>更好的用户体验</strong> - 组件加载时显示加载状态
                    </li>
                </ul>
            </div>

            <div className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        1. 条件加载（禁用 SSR）
                    </h2>
                    <p className="text-gray-600 mb-4">
                        该组件只在你点击按钮时才加载。它被排除在 SSR
                        之外，以减小服务端包体积。
                    </p>
                    <button
                        onClick={() => setShowHeavy(!showHeavy)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
                    >
                        {showHeavy ? '隐藏' : '加载'}重组件
                    </button>
                    {showHeavy && <HeavyComponent />}
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm mt-4">
                        <code>{`const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { ssr: false }
);`}</code>
                    </pre>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        2. 自定义加载状态
                    </h2>
                    <p className="text-gray-600 mb-4">
                        在实际组件加载期间显示自定义的加载组件。
                    </p>
                    <button
                        onClick={() => setShowChart(!showChart)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
                    >
                        {showChart ? '隐藏' : '加载'}图表组件
                    </button>
                    {showChart && <ChartComponent />}
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm mt-4">
                        <code>{`const ChartComponent = dynamic(
  () => import('./ChartComponent'),
  {
    loading: () => <div>正在加载图表...</div>
  }
);`}</code>
                    </pre>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        3. 模态框组件（仅客户端）
                    </h2>
                    <p className="text-gray-600 mb-4">
                        模态框组件通常不需要 SSR，只在客户端加载它们即可。
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mb-4"
                    >
                        打开模态框
                    </button>
                    {showModal && (
                        <ModalComponent onClose={() => setShowModal(false)} />
                    )}
                </section>

                <section className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        如何查看代码分割效果
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>打开 DevTools → Network 标签 → 按 "JS" 过滤</li>
                        <li>
                            刷新页面 - 观察初始包的大小
                        </li>
                        <li>
                            点击按钮加载组件 - 观察新的 chunk 被加载
                        </li>
                        <li>查看 "Coverage" 标签，了解未使用的代码</li>
                    </ol>
                </section>
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
