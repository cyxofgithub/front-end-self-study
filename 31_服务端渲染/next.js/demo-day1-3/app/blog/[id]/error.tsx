'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Error boundary component - catches errors in the route segment
interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('Blog detail page error:', error);
    }, [error]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-red-800">
                    Something went wrong!
                </h2>
                <p className="text-gray-700 mb-4">
                    An error occurred while loading the blog post. This could be
                    due to a network issue or invalid post ID.
                </p>
                {error.message && (
                    <p className="text-sm text-gray-600 mb-4 font-mono bg-gray-100 p-2 rounded">
                        {error.message}
                    </p>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={reset}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/blog"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        Back to Blog List
                    </Link>
                </div>
            </div>
        </div>
    );
}
