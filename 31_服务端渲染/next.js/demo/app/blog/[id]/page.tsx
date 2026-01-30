import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostById } from '@/lib/api';

// SSR (Server-Side Rendering) - Rendered on each request
// Using cache: 'no-store' to disable caching and force SSR
export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
    params: {
        id: string;
    };
}

/**
 * Generate dynamic metadata for blog post pages
 */
export async function generateMetadata({
    params,
}: BlogDetailPageProps): Promise<Metadata> {
    const post = await getPostById(params.id);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} - Next.js Demo Blog`,
        description: post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 160),
            type: 'article',
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
            authors: [post.author],
        },
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const post = await getPostById(params.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href="/blog"
                        className="text-blue-600 hover:text-blue-800 inline-block"
                    >
                        ← Back to Blog List
                    </Link>
                    <Link
                        href={`/blog/${params.id}/edit`}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    >
                        Edit Post
                    </Link>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
                    <p className="text-sm text-gray-700">
                        <strong>
                            Rendering Mode: SSR (Server-Side Rendering)
                        </strong>
                        <br />
                        This page is rendered on the server for each request.
                        The HTML is generated fresh every time, ensuring you
                        always get the latest data. Perfect for content that
                        changes frequently.
                    </p>
                </div>
            </div>

            <article className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                    <span>By {post.author}</span>
                    <span>•</span>
                    <span>
                        Published:{' '}
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.updatedAt !== post.createdAt && (
                        <>
                            <span>•</span>
                            <span>
                                Updated:{' '}
                                {new Date(post.updatedAt).toLocaleDateString()}
                            </span>
                        </>
                    )}
                </div>
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {post.content}
                    </p>
                </div>
            </article>
        </div>
    );
}
