import Link from 'next/link';

// Home page - Server Component by default
export default function Home() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to Next.js Demo
                </h1>
                <p className="text-xl text-gray-600">
                    Complete Next.js Learning Path: Day 1-7
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-blue-600">
                        Day 1: Project Setup
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        Learn how to initialize a Next.js project, understand
                        core files like{' '}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                            layout.tsx
                        </code>{' '}
                        and{' '}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                            page.tsx
                        </code>
                        , and set up the App Router.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-green-600">
                        Day 2: Routing System
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        Explore file-based routing, dynamic routes, navigation
                        components, and route states like loading and error
                        boundaries.
                    </p>
                    <Link
                        href="/about"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        → About Page
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-purple-600">
                        Day 3: Rendering Modes
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        Understand Server Components vs Client Components, and
                        implement four rendering modes: SSR, SSG, ISR, and CSR.
                    </p>
                    <div className="space-y-1 text-sm">
                        <Link
                            href="/blog"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → Blog List (SSG)
                        </Link>
                        <Link
                            href="/isr-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → ISR Demo
                        </Link>
                        <Link
                            href="/csr-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → CSR Demo
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-orange-600">
                        Day 4: Server Features
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        Learn Server Actions, API Routes, and Middleware for
                        handling server-side logic and authentication.
                    </p>
                    <div className="space-y-1 text-sm">
                        <Link
                            href="/blog-admin"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → Blog Admin (Server Actions)
                        </Link>
                        <Link
                            href="/api-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → API Demo
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-pink-600">
                        Day 5: Performance
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        Optimize your app with image optimization, font
                        optimization, metadata, and code splitting.
                    </p>
                    <div className="space-y-1 text-sm">
                        <Link
                            href="/image-optimization-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → Image Optimization
                        </Link>
                        <Link
                            href="/code-splitting-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → Code Splitting
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-indigo-600">
                        Day 6: Advanced
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                        Master advanced features: parallel routes, intercepting
                        routes, cache revalidation, and error handling.
                    </p>
                    <div className="space-y-1 text-sm">
                        <Link
                            href="/parallel-routes-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → Parallel Routes
                        </Link>
                        <Link
                            href="/cache-demo"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → Cache Revalidation
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    🎉 Complete Learning Path
                </h2>
                <p className="text-gray-700 mb-4">
                    This demo covers all 7 days of the Next.js learning path:
                </p>
                <div className="grid md:grid-cols-7 gap-2 text-sm">
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-blue-600">Day 1</div>
                        <div className="text-xs text-gray-600">Setup</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-green-600">
                            Day 2
                        </div>
                        <div className="text-xs text-gray-600">Routing</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-purple-600">
                            Day 3
                        </div>
                        <div className="text-xs text-gray-600">Rendering</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-orange-600">
                            Day 4
                        </div>
                        <div className="text-xs text-gray-600">Server</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-pink-600">Day 5</div>
                        <div className="text-xs text-gray-600">Performance</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-indigo-600">
                            Day 6
                        </div>
                        <div className="text-xs text-gray-600">Advanced</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                        <div className="font-semibold text-teal-600">Day 7</div>
                        <div className="text-xs text-gray-600">Deploy</div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                    <strong>Note:</strong> This is a Server Component. It runs
                    on the server and is rendered before being sent to the
                    client, improving performance and SEO.
                </p>
            </div>
        </div>
    );
}
