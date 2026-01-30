'use client';

/**
 * Chart Component - Simulates a charting library component
 * These libraries are often large and benefit from code splitting
 */
export default function ChartComponent() {
    return (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Chart Component
            </h3>
            <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-600">
                        Chart visualization would appear here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        (This simulates a heavy charting library component)
                    </p>
                </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
                Chart libraries like Chart.js, Recharts, or D3.js are perfect
                candidates for code splitting as they're only needed on specific
                pages.
            </p>
        </div>
    );
}
