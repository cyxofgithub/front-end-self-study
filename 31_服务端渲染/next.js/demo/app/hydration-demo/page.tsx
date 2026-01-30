import type { Metadata } from 'next';
import Link from 'next/link';
import HydrationExamples from './HydrationExamples';

/**
 * 水合（Hydration）演示页面
 * 展示 Next.js 中水合的概念、过程和最佳实践
 */
export const metadata: Metadata = {
    title: '水合演示 - Next.js Day 3',
    description: 'Next.js 中水合（Hydration）的概念和实践演示',
};

export default function HydrationDemoPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                水合（Hydration）演示
            </h1>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                    什么是水合（Hydration）？
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p>
                        水合是 React
                        在服务端渲染（SSR）或静态站点生成（SSG）后，在客户端"激活"页面的过程。
                    </p>
                    <p>
                        <strong>水合的过程：</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>
                            服务端生成 HTML：Next.js 在服务器上渲染 React
                            组件，生成完整的 HTML
                        </li>
                        <li>
                            浏览器接收 HTML：浏览器接收到 HTML
                            后立即显示页面（首屏快速显示）
                        </li>
                        <li>
                            React 水合：浏览器加载 JavaScript 后，React
                            接管已渲染的 HTML，将其"激活"
                        </li>
                        <li>
                            页面可交互：水合完成后，事件处理器、状态管理等客户端功能开始工作
                        </li>
                    </ol>
                    <p className="mt-4">
                        <strong>为什么需要水合？</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>提供快速的首屏加载（用户立即看到内容）</li>
                        <li>保持 SEO 友好（搜索引擎可以读取完整的 HTML）</li>
                        <li>使页面具有交互性（React 的事件处理和状态管理）</li>
                    </ul>
                </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-red-800">
                    常见的水合错误
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p>
                        <strong>
                            水合不匹配（Hydration Mismatch）的本质：
                        </strong>
                    </p>
                    <div className="bg-white p-4 rounded mb-3">
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                            <li>
                                服务端渲染时，React 组件执行一次，生成
                                HTML（包含值A）
                            </li>
                            <li>
                                客户端水合时，React 重新执行组件，生成虚拟
                                DOM（包含值B）
                            </li>
                            <li>
                                React 对比服务端 HTML 和客户端虚拟
                                DOM，发现不一致 → 水合错误
                            </li>
                        </ol>
                    </div>
                    <p>
                        <strong>关键理解：</strong>
                    </p>
                    <p className="bg-white p-3 rounded">
                        问题不在于"值不同"本身（这是正常的），而在于
                        <strong>初始渲染时不一致</strong>。
                        即使值不同是预期的（如时间戳、随机数），但在服务端和客户端的首次渲染必须一致。
                    </p>
                    <p>
                        <strong>常见原因：</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            使用{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                Date.now()
                            </code>
                            、{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                Math.random()
                            </code>{' '}
                            等在组件顶层直接调用，导致服务端和客户端初始渲染不同
                        </li>
                        <li>
                            基于浏览器 API（如{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                window
                            </code>
                            、{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                localStorage
                            </code>
                            ）的条件渲染，服务端和客户端渲染结果不同
                        </li>
                        <li>服务端和客户端使用不同的数据源或条件渲染逻辑</li>
                        <li>第三方库在服务端和客户端行为不一致</li>
                    </ul>
                </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-green-800">
                    如何避免水合错误？
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p>
                        <strong>最佳实践：</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>使用 useEffect：</strong>
                            对于需要在客户端执行的逻辑（如访问 window、读取
                            localStorage、生成随机数），使用{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                useEffect
                            </code>{' '}
                            确保只在客户端执行，不影响初始渲染
                        </li>
                        <li>
                            <strong>确保初始渲染一致：</strong>
                            服务端和客户端的初始渲染应该完全相同（都渲染占位符或默认值），差异应该在客户端水合后通过状态更新引入
                        </li>
                        <li>
                            <strong>
                                避免在组件顶层调用会产生不同值的函数：
                            </strong>
                            不要在组件顶层直接调用{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                Date.now()
                            </code>
                            、{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                Math.random()
                            </code>{' '}
                            等函数
                        </li>
                        <li>
                            <strong>
                                使用 suppressHydrationWarning（谨慎使用）：
                            </strong>
                            对于已知的、预期的差异（如时间显示），可以使用{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                suppressHydrationWarning
                            </code>{' '}
                            属性告诉 React 这是预期的，但更好的做法还是使用
                            useEffect
                        </li>
                        <li>
                            <strong>避免基于浏览器 API 的条件渲染：</strong>
                            即使使用{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                typeof window !== 'undefined'
                            </code>{' '}
                            检查，服务端和客户端的初始渲染结果仍然可能不同，应该使用
                            useEffect
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    实际示例
                </h2>
                <HydrationExamples />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    试试看：
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>
                        打开浏览器开发者工具（F12），查看控制台（Console）标签
                    </li>
                    <li>观察下方错误示例在控制台中的水合警告</li>
                    <li>对比错误示例和正确示例的代码实现</li>
                    <li>
                        查看网络标签（Network），观察 HTML 和 JavaScript
                        的加载顺序
                    </li>
                    <li>
                        尝试禁用 JavaScript，刷新页面，看看服务端渲染的 HTML
                        内容
                    </li>
                </ol>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">
                    代码示例
                </h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">
                            ❌ 错误做法：
                        </h4>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                            <code>{`// 服务端和客户端会生成不同的值
export default function Component() {
  const timestamp = Date.now(); // ❌ 错误
  return <div>{timestamp}</div>;
}`}</code>
                        </pre>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">
                            ✅ 正确做法：
                        </h4>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                            <code>{`'use client';
import { useState, useEffect } from 'react';

export default function Component() {
  const [timestamp, setTimestamp] = useState<number | null>(null);
  
  useEffect(() => {
    // 只在客户端设置时间戳
    setTimestamp(Date.now());
  }, []);
  
  return <div>{timestamp || '加载中...'}</div>;
}`}</code>
                        </pre>
                    </div>
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
