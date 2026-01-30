'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/mockData';

interface EditPostFormProps {
    post: BlogPost;
    updateAction: (formData: FormData) => Promise<void>;
}

/**
 * Edit Post Form Component
 * Demonstrates Server Action form submission with pre-filled data
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
            // Redirect happens in the Server Action, but we can also handle it here
            router.push(`/blog/${post.id}`);
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to update post'
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
                        Title
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
                        Author
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
                        Content
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
                        {isSubmitting ? 'Updating...' : 'Update Post'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
