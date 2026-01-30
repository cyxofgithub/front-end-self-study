'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

/**
 * Code Splitting Demo Page
 * Demonstrates dynamic imports and code splitting in Next.js
 */

// Dynamic import with no SSR - component only loads on client
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
    ssr: false,
    loading: () => (
        <div className="text-center py-8">Loading heavy component...</div>
    ),
});

// Dynamic import with custom loading component
const ChartComponent = dynamic(() => import('./ChartComponent'), {
    loading: () => (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded">
            <div className="text-gray-600">Loading chart...</div>
        </div>
    ),
});

// Dynamic import that only loads when needed
const ModalComponent = dynamic(() => import('./ModalComponent'), {
    ssr: false,
});

export default function CodeSplittingDemoPage() {
    const [showHeavy, setShowHeavy] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                Code Splitting Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Next.js automatically splits your code, but you can also use
                dynamic imports to load components on-demand, reducing initial
                bundle size.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
                <h2 className="font-semibold text-blue-800 mb-2">
                    Benefits of Code Splitting:
                </h2>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                    <li>
                        <strong>Smaller Initial Bundle</strong> - Only load
                        what's needed initially
                    </li>
                    <li>
                        <strong>Faster Page Load</strong> - Reduce Time to
                        Interactive (TTI)
                    </li>
                    <li>
                        <strong>Better Performance</strong> - Load heavy
                        components only when needed
                    </li>
                    <li>
                        <strong>Improved UX</strong> - Show loading states while
                        components load
                    </li>
                </ul>
            </div>

            <div className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        1. Conditional Loading (No SSR)
                    </h2>
                    <p className="text-gray-600 mb-4">
                        This component only loads when you click the button.
                        It's excluded from SSR to reduce server-side bundle
                        size.
                    </p>
                    <button
                        onClick={() => setShowHeavy(!showHeavy)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
                    >
                        {showHeavy ? 'Hide' : 'Load'} Heavy Component
                    </button>
                    {showHeavy && <HeavyComponent />}
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm mt-4">
                        <code>{`const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { ssr: false }
);`}</code>
                    </pre>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        2. Custom Loading State
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Show a custom loading component while the actual
                        component loads.
                    </p>
                    <button
                        onClick={() => setShowChart(!showChart)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
                    >
                        {showChart ? 'Hide' : 'Load'} Chart Component
                    </button>
                    {showChart && <ChartComponent />}
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm mt-4">
                        <code>{`const ChartComponent = dynamic(
  () => import('./ChartComponent'),
  {
    loading: () => <div>Loading chart...</div>
  }
);`}</code>
                    </pre>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        3. Modal Component (Client-Only)
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Modal components often don't need SSR. Load them only on
                        the client side.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mb-4"
                    >
                        Open Modal
                    </button>
                    {showModal && (
                        <ModalComponent onClose={() => setShowModal(false)} />
                    )}
                </section>

                <section className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        How to Check Code Splitting
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Open DevTools → Network tab → Filter by "JS"</li>
                        <li>
                            Refresh the page - notice the initial bundle size
                        </li>
                        <li>
                            Click buttons to load components - watch new chunks
                            load
                        </li>
                        <li>Check the "Coverage" tab to see unused code</li>
                    </ol>
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
