import { getMockBlogPosts, getMockPostById, type BlogPost } from './mockData';
import { delay } from './mockData';

// 模拟获取所有博客文章
export async function getAllPosts(): Promise<BlogPost[]> {
  await delay(500);
  return getMockBlogPosts();
}

// 模拟根据 ID 获取单篇博客文章
export async function getPostById(id: string): Promise<BlogPost | null> {
  await delay(300);
  return getMockPostById(id);
}

// 模拟获取当前时间（用于 ISR 演示）
export async function getCurrentTime(): Promise<string> {
  await delay(200);
  return new Date().toISOString();
}

// 模拟客户端 API 调用（用于 CSR 演示）
export async function fetchClientData(): Promise<{ message: string; timestamp: string }> {
  await delay(1000);
  return {
    message: '这些数据是在客户端获取的！',
    timestamp: new Date().toISOString(),
  };
}
