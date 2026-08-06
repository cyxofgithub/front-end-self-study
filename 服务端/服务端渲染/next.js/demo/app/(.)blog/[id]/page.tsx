'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { BlogPost } from '@/lib/mockData';

/**
 * Intercepting Route - 博客详情弹窗
 *
 * 当从同一路由层级导航到 /blog/[id] 时，此路由会进行拦截。
 * (.) 前缀表示"同一层级"——拦截同一层级的路由。
 *
 * 当用户从 /blog 点击博客文章链接时，不会直接跳转到 /blog/[id]，
 * 而是显示这个弹窗版本。如果直接访问或刷新页面，则看到正常页面。
 */
interface InterceptingBlogPageProps {
    params: {
        id: string;
    };
}

export default function InterceptingBlogPage({
    params,
}: InterceptingBlogPageProps) {
    const router = useRouter();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            try {
                // 从 API 路由获取文章数据（客户端）
                const response = await fetch(`/api/posts/${params.id}`);
                const result = await response.json();
                if (result.success) {
                    setPost(result.data);
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error('加载文章失败:', error);
                setPost(null);
            } finally {
                setLoading(false);
            }
        }
        loadPost();
    }, [params.id]);

    function handleClose() {
        router.back();
    }

    useEffect(() => {
        // 弹窗打开时禁止页面滚动
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">加载中...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
                    <h2 className="text-xl font-bold mb-4">文章不存在</h2>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        关闭
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        博客文章预览
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                        <p className="text-sm text-blue-800">
                            <strong>Intercepting Route 演示</strong>
                            <br />
                            这是博客文章的弹窗版本。它通过{' '}
                            <code className="bg-blue-100 px-1 rounded">
                                (.)blog/[id]
                            </code>
                            拦截来自同一路由层级的导航。点击外部或关闭即可返回。
                        </p>
                    </div>

                    <article>
                        <h1 className="text-3xl font-bold mb-4 text-gray-800">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                            <span>作者：{post.author}</span>
                            <span>•</span>
                            <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {post.content}
                            </p>
                        </div>
                    </article>

                    <div className="mt-6 pt-6 border-t">
                        <button
                            onClick={() => router.push(`/blog/${params.id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            查看完整页面 →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
