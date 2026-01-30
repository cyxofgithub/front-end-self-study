'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  getMockBlogPosts,
  getMockPostById,
  createMockPost,
  updateMockPost,
  deleteMockPost,
  delay,
  type BlogPost,
} from './mockData';

/**
 * Server Action: Create a new blog post
 */
export async function createPost(formData: FormData) {
  await delay(500); // Simulate network delay

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;

  // Validation
  if (!title || !content || !author) {
    return {
      error: 'All fields are required',
    };
  }

  try {
    const newPost = createMockPost({ title, content, author });

    // Revalidate the blog list page to show the new post
    revalidatePath('/blog');
    revalidatePath('/blog-admin');

    return {
      success: true,
      post: newPost,
    };
  } catch (error) {
    return {
      error: 'Failed to create post',
    };
  }
}

/**
 * Server Action: Update an existing blog post
 */
export async function updatePost(id: string, formData: FormData) {
  await delay(500);

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;

  if (!title || !content || !author) {
    return {
      error: 'All fields are required',
    };
  }

  try {
    const updatedPost = updateMockPost(id, { title, content, author });

    if (!updatedPost) {
      return {
        error: 'Post not found',
      };
    }

    // Revalidate affected pages
    revalidatePath('/blog');
    revalidatePath(`/blog/${id}`);
    revalidatePath('/blog-admin');

    redirect(`/blog/${id}`);
  } catch (error) {
    return {
      error: 'Failed to update post',
    };
  }
}

/**
 * Server Action: Delete a blog post
 */
export async function deletePost(id: string) {
  await delay(500);

  try {
    const success = deleteMockPost(id);

    if (!success) {
      return {
        error: 'Post not found',
      };
    }

    // Revalidate affected pages
    revalidatePath('/blog');
    revalidatePath('/blog-admin');

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: 'Failed to delete post',
    };
  }
}

/**
 * Server Action: Get all posts (for Server Components)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  await delay(300);
  return getMockBlogPosts();
}

/**
 * Server Action: Get post by ID (for Server Components)
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  await delay(300);
  return getMockPostById(id);
}

/**
 * Server Action: Revalidate by tag
 * Demonstrates revalidateTag for granular cache control
 */
export async function revalidateBlogCache() {
  // 这里实现了“缓存重新验证”功能，结合 revalidateTag 和 revalidatePath：
  // 1. 通过 revalidateTag('blog-posts')，强制刷新所有标记为 'blog-posts' 的缓存内容，适用于数据源变更时快速让相关页面读取最新数据。
  // 2. 通过 revalidatePath('/blog') 和 revalidatePath('/blog-admin')，手动指定刷新博客列表页和后台管理页的页面缓存，确保用户看到最新内容。
  revalidateTag('blog-posts');
  revalidatePath('/blog');
  revalidatePath('/blog-admin');

  return {
    success: true,
    message: 'Blog cache revalidated successfully',
  };
}

/**
 * Server Action: Revalidate cache by tag
 * Demonstrates revalidateTag usage for tag-based cache invalidation
 */
export async function revalidateCacheByTag(tag: string) {
  try {
    revalidateTag(tag);
    return {
      success: true,
      message: `Cache with tag "${tag}" has been revalidated`,
    };
  } catch (error) {
    return {
      error: 'Failed to revalidate cache',
    };
  }
}
