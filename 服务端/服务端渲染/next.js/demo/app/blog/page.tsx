import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/api';

// SSG（静态站点生成）- 默认渲染模式
// 本页面在构建时生成
export const metadata: Metadata = {
    title: '博客文章 - Next.js 演示项目',
    description:
        '浏览我们的博客文章 - 演示 SSG（静态站点生成）',
};

export default async function BlogListPage() {
    const posts = await getAllPosts();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    博客文章
                </h1>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>
                            渲染模式：SSG（静态站点生成）
                        </strong>
                        <br />
                        本页面在构建时预渲染。HTML 在构建过程中生成一次，
                        之后以静态方式提供服务，从而实现最快的性能。
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-2xl font-semibold mb-2 text-blue-600">
                            <Link
                                href={`/blog/${post.id}`}
                                className="hover:text-blue-800 hover:underline"
                            >
                                {post.title}
                            </Link>
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.content}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>作者：{post.author}</span>
                            <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mt-4">
                            <Link
                                href={`/blog/${post.id}`}
                                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                            >
                                阅读更多 →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
