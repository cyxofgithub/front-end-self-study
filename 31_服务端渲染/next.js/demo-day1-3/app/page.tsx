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
                    Learning Day 1-3: Project Setup, Routing, and Rendering
                    Modes
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-blue-600">
                        Day 1: Project Setup
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Learn how to initialize a Next.js project, understand
                        core files like{' '}
                        <code className="bg-gray-100 px-2 py-1 rounded">
                            layout.tsx
                        </code>{' '}
                        and{' '}
                        <code className="bg-gray-100 px-2 py-1 rounded">
                            page.tsx
                        </code>
                        , and set up the App Router.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Project initialization</li>
                        <li>Core file structure</li>
                        <li>App Router basics</li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-green-600">
                        Day 2: Routing System
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Explore file-based routing, dynamic routes, navigation
                        components, and route states like loading and error
                        boundaries.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>File system routing</li>
                        <li>Dynamic routes</li>
                        <li>Navigation components</li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-purple-600">
                        Day 3: Rendering Modes
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Understand Server Components vs Client Components, and
                        implement four rendering modes: SSR, SSG, ISR, and CSR.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Server vs Client Components</li>
                        <li>SSR, SSG, ISR, CSR</li>
                        <li>Data fetching patterns</li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-3 text-orange-600">
                        Quick Links
                    </h2>
                    <div className="space-y-2">
                        <Link
                            href="/about"
                            className="block text-blue-600 hover:text-blue-800 underline"
                        >
                            → About Page
                        </Link>
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
