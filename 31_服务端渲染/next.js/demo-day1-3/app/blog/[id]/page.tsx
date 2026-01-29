import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '@/lib/api';

// SSR (Server-Side Rendering) - Rendered on each request
// Using cache: 'no-store' to disable caching and force SSR
export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
    params: {
        id: string;
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
                <Link
                    href="/blog"
                    className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
                >
                    ← Back to Blog List
                </Link>
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
