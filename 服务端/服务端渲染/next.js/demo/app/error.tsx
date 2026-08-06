'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * 全局 Error Boundary
 *
 * 该组件捕获根布局或其他 error boundary 中发生的错误，
 * 是应用的顶级错误处理器。
 */
interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // 将错误记录到错误上报服务
        console.error('全局错误：', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                出错了！
                            </h1>
                            <p className="text-gray-600 mb-6">
                                发生了意外错误。我们的团队已收到通知，
                                正在修复中。
                            </p>

                            {error.message && (
                                <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 text-left">
                                    <p className="text-sm font-semibold text-red-800 mb-2">
                                        错误详情：
                                    </p>
                                    <p className="text-sm text-red-700 font-mono break-all">
                                        {error.message}
                                    </p>
                                    {error.digest && (
                                        <p className="text-xs text-red-600 mt-2">
                                            错误 ID：{error.digest}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={reset}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    重试
                                </button>
                                <Link
                                    href="/"
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                >
                                    返回首页
                                </Link>
                            </div>

                            <div className="mt-8 pt-6 border-t text-sm text-gray-500">
                                <p>
                                    如果问题持续存在，请联系技术支持并附上上述错误
                                    ID。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
