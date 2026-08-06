import Image from 'next/image';
import Link from 'next/link';

/**
 * 图片优化演示页面
 * 演示 Next.js Image 组件的优化特性
 */
export const metadata = {
    title: '图片优化演示 - Next.js Day 5',
    description: '学习如何使用 Next.js Image 组件优化图片',
};

export default function ImageOptimizationDemoPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
                图片优化演示
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Next.js Image 组件会自动优化图片性能，提供懒加载、响应式尺寸和现代格式支持。
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
                <h2 className="font-semibold text-blue-800 mb-2">
                    核心特性：
                </h2>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                    <li>
                        <strong>自动优化</strong> - 图片按需进行优化
                    </li>
                    <li>
                        <strong>懒加载</strong> - 图片进入视口时才加载
                    </li>
                    <li>
                        <strong>响应式图片</strong> - 自动提供合适尺寸的图片
                    </li>
                    <li>
                        <strong>现代格式</strong> - 在支持时自动提供 WebP/AVIF
                    </li>
                    <li>
                        <strong>防止布局偏移</strong> - 预留空间以避免 CLS
                    </li>
                </ul>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        1. 本地图片（来自 public 目录）
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                public
                            </code>{' '}
                            目录中的图片可以直接引用，Next.js
                            会自动对它们进行优化。
                        </p>
                        <div className="relative w-full h-64 mb-4">
                            <Image
                                src="/images/placeholder.jpg"
                                alt="占位图片"
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
  alt="图片描述"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>`}</code>
                        </pre>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        2. 外部图片（需要配置域名）
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">
                            外部图片需要在{' '}
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                next.config.js
                            </code>{' '}
                            中配置域名。本示例使用了一个占位图服务。
                        </p>
                        <div className="relative w-full h-64 mb-4">
                            <Image
                                src="https://picsum.photos/800/600"
                                alt="来自 Picsum 的随机图片"
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
                        3. 带 priority 的响应式图片
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">
                            对首屏可见的图片使用{' '}
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                priority
                            </code>{' '}
                            属性，可以禁用懒加载并改善 LCP。
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative w-full h-48">
                                <Image
                                    src="https://picsum.photos/400/300?random=1"
                                    alt="优先加载的图片"
                                    fill
                                    className="object-cover rounded"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <div className="relative w-full h-48">
                                <Image
                                    src="https://picsum.photos/400/300?random=2"
                                    alt="懒加载的图片"
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
                        4. 自定义 sizes 的图片
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-4">
                            <code className="bg-gray-100 px-2 py-1 rounded">
                                sizes
                            </code>{' '}
                            属性告诉浏览器根据视口宽度加载哪种尺寸的图片。
                        </p>
                        <div className="relative w-full h-64">
                            <Image
                                src="https://picsum.photos/1200/800?random=3"
                                alt="响应式图片"
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
                    ← 返回首页
                </Link>
            </div>
        </div>
    );
}
