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
 * Server Action：创建新博客文章
 */
export async function createPost(formData: FormData) {
  await delay(500); // 模拟网络延迟

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;

  // 校验
  if (!title || !content || !author) {
    return {
      error: '所有字段均为必填项',
    };
  }

  try {
    const newPost = createMockPost({ title, content, author });

    // 重新验证博客列表页缓存，让新文章立即可见
    revalidatePath('/blog');
    revalidatePath('/blog-admin');

    return {
      success: true,
      post: newPost,
    };
  } catch (error) {
    return {
      error: '创建文章失败',
    };
  }
}

/**
 * Server Action：更新已有博客文章
 */
export async function updatePost(id: string, formData: FormData) {
  await delay(500);

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;

  if (!title || !content || !author) {
    return {
      error: '所有字段均为必填项',
    };
  }

  try {
    const updatedPost = updateMockPost(id, { title, content, author });

    if (!updatedPost) {
      return {
        error: '文章不存在',
      };
    }

    // 重新验证受影响的页面缓存
    revalidatePath('/blog');
    revalidatePath(`/blog/${id}`);
    revalidatePath('/blog-admin');
  } catch (error) {
    return {
      error: '更新文章失败',
    };
  }

  // 注意：redirect 必须放在 try/catch 外面，
  // 因为它内部通过抛出 NEXT_REDIRECT 异常工作，放在 try 里会被 catch 吞掉
  redirect(`/blog/${id}`);
}

/**
 * Server Action：删除博客文章
 */
export async function deletePost(id: string) {
  await delay(500);

  try {
    const success = deleteMockPost(id);

    if (!success) {
      return {
        error: '文章不存在',
      };
    }

    // 重新验证受影响的页面缓存
    revalidatePath('/blog');
    revalidatePath('/blog-admin');

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: '删除文章失败',
    };
  }
}

/**
 * Server Action：获取所有文章（供 Server Component 使用）
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  await delay(300);
  return getMockBlogPosts();
}

/**
 * Server Action：按 ID 获取文章（供 Server Component 使用）
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  await delay(300);
  return getMockPostById(id);
}

/**
 * Server Action：按标签重新验证缓存
 * 演示 revalidateTag 的精细化缓存控制
 */
export async function revalidateBlogCache() {
  // 这里实现了"缓存重新验证"功能，结合 revalidateTag 和 revalidatePath：
  // 1. 通过 revalidateTag('blog-posts')，强制刷新所有标记为 'blog-posts' 的缓存内容，适用于数据源变更时快速让相关页面读取最新数据。
  // 2. 通过 revalidatePath('/blog') 和 revalidatePath('/blog-admin')，手动指定刷新博客列表页和后台管理页的页面缓存，确保用户看到最新内容。
  revalidateTag('blog-posts');
  revalidatePath('/blog');
  revalidatePath('/blog-admin');

  return {
    success: true,
    message: '博客缓存已重新验证',
  };
}

/**
 * Server Action：按指定标签重新验证缓存
 * 演示 revalidateTag 按标签批量失效的用法
 */
export async function revalidateCacheByTag(tag: string) {
  try {
    revalidateTag(tag);
    return {
      success: true,
      message: `标签为 "${tag}" 的缓存已重新验证`,
    };
  } catch (error) {
    return {
      error: '缓存重新验证失败',
    };
  }
}
