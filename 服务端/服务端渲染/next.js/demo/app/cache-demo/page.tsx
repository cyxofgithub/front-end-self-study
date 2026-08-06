'use client';

import { useState } from 'react';
import { revalidateBlogCache } from '@/lib/actions';
import Link from 'next/link';

/**
 * 缓存重新验证演示页
 * 演示 revalidatePath 和 revalidateTag 两种缓存控制方式
 */
export default function CacheDemoPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    async function handleRevalidate() {
        setLoading(true);
        setResult(null);

        try {
            const response = await revalidateBlogCache();
            setResult(response.message);
        } catch (error) {
            setResult('缓存重新验证失败');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                缓存重新验证演示
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                学习如何使用{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                    revalidatePath
                </code>{' '}
                和{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                    revalidateTag
                </code>{' '}
                控制 Next.js 的缓存失效。
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
                <h2 className="font-semibold text-blue-800 mb-2">
                    缓存重新验证的三种方式：
                </h2>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>
                        <strong>revalidatePath</strong> - 按路径重新验证缓存
                    </li>
                    <li>
                        <strong>revalidateTag</strong> - 按标签批量重新验证缓存数据
                    </li>
                    <li>
                        <strong>revalidate</strong> - 按时间周期重新验证（ISR）
                    </li>
                </ul>
            </div>

            <div className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        手动触发缓存重新验证
                    </h2>
                    <p className="text-gray-600 mb-4">
                        点击下方按钮手动让博客缓存失效。适用于数据变更后希望立即更新缓存内容的场景。
                    </p>
                    <button
                        onClick={handleRevalidate}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? '正在重新验证...' : '重新验证博客缓存'}
                    </button>
                    {result && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                            {result}
                        </div>
                    )}
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        revalidatePath 示例
                    </h2>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                        <code>{`import { revalidatePath } from 'next/cache';

// 重新验证指定路径
revalidatePath('/blog');
revalidatePath('/blog/[id]', 'page');

// 重新验证该路径下的所有页面
revalidatePath('/blog', 'layout');`}</code>
                    </pre>
                    <p className="mt-4 text-sm text-gray-600">
                        <strong>适用场景：</strong>
                        新增、更新、删除博客文章后，重新验证受影响的路径，让用户看到最新数据。
                    </p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        revalidateTag 示例
                    </h2>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                        <code>{`import { revalidateTag } from 'next/cache';

// 在数据请求处打上标签
fetch(url, {
  next: { tags: ['blog-posts'] }
});

// 之后按标签一次性让所有相关缓存失效
revalidateTag('blog-posts');`}</code>
                    </pre>
                    <p className="mt-4 text-sm text-gray-600">
                        <strong>适用场景：</strong>
                        多个页面共用同一个数据源时，给数据打标签，按标签一次性更新所有页面。
                    </p>
                </section>

                <section className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        两种方式怎么选
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">
                                revalidatePath
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                <li>明确知道哪些页面需要更新时</li>
                                <li>简单直接的缓存失效</li>
                                <li>表单提交或数据变更之后</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">
                                revalidateTag
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                <li>多个页面共享同一数据源时</li>
                                <li>需要按缓存分组做精细化控制时</li>
                                <li>数据依赖关系复杂的应用</li>
                            </ul>
                        </div>
                    </div>
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
