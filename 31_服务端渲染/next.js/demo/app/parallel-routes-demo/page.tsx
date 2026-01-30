import Link from 'next/link';

/**
 * Parallel Routes Demo Page
 *
 * This page works together with the layout.tsx to demonstrate parallel routes.
 * The @analytics and @dashboard slots are rendered simultaneously.
 */
export const metadata = {
    title: 'Parallel Routes Demo - Next.js Day 6',
    description: 'Learn about parallel routes in Next.js App Router',
};

export default function ParallelRoutesDemoPage() {
    return (
        <div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                <h2 className="font-semibold text-blue-800 mb-2">
                    How Parallel Routes Work:
                </h2>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>
                        Slots are defined using{' '}
                        <code className="bg-blue-100 px-1 rounded">
                            @folder
                        </code>{' '}
                        syntax
                    </li>
                    <li>
                        Each slot is passed as a prop to the layout component
                    </li>
                    <li>Slots can have their own loading and error states</li>
                    <li>
                        Useful for conditional layouts and independent sections
                    </li>
                </ul>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">Use Cases:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                        <li>Dashboard with multiple independent sections</li>
                        <li>Conditional layouts based on authentication</li>
                        <li>
                            Loading different content for different user roles
                        </li>
                        <li>Independent error boundaries per section</li>
                    </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded">
                    <h3 className="font-semibold mb-2">File Structure:</h3>
                    <pre className="text-xs bg-white p-3 rounded overflow-x-auto">
                        <code>{`parallel-routes-demo/
├── layout.tsx          # Receives @analytics and @dashboard as props
├── page.tsx           # Main page content
├── @analytics/
│   └── page.tsx       # Analytics slot content
└── @dashboard/
    └── page.tsx       # Dashboard slot content`}</code>
                    </pre>
                </div>
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
