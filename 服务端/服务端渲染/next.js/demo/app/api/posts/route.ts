import { NextRequest, NextResponse } from 'next/server';
import {
  getMockBlogPosts,
  createMockPost,
  delay,
} from '@/lib/mockData';

/**
 * GET /api/posts
 * 获取所有博客文章
 */
export async function GET() {
  try {
    await delay(300); // 模拟网络延迟
    const posts = getMockBlogPosts();

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: '获取文章列表失败',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * 创建一篇新的博客文章
 */
export async function POST(request: NextRequest) {
  try {
    await delay(500);
    const body = await request.json();

    const { title, content, author } = body;

    // 参数校验
    if (!title || !content || !author) {
      return NextResponse.json(
        {
          success: false,
          error: '所有字段均为必填项',
        },
        { status: 400 }
      );
    }

    const newPost = createMockPost({ title, content, author });

    return NextResponse.json(
      {
        success: true,
        data: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: '创建文章失败',
      },
      { status: 500 }
    );
  }
}
