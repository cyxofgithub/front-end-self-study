import { ReactNode } from 'react';

interface ParallelRoutesLayoutProps {
    children: ReactNode;
    analytics: ReactNode;
    dashboard: ReactNode;
}

/**
 * Parallel Routes Layout
 *
 * Parallel routes allow you to simultaneously render multiple pages in the same layout.
 * They're useful for:
 * - Dashboard layouts with multiple sections
 * - Conditional layouts based on user roles
 * - Loading multiple independent sections
 */
export default function ParallelRoutesLayout({
    children,
    analytics,
    dashboard,
}: ParallelRoutesLayoutProps) {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    Parallel Routes Demo
                </h1>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>Day 6: Parallel Routes</strong>
                        <br />
                        This layout demonstrates parallel routes using the{' '}
                        <code className="bg-gray-100 px-1 rounded">
                            @folder
                        </code>{' '}
                        syntax. Multiple route segments are rendered
                        simultaneously in the same layout.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">
                        @analytics Slot
                    </h2>
                    {analytics}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
                    <h2 className="text-xl font-semibold mb-4 text-green-600">
                        @dashboard Slot
                    </h2>
                    {dashboard}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Main Content (children)
                </h2>
                {children}
            </div>
        </div>
    );
}
