'use client';

import { useState, useEffect } from 'react';
import { fetchClientData } from '@/lib/api';

// CSR (Client-Side Rendering)
// This component runs entirely in the browser
// Data is fetched using useEffect after the component mounts
export default function CSRDemoPage() {
    const [data, setData] = useState<{
        message: string;
        timestamp: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch data on the client side after component mounts
        async function loadData() {
            try {
                setLoading(true);
                const result = await fetchClientData();
                setData(result);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Failed to fetch data'
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                CSR Demo Page
            </h1>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-orange-800">
                    Rendering Mode: CSR (Client-Side Rendering)
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p>
                        <strong>How it works:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            The initial HTML is sent with minimal content (just
                            the loading state)
                        </li>
                        <li>
                            JavaScript runs in the browser to fetch data and
                            render the component
                        </li>
                        <li>
                            The page is interactive immediately, but content
                            appears after data loads
                        </li>
                        <li>
                            Uses React hooks like{' '}
                            <code className="bg-gray-100 px-1 rounded">
                                useEffect
                            </code>{' '}
                            for data fetching
                        </li>
                    </ul>
                    <p className="mt-4">
                        <strong>Best for:</strong> Highly interactive pages,
                        dashboards, user-specific content, or when SEO is not a
                        concern
                    </p>
                    <p className="mt-2 text-sm text-orange-700">
                        <strong>Note:</strong> CSR is not SEO-friendly as search
                        engines may not execute JavaScript. Use SSR or SSG for
                        public content.
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        <p className="mt-4 text-gray-600">
                            Loading data on the client...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-800">Error: {error}</p>
                    </div>
                )}

                {data && !loading && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                            Client-Side Data
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Message:
                                </p>
                                <p className="text-lg text-blue-600">
                                    {data.message}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Timestamp:
                                </p>
                                <p className="text-xl font-mono text-purple-600">
                                    {new Date(data.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600">
                                <strong>Notice:</strong> This data was fetched
                                entirely in the browser after the page loaded.
                                Check the Network tab in DevTools to see the
                                client-side request.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Try it yourself:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Open DevTools and check the Network tab</li>
                    <li>Refresh the page and watch for the API request</li>
                    <li>
                        Notice the initial HTML doesn't contain the data - it's
                        fetched client-side
                    </li>
                    <li>
                        Disable JavaScript and refresh - you'll see the loading
                        state only
                    </li>
                </ol>
            </div>
        </div>
    );
}
