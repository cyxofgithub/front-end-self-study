import Link from 'next/link';

/**
 * Global 404 Not Found Page
 *
 * This page is shown when a route doesn't exist.
 * It's the fallback for all unmatched routes.
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Page Not Found
                </h1>
                <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Go Back Home
                    </Link>

                    <div className="pt-6 border-t">
                        <p className="text-sm text-gray-500 mb-4">
                            Popular pages:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Link
                                href="/blog"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="/blog-admin"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm transition-colors"
                            >
                                Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
