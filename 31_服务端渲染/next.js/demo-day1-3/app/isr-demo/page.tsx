import { getCurrentTime } from '@/lib/api';

// ISR (Incremental Static Regeneration)
// This page is statically generated but can be regenerated periodically
// revalidate: 3600 means the page will be regenerated at most once per hour
export const revalidate = 10; // Revalidate every hour (3600 seconds)

export default async function ISRDemoPage() {
    const currentTime = await getCurrentTime();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                ISR Demo Page
            </h1>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-800">
                    Rendering Mode: ISR (Incremental Static Regeneration)
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p>
                        <strong>How it works:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            The page is statically generated at build time (like
                            SSG)
                        </li>
                        <li>
                            After the revalidation period (3600 seconds = 1
                            hour), the next request triggers a regeneration in
                            the background
                        </li>
                        <li>
                            Users continue to see the cached version while
                            regeneration happens
                        </li>
                        <li>
                            Once regeneration completes, the new version is
                            served to subsequent users
                        </li>
                    </ul>
                    <p className="mt-4">
                        <strong>Best for:</strong> Content that updates
                        occasionally but doesn't need to be real-time (e.g.,
                        blog posts, product listings)
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Current Server Time
                </h3>
                <p className="text-2xl font-mono text-blue-600 mb-4">
                    {new Date(currentTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                    This timestamp was generated on the server. If you refresh
                    the page within an hour, you'll see the same timestamp
                    (cached). After an hour, the page will be regenerated with a
                    new timestamp.
                </p>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Try it yourself:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Note the current timestamp above</li>
                    <li>
                        Refresh the page multiple times - the timestamp stays
                        the same
                    </li>
                    <li>
                        Wait for the revalidation period (or change revalidate
                        to a smaller value like 10 seconds for testing)
                    </li>
                    <li>
                        After revalidation, refresh again - you'll see a new
                        timestamp
                    </li>
                </ol>
            </div>
        </div>
    );
}
