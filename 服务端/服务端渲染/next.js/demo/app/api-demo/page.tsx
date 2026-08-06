'use client';

import { useState } from 'react';
import type { BlogPost } from '@/lib/mockData';

/**
 * API 演示页面 - 演示 API Routes
 *
 * 本页面展示如何使用 API Routes（RESTful 端点）
 * 以下场景中 API Routes 很有用：
 * - 为外部服务提供接口
 * - 支持非 React 客户端
 * - 处理复杂的请求/响应逻辑
 */
export default function ApiDemoPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
    });

    // 获取所有文章
    async function fetchPosts() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/posts');
            const result = await response.json();

            if (result.success) {
                setPosts(result.data);
            } else {
                setError(result.error || '获取文章失败');
            }
        } catch (err) {
            setError(
                '网络错误：' +
                    (err instanceof Error ? err.message : '未知错误')
            );
        } finally {
            setLoading(false);
        }
    }

    // 创建新文章
    async function createPost() {
        if (!formData.title || !formData.content || !formData.author) {
            setError('所有字段都是必填的');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setFormData({ title: '', content: '', author: '' });
                await fetchPosts(); // 重新加载文章列表
            } else {
                setError(result.error || '创建文章失败');
            }
        } catch (err) {
            setError(
                '网络错误：' +
                    (err instanceof Error ? err.message : '未知错误')
            );
        } finally {
            setLoading(false);
        }
    }

    // 更新文章
    async function updatePost(id: string) {
        const title = prompt('请输入新标题：');
        const content = prompt('请输入新内容：');
        const author = prompt('请输入新作者：');

        if (!title || !content || !author) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, author }),
            });

            const result = await response.json();

            if (result.success) {
                await fetchPosts(); // 重新加载文章列表
            } else {
                setError(result.error || '更新文章失败');
            }
        } catch (err) {
            setError(
                '网络错误：' +
                    (err instanceof Error ? err.message : '未知错误')
            );
        } finally {
            setLoading(false);
        }
    }

    // 删除文章
    async function deletePost(id: string) {
        if (!confirm('确定要删除这篇文章吗？')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                await fetchPosts(); // 重新加载文章列表
            } else {
                setError(result.error || '删除文章失败');
            }
        } catch (err) {
            setError(
                '网络错误：' +
                    (err instanceof Error ? err.message : '未知错误')
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    API Routes 演示
                </h1>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>Day 4：API Routes</strong>
                        <br />
                        本页面演示 API Routes —— 可以通过 HTTP
                        请求访问的 RESTful 端点。API Routes
                        适用于为外部服务、移动应用提供接口，或需要对请求/响应处理有更多控制的场景。
                    </p>
                </div>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* 操作区 */}
            <div className="mb-8 space-y-4">
                <button
                    onClick={fetchPosts}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading
                        ? '加载中...'
                        : '获取所有文章（GET /api/posts）'}
                </button>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        创建文章（POST /api/posts）
                    </h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="标题"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="作者"
                            value={formData.author}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    author: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <textarea
                            placeholder="内容"
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    content: e.target.value,
                                })
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <button
                            onClick={createPost}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                            创建文章
                        </button>
                    </div>
                </div>
            </div>

            {/* 文章列表 */}
            {posts.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">文章列表</h2>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 mb-2">{post.content}</p>
                            <div className="text-sm text-gray-500 mb-4">
                                作者：{post.author} •{' '}
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updatePost(post.id)}
                                    disabled={loading}
                                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:bg-gray-200"
                                >
                                    更新（PUT）
                                </button>
                                <button
                                    onClick={() => deletePost(post.id)}
                                    disabled={loading}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-200"
                                >
                                    删除（DELETE）
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* API 端点参考 */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                    可用的 API 端点
                </h2>
                <div className="space-y-2 text-sm font-mono">
                    <div>
                        <span className="text-green-600 font-bold">GET</span>{' '}
                        <span>/api/posts</span> - 获取所有文章
                    </div>
                    <div>
                        <span className="text-green-600 font-bold">GET</span>{' '}
                        <span>/api/posts/[id]</span> - 获取单篇文章
                    </div>
                    <div>
                        <span className="text-blue-600 font-bold">POST</span>{' '}
                        <span>/api/posts</span> - 创建新文章
                    </div>
                    <div>
                        <span className="text-yellow-600 font-bold">PUT</span>{' '}
                        <span>/api/posts/[id]</span> - 更新文章
                    </div>
                    <div>
                        <span className="text-red-600 font-bold">DELETE</span>{' '}
                        <span>/api/posts/[id]</span> - 删除文章
                    </div>
                </div>
            </div>
        </div>
    );
}
