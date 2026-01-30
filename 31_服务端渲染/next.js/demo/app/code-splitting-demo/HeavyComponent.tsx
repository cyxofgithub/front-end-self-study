'use client';

/**
 * Heavy Component - Simulates a large component that benefits from code splitting
 * This component would normally increase bundle size significantly
 */
export default function HeavyComponent() {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Heavy Component Loaded!</h3>
            <p className="mb-4">
                This component was loaded dynamically using{' '}
                <code className="bg-white/20 px-2 py-1 rounded">dynamic()</code>
                . It's not included in the initial bundle, reducing the page
                load time.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                        key={item}
                        className="bg-white/20 p-4 rounded text-center"
                    >
                        <div className="text-3xl font-bold">{item}</div>
                        <div className="text-sm opacity-90">Feature {item}</div>
                    </div>
                ))}
            </div>
            <p className="mt-6 text-sm opacity-90">
                Check the Network tab to see this component loaded as a separate
                chunk!
            </p>
        </div>
    );
}
