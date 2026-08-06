'use client';

import { useState, useEffect } from 'react';
import { fetchClientData } from '@/lib/api';

// CSR（客户端渲染）
// 该组件完全在浏览器中运行
// 组件挂载后通过 useEffect 获取数据
// 注意：客户端组件无法导出 metadata
// 请使用 layout.tsx 或父级服务端组件来设置 metadata
export default function CSRDemoPage() {
    const [data, setData] = useState<{
        message: string;
        timestamp: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 组件挂载后在客户端获取数据
        async function loadData() {
            try {
                setLoading(true);
                const result = await fetchClientData();
                setData(result);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : '获取数据失败'
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                CSR 演示页面
            </h1>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-orange-800">
                    渲染模式：CSR（客户端渲染）
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p>
                        <strong>工作原理：</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            初始 HTML 只包含最少的内容（仅加载状态）
                        </li>
                        <li>
                            JavaScript 在浏览器中运行，负责获取数据并渲染组件
                        </li>
                        <li>
                            页面立即可交互，但内容要等数据加载完成后才显示
                        </li>
                        <li>
                            使用{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                useEffect
                            </code>{' '}
                            等 React Hooks 进行数据获取
                        </li>
                    </ul>
                    <p className="mt-4">
                        <strong>适用场景：</strong>高度交互的页面、仪表盘、用户专属内容，或不关心
                        SEO 的场景
                    </p>
                    <p className="mt-2 text-sm text-orange-700">
                        <strong>注意：</strong>CSR 对 SEO
                        不友好，因为搜索引擎可能不会执行
                        JavaScript。面向公众的内容请使用 SSR 或 SSG。
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        <p className="mt-4 text-gray-600">
                            正在客户端加载数据...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-800">错误：{error}</p>
                    </div>
                )}

                {data && !loading && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                            客户端获取的数据
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    消息：
                                </p>
                                <p className="text-lg text-blue-600">
                                    {data.message}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    时间戳：
                                </p>
                                <p className="text-xl font-mono text-purple-600">
                                    {new Date(data.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">
                                <strong>提示：</strong>这些数据完全是在页面加载后由浏览器获取的。
                                打开 DevTools 的 Network
                                标签可以看到这个客户端请求。
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    动手试试：
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>打开 DevTools，查看 Network 标签</li>
                    <li>刷新页面，观察 API 请求</li>
                    <li>
                        注意初始 HTML 中并不包含数据——数据是在客户端获取的
                    </li>
                    <li>
                        禁用 JavaScript 后刷新——你只会看到加载状态
                    </li>
                </ol>
            </div>
        </div>
    );
}
