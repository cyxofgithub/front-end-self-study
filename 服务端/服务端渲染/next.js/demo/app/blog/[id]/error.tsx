'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Error boundary 组件 - 捕获路由段内的错误
interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('博客详情页错误：', error);
    }, [error]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-red-800">
                    出错了！
                </h2>
                <p className="text-gray-700 mb-4">
                    加载博客文章时发生错误。可能是网络问题或文章 ID 无效导致的。
                </p>
                {error.message && (
                    <p className="text-sm text-gray-600 mb-4 font-mono bg-gray-100 p-2 rounded">
                        {error.message}
                    </p>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={reset}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        重试
                    </button>
                    <Link
                        href="/blog"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        返回博客列表
                    </Link>
                </div>
            </div>
        </div>
    );
}
