import { notFound, redirect } from 'next/navigation';
import { getPostById, updatePost } from '@/lib/actions';
import EditPostForm from '@/components/EditPostForm';

interface EditPageProps {
    params: {
        id: string;
    };
}

/**
 * Edit Post Page - Demonstrates Server Actions with form handling
 *
 * This page shows how to use Server Actions to update data
 * The form submission is handled by the updatePost Server Action
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
                    Edit Post
                </h1>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>Day 4: Server Actions - Update</strong>
                        <br />
                        This form uses a Server Action to update the blog post.
                        After submission, you'll be redirected to the post
                        detail page.
                    </p>
                </div>
            </div>

            <EditPostForm post={post} updateAction={handleUpdate} />
        </div>
    );
}
