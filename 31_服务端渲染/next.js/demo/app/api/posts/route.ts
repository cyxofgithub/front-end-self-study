import { NextRequest, NextResponse } from 'next/server';
import {
  getMockBlogPosts,
  createMockPost,
  delay,
} from '@/lib/mockData';

/**
 * GET /api/posts
 * Fetch all blog posts
 */
export async function GET() {
  try {
    await delay(300); // Simulate network delay
    const posts = getMockBlogPosts();

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    await delay(500);
    const body = await request.json();

    const { title, content, author } = body;

    // Validation
    if (!title || !content || !author) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required',
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
        error: 'Failed to create post',
      },
      { status: 500 }
    );
  }
}
