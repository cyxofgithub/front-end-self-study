// Mock blog data for demonstration
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for demo purposes (in production, use a database)
let mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    content: 'Next.js is a React framework that enables server-side rendering and static site generation. It provides a great developer experience with features like automatic code splitting, optimized performance, and built-in CSS support.',
    author: 'John Doe',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Understanding Server Components',
    content: 'Server Components allow you to write components that run on the server, reducing the amount of JavaScript sent to the client. This improves performance and enables direct access to backend resources like databases.',
    author: 'Jane Smith',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    title: 'Rendering Modes Explained',
    content: 'Next.js supports multiple rendering modes: SSR (Server-Side Rendering), SSG (Static Site Generation), ISR (Incremental Static Regeneration), and CSR (Client-Side Rendering). Each has its own use cases and benefits.',
    author: 'Bob Johnson',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
];

// Get all posts
export function getMockBlogPosts(): BlogPost[] {
  return mockBlogPosts;
}

// Get post by ID
export function getMockPostById(id: string): BlogPost | null {
  return mockBlogPosts.find((p) => p.id === id) || null;
}

// Create a new post
export function createMockPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockBlogPosts.push(newPost);
  return newPost;
}

// Update a post
export function updateMockPost(id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): BlogPost | null {
  const index = mockBlogPosts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  mockBlogPosts[index] = {
    ...mockBlogPosts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockBlogPosts[index];
}

// Delete a post
export function deleteMockPost(id: string): boolean {
  const index = mockBlogPosts.findIndex((p) => p.id === id);
  if (index === -1) return false;

  mockBlogPosts.splice(index, 1);
  return true;
}

// Simulate API delay
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
