import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/api';

// SSG (Static Site Generation) - Default rendering mode
// This page is generated at build time
export const metadata: Metadata = {
    title: 'Blog Posts - Next.js Demo',
    description:
        'Browse our blog posts - demonstrating SSG (Static Site Generation)',
};

export default async function BlogListPage() {
    const posts = await getAllPosts();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    Blog Posts
                </h1>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>
                            Rendering Mode: SSG (Static Site Generation)
                        </strong>
                        <br />
                        This page is pre-rendered at build time. The HTML is
                        generated once during the build process and served
                        statically, providing the fastest possible performance.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-2xl font-semibold mb-2 text-blue-600">
                            <Link
                                href={`/blog/${post.id}`}
                                className="hover:text-blue-800 hover:underline"
                            >
                                {post.title}
                            </Link>
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.content}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>By {post.author}</span>
                            <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mt-4">
                            <Link
                                href={`/blog/${post.id}`}
                                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                            >
                                Read more →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
