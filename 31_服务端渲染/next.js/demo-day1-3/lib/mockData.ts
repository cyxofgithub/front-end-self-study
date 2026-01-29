// Mock blog data for demonstration
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export const mockBlogPosts: BlogPost[] = [
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

// Simulate API delay
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
