import Link from 'next/link';

// 404 page for blog post not found
export default function NotFound() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-yellow-800">
                    Blog Post Not Found
                </h2>
                <p className="text-gray-700 mb-4">
                    The blog post you're looking for doesn't exist or has been
                    removed.
                </p>
                <Link
                    href="/blog"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Back to Blog List
                </Link>
            </div>
        </div>
    );
}
