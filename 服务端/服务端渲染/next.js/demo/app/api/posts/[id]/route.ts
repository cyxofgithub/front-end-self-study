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
 * Fetch a single blog post by ID
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
          error: 'Post not found',
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
        error: 'Failed to fetch post',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[id]
 * Update an existing blog post
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
          error: 'All fields are required',
        },
        { status: 400 }
      );
    }

    const updatedPost = updateMockPost(params.id, { title, content, author });

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
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
        error: 'Failed to update post',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 * Delete a blog post
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
          error: 'Post not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete post',
      },
      { status: 500 }
    );
  }
}
