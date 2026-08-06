// 用于演示的 Mock 博客数据
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// 演示用的内存存储（生产环境中请使用数据库）
let mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Next.js 入门指南',
    content: 'Next.js 是一个支持服务端渲染和静态站点生成的 React 框架。它提供了出色的开发体验，具备自动代码分割、性能优化和内置 CSS 支持等特性。',
    author: '张三',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: '理解 Server Components',
    content: 'Server Components 允许你编写在服务器上运行的组件，减少发送到客户端的 JavaScript 体积。这不仅提升了性能，还能直接访问数据库等后端资源。',
    author: '李四',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    title: '渲染模式详解',
    content: 'Next.js 支持多种渲染模式：SSR（服务端渲染）、SSG（静态站点生成）、ISR（增量静态再生）和 CSR（客户端渲染）。每种模式都有各自的适用场景和优势。',
    author: '王五',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
];

// 获取所有文章
export function getMockBlogPosts(): BlogPost[] {
  return mockBlogPosts;
}

// 根据 ID 获取文章
export function getMockPostById(id: string): BlogPost | null {
  return mockBlogPosts.find((p) => p.id === id) || null;
}

// 创建新文章
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

// 更新文章
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

// 删除文章
export function deleteMockPost(id: string): boolean {
  const index = mockBlogPosts.findIndex((p) => p.id === id);
  if (index === -1) return false;

  mockBlogPosts.splice(index, 1);
  return true;
}

// 模拟 API 延迟
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
