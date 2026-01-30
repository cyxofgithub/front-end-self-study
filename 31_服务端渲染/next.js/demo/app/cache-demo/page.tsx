'use client';

import { useState } from 'react';
import { revalidateBlogCache } from '@/lib/actions';
import Link from 'next/link';

/**
 * Cache Revalidation Demo Page
 * Demonstrates revalidatePath and revalidateTag for cache control
 */
export default function CacheDemoPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    async function handleRevalidate() {
        setLoading(true);
        setResult(null);

        try {
            const response = await revalidateBlogCache();
            setResult(response.message);
        } catch (error) {
            setResult('Failed to revalidate cache');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                Cache Revalidation Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Learn how to control Next.js cache invalidation using{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                    revalidatePath
                </code>{' '}
                and{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                    revalidateTag
                </code>
                .
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
                <h2 className="font-semibold text-blue-800 mb-2">
                    Cache Revalidation Methods:
                </h2>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>
                        <strong>revalidatePath</strong> - Revalidate a specific
                        path's cache
                    </li>
                    <li>
                        <strong>revalidateTag</strong> - Revalidate all cached
                        data with a specific tag
                    </li>
                    <li>
                        <strong>revalidate</strong> - Time-based revalidation
                        (ISR)
                    </li>
                </ul>
            </div>

            <div className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        Manual Cache Revalidation
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Click the button below to manually revalidate the blog
                        cache. This is useful when you want to update cached
                        content immediately after a data mutation.
                    </p>
                    <button
                        onClick={handleRevalidate}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Revalidating...' : 'Revalidate Blog Cache'}
                    </button>
                    {result && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                            {result}
                        </div>
                    )}
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        revalidatePath Example
                    </h2>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                        <code>{`import { revalidatePath } from 'next/cache';

// Revalidate a specific path
revalidatePath('/blog');
revalidatePath('/blog/[id]', 'page');

// Revalidate all pages under a path
revalidatePath('/blog', 'layout');`}</code>
                    </pre>
                    <p className="mt-4 text-sm text-gray-600">
                        <strong>Use case:</strong> After creating, updating, or
                        deleting a blog post, revalidate the affected paths to
                        show fresh data.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        revalidateTag Example
                    </h2>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                        <code>{`import { revalidateTag } from 'next/cache';

// In your data fetching function
fetch(url, {
  next: { tags: ['blog-posts'] }
});

// Later, revalidate all data with this tag
revalidateTag('blog-posts');`}</code>
                    </pre>
                    <p className="mt-4 text-sm text-gray-600">
                        <strong>Use case:</strong> When you have multiple pages
                        using the same data source, tag the data and revalidate
                        by tag to update all pages at once.
                    </p>
                </section>

                <section className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        When to Use Each Method
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">
                                revalidatePath
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                <li>
                                    You know exactly which pages need updating
                                </li>
                                <li>
                                    Simple, straightforward cache invalidation
                                </li>
                                <li>After form submissions or mutations</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">
                                revalidateTag
                            </h3>
                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                <li>
                                    Multiple pages share the same data source
                                </li>
                                <li>
                                    You want granular control over cache groups
                                </li>
                                <li>
                                    Complex applications with many data
                                    dependencies
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
