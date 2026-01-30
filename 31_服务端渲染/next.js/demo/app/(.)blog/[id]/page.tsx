'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { BlogPost } from '@/lib/mockData';

/**
 * Intercepting Route - Blog Detail Modal
 *
 * This route intercepts navigation to /blog/[id] when coming from the same segment level.
 * The (.) prefix means "same level" - intercepts routes at the same level.
 *
 * When a user clicks a blog post link from /blog, instead of navigating to /blog/[id],
 * this modal version is shown. If they navigate directly or refresh, they see the
 * normal page.
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
                // Fetch post data from API route (client-side)
                const response = await fetch(`/api/posts/${params.id}`);
                const result = await response.json();
                if (result.success) {
                    setPost(result.data);
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error('Failed to load post:', error);
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
        // Prevent body scroll when modal is open
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
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
                    <h2 className="text-xl font-bold mb-4">Post Not Found</h2>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Close
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
                        Blog Post Preview
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
                            <strong>Intercepting Route Demo</strong>
                            <br />
                            This is a modal version of the blog post. It
                            intercepts navigation from the same route level
                            using{' '}
                            <code className="bg-blue-100 px-1 rounded">
                                (.)blog/[id]
                            </code>
                            . Click outside or close to go back.
                        </p>
                    </div>

                    <article>
                        <h1 className="text-3xl font-bold mb-4 text-gray-800">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                            <span>By {post.author}</span>
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
                            View Full Page →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
