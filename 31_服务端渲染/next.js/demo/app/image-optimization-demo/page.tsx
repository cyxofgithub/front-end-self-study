import Image from 'next/image';
import Link from 'next/link';

/**
 * Image Optimization Demo Page
 * Demonstrates Next.js Image component optimization features
 */
export const metadata = {
    title: 'Image Optimization Demo - Next.js Day 5',
    description: 'Learn how to optimize images using Next.js Image component',
};

export default function ImageOptimizationDemoPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                Image Optimization Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Next.js Image component automatically optimizes images for
                performance, providing lazy loading, responsive sizing, and
                modern format support.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
                <h2 className="font-semibold text-blue-800 mb-2">
                    Key Features:
                </h2>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                    <li>
                        <strong>Automatic Optimization</strong> - Images are
                        optimized on-demand
                    </li>
                    <li>
                        <strong>Lazy Loading</strong> - Images load only when
                        they enter the viewport
                    </li>
                    <li>
                        <strong>Responsive Images</strong> - Automatically
                        serves appropriately sized images
                    </li>
                    <li>
                        <strong>Modern Formats</strong> - Automatically serves
                        WebP/AVIF when supported
                    </li>
                    <li>
                        <strong>Prevents Layout Shift</strong> - Reserves space
                        to prevent CLS
                    </li>
                </ul>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        1. Local Image (from public folder)
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">
                            Images in the{' '}
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                public
                            </code>{' '}
                            folder can be referenced directly. Next.js will
                            optimize them automatically.
                        </p>
                        <div className="relative w-full h-64 mb-4">
                            <Image
                                src="/images/placeholder.jpg"
                                alt="Placeholder image"
                                fill
                                className="object-cover rounded"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                        </div>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                            <code>{`<Image
  src="/images/placeholder.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>`}</code>
                        </pre>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        2. External Image (with domain configuration)
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">
                            External images require domain configuration in{' '}
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                next.config.js
                            </code>
                            . This example uses a placeholder service.
                        </p>
                        <div className="relative w-full h-64 mb-4">
                            <Image
                                src="https://picsum.photos/800/600"
                                alt="Random image from Picsum"
                                fill
                                className="object-cover rounded"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                            <code>{`// next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
  ],
}`}</code>
                        </pre>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        3. Responsive Image with Priority
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">
                            Use{' '}
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                priority
                            </code>{' '}
                            for above-the-fold images to disable lazy loading
                            and improve LCP.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative w-full h-48">
                                <Image
                                    src="https://picsum.photos/400/300?random=1"
                                    alt="Priority image"
                                    fill
                                    className="object-cover rounded"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <div className="relative w-full h-48">
                                <Image
                                    src="https://picsum.photos/400/300?random=2"
                                    alt="Lazy loaded image"
                                    fill
                                    className="object-cover rounded"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        4. Image with Custom Sizes
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">
                            The{' '}
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                sizes
                            </code>{' '}
                            prop tells the browser which image size to load
                            based on viewport width.
                        </p>
                        <div className="relative w-full h-64">
                            <Image
                                src="https://picsum.photos/1200/800?random=3"
                                alt="Responsive image"
                                fill
                                className="object-cover rounded"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                            />
                        </div>
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm mt-4">
                            <code>{`sizes="(max-width: 640px) 100vw, 
       (max-width: 1024px) 80vw, 
       1200px"`}</code>
                        </pre>
                    </div>
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
