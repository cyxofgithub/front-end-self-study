import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostById } from '@/lib/api';

// SSR（服务端渲染）- 每次请求时渲染
// SSR（服务端渲染）- 每次请求都在服务端实时渲染
// 本页用路由级的 force-dynamic 强制动态渲染；
// 另一种等价做法是请求级控制：fetch(url, { cache: 'no-store' })
// 两者的真实对比见 /fetch-cache-demo 页面
export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
    params: {
        id: string;
    };
}

/**
 * 为博客文章页面生成动态 metadata
 */
export async function generateMetadata({
    params,
}: BlogDetailPageProps): Promise<Metadata> {
    const post = await getPostById(params.id);

    if (!post) {
        return {
            title: '文章未找到',
        };
    }

    return {
        title: `${post.title} - Next.js 演示博客`,
        description: post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 160),
            type: 'article',
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
            authors: [post.author],
        },
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const post = await getPostById(params.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href="/blog"
                        className="text-blue-600 hover:text-blue-800 inline-block"
                    >
                        ← 返回博客列表
                    </Link>
                    <Link
                        href={`/blog/${params.id}/edit`}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    >
                        编辑文章
                    </Link>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
                    <p className="text-sm text-gray-700">
                        <strong>
                            渲染模式：SSR（服务端渲染）
                        </strong>
                        <br />
                        本页面在服务端针对每次请求进行渲染。HTML 每次都全新生成，
                        确保你始终获取最新数据。非常适合频繁变化的内容。
                    </p>
                </div>
            </div>

            <article className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                    <span>作者：{post.author}</span>
                    <span>•</span>
                    <span>
                        发布于：{' '}
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.updatedAt !== post.createdAt && (
                        <>
                            <span>•</span>
                            <span>
                                更新于：{' '}
                                {new Date(post.updatedAt).toLocaleDateString()}
                            </span>
                        </>
                    )}
                </div>
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {post.content}
                    </p>
                </div>
            </article>
        </div>
    );
}
