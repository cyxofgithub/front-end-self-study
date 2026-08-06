import { notFound, redirect } from 'next/navigation';
import { getPostById, updatePost } from '@/lib/actions';
import EditPostForm from '@/components/EditPostForm';

interface EditPageProps {
    params: {
        id: string;
    };
}

/**
 * 编辑文章页面 - 演示带表单处理的 Server Actions
 *
 * 本页面展示如何使用 Server Actions 更新数据
 * 表单提交由 updatePost 这个 Server Action 处理
 */
export default async function EditPostPage({ params }: EditPageProps) {
    const post = await getPostById(params.id);

    if (!post) {
        notFound();
    }

    async function handleUpdate(formData: FormData) {
        'use server';
        await updatePost(params.id, formData);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    编辑文章
                </h1>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>第 4 天：Server Actions - 更新</strong>
                        <br />
                        本表单使用 Server Action 来更新博客文章。
                        提交后，你将被重定向到文章详情页。
                    </p>
                </div>
            </div>

            <EditPostForm post={post} updateAction={handleUpdate} />
        </div>
    );
}
