'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/mockData';

interface EditPostFormProps {
    post: BlogPost;
    updateAction: (formData: FormData) => Promise<void>;
}

/**
 * 编辑文章表单组件
 * 演示使用预填数据通过 Server Action 提交表单
 */
export default function EditPostForm({
    post,
    updateAction,
}: EditPostFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            await updateAction(formData);
            // 重定向在 Server Action 中发生，但我们也可以在这里处理
            router.push(`/blog/${post.id}`);
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : '文章更新失败'
            );
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <form action={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        标题
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={post.title}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="author"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        作者
                    </label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        defaultValue={post.author}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        内容
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={10}
                        defaultValue={post.content}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? '更新中...' : '更新文章'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        取消
                    </button>
                </div>
            </form>
        </div>
    );
}
