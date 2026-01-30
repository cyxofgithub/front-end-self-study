import { getMockBlogPosts, getMockPostById, type BlogPost } from './mockData';
import { delay } from './mockData';

// Simulate fetching all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  await delay(500);
  return getMockBlogPosts();
}

// Simulate fetching a single blog post by ID
export async function getPostById(id: string): Promise<BlogPost | null> {
  await delay(300);
  return getMockPostById(id);
}

// Simulate fetching current time (for ISR demo)
export async function getCurrentTime(): Promise<string> {
  await delay(200);
  return new Date().toISOString();
}

// Simulate client-side API call (for CSR demo)
export async function fetchClientData(): Promise<{ message: string; timestamp: string }> {
  await delay(1000);
  return {
    message: 'This data was fetched on the client side!',
    timestamp: new Date().toISOString(),
  };
}
