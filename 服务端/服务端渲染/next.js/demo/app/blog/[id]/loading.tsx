// Loading UI component - shown while the page is loading
export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="h-10 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
