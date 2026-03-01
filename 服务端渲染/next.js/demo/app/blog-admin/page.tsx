'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, deletePost, getAllPosts } from '@/lib/actions';
import type { BlogPost } from '@/lib/mockData';

/**
 * Blog Admin Page - Demonstrates Server Actions
 *
 * This page shows how to use Server Actions for form submissions
 * Server Actions allow you to mutate data directly from Server Components
 * without needing to create API routes
 */
export default function BlogAdminPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    // Load posts on mount
    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        try {
            setLoading(true);
            const allPosts = await getAllPosts();
            setPosts(allPosts);
        } catch (error) {
            console.error('Failed to load posts:', error);
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
            setFormSuccess('Post created successfully!');
            setShowForm(false);
            // Reload posts to show the new one
            await loadPosts();
            // Reset form
            const form = document.getElementById(
                'create-post-form'
            ) as HTMLFormElement;
            form?.reset();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this post?')) {
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
                    <p className="text-gray-600">Loading posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    Blog Admin (Server Actions Demo)
                </h1>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>Day 4: Server Actions</strong>
                        <br />
                        This page demonstrates Server Actions - functions that
                        run on the server and can be called directly from forms
                        or client components. They provide a simpler alternative
                        to API routes for form submissions and data mutations.
                    </p>
                </div>
            </div>

            {/* Create Post Form */}
            <div className="mb-8">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : '+ Create New Post'}
                </button>

                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Create New Post
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
                                        Title
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
                                        Author
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
                                        Content
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
                                    Create Post
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">All Posts</h2>

                {posts.length === 0 ? (
                    <p className="text-gray-600">
                        No posts yet. Create your first post!
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
                                        <span>By {post.author}</span>
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
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        Delete
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
