import Link from 'next/link';

// 博客文章未找到时的 404 页面
export default function NotFound() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-yellow-800">
                    博客文章未找到
                </h2>
                <p className="text-gray-700 mb-4">
                    你要查找的博客文章不存在或已被删除。
                </p>
                <Link
                    href="/blog"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    返回博客列表
                </Link>
            </div>
        </div>
    );
}
