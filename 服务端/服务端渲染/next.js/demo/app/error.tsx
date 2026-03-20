'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Global Error Boundary
 *
 * This component catches errors that occur in the root layout or other error boundaries.
 * It's the top-level error handler for the application.
 */
interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error to error reporting service
        console.error('Global error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                Something went wrong!
                            </h1>
                            <p className="text-gray-600 mb-6">
                                An unexpected error occurred. Our team has been
                                notified and is working on a fix.
                            </p>

                            {error.message && (
                                <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 text-left">
                                    <p className="text-sm font-semibold text-red-800 mb-2">
                                        Error Details:
                                    </p>
                                    <p className="text-sm text-red-700 font-mono break-all">
                                        {error.message}
                                    </p>
                                    {error.digest && (
                                        <p className="text-xs text-red-600 mt-2">
                                            Error ID: {error.digest}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={reset}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Try Again
                                </button>
                                <Link
                                    href="/"
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                >
                                    Go Home
                                </Link>
                            </div>

                            <div className="mt-8 pt-6 border-t text-sm text-gray-500">
                                <p>
                                    If this problem persists, please contact
                                    support with the error ID above.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
