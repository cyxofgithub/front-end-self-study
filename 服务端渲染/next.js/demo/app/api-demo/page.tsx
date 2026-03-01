'use client';

import { useState } from 'react';
import type { BlogPost } from '@/lib/mockData';

/**
 * API Demo Page - Demonstrates API Routes
 *
 * This page shows how to use API Routes (RESTful endpoints)
 * API Routes are useful when you need to:
 * - Provide endpoints for external services
 * - Support non-React clients
 * - Handle complex request/response logic
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

    // Fetch all posts
    async function fetchPosts() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/posts');
            const result = await response.json();

            if (result.success) {
                setPosts(result.data);
            } else {
                setError(result.error || 'Failed to fetch posts');
            }
        } catch (err) {
            setError(
                'Network error: ' +
                    (err instanceof Error ? err.message : 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    }

    // Create a new post
    async function createPost() {
        if (!formData.title || !formData.content || !formData.author) {
            setError('All fields are required');
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
                await fetchPosts(); // Reload posts
            } else {
                setError(result.error || 'Failed to create post');
            }
        } catch (err) {
            setError(
                'Network error: ' +
                    (err instanceof Error ? err.message : 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    }

    // Update a post
    async function updatePost(id: string) {
        const title = prompt('Enter new title:');
        const content = prompt('Enter new content:');
        const author = prompt('Enter new author:');

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
                await fetchPosts(); // Reload posts
            } else {
                setError(result.error || 'Failed to update post');
            }
        } catch (err) {
            setError(
                'Network error: ' +
                    (err instanceof Error ? err.message : 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    }

    // Delete a post
    async function deletePost(id: string) {
        if (!confirm('Are you sure you want to delete this post?')) {
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
                await fetchPosts(); // Reload posts
            } else {
                setError(result.error || 'Failed to delete post');
            }
        } catch (err) {
            setError(
                'Network error: ' +
                    (err instanceof Error ? err.message : 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    API Routes Demo
                </h1>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>Day 4: API Routes</strong>
                        <br />
                        This page demonstrates API Routes - RESTful endpoints
                        that can be accessed via HTTP requests. API Routes are
                        useful for providing endpoints to external services,
                        mobile apps, or when you need more control over
                        request/response handling.
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="mb-8 space-y-4">
                <button
                    onClick={fetchPosts}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading
                        ? 'Loading...'
                        : 'Fetch All Posts (GET /api/posts)'}
                </button>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        Create Post (POST /api/posts)
                    </h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
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
                            placeholder="Author"
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
                            placeholder="Content"
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
                            Create Post
                        </button>
                    </div>
                </div>
            </div>

            {/* Posts List */}
            {posts.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Posts</h2>
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
                                By {post.author} •{' '}
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updatePost(post.id)}
                                    disabled={loading}
                                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:bg-gray-200"
                                >
                                    Update (PUT)
                                </button>
                                <button
                                    onClick={() => deletePost(post.id)}
                                    disabled={loading}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-200"
                                >
                                    Delete (DELETE)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* API Endpoints Reference */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Available API Endpoints
                </h2>
                <div className="space-y-2 text-sm font-mono">
                    <div>
                        <span className="text-green-600 font-bold">GET</span>{' '}
                        <span>/api/posts</span> - Fetch all posts
                    </div>
                    <div>
                        <span className="text-green-600 font-bold">GET</span>{' '}
                        <span>/api/posts/[id]</span> - Fetch a single post
                    </div>
                    <div>
                        <span className="text-blue-600 font-bold">POST</span>{' '}
                        <span>/api/posts</span> - Create a new post
                    </div>
                    <div>
                        <span className="text-yellow-600 font-bold">PUT</span>{' '}
                        <span>/api/posts/[id]</span> - Update a post
                    </div>
                    <div>
                        <span className="text-red-600 font-bold">DELETE</span>{' '}
                        <span>/api/posts/[id]</span> - Delete a post
                    </div>
                </div>
            </div>
        </div>
    );
}
