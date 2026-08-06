import { NextRequest, NextResponse } from 'next/server';
import {
  getMockPostById,
  updateMockPost,
  deleteMockPost,
  delay,
} from '@/lib/mockData';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/posts/[id]
 * 根据 ID 获取单篇博客文章
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await delay(300);
    const post = getMockPostById(params.id);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: '文章不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: '获取文章失败',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[id]
 * 更新已有的博客文章
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await delay(500);
    const body = await request.json();

    const { title, content, author } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        {
          success: false,
          error: '所有字段均为必填项',
        },
        { status: 400 }
      );
    }

    const updatedPost = updateMockPost(params.id, { title, content, author });

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: '文章不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: '更新文章失败',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 * 删除一篇博客文章
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await delay(500);
    const success = deleteMockPost(params.id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '文章不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '文章删除成功',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: '删除文章失败',
      },
      { status: 500 }
    );
  }
}
