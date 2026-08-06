'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, deletePost, getAllPosts } from '@/lib/actions';
import type { BlogPost } from '@/lib/mockData';

/**
 * 博客管理页面 - 演示 Server Actions
 *
 * 本页面展示如何使用 Server Actions 处理表单提交
 * Server Actions 允许你直接从 Server Components 修改数据
 * 无需创建 API 路由
 */
export default function BlogAdminPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    // 组件挂载时加载文章
    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        try {
            setLoading(true);
            const allPosts = await getAllPosts();
            setPosts(allPosts);
        } catch (error) {
            console.error('加载文章失败:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(formData: FormData) {
        setFormError(null);
        setFormSuccess(null);

        const result = await createPost(formData);

        if (result.error) {
            setFormError(result.error);
        } else {
            setFormSuccess('文章创建成功！');
            setShowForm(false);
            // 重新加载文章以显示新创建的文章
            await loadPosts();
            // 重置表单
            const form = document.getElementById(
                'create-post-form'
            ) as HTMLFormElement;
            form?.reset();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('确定要删除这篇文章吗？')) {
            return;
        }

        const result = await deletePost(id);

        if (result.error) {
            alert(result.error);
        } else {
            await loadPosts();
        }
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-12">
                    <p className="text-gray-600">正在加载文章...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    博客管理（Server Actions 演示）
                </h1>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>第 4 天：Server Actions</strong>
                        <br />
                        本页面演示 Server Actions —— 在服务器上运行的函数，
                        可以直接从表单或客户端组件中调用。对于表单提交和数据修改，
                        它们提供了比 API 路由更简单的替代方案。
                    </p>
                </div>
            </div>

            {/* 创建文章表单 */}
            <div className="mb-8">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? '取消' : '+ 创建新文章'}
                </button>

                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            创建新文章
                        </h2>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                                {formError}
                            </div>
                        )}

                        {formSuccess && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                                {formSuccess}
                            </div>
                        )}

                        <form id="create-post-form" action={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        标题
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="author"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        作者
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="content"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        内容
                                    </label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        rows={6}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    创建文章
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* 文章列表 */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">全部文章</h2>

                {posts.length === 0 ? (
                    <p className="text-gray-600">
                        暂无文章，快来创建第一篇文章吧！
                    </p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 mb-2 line-clamp-2">
                                        {post.content}
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        <span>作者：{post.author}</span>
                                        <span className="mx-2">•</span>
                                        <span>
                                            {new Date(
                                                post.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() =>
                                            router.push(`/blog/${post.id}`)
                                        }
                                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                    >
                                        查看
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
