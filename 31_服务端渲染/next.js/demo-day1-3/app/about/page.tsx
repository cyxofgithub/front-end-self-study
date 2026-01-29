// Basic route example: /about
// This is a Server Component (default in App Router)
export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                About This Demo
            </h1>

            <div className="prose prose-lg">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                        What is This Project?
                    </h2>
                    <p className="text-gray-700 mb-4">
                        This is a comprehensive Next.js demonstration project
                        designed to help you master the fundamentals covered in
                        Day 1-3 of the Next.js learning path.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-green-600">
                        Day 1: Project Setup
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Learn how to initialize a Next.js project with
                        TypeScript and the App Router. Understand the core file
                        structure including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                app/layout.tsx
                            </code>{' '}
                            - Root layout component
                        </li>
                        <li>
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                app/page.tsx
                            </code>{' '}
                            - Home page component
                        </li>
                        <li>File-based routing system</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                        Day 2: Routing System
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Explore Next.js routing capabilities including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Basic routes (like this /about page)</li>
                        <li>Dynamic routes (/blog/[id])</li>
                        <li>
                            Navigation components (Link, useRouter, usePathname)
                        </li>
                        <li>Route states (loading.tsx, error.tsx)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-orange-600">
                        Day 3: Rendering Modes
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Understand different rendering strategies:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>
                            <strong>SSR</strong> - Server-Side Rendering (blog
                            detail pages)
                        </li>
                        <li>
                            <strong>SSG</strong> - Static Site Generation (blog
                            list page)
                        </li>
                        <li>
                            <strong>ISR</strong> - Incremental Static
                            Regeneration (isr-demo page)
                        </li>
                        <li>
                            <strong>CSR</strong> - Client-Side Rendering
                            (csr-demo page)
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
