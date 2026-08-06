import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// 解释 Inter() 函数内各个属性作用：
// subsets: 指定只加载所需的字符子集（如 'latin'），减小字体文件体积。
// display: 指定字体加载显示策略，'swap' 意味着先用系统字体显示，加载好自定义字体后无缝切换，避免文字闪烁。
// variable: 定义一个 CSS 变量名称，用于在全局通过 CSS 变量引用此字体。
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

// 根布局组件 - 包裹所有页面
export const metadata: Metadata = {
    title: 'Next.js Demo - Day 1-7',
    description: '覆盖 Next.js Day 1 到 Day 7 核心知识点的完整演示项目',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN" className={inter.variable}>
            <body className="flex flex-col min-h-screen font-sans">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
